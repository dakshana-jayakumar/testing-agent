#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Enhanced validation configuration
const config = {
  types: {
    feat: 'A new feature',
    fix: 'A bug fix',
    hotfix: 'Critical fixes that must be deployed immediately to production',
    docs: 'Documentation only changes',
    style: 'Changes that do not affect the meaning of the code',
    refactor: 'A code change that neither fixes a bug nor adds a feature',
    perf: 'A code change that improves performance',
    test: 'Adding missing tests or correcting existing tests',
    chore: 'Changes to the build process or auxiliary tools',
    ci: 'Changes to CI configuration files and scripts',
    build: 'Changes that affect the build system or external dependencies',
    revert: 'Reverts a previous commit'
  },
  scopes: {
    // Project-specific scopes (can be customized)
    cli: 'CLI interface and commands',
    ai: 'AI provider integrations',
    analysis: 'Error analysis and pattern engine',
    config: 'Configuration management',
    test: 'Testing framework and utilities',
    docs: 'Documentation changes',
    deps: 'Dependency updates',
    api: 'API endpoints and interfaces',
    ui: 'User interface components',
    db: 'Database related changes',
    auth: 'Authentication and authorization',
    security: 'Security improvements and fixes'
  },
  maxSubjectLength: 50,
  maxBodyLineLength: 72,
  minSubjectLength: 10
};

class CommitValidator {
  constructor(commitMsgFile) {
    this.commitMsgFile = commitMsgFile;
    this.errors = [];
    this.warnings = [];
  }

  // Read commit message from file
  readCommitMessage() {
    try {
      const content = fs.readFileSync(this.commitMsgFile, 'utf8');
      return content.trim().split('\n');
    } catch (error) {
      this.addError(`Failed to read commit message file: ${error.message}`);
      return [];
    }
  }

  // Add validation error
  addError(message) {
    this.errors.push(message);
  }

  // Add validation warning
  addWarning(message) {
    this.warnings.push(message);
  }

  // Validate conventional commit format
  validateFormat(subject) {
    // Enhanced regex for conventional commits (including hotfix)
    const conventionalCommitRegex = /^(feat|fix|hotfix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+?\))?(!)?:\s(.+)$/;
    const match = subject.match(conventionalCommitRegex);

    if (!match) {
      this.addError('Commit message does not follow conventional commit format');
      return null;
    }

