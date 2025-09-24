# Advanced Configuration ⚙️

Comprehensive guide to configuring Lumos for enterprise environments and
advanced use cases.

## Configuration File Structure

### Complete Configuration Example

```yaml
# lumos.config.yaml
version: '1.0'

# AI Provider Configuration
ai:
  provider: 'neurolink'
  model: 'gpt-4'
  maxTokens: 4000
  temperature: 0.3
  timeout: 30000

  # Fallback and retry settings
  fallback:
    retryAttempts: 3
    retryDelay: 1000
    exponentialBackoff: true
    maxRetryDelay: 10000

  # Enterprise features
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
      - 'token'

# Analysis Configuration
analysis:
  confidenceThreshold: 0.7
  maxSuggestions: 5
  includeResearch: true
  includeFixes: true

  # Pattern learning
  patterns:
    enabled: true
    minFrequency: 3
    maxPatterns: 1000
    autoUpdate: true

  # Context analysis
  context:
    maxFileSize: '1MB'
    includeStackTrace: true
    includeBrowserLogs: true
    includeNetworkLogs: true
    maxContextLines: 50

# Debug Configuration
debug:
  screenshotDir: './screenshots'
  saveOnError: true
  viewport:
    width: 1920
    height: 1080

  # Browser settings
  browser:
    headless: true
    timeout: 30000
    slowMo: 0
    args:
      - '--no-sandbox'
      - '--disable-dev-shm-usage'

  # Visual analysis
  visual:
    enabled: true
    autoAnalyze: true
    saveAnnotatedScreenshots: true

# Output Configuration
output:
  format: 'json' # json, table, html, markdown
  saveReports: true
  reportsDir: './lumos-reports'

  # Report settings
  reports:
    includeTimestamps: true
    includeMetadata: true
    compressOldReports: true
    maxReports: 100

  # Formatting options
  formatting:
    colorize: true
    verbose: false
    showConfidence: true
    showTimings: true

# Cache Configuration
cache:
  enabled: true
  directory: './.lumos-cache'
  maxSize: '100MB'
  ttl: '24h'

  # Cache strategies
  strategies:
    errorAnalysis: '7d'
    patterns: '30d'
    research: '1d'
    fixes: '7d'

# Monitoring and Logging
monitoring:
  enabled: true
  logLevel: 'info' # debug, info, warn, error
  logFile: './lumos.log'

  # Metrics collection
  metrics:
    enabled: true
    endpoint: 'https://metrics.lumos.dev'
    interval: '5m'
    batchSize: 100

  # Performance tracking
  performance:
    trackAnalysisTime: true
    trackMemoryUsage: true
    trackApiCalls: true

# Integration Settings
integrations:
  # CI/CD platforms
  cicd:
    github:
      enabled: true
      token: '${GITHUB_TOKEN}'
      repository: 'your-org/your-repo'

    jenkins:
      enabled: false
      url: 'https://jenkins.example.com'
      username: '${JENKINS_USER}'
      apiToken: '${JENKINS_TOKEN}'

  # Notification systems
  notifications:
    slack:
      enabled: false
      webhook: '${SLACK_WEBHOOK}'
      channel: '#testing'

    email:
      enabled: false
      smtp:
        host: 'smtp.example.com'
        port: 587
        username: '${SMTP_USER}'
        password: '${SMTP_PASS}'

  # External tools
  tools:
    jira:
      enabled: false
      url: 'https://your-org.atlassian.net'
      username: '${JIRA_USER}'
      apiToken: '${JIRA_TOKEN}'

# Quality Gates
quality:
  gates:
    errorAnalysis:
      minConfidence: 0.8
      requireFixes: true

    testValidation:
      minScore: 80
      maxFlaky: 5
      minCoverage: 85

    performance:
      maxAnalysisTime: '10s'
      maxMemoryUsage: '500MB'

# Environment-specific settings
environments:
  development:
    ai:
      model: 'gpt-3.5-turbo'
      maxTokens: 2000
    debug:
      verbose: true
    cache:
      ttl: '1h'

  staging:
    ai:
      model: 'gpt-4'
      maxTokens: 4000
    monitoring:
      logLevel: 'debug'

  production:
    ai:
      model: 'gpt-4'
      maxTokens: 4000
      temperature: 0.1
    monitoring:
      logLevel: 'warn'
    quality:
      gates:
        errorAnalysis:
          minConfidence: 0.9
```

