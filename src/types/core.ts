/**
 * 🔮 Lumos Core Types
 * 
 * Core type definitions for the Guardian system
 */

export interface GuardianConfig {
  // AI Configuration
  ai: {
    provider: 'auto' | 'openai' | 'anthropic' | 'google-ai';
    enableFallback: boolean;
    enableAnalytics: boolean;
    timeout: string;
    temperature: number;
    maxRetries: number;
  };

  // Testing Configuration
  testing: {
    defaultTimeout: number;
    retryAttempts: number;
    excludePatterns: string[];
    contextLines: number;
    enableScreenshots: boolean;
  };

  // Cache Configuration
  cache: {
    enabled: boolean;
    ttl: string;
    maxSize: string;
    storage: 'memory' | 'disk' | 'redis';
  };

  // Performance Configuration
  performance: {
    enableMonitoring: boolean;
    batchSize: number;
    concurrentOperations: number;
    metricsRetention: string;
  };

  // Security Configuration
  security: {
    enableDataFiltering: boolean;
    sensitivePatterns: string[];
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

export type ProcessingOperation = 
  | 'error-analysis'
  | 'quality-validation'
  | 'insights-generation'
  | 'security-scan'
  | 'performance-analysis'
  | 'coverage-analysis';

export interface ProcessingResult {
  operationId: string;
  success: boolean;
  operations: OperationResult[];
  performance: {
    totalTime: number;
    apiCallsSaved: number;
    cacheHitRatio: number;
    operationsProcessed: number;
  };
  context: {
    testPath: string;
    filesProcessed: number;
    totalErrors: number;
  };
  errors?: Error[];
}

export interface OperationResult {
  type: ProcessingOperation;
  success: boolean;
  results: any[];
  errors?: any[];
  metadata?: {
    duration: number;
    confidence?: number;
    suggestions?: string[];
  };
}

export interface StreamingUpdate {
  operationId: string;
  operation: string;
  status: 'started' | 'in-progress' | 'completed' | 'failed';
  message: string;
  progress?: number;
  data?: any;
}

export interface HealthStatus {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    ai: ComponentHealth;
    cache: ComponentHealth;
    config: ComponentHealth;
    performance: ComponentHealth;
  };
  lastChecked: Date;
  uptime: number;
}

export interface ComponentHealth {
  status: 'ok' | 'warning' | 'error';
  message?: string;
  lastError?: Error;
  metrics?: Record<string, number>;
}

export interface PerformanceMetrics {
  totalOperations: number;
  averageProcessingTime: number;
  successRate: number;
  apiCallsSaved: number;
  cacheMetrics: {
    hitRatio: number;
    totalHits: number;
    totalMisses: number;
  };
  resourceUsage: {
    memory: NodeJS.MemoryUsage;
    cpu: number;
  };
}

export interface ContextData {
  files: FileContext[];
  cacheHits: number;
  cacheHitRatio: number;
  totalSize: number;
  metadata: {
    gathered: Date;
    strategy: 'whole' | 'file-by-file';
    exclusions: string[];
  };
}

export interface FileContext {
  path: string;
  content: string;
  size: number;
  type: string;
  lastModified: Date;
  errors?: string[];
}

export interface CacheStats {
  hitRatio: number;
  hits: number;
  misses: number;
  keyCount: number;
  totalSize: string;
  types: Record<string, number>;
}

export interface OperationTracker {
  operationId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  success?: boolean;
  error?: Error;
  complete(): { duration: number; success: boolean };
  fail(error: Error): void;
}

// Event types for the Guardian EventEmitter
export interface GuardianEvents {
  'initializing': () => void;
  'initialized': () => void;
  'processing:start': (data: { operationId: string; options: any }) => void;
  'processing:complete': (result: ProcessingResult) => void;
  'processing:error': (data: { operationId: string; error: Error }) => void;
  'cache:cleared': (data: { types?: string[] }) => void;
  'config:updated': (config: Partial<GuardianConfig>) => void;
  'config:hot-reload': (config: GuardianConfig) => void;
  'shutting-down': () => void;
  'shutdown': () => void;
  'error': (error: Error) => void;
}
