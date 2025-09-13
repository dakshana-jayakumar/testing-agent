# Installation Guide

Get Lumos up and running in your development environment quickly and easily.

## Prerequisites

Before installing Lumos, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (or **yarn** 1.22.0+)
- **Git** (for cloning repositories)

## Installation Methods

### Global Installation (Recommended)

Install Lumos globally to use it across all your projects:

```bash
npm install -g lumos
```

Verify the installation:

```bash
lumos --version
```

### Project-Level Installation

For project-specific installations:

```bash
# Using npm
npm install --save-dev lumos

# Using yarn
yarn add --dev lumos
```

### Development Installation

For contributing to Lumos development:

```bash
git clone https://github.com/lumos/lumos.git
cd lumos
npm install
npm run build
npm link
```

## Configuration

### Initial Setup

Initialize Lumos in your project:

```bash
lumos init
```

This creates a `lumos.config.yaml` file with default settings:

```yaml
# Lumos Configuration
ai:
  provider: 'openai' # or "anthropic", "google"
  model: 'gpt-4'
  apiKey: '${OPENAI_API_KEY}'

analysis:
  confidence_threshold: 0.7
  max_suggestions: 5
  include_research: true

paths:
  tests: 'tests/'
  source: 'src/'
  output: '.lumos/'
```

### Environment Variables

Set up your AI provider API keys:

```bash
# OpenAI
export OPENAI_API_KEY="your-openai-api-key"

# Anthropic
export ANTHROPIC_API_KEY="your-anthropic-api-key"

# Google AI
export GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

## Verification

Test your installation with a simple error analysis:

```bash
lumos analyze "TypeError: Cannot read property 'click' of null"
```

Expected output:

```json
{
  "summary": "Null reference error in DOM interaction",
  "confidence": 0.95,
  "suggestions": [
    "Add null check before accessing property",
    "Use optional chaining (?.)",
    "Implement proper element selection validation"
  ]
}
```

## IDE Integration

### VS Code Extension

Install the Lumos VS Code extension for enhanced development experience:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Lumos AI Testing"
4. Click Install

### WebStorm Plugin

For JetBrains IDEs:

1. Go to File → Settings → Plugins
2. Search for "Lumos" in the marketplace
3. Install and restart the IDE

## Troubleshooting

### Common Issues

**Permission Errors (macOS/Linux)**

```bash
sudo npm install -g lumos
```

**Node Version Issues**

```bash
# Check Node version
node --version

# Update Node using nvm
nvm install 18
nvm use 18
```

**API Key Issues**

```bash
# Verify environment variables
echo $OPENAI_API_KEY

# Test API connectivity
lumos validate --check-api
```

### Getting Help

- 📖 [Documentation](../index.md)
- 🐛 [Report Issues](https://github.com/lumos/lumos/issues)
- 💬 [Discord Community](https://discord.gg/lumos)
- 📧 [Support Email](mailto:support@lumos.dev)

## Next Steps

- 🚀 [Quick Start Guide](quick-start.md)
- 🔍 [Your First Analysis](first-analysis.md)
- 📚 [CLI Reference](../cli/commands.md)
