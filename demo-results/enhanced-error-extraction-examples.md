# 🔍 Enhanced Error Extraction Examples

This document demonstrates Lumos's advanced error extraction capabilities with surgical precision error context analysis.

## 🎯 Surgical Precision Features

### ✅ Test File Detection
- Automatically extracts test file paths from stack traces
- Identifies line and column numbers with precision
- Shows specific function/test names where errors occur

### ✅ Multi-Framework Selector Extraction
- **Playwright**: `Selector: button[data-testid='submit-btn']`
- **Cypress**: `Expected to find element: .submit-button`
- **Selenium**: `"selector":"#login-form input[type='password']"`

### ✅ Real-Time Code Context
- Reads actual source files dynamically
- Shows error line with surrounding context
- Highlights exact error location

---

## 🔧 Enhanced Error Type Examples

### 1. Element Timeout with Surgical Context

```typescript
// Input Error Message:
Error: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for locator('#submit-button').click()
============================================================
    at /home/user/project/tests/auth/login.spec.ts:45:31
    at test (/home/user/project/tests/auth/login.spec.ts:42:3)
```

**Enhanced Analysis Output:**
```json
{
  "category": "Element Timeout Error",
  "confidence": 0.92,
  "severity": "medium",
  "codeContext": {
    "fileName": "login.spec.ts",
    "lineNumber": 45,
    "columnNumber": 31,
    "functionName": "should login with valid credentials",
    "projectPath": "/home/user/project/tests/auth/login.spec.ts",
    "codeSnippet": "  await page.goto('/login');\n  await page.fill('#username', 'user@test.com');\n  await page.fill('#password', 'password123');\n→ await page.locator('#submit-button').click();\n  await expect(page).toHaveURL('/dashboard');",
    "errorLineContent": "  await page.locator('#submit-button').click();"
  },
  "locatorDetails": {
    "selector": "#submit-button",
    "action": "click",
    "timeout": "30000ms",
    "framework": "playwright"
  },
  "stackTrace": {
    "testFile": "login.spec.ts",
    "location": "login.spec.ts:45"
  }
}
```

### 2. Cypress Element Not Found

```typescript
// Input Error Message:
CypressError: Timed out retrying after 4000ms: Expected to find element: `.product-card[data-id="123"]`, but never found it.
    at Context.<anonymous> (/cypress/e2e/products.cy.js:25:8)
    at runnable (/cypress/node_modules/@cypress/runner/lib/runner.js:288:23)
```

**Enhanced Analysis Output:**
```json
{
  "category": "Cypress Element Not Exist",
  "confidence": 0.89,
  "codeContext": {
    "fileName": "products.cy.js", 
    "lineNumber": 25,
    "columnNumber": 8,
    "functionName": "should display product details",
    "projectPath": "/cypress/e2e/products.cy.js",
    "codeSnippet": "  cy.visit('/products');\n  cy.get('.search-input').type('laptop');\n  cy.get('.search-button').click();\n→ cy.get('.product-card[data-id=\"123\"]').should('be.visible');\n  cy.get('.product-title').should('contain', 'Gaming Laptop');",
    "errorLineContent": "  cy.get('.product-card[data-id=\"123\"]').should('be.visible');"
  },
  "locatorDetails": {
    "selector": ".product-card[data-id=\"123\"]",
    "action": "get",
    "framework": "cypress"
  }
}
```

### 3. Selenium Stale Element Reference

```java
// Input Error Message:
org.openqa.selenium.StaleElementReferenceException: stale element reference: element is not attached to the page document
  at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
  at com.example.tests.CheckoutTest.testPaymentFlow(CheckoutTest.java:89)
  at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
```

**Enhanced Analysis Output:**
```json
{
  "category": "Selenium Stale Element Reference",
  "confidence": 0.95,
  "severity": "high",
  "codeContext": {
    "fileName": "CheckoutTest.java",
    "lineNumber": 89,
    "functionName": "testPaymentFlow",
    "projectPath": "com.example.tests.CheckoutTest.java"
  },
  "solutions": [
    "Re-find element before each interaction",
    "Use explicit waits: WebDriverWait().until()",
    "Avoid storing element references across page changes",
    "Implement retry mechanism for stale elements"
  ]
}
```

### 4. React Infinite Render Loop

```typescript
// Input Error Message:
Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    at UserProfile (/src/components/UserProfile.tsx:15:23)
    at App (/src/App.tsx:42:11)
```

