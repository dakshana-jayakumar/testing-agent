# API Reference 📖

Complete technical reference for Lumos APIs and interfaces.

## Core Classes

### AICoordinator

The main orchestrator for AI-powered analysis operations.

```typescript
class AICoordinator {
  constructor(config: CoordinatorConfig);

  // Error Analysis
  analyzeError(
    error: ErrorAnalysis,
    context: AnalysisContext,
    options?: AnalysisOptions
  ): Promise<AIAnalysisResult>;

  // Visual Analysis
  analyzeVisual(
    screenshot: Buffer,
    context: AnalysisContext,
    options?: AnalysisOptions
  ): Promise<VisualAnalysisResult>;

  // Test Validation
  validateTest(
    result: TestValidationResult,
    context: AnalysisContext,
    options?: AnalysisOptions
  ): Promise<AIAnalysisResult>;

  // Code Generation
  generateFix(
    analysis: AIAnalysisResult,
    context: AnalysisContext,
    options?: AnalysisOptions
  ): Promise<string>;

  // Status Check
  hasAvailableProviders(): Promise<boolean>;
  getProviderStatus(): Promise<ProviderStatus>;
}
```

### LumosNeuroLinkClient

NeuroLink integration client for AI operations.

```typescript
class LumosNeuroLinkClient {
  constructor(config: NeuroLinkConfig);

  // Availability Check
  isAvailable(): Promise<boolean>;

  // Analysis Methods
  analyzeError(
    error: ErrorAnalysis,
    context: AnalysisContext
  ): Promise<AIAnalysisResult>;
  analyzeVisual(
    screenshot: Buffer,
    context: AnalysisContext
  ): Promise<VisualAnalysisResult>;
  validateTest(
    result: TestValidationResult,
    context: AnalysisContext
  ): Promise<AIAnalysisResult>;
  generateFix(
    analysis: AIAnalysisResult,
    context: AnalysisContext
  ): Promise<string>;
}
```

## Type Definitions

### Configuration Types

```typescript
interface CoordinatorConfig {
  neurolink: NeuroLinkConfig;
  maxRetries?: number;
  retryDelay?: number;
}

interface NeuroLinkConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

interface AnalysisOptions {
  timeout?: number;
  retryOnFailure?: boolean;
}
```

### Analysis Types

```typescript
interface ErrorAnalysis {
  category: ErrorCategory;
  confidence: number;
  suggestions: string[];
  pattern: ErrorPattern | null;
  context: ErrorContext;
  timestamp: Date;
}

interface ErrorContext {
  errorMessage: string;
  stackTrace?: string;
  filePath?: string;
  lineNumber?: number;
  codeContext?: string;
  timestamp: Date;
  environment?: EnvironmentInfo;
}

interface AnalysisContext {
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
```

### Result Types

```typescript
interface AIAnalysisResult {
  summary: string;
  rootCause: string;
  suggestions: string[];
  confidence: number; // 0-1
  fixCode?: string;
  researchQueries?: string[];
}

interface VisualAnalysisResult {
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

interface TestValidationResult {
  overall: {
    score: number;
    grade: string;
    factors: Array<{
      name: string;
      score: number;
      description: string;
    }>;
  };
  coverage: {
    lines: { percentage: number; covered: number; total: number };
    functions: { percentage: number; covered: number; total: number };
    branches: { percentage: number; covered: number; total: number };
    gaps: Array<{
      file: string;
      lines: number[];
      priority: 'low' | 'medium' | 'high';
      reason: string;
    }>;
  };
  flaky: {
    flakyPercentage: number;
    stabilityScore: number;
    flakyTests: Array<{
      name: string;
      failureRate: number;
      pattern: string;
    }>;
  };
  performance: {
    averageDuration: number;
    slowestTests: Array<{
      name: string;
      duration: number;
      bottleneck: string;
    }>;
    timeouts: number;
    memoryUsage: {
      leaks: Array<{
        test: string;
        size: string;
        location: string;
      }>;
    };
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    effort: 'minimal' | 'moderate' | 'significant';
  }>;
}
```

### Enum Types

```typescript
enum ErrorCategory {
  SYNTAX_ERROR = 'syntax-error',
  LOGIC_ERROR = 'logic-error',
  RUNTIME_ERROR = 'runtime-error',
  TYPE_ERROR = 'type-error',
  REFERENCE_ERROR = 'reference-error',
  NETWORK_ERROR = 'network-error',
  TIMEOUT_ERROR = 'timeout-error',
  PERMISSION_ERROR = 'permission-error',
  UI_ERROR = 'ui-error',
  ASSERTION_ERROR = 'assertion-error',
  UNKNOWN_ERROR = 'unknown-error',
}
```

