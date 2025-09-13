import chalk from 'chalk';
import ora from 'ora';
import { writeFile, access } from 'node:fs/promises';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';
import YAML from 'yaml';

interface InitCommandOptions {
  interactive?: boolean;
  preset: string;
  overwrite?: boolean;
}

const BASIC_CONFIG = {
  ai: {
    provider: 'neurolink',
    fallback: true,
    timeout: 30000,
    temperature: 0.3
  },
  playwright: {
    headless: true,
    timeout: 30000,
    viewport: {
      width: 1280,
      height: 720
    }
  },
  testing: {
    coverageThreshold: 80,
    flakyDetection: true,
    performanceMonitoring: true
  },
  research: {
    sources: ['stackoverflow', 'github'],
    maxResults: 10,
    confidenceThreshold: 0.7
  },
  cache: {
    enabled: true,
    ttl: '1h',
    maxSize: '100mb'
  }
};

const ENTERPRISE_CONFIG = {
  ...BASIC_CONFIG,
  ai: {
    ...BASIC_CONFIG.ai,
    timeout: 60000,
    temperature: 0.2
  },
  testing: {
    ...BASIC_CONFIG.testing,
    coverageThreshold: 90,
    performanceMonitoring: true
  },
  research: {
    sources: ['stackoverflow', 'github', 'documentation'],
    maxResults: 20,
    confidenceThreshold: 0.8
  },
  cache: {
    enabled: true,
    ttl: '24h',
    maxSize: '1gb'
  },
  environments: {
    development: {
      ai: {
        temperature: 0.5
      },
      playwright: {
        headless: false
      }
    },
    production: {
      cache: {
        ttl: '24h',
        maxSize: '2gb'
      }
    }
  }
};

