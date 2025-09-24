import {
  LumosNeuroLinkClient,
  createNeuroLinkClient,
  NeuroLinkConfig,
  AIAnalysisResult,
  VisualAnalysisResult,
  AnalysisContext,
} from './neurolink.js';
import { ErrorAnalysis, TestValidationResult } from '../types/analysis.js';

export interface CoordinatorConfig {
  neurolink: NeuroLinkConfig;
  maxRetries?: number;
  retryDelay?: number;
}

export interface AnalysisOptions {
  timeout?: number;
  retryOnFailure?: boolean;
}

/**
 * Simplified AI Coordinator using only NeuroLink
 * Maintains backward compatibility while providing enterprise-grade AI analysis
 */
export class AICoordinator {
  private client: LumosNeuroLinkClient;
  private config: CoordinatorConfig;

  constructor(config: CoordinatorConfig) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };

    // Initialize NeuroLink client
    this.client = createNeuroLinkClient(config.neurolink);
  }

  /**
   * Analyze error with NeuroLink AI intelligence
   */
  async analyzeError(
    error: ErrorAnalysis,
    context: AnalysisContext,
    options: AnalysisOptions = {}
  ): Promise<AIAnalysisResult> {
    try {
      console.log('🔮 Analyzing error with NeuroLink AI...');

      const result = await this.withRetry(
        () => this.client.analyzeError(error, context),
        'error analysis'
      );

      console.log('✅ Error analysis completed successfully with NeuroLink');
      return result;
    } catch (err: any) {
      console.error(`❌ Error analysis failed: ${err.message}`);
      throw new Error(`NeuroLink error analysis failed: ${err.message}`);
    }
  }

  /**
   * Analyze visual elements with NeuroLink AI intelligence
   */
  async analyzeVisual(
    screenshot: Buffer,
    context: AnalysisContext,
    options: AnalysisOptions = {}
  ): Promise<VisualAnalysisResult> {
    try {
      console.log('🔮 Analyzing screenshot with NeuroLink AI...');

      const result = await this.withRetry(
        () => this.client.analyzeVisual(screenshot, context),
        'visual analysis'
      );

      console.log('✅ Visual analysis completed successfully with NeuroLink');
      return result;
    } catch (err: any) {
      console.error(`❌ Visual analysis failed: ${err.message}`);
      throw new Error(`NeuroLink visual analysis failed: ${err.message}`);
    }
  }

  /**
   * Validate test results with NeuroLink AI intelligence
   */
  async validateTest(
    result: TestValidationResult,
    context: AnalysisContext,
    options: AnalysisOptions = {}
  ): Promise<AIAnalysisResult> {
    try {
      console.log('🔮 Validating test quality with NeuroLink AI...');

      const analysisResult = await this.withRetry(
        () => this.client.validateTest(result, context),
        'test validation'
      );

      console.log('✅ Test validation completed successfully with NeuroLink');
      return analysisResult;
    } catch (err: any) {
      console.error(`❌ Test validation failed: ${err.message}`);
      throw new Error(`NeuroLink test validation failed: ${err.message}`);
    }
  }

  /**
   * Generate code fix with NeuroLink AI intelligence
   */
  async generateFix(
    analysis: AIAnalysisResult,
    context: AnalysisContext,
    options: AnalysisOptions = {}
  ): Promise<string> {
    try {
      console.log('🔮 Generating code fix with NeuroLink AI...');

      const fixCode = await this.withRetry(
        () => this.client.generateFix(analysis, context),
        'fix generation'
      );

      console.log('✅ Fix generation completed successfully with NeuroLink');
      return fixCode;
    } catch (err: any) {
      console.error(`❌ Fix generation failed: ${err.message}`);
      throw new Error(`NeuroLink fix generation failed: ${err.message}`);
    }
  }

  /**
   * Get NeuroLink provider status
   */
  async getProviderStatus(): Promise<{ neurolink: { available: boolean; configured: boolean } }> {
    try {
      const available = await this.client.isAvailable();
      return {
        neurolink: {
          available,
          configured: true,
        },
      };
    } catch (error) {
      return {
        neurolink: {
          available: false,
          configured: true,
        },
      };
    }
  }

  /**
   * Check if NeuroLink is available
   */
  async hasAvailableProviders(): Promise<boolean> {
    return this.client.isAvailable();
  }

  /**
   * Retry mechanism with exponential backoff
   */
  private async withRetry<T>(operation: () => Promise<T>, operationType: string): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= (this.config.maxRetries || 3); attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        // Don't retry on the last attempt
        if (attempt === this.config.maxRetries) {
          break;
        }
        // Exponential backoff with jitter
        const delay = (this.config.retryDelay || 1000) * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 0.1 * delay;
        const totalDelay = delay + jitter;

        console.log(
          `🔄 Retrying ${operationType} in ${Math.round(totalDelay)}ms (attempt ${attempt}/${this.config.maxRetries})`
        );
        await new Promise(resolve => setTimeout(resolve, totalDelay));
      }
    }

    throw lastError!;
  }
}

/**
 * Create a NeuroLink-powered AI coordinator instance
 */
export function createAICoordinator(config: CoordinatorConfig): AICoordinator {
  return new AICoordinator(config);
}

/**
 * Create AI coordinator with environment-based NeuroLink configuration
 */
export function createDefaultCoordinator(): AICoordinator {
  const apiKey = process.env.NEUROLINK_API_KEY;

  if (!apiKey) {
    throw new Error('NEUROLINK_API_KEY environment variable is required');
  }

  return new AICoordinator({
    neurolink: {
      apiKey,
    },
  });
}
