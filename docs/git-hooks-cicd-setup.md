# 🚀 Git Hooks & CI/CD Setup Documentation

## 📋 Overview

This document outlines the complete Git hooks and CI/CD implementation for the Lumos project, providing automated code quality checks, testing, and deployment processes.

## 🔧 Git Hooks Implementation

### Pre-commit Hook (`.husky/pre-commit`)
**Triggers**: Before each commit
**Actions**:
- ✅ Runs `lint-staged` for staged files
- ✅ Performs TypeScript compilation check
- ✅ Ensures code quality before commit

### Pre-push Hook (`.husky/pre-push`)
**Triggers**: Before pushing to remote
**Actions**:
- ✅ Runs unit tests (`npm run test`)
- ✅ Final TypeScript check
- ✅ ESLint validation
- ✅ Prevents broken code from reaching remote

### Commit Message Hook (`.husky/commit-msg`)
**Triggers**: When creating commit message
**Actions**:
- ✅ Validates conventional commit format
- ✅ Enforces consistent commit patterns
- ✅ Supports semantic versioning

## 📝 Conventional Commit Format

```
<type>[optional scope]: <description>

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

### Examples:
```bash
feat: add new error analysis pattern
fix(cli): resolve TypeScript compilation errors
docs: update API documentation
test: add integration tests for pattern engine
```

## 🤖 Lint-Staged Configuration

The `lint-staged.config.js` file defines actions for staged files:

- **TypeScript/JavaScript**: ESLint fix + Prettier formatting + Type checking
- **JSON**: Prettier formatting
- **Markdown**: Prettier formatting
- **YAML**: Prettier formatting
- **Test files**: Run relevant tests

## 🚀 CI/CD Pipeline (`.github/workflows/ci.yml`)

### Pipeline Stages:

#### 1. 🔍 Code Quality
- ESLint linting
- TypeScript compilation check
- Prettier formatting check

#### 2. 🧪 Testing
- Unit tests on Node.js 18 & 20
- Code coverage reporting
- Upload to Codecov

#### 3. 🎭 E2E Testing
- Playwright browser tests
- Screenshot uploads on failure
- Cross-browser compatibility

#### 4. 🔒 Security Scanning
- npm audit for vulnerabilities
- CodeQL static analysis
- Dependency scanning

#### 5. 🏗️ Build & Package
- TypeScript compilation
- Package creation
- Artifact uploads

#### 6. ⚡ Performance Benchmarks
- Automated performance testing
- PR comment with results
- Regression detection

## 🚀 Release Pipeline (`.github/workflows/release.yml`)

### Automated Release Process:

#### 1. Release Creation
- **Trigger**: Push to `main` branch
- **Tool**: Release Please (Google)
- **Features**: 
  - Automatic version bumping
  - Changelog generation
  - Semantic versioning

#### 2. Package Publishing
- **NPM**: Automatic package publication
- **GitHub**: Release creation with assets
- **Docker**: Image builds (if configured)

#### 3. Notifications
- **Slack**: Team notifications
- **Discord**: Community updates
- **Metrics**: Release tracking

## 🤖 Dependabot Configuration (`.github/dependabot.yml`)

### Automated Dependency Management:

- **Schedule**: Weekly updates (Mondays, 9 AM UTC)
- **Scope**: Production & development dependencies
- **Features**:
  - Auto-approve minor/patch updates
  - Grouped dependency PRs
  - GitHub Actions updates

## 🛠️ Setup Instructions

### 1. Initial Setup
```bash
# Install Husky hooks
npm run prepare

# Make hooks executable
chmod +x .husky/*

# Test hooks
git add . && git commit -m "test: validate git hooks"
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure API keys (optional for basic development)
# OPENAI_API_KEY=your_key_here
# ANTHROPIC_API_KEY=your_key_here
# GOOGLE_API_KEY=your_key_here
```

### 3. Repository Secrets (GitHub)
Configure these secrets in your GitHub repository:

```bash
# Required for releases
NPM_TOKEN=your_npm_token
CODECOV_TOKEN=your_codecov_token

# Optional for notifications
SLACK_WEBHOOK_URL=your_slack_webhook
DISCORD_WEBHOOK=your_discord_webhook
```

## 🧪 Testing the Setup

### Test Git Hooks
```bash
# Test pre-commit hook
echo "console.log('test')" > test.js
git add test.js
git commit -m "test: pre-commit hook"

# Test commit message validation
git commit -m "invalid message format"  # Should fail

# Test pre-push hook
git push origin feature-branch
```

### Test CI Pipeline
```bash
# Create a pull request to trigger CI
git checkout -b feature/test-ci
git push origin feature/test-ci

# Open PR on GitHub to see CI in action
```

## 📊 Monitoring & Metrics

### Code Quality Metrics
- **ESLint**: Code style compliance
- **Prettier**: Formatting consistency
- **TypeScript**: Type safety

### Testing Metrics
- **Unit Tests**: Code coverage percentage
- **E2E Tests**: Browser compatibility
- **Performance**: Benchmark results

### Security Metrics
- **Dependencies**: Vulnerability count
- **Code Analysis**: Security issues
- **Audit**: npm security reports

## 🔧 Customization

### Adding New Lint Rules
Edit `.eslintrc.json`:
```json
{
  "rules": {
    "your-custom-rule": "error"
  }
}
```

### Modifying Prettier Configuration
Edit `.prettierrc.json`:
```json
{
  "singleQuote": true,
  "printWidth": 100
}
```

### Adding New Git Hooks
Create new files in `.husky/` directory:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Your custom hook logic
```

## 🚨 Troubleshooting

### Common Issues:

#### Hook Permission Errors
```bash
chmod +x .husky/pre-commit .husky/pre-push .husky/commit-msg
```

#### TypeScript Compilation Errors
```bash
npm run typecheck
# Fix reported errors before committing
```

#### Test Failures
```bash
npm run test
npm run test:playwright
# Address failing tests
```

#### Lint Errors
```bash
npm run lint:fix
# Review and commit fixes
```

## 📈 Benefits

### Developer Experience
- **Fast Feedback**: Immediate error detection
- **Consistent Quality**: Automated formatting and linting
- **Reduced Bugs**: Pre-commit validation

### Team Collaboration
- **Standard Commits**: Consistent commit messages
- **Automated Reviews**: CI checks before merge
- **Release Notes**: Automatic changelog generation

### Production Stability
- **Quality Gates**: Multiple validation layers
- **Security**: Automated vulnerability scanning
- **Performance**: Benchmark regression detection

## 🎯 Next Steps

1. **Team Training**: Ensure all developers understand the workflow
2. **Custom Rules**: Add project-specific linting rules
3. **Monitoring**: Set up alerts for pipeline failures
4. **Documentation**: Keep this guide updated with changes

---

**Note**: This setup follows industry best practices for enterprise-grade development workflows. All configurations are optimized for the Lumos project's specific requirements while remaining flexible for future enhancements.
