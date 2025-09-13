# Contributing to Lumos

*"Illuminating the path to better testing through collaborative development"*

Welcome to Lumos! We're excited that you want to contribute to our AI-powered testing intelligence platform. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Contribution Workflow](#contribution-workflow)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Release Process](#release-process)
- [Getting Help](#getting-help)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** (preferred) or npm
- **Git**
- **VSCode** (recommended) with TypeScript extension

### Quick Setup

1. **Fork the repository**
   ```bash
   # Click the Fork button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/lumos.git
   cd lumos
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (optional for development)
   ```

4. **Verify setup**
   ```bash
   pnpm run build
   pnpm run test
   pnpm run typecheck
   ```

## Development Environment

### Environment Configuration

Create a `.env` file from the example:

```bash
# AI Provider API Keys (optional for core development)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_API_KEY=your_google_key_here

# Development Settings
LUMOS_LOG_LEVEL=debug
NODE_ENV=development
```

### Available Scripts

```bash
# Development
pnpm run dev              # Start CLI in watch mode
pnpm run dev:debug        # Start with debugger
pnpm run build            # Build the project
pnpm run build:watch      # Build in watch mode

# Testing
pnpm run test             # Run unit tests
pnpm run test:watch       # Run tests in watch mode
pnpm run test:coverage    # Run tests with coverage
pnpm run test:playwright  # Run E2E tests
pnpm run test:ui          # Run tests with UI

# Code Quality
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Fix ESLint issues
pnpm run typecheck        # Run TypeScript check
pnpm run quality:check    # Run all quality checks

# Utilities
pnpm run cache:clear      # Clear Lumos cache
pnpm run validate:config  # Validate configuration
pnpm run docs:generate    # Generate API docs
```

## Project Structure

```
lumos/
├── src/                    # Source code
│   ├── ai/                # AI provider integrations
│   │   ├── coordinator.ts # Multi-provider coordination
│   │   └── providers/     # Individual AI providers
│   ├── cli/               # CLI interface
│   │   ├── commands/      # CLI commands (analyze, validate, etc.)
│   │   └── analysis/      # Analysis engines
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── tests/                 # Test suites
│   ├── demo/              # Demo tests
│   ├── ui-interaction/    # UI testing scenarios
│   ├── api-network/       # API/Network tests
│   └── shared/            # Shared test utilities
├── docs/                  # Documentation
├── memory-bank/           # Development knowledge base
└── .github/               # GitHub workflows and templates
```

### Key Files

- `src/cli/index.ts` - Main CLI entry point
- `src/ai/coordinator.ts` - AI provider coordination
- `src/cli/analysis/pattern-engine.ts` - Error pattern analysis
- `lumos.config.yaml` - Default configuration
- `playwright.config.ts` - E2E test configuration

## Coding Standards

### TypeScript Guidelines

- **Strict Mode**: All code must compile with TypeScript strict mode
- **Type Safety**: Prefer explicit types over `any`
- **Interfaces**: Use interfaces for object shapes
- **Enums**: Use string enums for constants

```typescript
// ✅ Good
interface AnalysisResult {
  category: string;
  confidence: number;
  suggestions: string[];
}

// ❌ Bad
function analyze(error: any): any {
  // implementation
}
```

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
# Run before committing
pnpm run lint:fix
```

**Key Rules:**
- Use 2 spaces for indentation
- Prefer `const` over `let` when possible
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Maximum line length: 100 characters

### File Naming Conventions

- **Files**: Use kebab-case (e.g., `pattern-engine.ts`)
- **Directories**: Use kebab-case (e.g., `cli-commands/`)
- **Classes**: Use PascalCase (e.g., `PatternEngine`)
- **Functions**: Use camelCase (e.g., `analyzeError`)
- **Constants**: Use SCREAMING_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Import Organization

```typescript
// 1. Node.js built-ins
import { readFileSync } from 'fs';
import { join } from 'path';

// 2. External libraries
import chalk from 'chalk';
import ora from 'ora';

// 3. Internal modules (absolute paths)
import { AnalysisEngine } from '../../analysis/engine.js';
import { ConfigManager } from '../../utils/config.js';

// 4. Type-only imports (separate)
import type { AnalysisResult } from '../../types/analysis.js';
```

## Testing Guidelines

### Testing Strategy

We maintain **90%+ test coverage** across the codebase:

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test CLI commands and workflows
- **Visual Tests**: Test UI components and outputs

### Writing Tests

#### Unit Tests (Vitest)

```typescript
// tests/unit/pattern-engine.test.ts
import { describe, it, expect } from 'vitest';
import { PatternEngine } from '../../src/analysis/pattern-engine.js';

describe('PatternEngine', () => {
  it('should identify timeout errors correctly', () => {
    const engine = new PatternEngine();
    const result = engine.analyzeError('Timeout waiting for element');
    
    expect(result.category).toBe('element-timeout');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

#### E2E Tests (Playwright)

```typescript
// tests/e2e/cli.spec.ts
import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test('lumos analyze command works', async () => {
  const output = execSync('npx lumos analyze "ReferenceError: x is not defined"', {
    encoding: 'utf8'
  });
  
  expect(output).toContain('Analysis completed');
  expect(output).toContain('undefined-variable');
});
```

### Test Organization

- Place unit tests in `tests/unit/`
- Place integration tests in `tests/integration/`
- Place E2E tests alongside the feature being tested
- Use descriptive test names that explain the scenario

### Running Tests

```bash
# Run all tests
pnpm run test

# Run specific test suite
pnpm run test pattern-engine

# Run with coverage
pnpm run test:coverage

# Run E2E tests
pnpm run test:playwright
```

## Contribution Workflow

### Branch Strategy

We use **GitHub Flow** with semantic branch naming:

```bash
# Feature branches
feature/add-selenium-support
feature/improve-confidence-scoring

# Bug fix branches  
fix/handle-null-stack-traces
fix/cli-output-formatting

# Documentation branches
docs/update-contributing-guide
docs/add-api-examples
```

### Commit Message Convention

We use [Conventional Commits](https://conventionalcommits.org/) for automated releases:

```bash
# Format: type(scope): description

feat(analysis): add selenium error pattern detection
fix(cli): handle undefined error messages gracefully
docs(readme): update installation instructions
test(e2e): add tests for jenkins integration
chore(deps): update playwright to v1.40.1

# Breaking changes
feat(api)!: redesign analysis result interface
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Test additions/modifications
- `chore`: Maintenance tasks
- `refactor`: Code refactoring
- `perf`: Performance improvements

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our standards
   - Add/update tests
   - Update documentation if needed

3. **Test your changes**
   ```bash
   pnpm run quality:check  # Runs lint, typecheck, and tests
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Pre-commit Hooks

We use Husky for automated quality checks:

- **lint-staged**: Runs ESLint on staged files
- **typecheck**: Validates TypeScript compilation
- **test**: Runs relevant tests

These run automatically before each commit.

## Pull Request Process

### Before Submitting

- [ ] Code compiles with `pnpm run build`
- [ ] All tests pass with `pnpm run test`
- [ ] Code follows style guidelines (`pnpm run lint`)
- [ ] TypeScript checks pass (`pnpm run typecheck`)
- [ ] Documentation is updated (if applicable)
- [ ] Changelog entry added (for significant changes)

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
```

### Review Process

1. **Automated Checks**: GitHub Actions will run tests and quality checks
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

## Issue Reporting

### Bug Reports

Use the bug report template and include:

- **Environment**: OS, Node.js version, Lumos version
- **Error Message**: Full error output
- **Steps to Reproduce**: Detailed reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Additional Context**: Screenshots, logs, etc.

### Example Bug Report

```markdown
**Environment:**
- OS: macOS 14.0
- Node.js: 18.17.0
- Lumos: 1.0.0

**Error Message:**
```
TypeError: Cannot read property 'confidence' of undefined
```

**Steps to Reproduce:**
1. Run `lumos analyze "ReferenceError: x is undefined"`
2. Error occurs during confidence calculation

**Expected Behavior:**
Should display analysis with confidence score

**Actual Behavior:**
Command fails with TypeError
```

## Feature Requests

### Before Requesting

- Check existing issues and discussions
- Consider if the feature aligns with Lumos goals
- Think about implementation complexity

### Feature Request Template

```markdown
**Feature Description:**
Clear description of the proposed feature

**Problem It Solves:**
What problem does this address?

**Proposed Solution:**
How should this feature work?

**Alternatives Considered:**
Other approaches you've considered

**Additional Context:**
Any other relevant information
```

## Release Process

### Semantic Versioning

We follow [SemVer](https://semver.org/):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features (backward compatible)
- **Patch** (0.0.1): Bug fixes (backward compatible)

### Automated Releases

Releases are automated using `semantic-release`:

1. PRs are merged to `main`
2. GitHub Actions analyzes commit messages
3. Version is bumped automatically
4. Release notes are generated
5. NPM package is published

### Manual Release (Maintainers Only)

```bash
# Dry run to preview release
pnpm run release:dry

# Create release
pnpm run release
```

## Getting Help

### Documentation

- **README.md**: Project overview and quick start
- **docs/**: Detailed documentation
- **API Documentation**: Generated from code comments

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time community chat (link in README)

### Common Questions

**Q: How do I test AI provider integrations without API keys?**
A: Lumos includes demo mode with simulated responses. Set `NODE_ENV=demo` in your `.env`.

**Q: Can I contribute without deep AI knowledge?**
A: Absolutely! We need help with documentation, testing, CLI improvements, and more.

**Q: How do I debug TypeScript compilation errors?**
A: Run `pnpm run typecheck` for detailed error messages. Check our coding standards for common patterns.

**Q: Where should I add new error patterns?**
A: Add them to `src/cli/analysis/pattern-engine.ts` with appropriate tests.

## Development Tips

### Debugging

```bash
# Debug CLI commands
pnpm run dev:debug

# Enable verbose logging
export LUMOS_LOG_LEVEL=debug

# Test specific patterns
pnpm run test pattern-engine --watch
```

### Performance Profiling

```bash
# Run performance benchmarks
pnpm run benchmark

# Profile memory usage
node --inspect dist/cli/index.js analyze "error message"
```

### IDE Setup (VSCode)

Recommended extensions:
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- GitLens
- Error Lens

## Recognition

We value all contributions! Contributors will be:

- Listed in our README contributors section
- Mentioned in release notes for significant contributions
- Invited to join our contributor Discord channel
- Eligible for special contributor badges

## License

By contributing to Lumos, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

**Thank you for contributing to Lumos! Together, we're illuminating the path to better testing.** ✨

For questions about this guide, please open an issue or start a discussion on GitHub.
