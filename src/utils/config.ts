import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import { LumosConfigSchema, type LumosConfig, type ConfigValidationResult } from '../types/config.js';

/**
 * Configuration utility for loading and validating Lumos configuration
 * with environment variable support for AI providers
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: LumosConfig | null = null;
  private configPath: string = 'lumos.config.yaml';

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load configuration from file with environment variable overrides
   */
  async loadConfig(configPath?: string): Promise<ConfigValidationResult> {
    if (configPath) {
      this.configPath = configPath;
    }

    try {
      // Load base configuration from YAML file
      const baseConfig = await this.loadConfigFile();
      
      // Apply environment variable overrides
      const configWithEnv = this.applyEnvironmentOverrides(baseConfig);
      
      // Validate configuration
      const validationResult = LumosConfigSchema.safeParse(configWithEnv);
      
      if (validationResult.success) {
        this.config = validationResult.data;
        return {
          valid: true,
          config: validationResult.data
        };
      } else {
        return {
          valid: false,
          errors: [validationResult.error]
        };
      }
    } catch (error) {
      return {
        valid: false,
        errors: [error as any]
      };
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): LumosConfig {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }
    return this.config;
  }

  /**
   * Get AI provider configuration with API key resolution
   */
  getAIProviderConfig(provider: 'openai' | 'anthropic' | 'google') {
    const config = this.getConfig();
    const providerConfig = config.ai.providers[provider];
    
    // Resolve API key from environment if not provided in config
    const apiKey = this.resolveAPIKey(provider, providerConfig.apiKey);
    
    return {
      ...providerConfig,
      apiKey
    };
  }

  /**
   * Check if a provider is available (enabled and has API key)
   */
  isProviderAvailable(provider: 'openai' | 'anthropic' | 'google'): boolean {
    try {
      const providerConfig = this.getAIProviderConfig(provider);
      return providerConfig.enabled && !!providerConfig.apiKey;
    } catch {
      return false;
    }
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): ('openai' | 'anthropic' | 'google')[] {
    const providers: ('openai' | 'anthropic' | 'google')[] = ['openai', 'anthropic', 'google'];
    return providers.filter(provider => this.isProviderAvailable(provider));
  }

  /**
   * Get primary provider or first available fallback
   */
  getPrimaryProvider(): 'openai' | 'anthropic' | 'google' | null {
    const config = this.getConfig();
    
    // Check if primary provider is available
    if (this.isProviderAvailable(config.ai.primaryProvider)) {
      return config.ai.primaryProvider;
    }
    
    // Fall back to first available provider
    const availableProviders = this.getAvailableProviders();
    return availableProviders.length > 0 ? availableProviders[0]! : null;
  }

  /**
   * Get fallback providers for coordination
   */
  getFallbackProviders(): ('openai' | 'anthropic' | 'google')[] {
    const config = this.getConfig();
    return config.ai.fallback.providers.filter(provider => 
      this.isProviderAvailable(provider)
    );
  }

  private async loadConfigFile(): Promise<any> {
    const fullPath = join(process.cwd(), this.configPath);
    
    if (!existsSync(fullPath)) {
      // Return default configuration if file doesn't exist
      return {};
    }

    const fileContent = readFileSync(fullPath, 'utf8');
    return yaml.load(fileContent) || {};
  }

  private applyEnvironmentOverrides(baseConfig: any): any {
    const config = { ...baseConfig };
    
    // Initialize nested objects if they don't exist
    if (!config.ai) config.ai = {};
    if (!config.ai.providers) config.ai.providers = {};
    if (!config.ai.providers.openai) config.ai.providers.openai = {};
    if (!config.ai.providers.anthropic) config.ai.providers.anthropic = {};
    if (!config.ai.providers.google) config.ai.providers.google = {};

    // OpenAI environment overrides
    if (process.env.OPENAI_API_KEY) {
      config.ai.providers.openai.apiKey = process.env.OPENAI_API_KEY;
    }
    if (process.env.OPENAI_ORG_ID) {
      config.ai.providers.openai.organizationId = process.env.OPENAI_ORG_ID;
    }

    // Anthropic environment overrides
    if (process.env.ANTHROPIC_API_KEY) {
      config.ai.providers.anthropic.apiKey = process.env.ANTHROPIC_API_KEY;
    }

    // Google environment overrides
    if (process.env.GOOGLE_API_KEY) {
      config.ai.providers.google.apiKey = process.env.GOOGLE_API_KEY;
    }

    // Global debug and logging overrides
    if (process.env.LUMOS_DEBUG) {
      config.ai.enableLogging = process.env.LUMOS_DEBUG.toLowerCase() === 'true';
    }
    if (process.env.LUMOS_LOG_LEVEL) {
      config.ai.logLevel = process.env.LUMOS_LOG_LEVEL;
    }

    return config;
  }

  private resolveAPIKey(provider: 'openai' | 'anthropic' | 'google', configApiKey?: string): string | undefined {
    // Use config API key if provided
    if (configApiKey) {
      return configApiKey;
    }

    // Fall back to environment variables
    switch (provider) {
      case 'openai':
        return process.env.OPENAI_API_KEY;
      case 'anthropic':
        return process.env.ANTHROPIC_API_KEY;
      case 'google':
        return process.env.GOOGLE_API_KEY;
      default:
        return undefined;
    }
  }
}

// Export singleton instance
export const configManager = ConfigManager.getInstance();

// Helper function for quick config access
export async function loadLumosConfig(configPath?: string): Promise<ConfigValidationResult> {
  return configManager.loadConfig(configPath);
}

// Helper function to get current config
export function getLumosConfig(): LumosConfig {
  return configManager.getConfig();
}