## Factory Functions

### createAICoordinator

Create a new AI coordinator instance.

```typescript
function createAICoordinator(config: CoordinatorConfig): AICoordinator;

// Example
const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
    model: 'gpt-4',
    temperature: 0.3,
  },
  maxRetries: 3,
  retryDelay: 1000,
});
```

### createDefaultCoordinator

Create coordinator with environment-based configuration.

```typescript
function createDefaultCoordinator(): AICoordinator;

// Example
const coordinator = createDefaultCoordinator();
// Uses NEUROLINK_API_KEY environment variable
```

### createNeuroLinkClient

Create a NeuroLink client with configuration.

```typescript
function createNeuroLinkClient(
  config?: Partial<NeuroLinkConfig>
): LumosNeuroLinkClient;

// Example
const client = createNeuroLinkClient({
  apiKey: process.env.NEUROLINK_API_KEY,
  model: 'gpt-4',
  maxTokens: 4000,
});
```

## Error Handling

### Error Classes

```typescript
class LumosError extends Error {
  code: string;
  details?: any;
}

class NeuroLinkError extends LumosError {
  constructor(message: string, code: string, details?: any);
}

class ConfigurationError extends LumosError {
  constructor(message: string, field?: string);
}

class AnalysisError extends LumosError {
  constructor(message: string, errorType?: string);
}
```

### Error Codes

```typescript
const ErrorCodes = {
  // Configuration Errors
  MISSING_API_KEY: 'MISSING_API_KEY',
  INVALID_CONFIG: 'INVALID_CONFIG',

  // Network Errors
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',

  // API Errors
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  INVALID_REQUEST: 'INVALID_REQUEST',

  // Analysis Errors
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  PARSING_FAILED: 'PARSING_FAILED',
  CONTEXT_TOO_LARGE: 'CONTEXT_TOO_LARGE',
} as const;
```

## Utility Functions

### Configuration Utilities

```typescript
// Validate configuration
function validateConfig(config: any): { valid: boolean; errors?: string[] };

// Merge configurations
function mergeConfigs(base: any, override: any): any;

// Load configuration from file
function loadConfig(
  path?: string
): Promise<{ config: any; valid: boolean; errors?: string[] }>;
```

### Analysis Utilities

```typescript
// Create error analysis from exception
function createErrorAnalysis(
  error: Error,
  context?: Partial<ErrorContext>
): ErrorAnalysis;

// Parse stack trace
function parseStackTrace(stackTrace: string): Array<{
  file: string;
  line: number;
  column: number;
  function: string;
}>;

// Extract error patterns
function extractPatterns(errors: ErrorAnalysis[]): ErrorPattern[];
```

### Context Utilities

```typescript
// Create analysis context
function createAnalysisContext(options: {
  projectRoot: string;
  testFile?: string;
  browserContext?: any;
}): AnalysisContext;

// Enhance context with environment info
function enhanceContext(context: AnalysisContext): AnalysisContext;
```

## CLI Integration

### Command Interface

```typescript
interface CommandOptions {
  verbose?: boolean;
  quiet?: boolean;
  config?: string;
}

interface AnalyzeOptions extends CommandOptions {
  file?: string;
  context?: string;
  research?: boolean;
  fixSuggestions?: boolean;
  confidence: string;
  maxSuggestions: string;
}

interface ValidateOptions extends CommandOptions {
  threshold?: number;
  detailed?: boolean;
  fix?: boolean;
  format?: 'json' | 'table' | 'html';
}

interface DebugOptions extends CommandOptions {
  url?: string;
  viewport?: string;
  device?: string;
  saveScreenshots?: boolean;
  interactive?: boolean;
  headless?: boolean;
}
```

### Command Functions

```typescript
// Analyze command
async function analyzeCommand(
  error: string,
  options: AnalyzeOptions
): Promise<void>;

// Validate command
async function validateCommand(
  testPath?: string,
  options?: ValidateOptions
): Promise<void>;

// Debug command
async function debugCommand(options: DebugOptions): Promise<void>;

// Research command
async function researchCommand(
  query: string,
  options: CommandOptions
): Promise<void>;
```

## Event System

### Event Types

