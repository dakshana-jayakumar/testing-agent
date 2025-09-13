# NeuroLink SDK Integration 🧠

Learn how to integrate Lumos with NeuroLink SDK for enterprise-grade AI testing
intelligence.

## Overview

Lumos uses NeuroLink as its unified AI provider, offering enterprise-level
capabilities for error analysis, test validation, and intelligent debugging.
This guide covers integration patterns and advanced usage.

## Installation & Setup

### 1. Install Dependencies

```bash
npm install lumos @juspay/neurolink
```

### 2. Environment Configuration

```bash
# Required: NeuroLink API Key
export NEUROLINK_API_KEY="your-neurolink-api-key"

# Optional: Advanced Configuration
export NEUROLINK_MODEL="gpt-4"
export NEUROLINK_MAX_TOKENS="4000"
export NEUROLINK_TEMPERATURE="0.3"
```

### 3. Configuration File

Create `lumos.config.yaml`:

```yaml
ai:
  provider: 'neurolink'
  model: 'gpt-4'
  maxTokens: 4000
  temperature: 0.3
  timeout: 30000

  fallback:
    retryAttempts: 3
    retryDelay: 1000
```

## Programmatic Usage

### Basic Error Analysis

```typescript
import { createAICoordinator } from 'lumos/ai/coordinator';
import { ErrorCategory } from 'lumos/types/analysis';

// Initialize AI coordinator
const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
    model: 'gpt-4',
    temperature: 0.3,
  },
});

// Analyze an error
const errorAnalysis = {
  category: ErrorCategory.LOGIC_ERROR,
  confidence: 0.8,
  suggestions: [],
  pattern: null,
  context: {
    errorMessage: 'TypeError: Cannot read property "click" of null',
    filePath: 'tests/login.spec.ts',
    timestamp: new Date(),
  },
  timestamp: new Date(),
};

const analysisContext = {
  projectRoot: process.cwd(),
  testFile: 'tests/login.spec.ts',
};

const result = await coordinator.analyzeError(errorAnalysis, analysisContext);
console.log('AI Analysis:', result);
```

### Visual Analysis Integration

```typescript
import { createAICoordinator } from 'lumos/ai/coordinator';
import * as fs from 'fs';

const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
  },
});

// Analyze a screenshot
const screenshot = fs.readFileSync('screenshot.png');
const context = {
  projectRoot: process.cwd(),
  browserContext: {
    url: 'http://localhost:3000',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0...',
  },
};

const visualResult = await coordinator.analyzeVisual(screenshot, context);
console.log('Visual Analysis:', visualResult);
```

### Test Validation

```typescript
import { createAICoordinator } from 'lumos/ai/coordinator';

const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
  },
});

// Validate test results
const testValidationResult = {
  overall: {
    score: 75,
    grade: 'B',
    factors: [
      { name: 'Coverage', score: 80, description: 'Good coverage' },
      { name: 'Quality', score: 70, description: 'Needs improvement' },
    ],
  },
  coverage: {
    lines: { percentage: 80, covered: 800, total: 1000 },
    functions: { percentage: 85, covered: 85, total: 100 },
    branches: { percentage: 75, covered: 75, total: 100 },
    gaps: [],
  },
  flaky: {
    flakyPercentage: 5,
    stabilityScore: 95,
    flakyTests: [],
  },
  performance: {
    averageDuration: 2500,
    slowestTests: [],
    timeouts: 2,
    memoryUsage: { leaks: [] },
  },
  recommendations: [],
};

const validationResult = await coordinator.validateTest(
  testValidationResult,
  context
);
console.log('Validation Analysis:', validationResult);
```

## Testing Framework Integration

### Playwright Integration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { createAICoordinator } from 'lumos/ai/coordinator';

const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
  },
});

export default defineConfig({
  // ... your config

  // Custom reporter for AI analysis
  reporter: [['list'], ['./lumos-reporter.ts']],
});

// lumos-reporter.ts
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class LumosReporter implements Reporter {
  async onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      // Analyze failure with Lumos
      const error = result.errors[0];
      if (error) {
        const analysis = await coordinator.analyzeError(
          {
            category: 'ui-error',
            confidence: 0.8,
            suggestions: [],
            pattern: null,
            context: {
              errorMessage: error.message,
              stackTrace: error.stack,
              filePath: test.location?.file,
              timestamp: new Date(),
            },
            timestamp: new Date(),
          },
          {
            projectRoot: process.cwd(),
            testFile: test.location?.file,
          }
        );

        console.log(`🔮 Lumos Analysis for ${test.title}:`);
        console.log(`📋 Summary: ${analysis.summary}`);
        console.log(`🎯 Root Cause: ${analysis.rootCause}`);
        console.log(`💡 Suggestions:`, analysis.suggestions);
      }
    }
  }
}

export default LumosReporter;
```

### Jest Integration

```typescript
// jest.config.js
module.exports = {
  // ... your config

  // Custom test result processor
  testResultsProcessor: './lumos-processor.js',
};

// lumos-processor.js
const { createAICoordinator } = require('lumos/ai/coordinator');

const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
  },
});

