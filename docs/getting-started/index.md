# Getting Started with Lumos 🚀

Welcome to Lumos! This guide will help you get up and running with AI-powered
testing intelligence in minutes.

## Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Testing framework** (Playwright, Jest, Cypress, etc.)

## Installation

### Global Installation (Recommended)

```bash
npm install -g lumos
```

### Project Installation

```bash
npm install --save-dev lumos
```

## Quick Setup

### 1. Initialize Lumos

```bash
# Navigate to your project
cd your-test-project

# Initialize Lumos configuration
lumos init
```

This creates a `lumos.config.yaml` file with default settings.

### 2. Configure AI Provider

Set up your NeuroLink API key:

```bash
# Option 1: Environment variable (recommended)
export NEUROLINK_API_KEY="your-neurolink-api-key"

# Option 2: Add to .env file
echo "NEUROLINK_API_KEY=your-neurolink-api-key" >> .env
```

### 3. First Analysis

Analyze your first error:

```bash
lumos analyze "TypeError: Cannot read property 'click' of null"
```

## Basic Usage

### Error Analysis

```bash
# Analyze a simple error
lumos analyze "ReferenceError: variable is not defined"

# Analyze with file context
lumos analyze "TypeError: null property" --file tests/login.spec.ts

# Get fix suggestions
lumos analyze "Network timeout" --fix-suggestions

# Include research from community
lumos analyze "DOM element not found" --research
```

### Test Validation

```bash
# Validate test quality
lumos validate tests/

# Validate specific test file
lumos validate tests/login.spec.ts

# Get detailed recommendations
lumos validate --detailed
```

### Visual Debugging

```bash
# Debug a webpage visually
lumos debug --url http://localhost:3000

# Debug with specific viewport
lumos debug --url http://localhost:3000 --viewport 1920x1080

# Save screenshots for analysis
lumos debug --url http://localhost:3000 --save-screenshots
```

## Configuration

### Basic Configuration (`lumos.config.yaml`)

```yaml
# AI Configuration
ai:
  provider: 'neurolink'
  model: 'gpt-4'
  maxTokens: 4000
  temperature: 0.3

  # Fallback settings
  fallback:
    retryAttempts: 3
    retryDelay: 1000

# Analysis Settings
analysis:
  confidenceThreshold: 0.7
  maxSuggestions: 5
  includeResearch: true
  includeFixes: true

# Debug Settings
debug:
  screenshotDir: './screenshots'
  saveOnError: true
  viewport:
    width: 1920
    height: 1080

# Output Settings
output:
  format: 'json'
  saveReports: true
  reportsDir: './lumos-reports'
```

### Environment Variables

```bash
# Required
NEUROLINK_API_KEY=your-neurolink-api-key

# Optional
LUMOS_CONFIG_PATH=./custom-lumos.config.yaml
LUMOS_LOG_LEVEL=info
LUMOS_CACHE_ENABLED=true
```

## Example Workflows

### CI/CD Integration

```yaml
# .github/workflows/test-analysis.yml
name: Test Analysis
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Lumos
        run: npm install -g lumos

      - name: Run tests with analysis
        env:
          NEUROLINK_API_KEY: ${{ secrets.NEUROLINK_API_KEY }}
        run: |
          npm test || lumos analyze "Test failures detected" --context tests/
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate test quality before commit
lumos validate tests/ --threshold 80
```

## Common Patterns

### Analyzing Test Failures

```bash
# After test failure, analyze the output
npm test 2>&1 | lumos analyze --file -

# Analyze specific error types
lumos analyze "TimeoutError: Waiting for selector" --context tests/e2e/

# Get comprehensive analysis
lumos analyze "Failed assertion" --research --fix-suggestions --confidence 0.8
```

### Continuous Monitoring

```bash
# Watch for file changes and analyze
lumos watch tests/ --auto-analyze

# Monitor test quality over time
lumos benchmark --track-quality

# Learn from patterns
lumos learn --from-logs test-results.xml
```

## Next Steps

- 📖 **[CLI Reference](../cli/commands.md)** - Complete command documentation
- 🔧 **[Advanced Configuration](../advanced/configuration.md)** - Power user
  settings
- 🧪 **[SDK Integration](../sdk/integration.md)** - Integrate Lumos into your
  code
- 📊 **[API Reference](../reference/api.md)** - Technical specifications

## Troubleshooting

### Common Issues

**"No AI providers available"**

```bash
# Check your API key
echo $NEUROLINK_API_KEY

# Verify configuration
lumos utils config validate
```

**"Analysis failed: Network error"**

```bash
# Check connectivity
lumos utils status

# Try with debug logging
LUMOS_LOG_LEVEL=debug lumos analyze "your error"
```

**"Configuration validation failed"**

```bash
# Check config syntax
lumos utils config validate

# Reset to defaults
lumos init --force
```

### Getting Help

- 📧 **Support**: [support@lumos.dev](mailto:support@lumos.dev)
- 💬 **Discord**: [Lumos Community](https://discord.gg/lumos)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/lumos/issues)
- 📚 **Docs**: [docs.lumos.dev](https://docs.lumos.dev)

---

**Ready to transform your testing workflow?** Start with `lumos analyze` and
experience AI-powered debugging! 🔮