export async function initCommand(options: InitCommandOptions): Promise<void> {
  const spinner = ora('🔮 Initializing Lumos configuration...').start();
  
  try {
    const configPath = 'lumos.config.yaml';
    
    // Check if config already exists
    try {
      await access(configPath);
      if (!options.overwrite) {
        spinner.warn('Configuration file already exists. Use --overwrite to replace it.');
        console.log(chalk.yellow('\n💡 Existing configuration found at:'), chalk.cyan(configPath));
        console.log(chalk.gray('   • Use --overwrite to replace it'));
        console.log(chalk.gray('   • Use lumos utils config show to view current config'));
        console.log(chalk.gray('   • Use lumos utils config validate to check config'));
        return;
      }
    } catch {
      // File doesn't exist, continue with initialization
    }
    
    spinner.text = '⚙️ Generating configuration...';
    
    let config: typeof BASIC_CONFIG | typeof ENTERPRISE_CONFIG;
    
    if (options.interactive) {
      spinner.stop();
      config = await interactiveConfigSetup();
      spinner.start('💾 Saving configuration...');
    } else {
      switch (options.preset) {
        case 'enterprise':
          config = ENTERPRISE_CONFIG;
          break;
        case 'custom':
          spinner.stop();
          config = await customConfigSetup();
          spinner.start('💾 Saving configuration...');
          break;
        default:
          config = BASIC_CONFIG;
      }
    }
    
    // Generate YAML content
    const yamlContent = generateConfigYaml(config);
    
    // Ensure directory exists
    const configDir = dirname(configPath);
    if (configDir !== '.') {
      await mkdir(configDir, { recursive: true });
    }
    
    // Write configuration file
    await writeFile(configPath, yamlContent, 'utf8');
    
    // Create example environment file
    await createExampleEnvFile();
    
    spinner.succeed('✨ Configuration initialized successfully!');
    
    // Display results
    displayInitResults(configPath, options.preset, config);
    
  } catch (error) {
    spinner.fail(`💥 Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    if (process.env.LUMOS_LOG_LEVEL === 'debug') {
      console.error(chalk.gray('Stack trace:'), error);
    }
    
    console.log(chalk.yellow('\n💡 Troubleshooting tips:'));
    console.log(chalk.gray('  • Check file permissions in current directory'));
    console.log(chalk.gray('  • Ensure you have write access'));
    console.log(chalk.gray('  • Try running with --verbose for more details'));
  }
}

async function interactiveConfigSetup(): Promise<typeof BASIC_CONFIG> {
  console.log(chalk.blue('\n🔮 Interactive Lumos Setup\n'));
  
  console.log(chalk.yellow('Note: Interactive mode is not yet implemented.'));
  console.log(chalk.gray('Using basic configuration for now.\n'));
  
  // TODO: Implement interactive prompts using inquirer or similar
  return BASIC_CONFIG;
}

async function customConfigSetup(): Promise<typeof BASIC_CONFIG> {
  console.log(chalk.blue('\n⚙️ Custom Configuration Setup\n'));
  
  console.log(chalk.yellow('Note: Custom setup is not yet implemented.'));
  console.log(chalk.gray('Using basic configuration for now.\n'));
  
  // TODO: Implement custom configuration wizard
  return BASIC_CONFIG;
}

function generateConfigYaml(config: any): string {
  const header = `# Lumos Configuration File
# Generated on ${new Date().toISOString()}
# Documentation: https://github.com/your-org/lumos#configuration

`;
  
  return header + YAML.stringify(config, {
    indent: 2,
    lineWidth: 120,
    minContentWidth: 0
  });
}

async function createExampleEnvFile(): Promise<void> {
  const envContent = `# Lumos Environment Variables
# Copy this file to .env and fill in your values

# AI Provider Configuration
NEUROLINK_API_KEY=your_neurolink_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Research APIs (optional)
STACKOVERFLOW_API_KEY=your_stackoverflow_api_key_here
GITHUB_TOKEN=your_github_token_here

# Debug settings
LUMOS_DEBUG=false
LUMOS_LOG_LEVEL=info

# Cache settings
LUMOS_CACHE_DIR=.lumos/cache
`;
  
  try {
    await access('.env.example');
  } catch {
    await writeFile('.env.example', envContent, 'utf8');
  }
}

function displayInitResults(
  configPath: string, 
  preset: string, 
  config: any
): void {
  console.log(chalk.blue('\n📋 Configuration Summary\n'));
  
  // Configuration Info
  console.log(chalk.bold('📁 Files Created:'));
  console.log(chalk.green(`   ✅ ${configPath} - Main configuration`));
  console.log(chalk.green('   ✅ .env.example - Environment variables template'));
  console.log();
  
  // Preset Information
  console.log(chalk.bold('⚙️ Configuration Details:'));
  console.log(chalk.gray(`   Preset: ${preset}`));
  console.log(chalk.gray(`   AI Provider: ${config.ai.provider}`));
  console.log(chalk.gray(`   Coverage Threshold: ${config.testing.coverageThreshold}%`));
  console.log(chalk.gray(`   Research Sources: ${config.research.sources.join(', ')}`));
  console.log();
  
  // Key Features
  console.log(chalk.bold('🚀 Enabled Features:'));
  console.log(chalk.green('   ✅ Error Intelligence & AI Analysis'));
  console.log(chalk.green('   ✅ Playwright Visual Analysis'));
  console.log(chalk.green('   ✅ Test Quality Validation'));
  console.log(chalk.green('   ✅ Web Research Integration'));
  console.log(chalk.green('   ✅ Pattern Learning & Caching'));
  console.log();
  
  // Next Steps
  console.log(chalk.bold.blue('🚀 Next Steps:'));
  console.log(chalk.blue('   1. Copy .env.example to .env and add your API keys'));
  console.log(chalk.blue('   2. Run: lumos utils config validate'));
  console.log(chalk.blue('   3. Try: lumos analyze "your error message"'));
  console.log(chalk.blue('   4. Run: lumos --help to see all available commands'));
  console.log();
  
  // Configuration Tips
  console.log(chalk.bold('💡 Configuration Tips:'));
  console.log(chalk.gray('   • Edit lumos.config.yaml to customize settings'));
  console.log(chalk.gray('   • Use environment-specific overrides for dev/prod'));
  console.log(chalk.gray('   • Check the documentation for advanced features'));
  console.log(chalk.gray('   • Run lumos utils status to verify everything is working'));
}
