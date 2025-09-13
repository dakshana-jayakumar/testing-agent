# Your First Analysis

Learn how to perform deep error analysis with Lumos and understand the advanced
features that make it powerful.

## Understanding Error Analysis

Lumos doesn't just identify errors - it provides intelligent analysis with
context, suggestions, and actionable solutions.

### Basic Analysis

Let's start with a simple error:

```bash
lumos analyze "ReferenceError: userConfig is not defined"
```

**Lumos Output:**

```json
{
  "error_type": "ReferenceError",
  "summary": "Variable 'userConfig' referenced before declaration",
  "confidence": 0.97,
  "root_cause": "Variable accessed in scope where it's not defined",
  "suggestions": [
    {
      "description": "Check variable declaration and scope",
      "code": "const userConfig = getDefaultConfig();",
      "confidence": 0.95,
      "impact": "high"
    },
    {
      "description": "Import missing dependency",
      "code": "import { userConfig } from './config';",
      "confidence": 0.9,
      "impact": "high"
    }
  ],
  "related_patterns": ["undefined-variable", "scope-issue"],
  "fix_priority": "critical"
}
```

### Advanced Analysis with Context

For better results, provide context about your codebase:

```bash
lumos analyze "TypeError: Cannot read property 'map' of undefined" \
  --context src/ \
  --file error.log \
  --research
```

**Enhanced Output:**

```json
{
  "error_type": "TypeError",
  "summary": "Null/undefined array access in mapping operation",
  "confidence": 0.94,
  "context_analysis": {
    "file_pattern": "React component data transformation",
    "common_cause": "Async data not loaded before render",
    "related_files": ["src/components/UserList.tsx"]
  },
  "suggestions": [
    {
      "description": "Add defensive check for array existence",
      "code": "const items = data?.users || [];",
      "confidence": 0.96,
      "fix_type": "defensive"
    },
    {
      "description": "Use loading state pattern",
      "code": "if (!data.users) return <Loading />;",
      "confidence": 0.92,
      "fix_type": "pattern"
    }
  ],
  "research_findings": [
    {
      "source": "Stack Overflow",
      "relevance": 0.89,
      "summary": "Common React pattern for async data handling"
    }
  ]
}
```

## Analysis Features

### 1. Confidence Scoring

Lumos provides confidence scores for each analysis:

- **0.9-1.0**: Very High Confidence - Apply suggestions immediately
- **0.7-0.89**: High Confidence - Review and apply
- **0.5-0.69**: Medium Confidence - Consider with caution
- **Below 0.5**: Low Confidence - Manual investigation needed

### 2. Pattern Recognition

Lumos recognizes common error patterns:

```bash
# DOM-related errors
lumos analyze "Cannot read property 'addEventListener' of null"

# Async/Promise errors
lumos analyze "UnhandledPromiseRejectionWarning"

# Network errors
lumos analyze "ERR_NETWORK_CONNECTION_LOST"
```

### 3. Fix Prioritization

Errors are prioritized by impact:

- 🔴 **Critical**: Breaks core functionality
- 🟡 **High**: Affects user experience
- 🟢 **Medium**: Performance or edge cases
- 🔵 **Low**: Code quality improvements

## Real-World Examples

### Example 1: React Component Error

**Error:**

```
TypeError: Cannot read property 'length' of undefined at UserList.render
```

**Analysis Command:**

```bash
lumos analyze "TypeError: Cannot read property 'length' of undefined" \
  --context src/components/ \
  --research \
  --fix-suggestions
```

**Lumos Solution:**

```typescript
// Before (problematic)
const UserList = ({ users }) => {
  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
};

// After (Lumos suggestion)
const UserList = ({ users = [] }) => {
  if (!users?.length) {
    return <EmptyState message="No users found" />;
  }

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
};
```

### Example 2: API Integration Error

**Error:**

```
UnhandledPromiseRejectionWarning: Error: Request failed with status code 404
```

**Analysis:**

```bash
lumos analyze --file api-error.log --context src/api/ --research
```

**Lumos Solution:**

```typescript
// Lumos suggested error handling pattern
const fetchUserData = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new UserNotFoundError(`User ${userId} not found`);
    }
    throw new APIError('Failed to fetch user data', error);
  }
};
```

## Advanced Features

### Visual Analysis

For UI test failures, include visual context:

```bash
lumos debug \
  --screenshot screenshot.png \
  --dom-state dom.html \
  --network-logs network.har
```

### Batch Analysis

Analyze multiple errors from log files:

```bash
lumos analyze --file test-results.log --batch --output analysis-report.json
```

### Custom Patterns

Define custom error patterns for your domain:

```yaml
# lumos.config.yaml
patterns:
  custom:
    - name: 'payment_failure'
      regex: 'Payment.*failed'
      confidence: 0.95
      suggestions:
        - 'Check payment gateway configuration'
        - 'Verify API credentials'
```

## Best Practices

!!! success "Do This" - Always provide context directories with `--context` -
Use `--research` for unknown errors - Set appropriate confidence thresholds -
Review suggestions before applying

!!! warning "Avoid This" - Don't blindly apply low-confidence suggestions -
Don't ignore context information - Don't skip manual review for critical errors

## Next Steps

- 🔧 [Advanced Configuration](../advanced/configuration.md)
- 🎯 [CLI Reference](../cli/commands.md)
- 🔌 [SDK Integration](../sdk/integration.md)
- 📊 [API Reference](../reference/api.md)
