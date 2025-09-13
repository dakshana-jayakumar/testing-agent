import { z } from 'zod';

// Configuration schema using Zod for runtime validation
export const LumosConfigSchema = z.object({
  ai: z.object({
    // Primary provider selection
    primaryProvider: z.enum(['openai', 'anthropic', 'google']).default('openai'),
    
    // Provider-specific configurations
    providers: z.object({
      openai: z.object({
        enabled: z.boolean().default(true),
        model: z.string().default('gpt-4-turbo-preview'),
        visionModel: z.string().default('gpt-4-vision-preview'),
        apiKey: z.string().optional(), // Will use OPENAI_API_KEY env var if not provided
        organizationId: z.string().optional(),
        maxTokens: z.number().min(100).max(32000).default(4000),
        temperature: z.number().min(0).max(2).default(0.3),
        topP: z.number().min(0).max(1).default(1),
        frequencyPenalty: z.number().min(-2).max(2).default(0),
        presencePenalty: z.number().min(-2).max(2).default(0)
      }).default({}),
      
      anthropic: z.object({
        enabled: z.boolean().default(true),
        model: z.string().default('claude-3-sonnet-20240229'),
        apiKey: z.string().optional(), // Will use ANTHROPIC_API_KEY env var if not provided
        maxTokens: z.number().min(100).max(100000).default(4000),
        temperature: z.number().min(0).max(1).default(0.3),
        topP: z.number().min(0).max(1).default(1),
        topK: z.number().min(1).max(40).default(5)
      }).default({}),
      
      google: z.object({
        enabled: z.boolean().default(true),
        model: z.string().default('gemini-1.5-pro'),
        apiKey: z.string().optional(), // Will use GOOGLE_API_KEY env var if not provided
        maxTokens: z.number().min(100).max(30720).default(4000),
        temperature: z.number().min(0).max(2).default(0.3),
        topP: z.number().min(0).max(1).default(0.95),
        topK: z.number().min(1).max(40).default(20),
        safetyThreshold: z.enum(['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']).default('BLOCK_MEDIUM_AND_ABOVE')
      }).default({})
    }).default({}),
    
    // Fallback and coordination settings
    fallback: z.object({
      enabled: z.boolean().default(true),
      providers: z.array(z.enum(['openai', 'anthropic', 'google'])).default(['anthropic', 'google']),
      retryAttempts: z.number().min(1).max(5).default(3),
      retryDelay: z.number().min(1000).max(30000).default(2000),
      exponentialBackoff: z.boolean().default(true)
    }).default({}),
    
    // Rate limiting and cost optimization
    rateLimiting: z.object({
      enabled: z.boolean().default(true),
      requestsPerMinute: z.number().min(1).max(1000).default(60),
      tokensPerMinute: z.number().min(1000).max(1000000).default(50000),
      dailyCostLimit: z.number().min(1).max(1000).default(50) // USD
    }).default({}),
    
    // Analysis-specific settings
    analysis: z.object({
      maxScreenshots: z.number().min(1).max(10).default(3),
      includeStackTrace: z.boolean().default(true),
      includeEnvironmentInfo: z.boolean().default(true),
      confidenceThreshold: z.number().min(0).max(1).default(0.7),
      enableContextualAnalysis: z.boolean().default(true)
    }).default({}),
    
    // Global AI settings
    timeout: z.number().min(1000).max(300000).default(30000),
    enableLogging: z.boolean().default(true),
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info')
  }),
  
  playwright: z.object({
    headless: z.boolean().default(true),
    timeout: z.number().default(30000),
    viewport: z.object({
      width: z.number().default(1280),
      height: z.number().default(720)
    })
  }),
  
  testing: z.object({
    coverageThreshold: z.number().min(0).max(100).default(80),
    flakyDetection: z.boolean().default(true),
    performanceMonitoring: z.boolean().default(true)
  }),
  
  research: z.object({
    sources: z.array(z.enum(['stackoverflow', 'github', 'documentation'])).default(['stackoverflow', 'github']),
    maxResults: z.number().min(1).max(50).default(10),
    confidenceThreshold: z.number().min(0).max(1).default(0.7)
  }),
  
  cache: z.object({
    enabled: z.boolean().default(true),
    ttl: z.string().default('1h'),
    maxSize: z.string().default('100mb')
  })
});

// Infer TypeScript type from Zod schema
export type LumosConfig = z.infer<typeof LumosConfigSchema>;

// Environment-specific configuration overrides
export interface EnvironmentConfig {
  development?: Partial<LumosConfig>;
  production?: Partial<LumosConfig>;
  test?: Partial<LumosConfig>;
}

// Complete configuration with environment overrides
export interface ConfigWithEnvironments extends LumosConfig {
  environments?: EnvironmentConfig;
}

// Configuration file structure
export interface ConfigFile {
  config: ConfigWithEnvironments;
  path: string;
  lastModified: Date;
}

// Configuration validation result
export interface ConfigValidationResult {
  valid: boolean;
  config?: LumosConfig;
  errors?: z.ZodError[];
}