## Environment Variables

### Required Variables

```bash
# NeuroLink API Configuration
NEUROLINK_API_KEY="your-neurolink-api-key"
```

### Optional Variables

```bash
# Lumos Core
LUMOS_CONFIG_PATH="./lumos.config.yaml"
LUMOS_LOG_LEVEL="info"
LUMOS_CACHE_ENABLED="true"
LUMOS_ENVIRONMENT="production"

# AI Configuration
NEUROLINK_MODEL="gpt-4"
NEUROLINK_MAX_TOKENS="4000"
NEUROLINK_TEMPERATURE="0.3"
NEUROLINK_TIMEOUT="30000"

# Debug Settings
LUMOS_DEBUG_SCREENSHOTS="true"
LUMOS_DEBUG_SAVE_LOGS="true"
LUMOS_DEBUG_VERBOSE="false"

# Integration Tokens
GITHUB_TOKEN="ghp_..."
SLACK_WEBHOOK="https://hooks.slack.com/..."
JIRA_API_TOKEN="..."

# Enterprise Settings
LUMOS_ORG_ID="your-organization-id"
LUMOS_PROJECT_ID="your-project-id"
```

## Profile-based Configuration

### Development Profile

```yaml
# lumos.dev.yaml
extends: './lumos.config.yaml'

ai:
  model: 'gpt-3.5-turbo'
  maxTokens: 2000
  temperature: 0.5

debug:
  verbose: true
  saveOnError: true

cache:
  ttl: '1h'

monitoring:
  logLevel: 'debug'
```

### Production Profile

```yaml
# lumos.prod.yaml
extends: './lumos.config.yaml'

ai:
  model: 'gpt-4'
  temperature: 0.1

monitoring:
  logLevel: 'warn'
  metrics:
    enabled: true

quality:
  gates:
    errorAnalysis:
      minConfidence: 0.9
```

### Using Profiles

```bash
# Use development profile
lumos analyze "error" --config lumos.dev.yaml

# Use production profile
LUMOS_CONFIG_PATH=lumos.prod.yaml lumos analyze "error"
```

## Team Configuration

### Shared Team Settings

```yaml
# team-config.yaml
team:
  name: 'Frontend Team'
  defaults:
    ai:
      model: 'gpt-4'
      confidenceThreshold: 0.8

    analysis:
      includeResearch: true
      includeFixes: true

    patterns:
      customPatterns:
        - name: 'React Hook Error'
          pattern: 'Invalid hook call'
          category: 'react-error'
          suggestions:
            - 'Check hook usage rules'
            - 'Verify component structure'

        - name: 'Async/Await Error'
          pattern: 'Cannot read property.*of undefined'
          category: 'async-error'
          suggestions:
            - 'Add null checks'
            - 'Use optional chaining'

  # Team-specific quality gates
  qualityGates:
    minTestCoverage: 85
    maxFlakiness: 3
    minConfidence: 0.85
```

### Role-based Permissions

```yaml
# roles.yaml
roles:
  developer:
    permissions:
      - 'analyze:error'
      - 'validate:tests'
      - 'debug:visual'

    limits:
      dailyAnalyses: 100
      maxTokens: 4000

  lead:
    permissions:
      - 'analyze:*'
      - 'validate:*'
      - 'debug:*'
      - 'config:read'

    limits:
      dailyAnalyses: 500
      maxTokens: 8000

  admin:
    permissions:
      - '*'

    limits:
      dailyAnalyses: 1000
      maxTokens: 16000
```

## CI/CD Integration Configuration

### GitHub Actions

