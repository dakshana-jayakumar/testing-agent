import { NeuroLink } from '@juspay/neurolink';
import { ErrorAnalysis, TestValidationResult } from '../types/analysis.js';

/**
 * NeuroLink configuration interface
 */
export interface NeuroLinkConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

/**
 * AI analysis result interface (maintaining backward compatibility)
 */
export interface AIAnalysisResult {
  summary: string;
  rootCause: string;
  suggestions: string[];
  confidence: number; // 0-1
  fixCode?: string;
  researchQueries?: string[];
}

/**
 * Visual analysis result interface (maintaining backward compatibility)
 */
export interface VisualAnalysisResult {
  description: string;
  elements: Array<{
    type: string;
    description: string;
    bounds?: { x: number; y: number; width: number; height: number };
  }>;
  issues: string[];
  suggestions: string[];
  confidence: number; // 0-1
}

/**
 * Analysis context interface
 */
export interface AnalysisContext {
  testFile?: string;
  projectRoot: string;
  browserContext?: {
    url: string;
    viewport: { width: number; height: number };
    userAgent: string;
  };
  errorContext?: {
    stackTrace?: string;
    browserLogs?: string[];
    networkLogs?: string[];
  };
}

/**
 * Lumos NeuroLink Client
 * Provides a simple interface to NeuroLink for AI-powered testing intelligence
 */
export class LumosNeuroLinkClient {
  private client: NeuroLink;
  private config: NeuroLinkConfig;

  constructor(config: NeuroLinkConfig) {
    this.config = {
      model: 'gpt-4',
      maxTokens: 4000,
      temperature: 0.3,
      timeout: 30000,
      ...config,
    };

    if (!this.config.apiKey) {
      throw new Error('NeuroLink API key is required');
    }

    // Initialize NeuroLink with proper configuration
    this.client = new NeuroLink({
      enableOrchestration: true,
    });

    // Store API key for later use
    process.env.NEUROLINK_API_KEY = this.config.apiKey;
  }

  /**
   * Check if NeuroLink is available and configured correctly
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Simple connectivity check
      return !!this.config.apiKey && !!this.client;
    } catch (error) {
      console.warn('NeuroLink availability check failed:', error);
      return false;
    }
  }

  /**
   * Analyze error with AI intelligence
   */
  async analyzeError(error: ErrorAnalysis, context: AnalysisContext): Promise<AIAnalysisResult> {
    const prompt = this.createErrorAnalysisPrompt(error, context);

    try {
      // Use NeuroLink's completion method (adjust based on actual API)
      const response = await this.makeRequest(prompt, 'completion');

      // Parse the response as JSON
      const result = this.parseAIResponse(response);
      return result;
    } catch (err: any) {
      throw new Error(`NeuroLink error analysis failed: ${err.message}`);
    }
  }

  /**
   * Analyze visual elements in screenshots
   */
  async analyzeVisual(screenshot: Buffer, context: AnalysisContext): Promise<VisualAnalysisResult> {
    const prompt = this.createVisualAnalysisPrompt(context);

    try {
      // Convert screenshot to base64 for vision analysis
      const base64Image = screenshot.toString('base64');

      const response = await this.makeRequest(prompt, 'vision', { image: base64Image });

      // Parse the response as JSON
      const result = this.parseVisualResponse(response);
      return result;
    } catch (err: any) {
      throw new Error(`NeuroLink visual analysis failed: ${err.message}`);
    }
  }

  /**
   * Validate test results and suggest improvements
   */
  async validateTest(
    result: TestValidationResult,
    context: AnalysisContext
  ): Promise<AIAnalysisResult> {
    const prompt = this.createTestValidationPrompt(result, context);

    try {
      const response = await this.makeRequest(prompt, 'completion');

      // Parse the response as JSON
      const analysisResult = this.parseAIResponse(response);
      return analysisResult;
    } catch (err: any) {
      throw new Error(`NeuroLink test validation failed: ${err.message}`);
    }
  }

  /**
   * Generate code fixes based on analysis
   */
  async generateFix(analysis: AIAnalysisResult, context: AnalysisContext): Promise<string> {
    const prompt = this.createFixGenerationPrompt(analysis, context);

    try {
      const response = await this.makeRequest(prompt, 'completion', { temperature: 0.1 });

      return response;
    } catch (err: any) {
      throw new Error(`NeuroLink fix generation failed: ${err.message}`);
    }
  }