module.exports = async results => {
  // Analyze failed tests
  for (const testResult of results.testResults) {
    if (testResult.numFailingTests > 0) {
      for (const assertionResult of testResult.assertionResults) {
        if (assertionResult.status === 'failed') {
          const analysis = await coordinator.analyzeError(
            {
              category: 'logic-error',
              confidence: 0.8,
              suggestions: [],
              pattern: null,
              context: {
                errorMessage: assertionResult.failureMessages.join('\n'),
                filePath: testResult.testFilePath,
                timestamp: new Date(),
              },
              timestamp: new Date(),
            },
            {
              projectRoot: process.cwd(),
              testFile: testResult.testFilePath,
            }
          );

          console.log(`🔮 Lumos Analysis: ${analysis.summary}`);
        }
      }
    }
  }

  return results;
};
```

## Custom AI Provider Implementation

For advanced use cases, you can create custom implementations:

```typescript
import { LumosNeuroLinkClient, NeuroLinkConfig } from 'lumos/ai/neurolink';

// Custom client with additional features
class CustomLumosClient extends LumosNeuroLinkClient {
  constructor(config: NeuroLinkConfig) {
    super(config);
  }

  // Add custom analysis methods
  async analyzePerformance(metrics: any, context: any) {
    // Custom performance analysis logic
    const prompt = this.createPerformancePrompt(metrics, context);
    const response = await this.makeRequest(prompt, 'completion');
    return this.parseAIResponse(response);
  }

  private createPerformancePrompt(metrics: any, context: any): string {
    return `
      Analyze these performance metrics and provide optimization suggestions:
      
      Metrics: ${JSON.stringify(metrics, null, 2)}
      Context: ${JSON.stringify(context, null, 2)}
      
      Provide JSON response with:
      - bottlenecks: string[]
      - optimizations: string[]
      - severity: 'low' | 'medium' | 'high'
      - estimatedImprovement: string
    `;
  }
}

// Use custom client
const customClient = new CustomLumosClient({
  apiKey: process.env.NEUROLINK_API_KEY,
  model: 'gpt-4',
  temperature: 0.2, // Lower temperature for performance analysis
});
```

## Error Handling & Best Practices

### Graceful Degradation

```typescript
import { createDefaultCoordinator } from 'lumos/ai/coordinator';

async function analyzeWithFallback(error: string) {
  try {
    const coordinator = createDefaultCoordinator();
    return await coordinator.analyzeError(/* ... */);
  } catch (aiError) {
    console.warn('AI analysis failed, using fallback:', aiError.message);

    // Fallback to rule-based analysis
    return {
      summary: 'Basic error analysis (AI unavailable)',
      rootCause: 'Unable to determine with AI analysis',
      suggestions: [
        'Check error message for common patterns',
        'Review recent code changes',
        'Verify environment configuration',
      ],
      confidence: 0.5,
    };
  }
}
```

### Rate Limiting & Retries

```typescript
import { createAICoordinator } from 'lumos/ai/coordinator';

const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
  },
  maxRetries: 3,
  retryDelay: 2000, // 2 seconds between retries
});

// The coordinator automatically handles rate limiting and retries
```

### Monitoring & Logging

```typescript
import { createAICoordinator } from 'lumos/ai/coordinator';

const coordinator = createAICoordinator({
  neurolink: {
    apiKey: process.env.NEUROLINK_API_KEY,
  },
});

// Monitor AI usage
let analysisCount = 0;
const originalAnalyzeError = coordinator.analyzeError;

coordinator.analyzeError = async function (...args) {
  analysisCount++;
  const startTime = Date.now();

  try {
    const result = await originalAnalyzeError.apply(this, args);
    const duration = Date.now() - startTime;

    console.log(`AI Analysis #${analysisCount} completed in ${duration}ms`);
    return result;
  } catch (error) {
    console.error(`AI Analysis #${analysisCount} failed:`, error);
    throw error;
  }
};
```

## Advanced Configuration

### Custom Models

```yaml
# lumos.config.yaml
ai:
  provider: 'neurolink'
  model: 'gpt-4-turbo' # Use latest model
  maxTokens: 8000 # Increased for complex analysis
  temperature: 0.1 # Very deterministic

  # Model-specific settings
  models:
    error-analysis:
      model: 'gpt-4'
      temperature: 0.3
    code-generation:
      model: 'gpt-4'
      temperature: 0.1
    research:
      model: 'gpt-3.5-turbo'
      temperature: 0.5
```

### Enterprise Settings

```yaml
# lumos.config.yaml
ai:
  provider: 'neurolink'

  # Enterprise configuration
  enterprise:
    organizationId: 'your-org-id'
    projectId: 'your-project-id'
    auditLogging: true
    dataRetention: '30days'
    complianceMode: 'SOC2'

  # Security settings
  security:
    encryptData: true
    anonymizeErrors: true
    excludePatterns:
      - 'password'
      - 'api_key'
      - 'secret'
```

## Troubleshooting

### Common Issues

**"NeuroLink API not available"**

```typescript
// Check API availability
const coordinator = createAICoordinator({
  neurolink: { apiKey: process.env.NEUROLINK_API_KEY },
});

const isAvailable = await coordinator.hasAvailableProviders();
if (!isAvailable) {
  console.error('NeuroLink API is not available');
}
```

**"API key authentication failed"**

```typescript
// Validate API key
if (!process.env.NEUROLINK_API_KEY) {
  throw new Error('NEUROLINK_API_KEY environment variable is required');
}

if (process.env.NEUROLINK_API_KEY.length < 20) {
  console.warn('API key appears to be invalid (too short)');
}
```

**"Rate limit exceeded"**

```typescript
// Handle rate limits gracefully
try {
  const result = await coordinator.analyzeError(/* ... */);
} catch (error) {
  if (error.message.includes('rate limit')) {
    console.log('Rate limited, waiting before retry...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    // Retry logic handled automatically by coordinator
  }
}
```

---

**Ready to integrate?** Check out our
[Getting Started Guide](../getting-started/index.md) for step-by-step setup
instructions.
