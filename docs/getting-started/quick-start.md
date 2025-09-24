# Quick Start Guide

Get started with Lumos in under 5 minutes! This guide will walk you through your
first error analysis.

## Step 1: Install Lumos

```bash
npm install -g lumos
```

## Step 2: Initialize Your Project

Navigate to your project directory and initialize Lumos:

```bash
cd your-project
lumos init --preset basic
```

This creates a `lumos.config.yaml` file:

```yaml
ai:
  provider: 'openai'
  model: 'gpt-4'
analysis:
  confidence_threshold: 0.7
  max_suggestions: 5
```

## Step 3: Set Up API Keys

Add your AI provider API key to your environment:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

## Step 4: Analyze Your First Error

Try analyzing a common JavaScript error:

```bash
lumos analyze "TypeError: Cannot read property 'innerHTML' of null"
```

**Output:**

```json
{
  "error_type": "TypeError",
  "summary": "Null reference error when accessing DOM element",
  "confidence": 0.94,
  "root_cause": "Element not found in DOM before accessing property",
  "suggestions": [
    {
      "description": "Add null check before accessing property",
      "code": "if (element) { element.innerHTML = content; }",
      "confidence": 0.95
    },
    {
      "description": "Use optional chaining",
      "code": "element?.innerHTML = content;",
      "confidence": 0.92
    }
  ],
  "fix_priority": "high"
}
```

## Step 5: Analyze Test Failures

For test failures, provide additional context:

```bash
lumos analyze --file error.log --context src/ --research
```

## Step 6: Validate Test Quality

Check your test suite quality:

```bash
lumos validate tests/ --coverage --flaky-detection
```

**Sample Output:**

```
🧪 Test Validation Report
=========================
✅ Coverage: 87% (Target: 80%)
⚠️  Flaky Tests Found: 3
🎯 Test Quality Score: B+

Recommendations:
- Fix flaky test: user-login.spec.ts
- Add edge case tests for payment module
- Increase timeout for network tests
```

## Common Use Cases

### 1. CI/CD Integration

Add Lumos to your GitHub Actions:

```yaml
- name: Analyze Test Failures
  if: failure()
  run: |
    lumos analyze --file test-results.log \
      --context src/ \
      --research \
      --output analysis-report.json
```

### 2. Real-time Monitoring

Watch for test failures in real-time:

```bash
lumos watch tests/ --auto-analyze --notify
```

### 3. Debug Visual Tests

For Playwright/Cypress failures:

```bash
lumos debug --screenshot error-screenshot.png \
  --dom-state dom-dump.html \
  --network-logs network.har
```

## Next Steps

<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon">🎯</div>
    <h3>Deep Dive Analysis</h3>
    <p>Learn advanced error analysis techniques</p>
    <a href="first-analysis.md" class="lumos-button">Start Learning</a>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">⚙️</div>
    <h3>Configuration</h3>
    <p>Customize Lumos for your workflow</p>
    <a href="../advanced/configuration.md" class="lumos-button">Configure</a>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">🔌</div>
    <h3>Integrations</h3>
    <p>Connect with your favorite tools</p>
    <a href="../sdk/integration.md" class="lumos-button">Integrate</a>
  </div>
</div>

## Pro Tips

!!! tip "Improve Analysis Quality" - Provide context directories
(`--context src/`) for better analysis - Use `--research` flag for web-based
solution suggestions - Set appropriate confidence thresholds
(`--confidence 0.8`)

!!! warning "API Usage" - Monitor your AI provider usage and costs - Set up rate
limiting for large projects - Use caching to avoid duplicate analyses

!!! example "Best Practices" - Run `lumos validate` before major releases -
Integrate error analysis in your PR workflow - Keep your configuration under
version control

## Need Help?

- 📚 [Full Documentation](../index.md)
- 🐛 [Report Issues](https://github.com/lumos/lumos/issues)
- 💬 [Community Discord](https://discord.gg/lumos)