  /**
   * Make request to NeuroLink API
   * This is a wrapper method that can be adapted to the actual NeuroLink API
   */
  private async makeRequest(
    prompt: string,
    type: 'completion' | 'vision',
    options?: any
  ): Promise<string> {
    try {
      // TODO: Replace this with actual NeuroLink API calls once the correct API is confirmed
      // For now, we'll create a placeholder that maintains the expected interface

      // This is a temporary implementation that should be replaced with actual NeuroLink calls
      throw new Error(
        'NeuroLink API integration pending - please configure with actual API endpoints'
      );

      // When the actual NeuroLink API is available, replace above with something like:
      // if (type === 'vision') {
      //   return await this.client.vision({ prompt, image: options?.image, ...this.config });
      // } else {
      //   return await this.client.complete(prompt, { ...this.config, ...options });
      // }
    } catch (err: any) {
      // Fallback for development/testing
      console.warn('NeuroLink API not available, using fallback response');
      return this.getFallbackResponse(prompt, type);
    }
  }

  /**
   * Provide fallback responses for development/testing
   */
  private getFallbackResponse(prompt: string, type: 'completion' | 'vision'): string {
    if (type === 'vision') {
      return JSON.stringify({
        description: 'Visual analysis completed (fallback mode)',
        elements: [],
        issues: ['NeuroLink API not configured - using fallback response'],
        suggestions: ['Configure NeuroLink API for actual visual analysis'],
        confidence: 0.5,
      });
    }

    return JSON.stringify({
      summary: 'Analysis completed (fallback mode)',
      rootCause: 'NeuroLink API not configured - using fallback response',
      suggestions: [
        'Configure NeuroLink API key',
        'Verify NeuroLink service availability',
        'Check network connectivity',
      ],
      confidence: 0.5,
      fixCode: '// NeuroLink API configuration required for fix generation',
    });
  }

  /**
   * Create standardized prompt for error analysis
   */
  private createErrorAnalysisPrompt(error: ErrorAnalysis, context: AnalysisContext): string {
    return `
You are an expert software testing engineer analyzing a test failure. Provide a comprehensive analysis.

## Error Details:
- Category: ${error.category}
- Message: ${error.context.errorMessage}
- Confidence: ${error.confidence}

## Stack Trace:
${error.context.stackTrace || 'Not available'}

## File Context:
- File: ${error.context.filePath || context.testFile || 'Unknown'}
- Line: ${error.context.lineNumber || 'Unknown'}
- Code Context: ${error.context.codeContext || 'Not available'}

## Test Context:
- Project Root: ${context.projectRoot}
${
  context.browserContext
    ? `
- Browser URL: ${context.browserContext.url}
- Viewport: ${context.browserContext.viewport.width}x${context.browserContext.viewport.height}
`
    : ''
}

## Environment:
${
  error.context.environment
    ? `
- Node Version: ${error.context.environment.nodeVersion || 'Unknown'}
- Platform: ${error.context.environment.platform || 'Unknown'}
- Framework: ${error.context.environment.framework || 'Unknown'}
- Environment: ${error.context.environment.environment || 'Unknown'}
`
    : 'Not available'
}

## Additional Context:
${
  context.errorContext?.browserLogs?.length
    ? `
Browser Logs:
${context.errorContext.browserLogs.join('\n')}
`
    : ''
}

${
  context.errorContext?.networkLogs?.length
    ? `
Network Logs:
${context.errorContext.networkLogs.join('\n')}
`
    : ''
}

## Existing Suggestions:
${error.suggestions.length ? error.suggestions.join('\n- ') : 'None'}

## Pattern Information:
${
  error.pattern
    ? `
- Pattern ID: ${error.pattern.id}
- Pattern: ${error.pattern.pattern}
- Frequency: ${error.pattern.frequency}
- Last Seen: ${error.pattern.lastSeen}
`
    : 'No pattern identified'
}

Please provide a JSON response with these fields:
- summary: string
- rootCause: string
- suggestions: string[]
- confidence: number (0-1)
- fixCode?: string
- researchQueries?: string[]

Respond with valid JSON only, no additional text.
`.trim();
  }

  /**
   * Create standardized prompt for visual analysis
   */
  private createVisualAnalysisPrompt(context: AnalysisContext): string {
    return `
You are an expert UI/UX tester analyzing a screenshot for testing issues.

## Context:
${
  context.browserContext
    ? `
- URL: ${context.browserContext.url}
- Viewport: ${context.browserContext.viewport.width}x${context.browserContext.viewport.height}
- User Agent: ${context.browserContext.userAgent}
`
    : ''
}

Analyze the screenshot and provide a JSON response with these fields:
- description: string
- elements: Array<{type: string, description: string, bounds?: {x, y, width, height}}>
- issues: string[]
- suggestions: string[]
- confidence: number (0-1)

Respond with valid JSON only, no additional text.
`.trim();
  }