```yaml
# .github/workflows/lumos-analysis.yml
name: Lumos Analysis
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Lumos
        run: |
          npm install -g lumos
          echo "NEUROLINK_API_KEY=${{ secrets.NEUROLINK_API_KEY }}" >> $GITHUB_ENV

      - name: Configure Lumos for CI
        run: |
          cat > lumos.ci.yaml << EOF
          extends: "./lumos.config.yaml"

          ai:
            model: "gpt-3.5-turbo"  # Faster for CI
            maxTokens: 2000

          output:
            format: "json"
            saveReports: true

          quality:
            gates:
              errorAnalysis:
                minConfidence: 0.7
          EOF

      - name: Run Tests with Analysis
        run: |
          npm test || lumos analyze "$(cat test-output.log)" --config lumos.ci.yaml

      - name: Upload Analysis Reports
        uses: actions/upload-artifact@v3
        with:
          name: lumos-reports
          path: lumos-reports/
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        NEUROLINK_API_KEY = credentials('neurolink-api-key')
        LUMOS_CONFIG_PATH = 'lumos.jenkins.yaml'
    }

    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g lumos'

                // Create Jenkins-specific config
                writeFile file: 'lumos.jenkins.yaml', text: '''
extends: "./lumos.config.yaml"

ai:
  model: "gpt-3.5-turbo"
  maxTokens: 2000

monitoring:
  logLevel: "info"
  metrics:
    enabled: true
    endpoint: "${JENKINS_METRICS_URL}"

integrations:
  jenkins:
    enabled: true
    buildId: "${BUILD_ID}"
    jobName: "${JOB_NAME}"
'''
            }
        }

        stage('Test & Analyze') {
            steps {
                script {
                    def testResult = sh(
                        script: 'npm test',
                        returnStatus: true
                    )

                    if (testResult != 0) {
                        sh '''
                            npm test 2>&1 | tee test-output.log
                            lumos analyze "$(cat test-output.log)" --config lumos.jenkins.yaml
                        '''
                    }
                }
            }
        }

        stage('Quality Gates') {
            steps {
                sh 'lumos validate tests/ --threshold 80 --config lumos.jenkins.yaml'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'lumos-reports/**', fingerprint: true
        }
    }
}
```

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:18-alpine

# Install Lumos
RUN npm install -g lumos

# Copy configuration
COPY lumos.config.yaml /app/
WORKDIR /app

# Set environment variables
ENV LUMOS_CONFIG_PATH=/app/lumos.config.yaml
ENV LUMOS_CACHE_DIR=/app/.lumos-cache

# Create cache directory
RUN mkdir -p /app/.lumos-cache

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD lumos utils status || exit 1

ENTRYPOINT ["lumos"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  lumos:
    build: .
    environment:
      - NEUROLINK_API_KEY=${NEUROLINK_API_KEY}
      - LUMOS_ENVIRONMENT=production
    volumes:
      - ./tests:/app/tests:ro
      - ./lumos-reports:/app/lumos-reports
      - lumos-cache:/app/.lumos-cache
    command: ['watch', 'tests/', '--auto-analyze']

volumes:
  lumos-cache:
```

## Performance Tuning

### Memory Optimization

```yaml
# lumos.config.yaml
performance:
  memory:
    maxHeapSize: '2GB'
    gcStrategy: 'aggressive'

  analysis:
    batchSize: 10
    concurrency: 3
    timeout: '5m'

  cache:
    compressionLevel: 6
    maxEntries: 10000
```

### Network Optimization

```yaml
# lumos.config.yaml
network:
  timeout: 30000
  retries: 3
  keepAlive: true

  # Connection pooling
  pool:
    maxSockets: 10
    maxFreeSockets: 5
    timeout: 60000
```

## Security Configuration

### Data Protection

```yaml
# lumos.config.yaml
security:
  encryption:
    enabled: true
    algorithm: 'aes-256-gcm'
    keyRotation: '90d'

  privacy:
    anonymizeStackTraces: true
    excludePersonalData: true
    dataRetention: '30d'

  access:
    requireAuth: true
    allowedUsers:
      - 'team@company.com'

    ipWhitelist:
      - '10.0.0.0/8'
      - '192.168.0.0/16'
```

### Audit Logging

```yaml
# lumos.config.yaml
audit:
  enabled: true
  logFile: './audit.log'

  events:
    - 'analysis.start'
    - 'analysis.complete'
    - 'config.change'
    - 'auth.login'
    - 'auth.logout'

  retention: '1y'
  format: 'json'
```

## Troubleshooting Configuration

### Common Issues

**Configuration Validation Errors**

```bash
# Validate your configuration
lumos utils config validate

# Check specific sections
lumos utils config validate --section ai
lumos utils config validate --section analysis
```

**Environment Variable Issues**

```bash
# Check environment setup
lumos utils status --env

# Test API connectivity
lumos utils status --providers
```

**Performance Issues**

```bash
# Profile analysis performance
lumos utils profile --duration 5m

# Check cache efficiency
lumos utils cache stats
```

---

**Need help with configuration?** Check our
[troubleshooting guide](../reference/troubleshooting.md) or
[contact support](mailto:support@lumos.dev).