    return {
      type: match[1],
      scope: match[2] ? match[2].slice(1, -1) : null, // Remove parentheses
      breaking: !!match[3], // Boolean for breaking change
      description: match[4]
    };
  }

  // Validate commit type
  validateType(type) {
    if (!config.types[type]) {
      this.addError(`Invalid commit type: "${type}"`);
      this.addError(`Valid types: ${Object.keys(config.types).join(', ')}`);
      return false;
    }
    return true;
  }

  // Validate scope (optional but if present, should be valid)
  validateScope(scope) {
    if (!scope) return true; // Scope is optional

    // Allow any scope but suggest known ones
    if (!config.scopes[scope]) {
      this.addWarning(`Unknown scope: "${scope}". Consider using: ${Object.keys(config.scopes).join(', ')}`);
    }
    return true;
  }

  // Validate subject length
  validateSubjectLength(subject) {
    if (subject.length > config.maxSubjectLength) {
      this.addError(`Subject line too long (${subject.length}/${config.maxSubjectLength} characters)`);
      return false;
    }
    
    if (subject.length < config.minSubjectLength) {
      this.addError(`Subject line too short (${subject.length}/${config.minSubjectLength} characters)`);
      return false;
    }
    
    return true;
  }

  // Validate description content
  validateDescription(description) {
    // Should not end with period
    if (description.endsWith('.')) {
      this.addWarning('Subject line should not end with a period');
    }

    // Should not be empty
    if (!description.trim()) {
      this.addError('Description cannot be empty');
      return false;
    }

    // Should start with lowercase (unless proper noun)
    if (description[0] !== description[0].toLowerCase()) {
      this.addWarning('Description should start with lowercase letter');
    }

    return true;
  }

  // Validate body formatting
  validateBody(lines) {
    if (lines.length <= 1) return true; // No body to validate

    // Check for blank line after subject
    if (lines[1] && lines[1].trim() !== '') {
      this.addError('Subject and body must be separated by a blank line');
    }

    // Validate body line lengths
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      if (line.length > config.maxBodyLineLength) {
        this.addWarning(`Body line ${i + 1} is too long (${line.length}/${config.maxBodyLineLength} characters)`);
      }
    }

    return true;
  }

  // Check for breaking change indicators
  validateBreakingChanges(lines, parsedCommit) {
    const hasBreakingFooter = lines.some(line => 
      line.startsWith('BREAKING CHANGE:') || line.startsWith('BREAKING-CHANGE:')
    );

    if (parsedCommit.breaking && !hasBreakingFooter) {
      this.addWarning('Breaking change indicator (!) found but no BREAKING CHANGE footer');
    }

    if (!parsedCommit.breaking && hasBreakingFooter) {
      this.addWarning('BREAKING CHANGE footer found but no breaking change indicator (!) in subject');
    }

    return true;
  }

  // Special validation for hotfix commits
  validateHotfix(parsedCommit, lines) {
    if (parsedCommit.type === 'hotfix') {
      // Hotfix commits should be descriptive about the urgency
      const urgentKeywords = ['critical', 'urgent', 'emergency', 'security', 'production', 'fix', 'vulnerability'];
      const hasUrgentKeyword = urgentKeywords.some(keyword => 
        parsedCommit.description.toLowerCase().includes(keyword)
      );

      if (!hasUrgentKeyword) {
        this.addWarning('Hotfix commits should clearly indicate urgency (e.g., critical, security, production)');
      }

      // Recommend having a body for hotfix commits
      if (lines.length <= 2) {
        this.addWarning('Hotfix commits should include a body explaining the issue and solution');
      }
    }

    return true;
  }

  // Main validation function
  validate() {
    console.log(`${colors.blue}📝 Validating commit message...${colors.reset}`);

    const lines = this.readCommitMessage();
    if (lines.length === 0) {
      this.addError('Commit message is empty');
      return false;
    }

    const subject = lines[0];
    
    // Parse conventional commit format
    const parsedCommit = this.validateFormat(subject);
    if (!parsedCommit) {
      return false;
    }

    // Validate individual components
    this.validateType(parsedCommit.type);
    this.validateScope(parsedCommit.scope);
    this.validateSubjectLength(subject);
    this.validateDescription(parsedCommit.description);
    this.validateBody(lines);
    this.validateBreakingChanges(lines, parsedCommit);
    this.validateHotfix(parsedCommit, lines);

    return this.errors.length === 0;
  }

  // Display validation results
  displayResults() {
    if (this.errors.length > 0) {
      console.log(`\n${colors.red}${colors.bold}❌ Commit message validation failed!${colors.reset}`);
      console.log(`${colors.red}${colors.bold}Errors:${colors.reset}`);
      this.errors.forEach(error => {
        console.log(`${colors.red}  • ${error}${colors.reset}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n${colors.yellow}${colors.bold}⚠️  Warnings:${colors.reset}`);
      this.warnings.forEach(warning => {
        console.log(`${colors.yellow}  • ${warning}${colors.reset}`);
      });
    }

    if (this.errors.length === 0) {
      console.log(`${colors.green}✅ Commit message format is valid!${colors.reset}`);
      if (this.warnings.length > 0) {
        console.log(`${colors.yellow}Consider addressing the warnings above for better commit hygiene.${colors.reset}`);
      }
    } else {
      this.displayHelp();
    }
  }

  // Display help and examples
  displayHelp() {
    console.log(`\n${colors.cyan}${colors.bold}📖 Conventional Commit Format:${colors.reset}`);
    console.log(`${colors.white}Format: type(scope): description${colors.reset}`);
    console.log(`${colors.white}Breaking: type(scope)!: description${colors.reset}`);
    
    console.log(`\n${colors.cyan}${colors.bold}✨ Examples:${colors.reset}`);
    console.log(`${colors.green}  feat: add new error analysis pattern${colors.reset}`);
    console.log(`${colors.green}  fix(cli): resolve TypeScript compilation errors${colors.reset}`);
    console.log(`${colors.green}  hotfix: resolve critical security vulnerability in auth${colors.reset}`);
    console.log(`${colors.green}  docs: update API documentation${colors.reset}`);
    console.log(`${colors.green}  feat(analysis)!: redesign pattern engine interface${colors.reset}`);
    
    console.log(`\n${colors.cyan}${colors.bold}📝 Valid Types:${colors.reset}`);
    Object.entries(config.types).forEach(([type, description]) => {
      const color = type === 'hotfix' ? colors.red : colors.white;
      console.log(`${color}  ${type.padEnd(10)} - ${description}${colors.reset}`);
    });

    console.log(`\n${colors.cyan}${colors.bold}🏷️  Suggested Scopes:${colors.reset}`);
    Object.entries(config.scopes).forEach(([scope, description]) => {
      console.log(`${colors.white}  ${scope.padEnd(10)} - ${description}${colors.reset}`);
    });

    console.log(`\n${colors.cyan}${colors.bold}🚨 Hotfix Guidelines:${colors.reset}`);
    console.log(`${colors.red}  • Use for critical production issues only${colors.reset}`);
    console.log(`${colors.red}  • Include urgency keywords (critical, security, production)${colors.reset}`);
    console.log(`${colors.red}  • Provide detailed body explaining the issue${colors.reset}`);
    console.log(`${colors.red}  • Examples: hotfix(auth): resolve critical JWT validation bypass${colors.reset}`);

    console.log(`\n${colors.cyan}${colors.bold}💡 Tips:${colors.reset}`);
    console.log(`${colors.white}  • Keep subject line under ${config.maxSubjectLength} characters${colors.reset}`);
    console.log(`${colors.white}  • Use imperative mood (add, fix, update)${colors.reset}`);
    console.log(`${colors.white}  • Don't end subject with a period${colors.reset}`);
    console.log(`${colors.white}  • Separate subject and body with blank line${colors.reset}`);
    console.log(`${colors.white}  • Use body to explain what and why, not how${colors.reset}`);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error(`${colors.red}Usage: node commit-validation.cjs <commit-msg-file>${colors.reset}`);
    process.exit(1);
  }

  const commitMsgFile = args[0];
  
  if (!fs.existsSync(commitMsgFile)) {
    console.error(`${colors.red}Error: Commit message file not found: ${commitMsgFile}${colors.reset}`);
    process.exit(1);
  }

  const validator = new CommitValidator(commitMsgFile);
  const isValid = validator.validate();
  validator.displayResults();

  // Exit with appropriate code
  process.exit(isValid ? 0 : 1);
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (error) => {
  console.error(`${colors.red}Unexpected error: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Run the validator
if (require.main === module) {
  main();
}

module.exports = { CommitValidator, config };