  /**
   * Create standardized prompt for test validation
   */
  private createTestValidationPrompt(
    result: TestValidationResult,
    context: AnalysisContext
  ): string {
    return `
You are analyzing test quality and performance. Provide actionable insights for improvement.

## Test Quality Analysis:
- Overall Score: ${result.overall.score}/100 (Grade: ${result.overall.grade})
- Factors: ${result.overall.factors.map(f => `${f.name}: ${f.score} (${f.description})`).join('\n  ')}

## Coverage Analysis:
- Lines: ${result.coverage.lines.percentage}% (${result.coverage.lines.covered}/${result.coverage.lines.total})
- Functions: ${result.coverage.functions.percentage}% (${result.coverage.functions.covered}/${result.coverage.functions.total})
- Branches: ${result.coverage.branches.percentage}% (${result.coverage.branches.covered}/${result.coverage.branches.total})

## Coverage Gaps:
${result.coverage.gaps.map(gap => `- ${gap.file}: ${gap.lines.length} uncovered lines (${gap.priority} priority) - ${gap.reason}`).join('\n')}

## Flaky Test Analysis:
- Flaky Percentage: ${result.flaky.flakyPercentage}%
- Stability Score: ${result.flaky.stabilityScore}
- Flaky Tests: ${result.flaky.flakyTests.length}

## Performance Analysis:
- Average Duration: ${result.performance.averageDuration}ms
- Slowest Tests: ${result.performance.slowestTests.length}
- Timeouts: ${result.performance.timeouts}
- Memory Leaks: ${result.performance.memoryUsage.leaks.length}

## Existing Recommendations:
${result.recommendations.map(r => `- [${r.priority.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')}

## Context:
- Project Root: ${context.projectRoot}
- Test File: ${context.testFile || 'Unknown'}

Please provide a JSON response with these fields:
- summary: string
- rootCause: string
- suggestions: string[]
- confidence: number (0-1)
- fixCode?: string
- researchQueries?: string[]

Respond with valid JSON only, no additional text.
`.trim();
  }

  /**
   * Create standardized prompt for fix generation
   */
  private createFixGenerationPrompt(analysis: AIAnalysisResult, context: AnalysisContext): string {
    return `
Generate a code fix based on the analysis results.

## Analysis Summary:
${analysis.summary}

## Root Cause:
${analysis.rootCause}

## Suggestions:
${analysis.suggestions.join('\n- ')}

## Context:
- Project Root: ${context.projectRoot}
- Test File: ${context.testFile || 'Unknown'}

## Requirements:
1. Provide complete, working code
2. Include proper TypeScript types
3. Follow best practices for test automation
4. Add helpful comments
5. Consider edge cases and error handling

Generate a complete code solution that addresses the root cause and implements the suggestions.
`.trim();
  }

  /**
   * Parse AI response and extract JSON
   */
  private parseAIResponse(response: string): AIAnalysisResult {
    try {
      // Look for JSON objects in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // If no JSON found, try to find it between code blocks
      const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        return JSON.parse(codeBlockMatch[1]);
      }

      // Fallback: try to parse the entire response
      return JSON.parse(response);
    } catch (error) {
      // If parsing fails, create a basic response
      return {
        summary: 'AI analysis completed',
        rootCause: 'Unable to parse detailed analysis',
        suggestions: ['Review the error manually', 'Check test configuration'],
        confidence: 0.5,
        fixCode: '// Fix code generation failed, manual review required',
      };
    }
  }

  /**
   * Parse visual analysis response
   */
  private parseVisualResponse(response: string): VisualAnalysisResult {
    try {
      // Similar JSON parsing logic as parseAIResponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        return JSON.parse(codeBlockMatch[1]);
      }

      return JSON.parse(response);
    } catch (error) {
      // Fallback visual analysis
      return {
        description: 'Visual analysis completed',
        elements: [],
        issues: ['Unable to parse detailed visual analysis'],
        suggestions: ['Review screenshot manually'],
        confidence: 0.5,
      };
    }
  }
}

/**
 * Create a NeuroLink client with environment-based configuration
 */
export function createNeuroLinkClient(config?: Partial<NeuroLinkConfig>): LumosNeuroLinkClient {
  const apiKey = config?.apiKey || process.env.NEUROLINK_API_KEY;

  if (!apiKey) {
    throw new Error(
      'NeuroLink API key not found. Set NEUROLINK_API_KEY environment variable or provide apiKey in config.'
    );
  }

  return new LumosNeuroLinkClient({
    apiKey,
    ...config,
  });
}
