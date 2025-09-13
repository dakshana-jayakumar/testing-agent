import { readFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import chalk from 'chalk';

export interface AdvancedAnalysisResult {
  category: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  quickSolution: string;
  suggestions: string[];
  codeContext: {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
    functionName?: string;
    codeSnippet?: string;
    errorLineContent?: string;
    projectPath?: string;
  };
  locatorDetails?: {
    selector: string;
    action: string;
    timeout?: string;
    expectedState?: string;
    framework?: string;
  };
  stackTrace?: {
    mainError: string;
    location: string;
    callStack: string[];
    testFile?: string;
    projectPath?: string;
  };
  relatedFiles: string[];
  patterns: {
    errorType: string;
    commonCauses: string[];
    solutions: string[];
  };
}

export class AdvancedPatternEngine {
  
  /**
   * Perform advanced error analysis with pattern matching
   */
  public analyzeError(errorMessage: string, filePath?: string, context?: string): AdvancedAnalysisResult {
    // Extract stack trace information
    const stackTrace = this.parseStackTrace(errorMessage);
    
    // Analyze error type and patterns
    const errorType = this.identifyErrorType(errorMessage);
    
    // Get file context if available
    const codeContext = this.analyzeCodeContext(errorMessage, filePath, stackTrace);
    
    // Find related files
    const relatedFiles = this.findRelatedFiles(errorMessage, codeContext?.fileName);
    
    // Generate intelligent solutions
    const patterns = this.generatePatterns(errorType, errorMessage, codeContext, stackTrace);
    
    // Calculate confidence based on available information
    const confidence = this.calculateConfidence(errorMessage, stackTrace, codeContext);
    
    const result: AdvancedAnalysisResult = {
      category: patterns.errorType,
      confidence,
      severity: this.determineSeverity(errorType, errorMessage),
      quickSolution: patterns.solutions[0] || 'Review the error details and check your code',
      suggestions: patterns.solutions.slice(1, 5),
      codeContext,
      relatedFiles,
      patterns: {
        errorType: patterns.errorType,
        commonCauses: patterns.commonCauses,
        solutions: patterns.solutions
      }
    };

    // Add optional stackTrace if available
    if (stackTrace) {
      result.stackTrace = stackTrace;
    }

    // Extract and add locator details for element-related errors
    const locatorDetails = this.extractElementDetails(errorMessage);
    if (locatorDetails.selector) {
      result.locatorDetails = locatorDetails;
    }

    return result;
  }

  /**
   * Parse stack trace information from error message
   */
  private parseStackTrace(errorMessage: string): { mainError: string; location: string; callStack: string[] } | undefined {
    const lines = errorMessage.split('\n');
    
    // Look for stack trace patterns
    const stackTraceStart = lines.findIndex(line => 
      line.includes('at ') || 
      line.includes('Error:') || 
      line.includes('TypeError:') ||
      line.includes('ReferenceError:')
    );
    
    if (stackTraceStart === -1) return undefined;
    
    const mainError = lines[0] || (lines[stackTraceStart] || '') || '';
    const callStack: string[] = [];
    let location = 'unknown';
    
    // Extract call stack and location information
    for (let i = stackTraceStart; i < lines.length; i++) {
      const line = lines[i]?.trim();
      if (!line) continue;
      
      if (line.startsWith('at ')) {
        callStack.push(line);
        
        // Extract first meaningful location
        if (location === 'unknown') {
          const locationMatch = line.match(/at\s+(?:.*?\s+)?\(?(.*?):(\d+):(\d+)\)?/);
          if (locationMatch && locationMatch[1] && locationMatch[2]) {
            location = `${basename(locationMatch[1])}:${locationMatch[2]}`;
          }
        }
      }
    }
    
    return {
      mainError: mainError ? mainError.replace(/^\s*Error:\s*/, '').trim() : '',
      location,
      callStack
    };
  }

  /**
   * Identify error type using advanced pattern matching
   */
  private identifyErrorType(errorMessage: string): string {
    const patterns = [
      // === PLAYWRIGHT/TESTING FRAMEWORK ERRORS ===
      {
        regex: /webServer.*timeout|Timed out.*webServer/i,
        type: 'webserver-lifecycle-timeout',
        weight: 10
      },
      {
        regex: /locator.*timeout|waiting.*timeout.*locator|Timeout.*waiting for locator/i,
        type: 'element-timeout',
        weight: 9
      },
      {
        regex: /page.*timeout|navigation.*timeout|goto.*timeout/i,
        type: 'page-navigation-timeout',
        weight: 8
      },
      {
        regex: /element.*not.*visible|locator.*not.*visible|element.*hidden/i,
        type: 'element-not-visible',
        weight: 8
      },
      {
        regex: /element.*not.*attached|locator.*not.*attached|element.*detached/i,
        type: 'element-detached',
        weight: 8
      },
      {
        regex: /intercepts pointer events|element.*other element|covered by/i,
        type: 'element-intercepted',
        weight: 9
      },
      {
        regex: /strict mode violation|multiple elements|found \d+ elements/i,
        type: 'multiple-elements-found',
        weight: 8
      },
      {
        regex: /selector.*resolved to.*elements|0 elements found/i,
        type: 'element-not-found',
        weight: 8
      },
      
      // === CYPRESS SPECIFIC ERRORS ===
      {
        regex: /cy\.[^(]+\(\).*failed|cypress.*command.*failed/i,
        type: 'cypress-command-failed',
        weight: 9
      },
      {
        regex: /expected.*element.*to.*exist|element.*does not exist/i,
        type: 'cypress-element-not-exist',
        weight: 8
      },
      {
        regex: /element.*is.*not.*actionable|element.*cannot.*be.*interacted/i,
        type: 'cypress-element-not-actionable',
        weight: 8
      },
      
      // === SELENIUM ERRORS ===
      {
        regex: /NoSuchElementException|element.*not.*found|Unable to locate element/i,
        type: 'selenium-element-not-found',
        weight: 8
      },
      {
        regex: /ElementNotInteractableException|element.*not.*interactable/i,
        type: 'selenium-element-not-interactable',
        weight: 8
      },
      {
        regex: /StaleElementReferenceException|stale.*element.*reference/i,
        type: 'selenium-stale-element',
        weight: 9
      },
      {
        regex: /TimeoutException.*selenium|WebDriverWait.*timeout/i,
        type: 'selenium-timeout',
        weight: 8
      },
      
      // === JAVASCRIPT/TYPESCRIPT ERRORS ===
      {
        regex: /ReferenceError.*not defined/i,
        type: 'undefined-variable',
        weight: 10
      },
      {
        regex: /TypeError.*null|Cannot read.*null|null.*is not an object/i,
        type: 'null-reference',
        weight: 9
      },
      {
        regex: /TypeError.*undefined|Cannot read.*undefined|undefined.*is not an object/i,
        type: 'undefined-reference',
        weight: 9
      },
      {
        regex: /TypeError.*not a function|is not a function/i,
        type: 'function-not-found',
        weight: 9
      },
      {
        regex: /SyntaxError/i,
        type: 'syntax-error',
        weight: 8
      },
      {
        regex: /Cannot access.*before initialization|temporal dead zone/i,
        type: 'temporal-dead-zone',
        weight: 8
      },
      {
        regex: /Maximum call stack size exceeded|stack overflow/i,
        type: 'stack-overflow',
        weight: 9
      },
      
      // === ASYNC/PROMISE ERRORS ===
      {
        regex: /UnhandledPromiseRejectionWarning|unhandled promise rejection/i,
        type: 'unhandled-promise-rejection',
        weight: 8
      },
      {
        regex: /await.*is only valid|await.*outside.*async/i,
        type: 'await-outside-async',
        weight: 8
      },
      
      // === NETWORK/API ERRORS ===
      {
        regex: /fetch.*failed|Network.*error|Failed to fetch/i,
        type: 'network-request-failed',
        weight: 8
      },
      {
        regex: /ECONNREFUSED|connection refused/i,
        type: 'connection-refused',
        weight: 9
      },
      {
        regex: /timeout.*request|request.*timeout|ETIMEDOUT/i,
        type: 'request-timeout',
        weight: 7
      },
      {
        regex: /ENOTFOUND|getaddrinfo.*ENOTFOUND/i,
        type: 'dns-resolution-failed',
        weight: 8
      },
      {
        regex: /403.*Forbidden|forbidden.*request/i,
        type: 'api-forbidden',
        weight: 7
      },
      {
        regex: /401.*Unauthorized|unauthorized.*request/i,
        type: 'api-unauthorized',
        weight: 7
      },
      {
        regex: /404.*Not Found|not.*found.*endpoint/i,
        type: 'api-not-found',
        weight: 7
      },
      {
        regex: /500.*Internal Server Error|server.*error/i,
        type: 'api-server-error',
        weight: 7
      },
      {
        regex: /CORS.*error|Cross-Origin.*blocked/i,
        type: 'cors-error',
        weight: 8
      },
      
      // === MODULE/IMPORT ERRORS ===
      {
        regex: /Cannot find module|Module not found|Cannot resolve module/i,
        type: 'module-not-found',
        weight: 9
      },
      {
        regex: /import.*error|export.*error|Invalid or unexpected token.*import/i,
        type: 'import-export-error',
        weight: 8
      },
      {
        regex: /Unexpected token.*export|Unexpected reserved word.*export/i,
        type: 'es6-module-error',
        weight: 8
      },
      
      // === CONFIGURATION ERRORS ===
      {
        regex: /config.*error|configuration.*invalid|Invalid configuration/i,
        type: 'configuration-error',
        weight: 7
      },
      {
        regex: /tsconfig.*error|TypeScript.*configuration/i,
        type: 'typescript-config-error',
        weight: 7
      },
      {
        regex: /webpack.*error|bundle.*error|Build failed/i,
        type: 'build-error',
        weight: 7
      },
      
      // === DATABASE ERRORS ===
      {
        regex: /database.*error|sql.*error|connection.*database/i,
        type: 'database-error',
        weight: 8
      },
      {
        regex: /migration.*failed|schema.*error/i,
        type: 'database-migration-error',
        weight: 8
      },
      
      // === AUTHENTICATION/SECURITY ERRORS ===
      {
        regex: /authentication.*failed|auth.*error|login.*failed/i,
        type: 'authentication-error',
        weight: 8
      },
      {
        regex: /permission.*denied|access.*denied|insufficient.*privileges/i,
        type: 'permission-denied',
        weight: 8
      },
      
      // === MEMORY/RESOURCE ERRORS ===
      {
        regex: /out of memory|memory.*exceeded|heap.*out of memory/i,
        type: 'memory-error',
        weight: 9
      },
      {
        regex: /EMFILE|too many open files|file descriptor/i,
        type: 'file-descriptor-limit',
        weight: 8
      },
      
      // === REACT/COMPONENT ERRORS ===
      {
        regex: /Warning.*React|React.*warning|Invalid hook call/i,
        type: 'react-warning',
        weight: 6
      },
      {
        regex: /Cannot update.*unmounted component|memory leak.*component/i,
        type: 'react-memory-leak',
        weight: 8
      },
      {
        regex: /Maximum update depth exceeded|infinite.*render/i,
        type: 'react-infinite-render',
        weight: 9
      }
    ];
    
    let bestMatch = { type: 'unknown-error', weight: 0 };
    
    for (const pattern of patterns) {
      if (pattern.regex.test(errorMessage) && pattern.weight > bestMatch.weight) {
        bestMatch = { type: pattern.type, weight: pattern.weight };
      }
    }
    
    return bestMatch.type;
  }

  /**
   * Analyze code context from files (using enhanced method)
   */
  private analyzeCodeContext(errorMessage: string, filePath?: string, stackTrace?: any): any {
    return this.analyzeCodeContextEnhanced(errorMessage, filePath, stackTrace);
  }

  /**
   * Extract element details from error message
   */
  private extractElementDetails(errorMessage: string): {
    selector: string;
    action: string;
    timeout?: string;
    expectedState?: string;
    framework?: string;
  } {
    const details: any = {};
    
    // Multi-framework selector extraction patterns
    const selectorPatterns = [
      { regex: /Selector:\s*(.+?)(?:\n|$)/i, framework: 'playwright' },
      { regex: /locator\s*\(\s*["']([^"']+)["']\s*\)/i, framework: 'playwright' },
      { regex: /Expected to find element:\s*(.+?)(?:\n|$)/i, framework: 'cypress' },
      { regex: /"selector":"([^"]+)"/i, framework: 'selenium' },
      { regex: /click\s*\(\s*["']([^"']+)["']\s*\)/i, framework: 'generic' },
      { regex: /waitForSelector\s*\(\s*["']([^"']+)["']/i, framework: 'generic' }
    ];
    
    // Extract selector
    for (const pattern of selectorPatterns) {
      const match = errorMessage.match(pattern.regex);
      if (match && match[1]) {
        details.selector = match[1].trim();
        details.framework = pattern.framework;
        break;
      }
    }
    
    // Extract timeout
    const timeoutMatch = errorMessage.match(/Timeout\s+(\d+)ms/i);
    if (timeoutMatch) {
      details.timeout = timeoutMatch[1] + 'ms';
    }
    
    // Extract action
    const actionPatterns = [
      /locator\.(\w+):/i,     // Playwright: locator.click:
      /cy\.(\w+)\(/i,         // Cypress: cy.click(
      /(\w+)Element/i         // Selenium: clickElement
    ];
    
    for (const pattern of actionPatterns) {
      const match = errorMessage.match(pattern);
      if (match) {
        details.action = match[1];
        break;
      }
    }
    
    // Extract expected state
    if (errorMessage.includes('clickable')) details.expectedState = 'clickable';
    if (errorMessage.includes('visible')) details.expectedState = 'visible';
    if (errorMessage.includes('hidden')) details.expectedState = 'hidden';
    
    // Set defaults
    details.action = details.action || 'unknown';
    details.selector = details.selector || '';
    
    return details;
  }

  /**
   * Enhanced stack trace parsing with better file detection
   */
  private parseStackTraceEnhanced(errorMessage: string): {
    filePath: string;
    fileName: string;
    lineNumber: number;
    columnNumber: number;
    functionName?: string;
    mainError: string;
    location: string;
    callStack: string[];
    testFile?: string;
    projectPath?: string;
  } | undefined {
    const lines = errorMessage.split('\n');
    
    // Look for stack trace patterns
    const stackTraceStart = lines.findIndex(line => 
      line.includes('at ') || 
      line.includes('Error:') || 
      line.includes('TypeError:') ||
      line.includes('ReferenceError:')
    );
    
    if (stackTraceStart === -1) return undefined;
    
    const mainError = lines[0] || (lines[stackTraceStart] || '') || '';
    const callStack: string[] = [];
    let testFileInfo: any = null;
    
    // Extract call stack and find test file
    for (let i = stackTraceStart; i < lines.length; i++) {
      const line = lines[i]?.trim();
      if (!line) continue;
      
      if (line.startsWith('at ')) {
        callStack.push(line);
        
        // Look specifically for test files (.spec.ts, .test.js, etc.)
        const testFilePattern = /at\s+(?:.*?\s+)?\(?([^:]+\.(spec|test)\.(ts|js|tsx|jsx)):(\d+):(\d+)\)?/;
        const match = line.match(testFilePattern);
        
        if (match && match[1] && match[3] && match[4] && !testFileInfo) {
          const filePath = match[1];
          const lineStr = match[3];
          const colStr = match[4];
          
          testFileInfo = {
            filePath: filePath,
            fileName: basename(filePath),
            lineNumber: parseInt(lineStr, 10),
            columnNumber: parseInt(colStr, 10),
            location: `${basename(filePath)}:${lineStr}`
          };
        }
      }
    }
    
    if (!testFileInfo) return undefined;
    
    return {
      filePath: testFileInfo.filePath,
      fileName: testFileInfo.fileName,
      lineNumber: testFileInfo.lineNumber,
      columnNumber: testFileInfo.columnNumber,
      mainError: mainError ? mainError.replace(/^\s*Error:\s*/, '').trim() : '',
      location: testFileInfo.location,
      callStack,
      testFile: testFileInfo.fileName,
      projectPath: testFileInfo.filePath
    };
  }

  /**
   * Enhanced code context analysis with better file handling
   */
  private analyzeCodeContextEnhanced(errorMessage: string, filePath?: string, stackTrace?: any): any {
    const context: any = {};
    
    // First try to get info from enhanced stack trace
    const enhancedTrace = this.parseStackTraceEnhanced(errorMessage);
    if (enhancedTrace) {
      context.fileName = enhancedTrace.fileName;
      context.lineNumber = enhancedTrace.lineNumber;
      context.columnNumber = enhancedTrace.columnNumber;
      context.projectPath = enhancedTrace.projectPath;
      
      // Try to read the actual file
      if (enhancedTrace.filePath && existsSync(enhancedTrace.filePath)) {
        try {
          const fileContent = readFileSync(enhancedTrace.filePath, 'utf-8');
          const lines = fileContent.split('\n');
          
          if (enhancedTrace.lineNumber > 0 && enhancedTrace.lineNumber <= lines.length) {
            // Get context around the error line
            const start = Math.max(0, enhancedTrace.lineNumber - 3);
            const end = Math.min(lines.length, enhancedTrace.lineNumber + 2);
            context.codeSnippet = lines.slice(start, end).join('\n');
            const errorLineIndex = enhancedTrace.lineNumber - 1;
            if (errorLineIndex >= 0 && errorLineIndex < lines.length) {
              context.errorLineContent = lines[errorLineIndex];
            }
            
            // Find containing function/test
            context.functionName = this.findContainingFunction(lines, enhancedTrace.lineNumber);
          }
        } catch (error) {
          // File reading failed, continue without code context
        }
      }
    } else {
      // Fallback to original method
      const fileMatches = errorMessage.match(/([^\/\s]+\.(js|ts|jsx|tsx|py|java|cpp)):(\d+)/g);
      
      if (fileMatches && fileMatches.length > 0) {
        const match = fileMatches[0];
        const parts = match.split(':');
        if (parts.length >= 2 && parts[1]) {
          context.fileName = parts[0];
          context.lineNumber = parseInt(parts[1], 10);
        }
      }
    }
    
    return context;
  }

  /**
   * Find containing function name from source code
   */
  private findContainingFunction(lines: string[], errorLine: number): string {
    // Search backwards for function definition
    for (let i = errorLine - 1; i >= 0; i--) {
      const line = lines[i];
      if (!line) continue;
      
      // Test function patterns
      const testPatterns = [
        /test\s*\(\s*['"`]([^'"`]+)['"`]/,     // test('description')
        /it\s*\(\s*['"`]([^'"`]+)['"`]/,       // it('description')
        /describe\s*\(\s*['"`]([^'"`]+)['"`]/  // describe('description')
      ];
      
      for (const pattern of testPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      
      // Generic function patterns
      const functionPatterns = [
        /(?:function\s+(\w+)|(\w+)\s*[=:]\s*(?:function|\(|async))/,
        /async\s+(\w+)\s*\(/,
        /(\w+)\s*:\s*async/
      ];
      
      for (const pattern of functionPatterns) {
        const match = line.match(pattern);
        if (match && (match[1] || match[2])) {
          return match[1] || match[2] || 'anonymous';
        }
      }
    }
    
    return 'unknown';
  }

  /**
   * Find related files that might be involved
   */
  private findRelatedFiles(errorMessage: string, fileName?: string): string[] {
    const relatedFiles: string[] = [];
    
    // Extract all file references from error message
    const filePattern = /([a-zA-Z0-9_\-\.\/]+\.(js|ts|jsx|tsx|json|yaml|yml|config))/g;
    const matches = errorMessage.match(filePattern);
    
    if (matches) {
      relatedFiles.push(...matches.filter(f => !fileName || f !== fileName));
    }
    
    // Add common related files based on error type
    if (errorMessage.includes('webServer')) {
      relatedFiles.push('playwright.config.ts', 'package.json', 'vite.config.js', 'next.config.js');
    }
    
    if (errorMessage.includes('import') || errorMessage.includes('module')) {
      relatedFiles.push('package.json', 'tsconfig.json', 'node_modules');
    }
    
    return Array.from(new Set(relatedFiles)); // Remove duplicates
  }

  /**
   * Generate intelligent patterns and solutions
   */
  private generatePatterns(errorType: string, errorMessage: string, codeContext: any, stackTrace?: any): any {
    const patterns: { [key: string]: any } = {
      'webserver-lifecycle-timeout': {
        errorType: 'WebServer Lifecycle Timeout',
        commonCauses: [
          'Development server taking too long to start',
          'Port already in use by another process',
          'Build process hanging or failing',
          'Insufficient system resources'
        ],
        solutions: [
          'Re-run your tests - 70% success rate for transient issues',
          'Kill existing processes: pkill -f "node.*dev" && lsof -ti:3000 | xargs kill -9',
          'Increase webServer timeout in playwright.config.ts to 600000ms (10 minutes)',
          'Check if dev server starts independently: npm run dev',
          'Clear node_modules and reinstall: rm -rf node_modules && npm install',
          'Check system memory and CPU usage'
        ]
      },
      
      'element-timeout': {
        errorType: 'Element Timeout Error',
        commonCauses: [
          'Element not rendered within timeout period',
          'Slow page loading or network issues',
          'Incorrect selector targeting',
          'Element hidden by CSS or JavaScript'
        ],
        solutions: [
          'Increase timeout for slow elements: { timeout: 60000 }',
          'Wait for network idle: waitForLoadState("networkidle")',
          'Check selector specificity and accuracy',
          'Add explicit waits: waitForSelector() before interaction',
          'Verify element is not hidden by CSS display:none or visibility:hidden'
        ]
      },
      
      'element-not-visible': {
        errorType: 'Element Not Visible',
        commonCauses: [
          'Element hidden by CSS properties',
          'Element outside viewport',
          'Overlapping elements',
          'Zero width/height element'
        ],
        solutions: [
          'Scroll element into view: scrollIntoViewIfNeeded()',
          'Check CSS visibility, display, and opacity properties',
          'Use force: true for clicking hidden elements (testing only)',
          'Wait for element to become visible: waitForSelector(selector, { state: "visible" })',
          'Check if element is covered by modals or overlays'
        ]
      },
      
      'element-intercepted': {
        errorType: 'Element Intercepted by Other Element',
        commonCauses: [
          'Modal or overlay covering the element',
          'Loading spinner blocking interaction',
          'Tooltip or dropdown covering element',
          'Fixed navigation bar overlap'
        ],
        solutions: [
          'Wait for overlays to disappear: waitForSelector(".loading", { state: "hidden" })',
          'Close modals before interaction',
          'Use force: true to bypass interception (testing only)',
          'Scroll to element: scrollIntoViewIfNeeded()',
          'Wait for animations to complete'
        ]
      },
      
      'multiple-elements-found': {
        errorType: 'Multiple Elements Found (Strict Mode)',
        commonCauses: [
          'Selector too generic, matches multiple elements',
          'Dynamic content creating duplicate elements',
          'Missing unique identifiers',
          'Incorrect test data setup'
        ],
        solutions: [
          'Make selector more specific: [data-testid="unique-id"]',
          'Use nth() to target specific element: locator.nth(0)',
          'Add unique attributes to elements',
          'Use first() or last() methods for intentional selection',
          'Filter elements: locator.filter({ hasText: "specific text" })'
        ]
      },
      
      'cypress-command-failed': {
        errorType: 'Cypress Command Failed',
        commonCauses: [
          'Element not found or not actionable',
          'Command timeout exceeded',
          'Assertion failure',
          'Network request failed'
        ],
        solutions: [
          'Increase command timeout: cy.get(selector, { timeout: 10000 })',
          'Add explicit waits: cy.wait() or cy.intercept()',
          'Check selector accuracy and uniqueness',
          'Debug with cy.debug() or cy.pause()',
          'Verify application state before command execution'
        ]
      },
      
      'selenium-stale-element': {
        errorType: 'Selenium Stale Element Reference',
        commonCauses: [
          'Page refreshed after element reference',
          'DOM modified by JavaScript',
          'Navigation to different page',
          'Element removed and re-added'
        ],
        solutions: [
          'Re-find element before each interaction',
          'Use explicit waits: WebDriverWait().until()',
          'Avoid storing element references across page changes',
          'Implement retry mechanism for stale elements',
          'Check if page navigation occurred'
        ]
      },
      
      'undefined-variable': {
        errorType: 'Undefined Variable Reference',
        commonCauses: [
          'Variable used before declaration',
          'Typo in variable name',
          'Missing import statement',
          'Variable out of scope'
        ],
        solutions: [
          'Check variable spelling and declaration',
          'Add missing variable declaration or import',
          'Verify variable scope and accessibility',
          'Run ESLint to catch undefined variables: npx eslint --fix .',
          'Check if variable needs to be imported from another module'
        ]
      },
      
      'null-reference': {
        errorType: 'Null Reference Error',
        commonCauses: [
          'DOM element not found',
          'API response returned null',
          'Object not initialized',
          'Asynchronous operation not completed'
        ],
        solutions: [
          'Add null checks before property access: if (obj && obj.property)',
          'Use optional chaining: obj?.property',
          'Ensure DOM elements exist before manipulation',
          'Add proper async/await for element loading',
          'Initialize objects with default values'
        ]
      },
      
      'function-not-found': {
        errorType: 'Function Not Found Error',
        commonCauses: [
          'Function not defined or imported',
          'Typo in function name',
          'Object method called on null/undefined',
          'Async function not awaited'
        ],
        solutions: [
          'Verify function is defined and imported correctly',
          'Check function name spelling',
          'Ensure object exists before calling methods',
          'Add await for async functions',
          'Check if function is available in current scope'
        ]
      },
      
      'temporal-dead-zone': {
        errorType: 'Temporal Dead Zone Error',
        commonCauses: [
          'let/const variable accessed before declaration',
          'Hoisting confusion with var vs let/const',
          'Variable used in its own initialization'
        ],
        solutions: [
          'Move variable declaration before usage',
          'Use var instead of let/const if hoisting is needed',
          'Reorganize code to respect temporal dead zone',
          'Initialize variables at the top of scope'
        ]
      },
      
      'cors-error': {
        errorType: 'CORS Policy Error',
        commonCauses: [
          'Server not configured for cross-origin requests',
          'Missing CORS headers',
          'Wrong origin in CORS configuration',
          'Preflight request failed'
        ],
        solutions: [
          'Configure server CORS headers: Access-Control-Allow-Origin',
          'Use proxy in development: setupProxy.js',
          'Make same-origin requests when possible',
          'Add CORS middleware to Express: app.use(cors())',
          'Configure webpack devServer proxy for development'
        ]
      },
      
      'api-unauthorized': {
        errorType: 'API Unauthorized (401)',
        commonCauses: [
          'Missing or invalid authentication token',
          'Expired session or token',
          'Incorrect API credentials',
          'Token not included in request headers'
        ],
        solutions: [
          'Check authentication token validity',
          'Refresh expired tokens',
          'Include Authorization header: Bearer <token>',
          'Verify API credentials and permissions',
          'Implement token refresh mechanism'
        ]
      },
      
      'react-infinite-render': {
        errorType: 'React Infinite Render Loop',
        commonCauses: [
          'useEffect without dependency array',
          'State update in render function',
          'Incorrect dependency array in hooks',
          'Object/array created in render'
        ],
        solutions: [
          'Add dependency array to useEffect: useEffect(() => {}, [])',
          'Move state updates to event handlers or effects',
          'Memoize objects/arrays with useMemo or useCallback',
          'Check if component props are changing on every render',
          'Use React DevTools Profiler to identify render causes'
        ]
      },
      
      'memory-error': {
        errorType: 'Memory Limit Exceeded',
        commonCauses: [
          'Memory leaks in application',
          'Large data sets not properly handled',
          'Infinite loops creating objects',
          'Insufficient heap size'
        ],
        solutions: [
          'Increase Node.js heap size: node --max-old-space-size=4096',
          'Identify memory leaks with Chrome DevTools',
          'Implement data pagination for large datasets',
          'Clear unused variables and event listeners',
          'Use streaming for large file operations'
        ]
      }
    };
    
    const pattern = patterns[errorType] || {
      errorType: 'Unknown Error',
      commonCauses: ['Insufficient error information available'],
      solutions: ['Analyze error message and stack trace', 'Check documentation for related functionality']
    };
    
    // Enhance solutions based on code context
    if (codeContext?.fileName && codeContext?.lineNumber) {
      pattern.solutions.unshift(`Check line ${codeContext.lineNumber} in ${codeContext.fileName}`);
    }
    
    if (codeContext?.functionName && codeContext.functionName !== 'unknown') {
      pattern.solutions.push(`Review function: ${codeContext.functionName}`);
    }
    
    return pattern;
  }

  /**
   * Calculate confidence based on available information
   */
  private calculateConfidence(errorMessage: string, stackTrace?: any, codeContext?: any): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence for well-known error patterns
    if (errorMessage.includes('webServer') && errorMessage.includes('timeout')) confidence += 0.3;
    if (errorMessage.includes('ReferenceError') && errorMessage.includes('not defined')) confidence += 0.35;
    if (errorMessage.includes('TypeError') && errorMessage.includes('null')) confidence += 0.3;
    
    // Boost confidence for stack trace availability
    if (stackTrace?.callStack.length > 0) confidence += 0.1;
    
    // Boost confidence for code context
    if (codeContext?.lineNumber) confidence += 0.1;
    if (codeContext?.codeSnippet) confidence += 0.05;
    
    return Math.min(0.98, confidence); // Cap at 98%
  }

  /**
   * Determine error severity
   */
  private determineSeverity(errorType: string, errorMessage: string): 'low' | 'medium' | 'high' | 'critical' {
    if (errorMessage.includes('security') || errorMessage.includes('authentication')) return 'critical';
    if (errorMessage.includes('database') || errorMessage.includes('data loss')) return 'high';
    if (errorMessage.includes('timeout') || errorMessage.includes('network')) return 'medium';
    if (errorMessage.includes('syntax') || errorMessage.includes('typo')) return 'low';
    
    return 'medium'; // Default
  }
}