**Enhanced Analysis Output:**
```json
{
  "category": "React Infinite Render Loop",
  "confidence": 0.94,
  "severity": "high",
  "codeContext": {
    "fileName": "UserProfile.tsx",
    "lineNumber": 15,
    "columnNumber": 23,
    "functionName": "UserProfile",
    "projectPath": "/src/components/UserProfile.tsx",
    "codeSnippet": "const UserProfile = ({ userId }) => {\n  const [user, setUser] = useState(null);\n  \n→ useEffect(() => {\n    fetchUser(userId).then(setUser);\n  }); // Missing dependency array!",
    "errorLineContent": "  useEffect(() => {"
  },
  "solutions": [
    "Add dependency array to useEffect: useEffect(() => {}, [userId])",
    "Move state updates to event handlers or effects",
    "Memoize objects/arrays with useMemo or useCallback"
  ]
}
```

### 5. API Network Error with Context

```typescript
// Input Error Message:
TypeError: Failed to fetch
    at APIService.post (/src/services/api.ts:45:12)
    at UserService.createUser (/src/services/users.ts:23:18)
    at RegisterForm.handleSubmit (/src/components/RegisterForm.spec.ts:67:8)
```

**Enhanced Analysis Output:**
```json
{
  "category": "Network Request Failed",
  "confidence": 0.87,
  "codeContext": {
    "fileName": "RegisterForm.spec.ts",
    "lineNumber": 67,
    "columnNumber": 8,
    "functionName": "should create new user account",
    "projectPath": "/src/components/RegisterForm.spec.ts",
    "codeSnippet": "  await page.fill('#email', 'test@example.com');\n  await page.fill('#password', 'securePass123');\n  await page.click('#register-button');\n→ await expect(page.locator('.success-message')).toBeVisible();\n  // API call fails here",
    "errorLineContent": "  await expect(page.locator('.success-message')).toBeVisible();"
  },
  "relatedFiles": [
    "/src/services/api.ts",
    "/src/services/users.ts"
  ]
}
```

---

## 🎯 Multi-Framework Selector Extraction

### Playwright Selectors
```typescript
// Various Playwright selector formats detected:
locator('#submit-button').click()          → selector: "#submit-button"
page.locator('button[data-testid="save"]') → selector: "button[data-testid='save']"
getByRole('button', { name: 'Submit' })    → selector: "button:has-text('Submit')"
```

### Cypress Selectors
```typescript
// Cypress selector formats:
cy.get('.product-card')                    → selector: ".product-card"
cy.contains('Add to Cart')                 → selector: ":contains('Add to Cart')"
cy.get('[data-cy="checkout-btn"]')         → selector: "[data-cy='checkout-btn']"
```

### Selenium Selectors
```java
// Selenium selector formats:
findElement(By.id("username"))             → selector: "#username"
findElement(By.className("error-message")) → selector: ".error-message"
findElement(By.xpath("//button[@type='submit']")) → selector: "//button[@type='submit']"
```

---

## 🔍 Advanced Stack Trace Analysis

### Test File Priority Detection
The engine prioritizes test files in stack trace analysis:

1. **Highest Priority**: `.spec.ts`, `.test.js`, `.cy.js`
2. **Medium Priority**: Component files in test directories
3. **Lowest Priority**: Library/framework files

### Function Name Extraction
Automatically detects test function names:
- `test('description')` → "description"  
- `it('should do something')` → "should do something"
- `describe('Component')` → "Component"

---

## 📊 Confidence Scoring System

### Confidence Factors:
- **Base**: 50%
- **Known Error Pattern**: +30-35%
- **Stack Trace Available**: +10%
- **Code Context Found**: +10%
- **Code Snippet Available**: +5%
- **Maximum**: 98%

### Example Confidence Calculations:
```typescript
// High Confidence (92%)
✅ Known pattern: webServer timeout (+30%)
✅ Stack trace with test file (+10%)
✅ Code context with line number (+10%)
✅ Code snippet extracted (+5%)
= 92% confidence

// Medium Confidence (65%)
✅ Generic error pattern (+15%)
❌ No stack trace (0%)
❌ No code context (0%)
❌ No code snippet (0%)
= 65% confidence
```

---

## 🎯 Real-World Usage Examples

### Testing Workflow Integration
```bash
# Analyze failed test with enhanced context
npx lumos analyze "Error: Timeout waiting for locator" \
  --file tests/checkout.spec.ts \
  --context src/ \
  --format enhanced

# Output includes:
# ✅ Exact test file and line number
# ✅ Specific selector that failed  
# ✅ Code context around the error
# ✅ Framework-specific solutions
# ✅ Related files to check
```

### CI/CD Pipeline Integration
```yaml
# GitHub Actions example
- name: Analyze Test Failures
  if: failure()
  run: |
    npx lumos analyze --file test-results.json \
      --format jenkins \
      --output analysis-report.json
```

This enhanced extraction system provides **surgical precision** for error analysis, dramatically reducing debugging time by showing exactly where issues occur with full context.