```typescript
interface LumosEvent {
  type: string;
  timestamp: Date;
  data: any;
}

interface AnalysisStartEvent extends LumosEvent {
  type: 'analysis.start';
  data: {
    id: string;
    type: 'error' | 'visual' | 'validation';
    input: any;
  };
}

interface AnalysisCompleteEvent extends LumosEvent {
  type: 'analysis.complete';
  data: {
    id: string;
    result: any;
    duration: number;
  };
}

interface ErrorEvent extends LumosEvent {
  type: 'error';
  data: {
    error: Error;
    context: any;
  };
}
```

### Event Emitter

```typescript
class LumosEventEmitter {
  on(event: string, listener: (event: LumosEvent) => void): void;
  off(event: string, listener: (event: LumosEvent) => void): void;
  emit(event: string, data: any): void;
}

// Usage
const emitter = new LumosEventEmitter();

emitter.on('analysis.start', event => {
  console.log('Analysis started:', event.data.id);
});

emitter.on('analysis.complete', event => {
  console.log('Analysis completed in', event.data.duration, 'ms');
});
```

## Plugin System

### Plugin Interface

```typescript
interface LumosPlugin {
  name: string;
  version: string;

  // Lifecycle hooks
  initialize?(config: any): Promise<void>;
  beforeAnalysis?(context: AnalysisContext): Promise<AnalysisContext>;
  afterAnalysis?(result: any, context: AnalysisContext): Promise<any>;
  cleanup?(): Promise<void>;

  // Custom analyzers
  analyzers?: {
    [key: string]: (input: any, context: AnalysisContext) => Promise<any>;
  };
}
```

### Plugin Registration

```typescript
// Register plugin
function registerPlugin(plugin: LumosPlugin): void;

// Load plugins from directory
function loadPlugins(directory: string): Promise<LumosPlugin[]>;

// Example plugin
const customPlugin: LumosPlugin = {
  name: 'custom-analyzer',
  version: '1.0.0',

  beforeAnalysis: async context => {
    // Enhance context
    return {
      ...context,
      customData: 'enhanced',
    };
  },

  analyzers: {
    'custom-error': async (error, context) => {
      // Custom analysis logic
      return {
        summary: 'Custom analysis result',
        confidence: 0.9,
      };
    },
  },
};

registerPlugin(customPlugin);
```

## Environment Variables Reference

```typescript
const EnvironmentVariables = {
  // Required
  NEUROLINK_API_KEY: 'NeuroLink API key',

  // Optional Core
  LUMOS_CONFIG_PATH: 'Path to configuration file',
  LUMOS_LOG_LEVEL: 'Logging level (debug|info|warn|error)',
  LUMOS_CACHE_ENABLED: 'Enable caching (true|false)',
  LUMOS_ENVIRONMENT: 'Environment name (dev|staging|prod)',

  // AI Configuration
  NEUROLINK_MODEL: 'AI model to use',
  NEUROLINK_MAX_TOKENS: 'Maximum tokens per request',
  NEUROLINK_TEMPERATURE: 'AI temperature setting',
  NEUROLINK_TIMEOUT: 'Request timeout in milliseconds',

  // Debug Settings
  LUMOS_DEBUG_SCREENSHOTS: 'Save debug screenshots',
  LUMOS_DEBUG_SAVE_LOGS: 'Save debug logs',
  LUMOS_DEBUG_VERBOSE: 'Enable verbose debug output',

  // Integration
  GITHUB_TOKEN: 'GitHub API token',
  SLACK_WEBHOOK: 'Slack webhook URL',
  JIRA_API_TOKEN: 'Jira API token',

  // Enterprise
  LUMOS_ORG_ID: 'Organization ID',
  LUMOS_PROJECT_ID: 'Project ID',
} as const;
```

## Version Compatibility

### API Versioning

```typescript
const API_VERSION = '1.0.0';

interface VersionInfo {
  api: string;
  core: string;
  neurolink: string;
  compatible: string[];
}

function getVersionInfo(): VersionInfo;
function checkCompatibility(requiredVersion: string): boolean;
```

### Migration Guide

```typescript
// Migrating from v0.x to v1.x
const migrationGuide = {
  '0.9.x': {
    breaking: [
      'AIProvider interface changed to NeuroLink-only',
      'Configuration format updated',
      'Some CLI options renamed',
    ],
    migration: [
      'Update configuration to use neurolink provider',
      'Replace provider-specific imports with neurolink imports',
      'Update CLI scripts to use new option names',
    ],
  },
};
```

---

**Need more details?** Check our [SDK Integration Guide](../sdk/integration.md)
for practical examples and [Configuration Guide](../advanced/configuration.md)
for setup details.
