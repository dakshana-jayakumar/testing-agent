#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { analyzeCommand } from './commands/analyze.js';
import { validateCommand } from './commands/validate.js';
import { debugCommand } from './commands/debug.js';
import { researchCommand } from './commands/research.js';
import { watchCommand } from './commands/watch.js';
import { initCommand } from './commands/init.js';

const program = new Command();

// Main program configuration
program
  .name('lumos')
  .description('🔮 AI-Powered Testing Intelligence Platform')
  .version('1.0.0')
  .option('-v, --verbose', 'Enable verbose output')
  .option('-q, --quiet', 'Suppress output except errors')
  .option('--config <path>', 'Path to configuration file')
  .hook('preAction', thisCommand => {
    // Global pre-action hook for common setup
    const options = thisCommand.opts();

    if (options.quiet && options.verbose) {
      console.error(chalk.red('Error: Cannot use both --quiet and --verbose flags'));
      process.exit(1);
    }

    // Set global log level based on flags
    process.env.LUMOS_LOG_LEVEL = options.quiet ? 'error' : options.verbose ? 'debug' : 'info';

    if (options.config) {
      process.env.LUMOS_CONFIG_PATH = options.config;
    }
  });

// Error Analysis & Intelligence
program
  .command('analyze')
  .description('🔍 Analyze error messages with AI intelligence')
  .argument('<error>', 'Error message or file path containing error')
  .option('-f, --file <path>', 'Path to file containing error log')
  .option('-c, --context <path>', 'Additional context directory (e.g., src/)')
  .option('--research', 'Include web research in analysis')
  .option('--fix-suggestions', 'Generate fix suggestions')
  .option('--confidence <threshold>', 'Minimum confidence threshold (0-1)', '0.7')
  .option('--max-suggestions <count>', 'Maximum number of suggestions', '5')
  .action(analyzeCommand);

// Test Validation & Quality
program
  .command('validate')
  .description('🧪 Validate test quality and coverage')
  .argument('[testPath]', 'Path to test files or directory')
  .option('--coverage', 'Include coverage analysis')
  .option('--flaky-detection', 'Detect flaky tests')
  .option('--performance', 'Include performance analysis')
  .option('--suite <type>', 'Test suite type (jest, vitest, playwright)', 'auto')
  .option('--threshold <percentage>', 'Coverage threshold', '80')
  .option('--export-report', 'Export detailed report')
  .option('--format <type>', 'Report format (html, json, markdown)', 'html')
  .action(validateCommand);

// Visual Analysis & Debugging
program
  .command('debug')
  .description('🎯 Visual debugging with Playwright')
  .option('-s, --screenshot <path>', 'Path to failure screenshot')
  .option('-u, --url <url>', 'URL to analyze')
  .option('--dom-state', 'Capture DOM state analysis')
  .option('--console-errors', 'Monitor console errors')
  .option('--network-errors', 'Analyze network issues')
  .option('--headless', 'Run in headless mode', true)
  .option('--timeout <ms>', 'Page timeout in milliseconds', '30000')
  .action(debugCommand);

// Web Research & Solutions
program
  .command('research')
  .description('🔍 Research solutions from community sources')
  .argument('<query>', 'Search query or error message')
  .option(
    '--sources <sources>',
    'Comma-separated sources (stackoverflow,github,documentation)',
    'stackoverflow,github'
  )
  .option('--max-results <count>', 'Maximum results per source', '10')
  .option('--confidence-threshold <threshold>', 'Minimum confidence threshold', '0.7')
  .option('--auto-rank', 'Enable AI-powered result ranking')
  .option('--include-related', 'Include related solutions')
  .action(researchCommand);

// Real-time Monitoring
program
  .command('watch')
  .description('👁️ Real-time file monitoring and analysis')
  .argument('[directory]', 'Directory to watch', 'src/')
  .option('--auto-analyze', 'Automatically analyze detected issues')
  .option('--quality-check', 'Monitor test quality changes')
  .option('--performance', 'Track performance metrics')
  .option('--notifications', 'Enable desktop notifications')
  .option('--exclude <patterns>', 'Comma-separated exclusion patterns')
  .action(watchCommand);

// Configuration & Setup
program
  .command('init')
  .description('⚙️ Initialize Lumos configuration')
  .option('-i, --interactive', 'Interactive configuration setup')
  .option('--preset <type>', 'Configuration preset (basic, enterprise, custom)', 'basic')
  .option('--overwrite', 'Overwrite existing configuration')
  .action(initCommand);

// Utility Commands
const utilityCommands = program.command('utils').description('🛠️ Utility commands');

utilityCommands
  .command('status')
  .description('Check system health and performance')
  .option('--health-check', 'Comprehensive health check')
  .option('--performance', 'Show performance metrics')
  .option('--detailed', 'Show detailed status information')
  .action(async options => {
    const { statusCommand } = await import('./commands/status');
    return statusCommand(options);
  });

utilityCommands
  .command('cache')
  .description('Manage cache operations')
  .argument('<action>', 'Cache action (clear, stats, refresh)')
  .option('--patterns', 'Include pattern cache')
  .option('--research', 'Include research cache')
  .option('--all', 'Include all cache types')
  .action(async (action, options) => {
    const { cacheCommand } = await import('./commands/cache');
    return cacheCommand(action, options);
  });

utilityCommands
  .command('config')
  .description('Configuration management')
  .argument('<action>', 'Config action (validate, show, edit)')
  .option('--show-sensitive', 'Show sensitive configuration values')
  .action(async (action, options) => {
    const { configCommand } = await import('./commands/config');
    return configCommand(action, options);
  });

// Advanced Commands
program
  .command('benchmark')
  .description('🚀 Performance benchmarking')
  .option('--operations <types>', 'Operations to benchmark (all, analyze, validate)', 'all')
  .option('--iterations <count>', 'Number of iterations', '10')
  .option('--save-results', 'Save benchmark results')
  .action(async options => {
    const { benchmarkCommand } = await import('./commands/benchmark');
    return benchmarkCommand(options);
  });

program
  .command('learn')
  .description('🧠 Pattern learning from logs')
  .option('--from-logs <path>', 'Learn from log files')
  .option('--update-patterns', 'Update existing patterns')
  .option('--dry-run', 'Preview changes without applying')
  .action(async options => {
    const { learnCommand } = await import('./commands/learn');
    return learnCommand(options);
  });

// Global error handler
program.exitOverride();

process.on('uncaughtException', error => {
  console.error(chalk.red('💥 Uncaught Exception:'), error.message);
  if (process.env.LUMOS_LOG_LEVEL === 'debug') {
    console.error(error.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('💥 Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

// Add helpful information for empty command
program.on('command:*', operands => {
  console.error(chalk.red(`Unknown command: ${operands[0]}`));
  console.log(chalk.yellow('Run "lumos --help" to see available commands'));
  process.exit(1);
});

// Show help by default if no command provided
if (process.argv.length <= 2) {
  program.help();
}

// Parse command line arguments
program.parse();

export default program;
