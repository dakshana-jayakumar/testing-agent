import { test, expect, type Page } from '@playwright/test';
import { LumosAnalyzer } from '../../shared/utils/lumos-analyzer';

/**
 * HTTP Status Code Error Testing
 * 
 * Tests various HTTP error scenarios that commonly occur in web applications:
 * - 4xx Client Errors (400, 401, 403, 404)
 * - 5xx Server Errors (500, 502, 503, 504)
 * - Network timeouts and connection failures
 * - CORS and authentication errors
 */

test.describe('🌐 HTTP Status Code Error Analysis', () => {
  let page: Page;
  let lumosAnalyzer: LumosAnalyzer;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    lumosAnalyzer = new LumosAnalyzer(page, 'api-network');
  });

  test('🚫 Scenario 1: 404 Not Found Error Analysis', async () => {
    console.log('\n=== Testing 404 Not Found Error ===');
    
    // Intercept and mock 404 responses
    await page.route('**/api/nonexistent-endpoint', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Endpoint not found',
          message: 'The requested resource could not be found',
          statusCode: 404,
          timestamp: new Date().toISOString()
        })
      });
    });

    // Navigate to test page and trigger API call
    await page.goto('data:text/html,<html><body><h1>API Test</h1><button id="test-btn">Test API</button><div id="result"></div><script>document.getElementById("test-btn").onclick = async () => { try { const response = await fetch("/api/nonexistent-endpoint"); const data = await response.text(); document.getElementById("result").innerText = `Status: ${response.status}, Data: ${data}`; } catch(e) { document.getElementById("result").innerText = `Error: ${e.message}`; } }</script></body></html>');
    
    // Trigger the API call that will result in 404
    await page.click('#test-btn');
    
    // Wait for the result to appear
    await page.waitForSelector('#result:has-text("404")', { timeout: 5000 });
    
    // Capture the error scenario
    const resultText = await page.locator('#result').textContent();
    expect(resultText).toContain('404');
    
    // Analyze with Lumos AI
    await lumosAnalyzer.analyzeError({
      errorType: 'HTTP_404_ERROR',
      errorMessage: 'HTTP 404 Not Found - Endpoint not accessible',
      scenario: 'API endpoint returned 404 status code',
      context: {
        endpoint: '/api/nonexistent-endpoint',
        statusCode: 404,
        method: 'GET',
        responseTime: '<100ms',
        errorCategory: 'CLIENT_ERROR'
      },
      suggestedFixes: [
        'Verify the API endpoint URL is correct',
        'Check if the endpoint exists on the server',
        'Validate API route configuration',
        'Implement proper endpoint existence validation',
        'Add fallback error handling for missing endpoints'
      ],
      aiInsights: {
        severity: 'MEDIUM',
        patternRecognition: 'Common in API integration and endpoint misconfiguration',
        preventionStrategy: 'Implement API endpoint validation and documentation'
      }
    });

    console.log('✅ 404 error analysis completed');
  });

  test('🔒 Scenario 2: 401 Unauthorized Error Analysis', async () => {
    console.log('\n=== Testing 401 Unauthorized Error ===');
    
    // Mock 401 authentication error
    await page.route('**/api/protected-resource', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        headers: {
          'WWW-Authenticate': 'Bearer realm="api"'
        },
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Authentication token is missing or invalid',
          statusCode: 401
        })
      });
    });

    await page.goto('data:text/html,<html><body><h1>Auth Test</h1><button id="auth-btn">Access Protected Resource</button><div id="auth-result"></div><script>document.getElementById("auth-btn").onclick = async () => { try { const response = await fetch("/api/protected-resource"); const data = await response.text(); document.getElementById("auth-result").innerText = `Status: ${response.status}, Data: ${data}`; } catch(e) { document.getElementById("auth-result").innerText = `Error: ${e.message}`; } }</script></body></html>');
    
    await page.click('#auth-btn');
    await page.waitForSelector('#auth-result:has-text("401")', { timeout: 5000 });
    
    await lumosAnalyzer.analyzeError({
      errorType: 'HTTP_401_UNAUTHORIZED',
      errorMessage: 'HTTP 401 Unauthorized - Authentication required',
      scenario: 'Protected API endpoint requires authentication',
      context: {
        endpoint: '/api/protected-resource',
        statusCode: 401,
        authenticationRequired: true,
        tokenPresent: false
      },
      suggestedFixes: [
        'Include valid authentication token in request headers',
        'Implement token refresh mechanism',
        'Add proper authentication flow',
        'Validate token expiration handling',
        'Implement redirect to login for unauthenticated users'
      ],
      aiInsights: {
        severity: 'HIGH',
        patternRecognition: 'Critical for secure API access patterns',
        preventionStrategy: 'Implement comprehensive authentication state management'
      }
    });

    console.log('✅ 401 authentication error analysis completed');
  });

  test('⚡ Scenario 3: 500 Internal Server Error Analysis', async () => {
    console.log('\n=== Testing 500 Internal Server Error ===');
    
    // Mock 500 server error
    await page.route('**/api/failing-endpoint', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: 'An unexpected error occurred while processing the request',
          statusCode: 500,
          requestId: 'req_123456789'
        })
      });
    });

    await page.goto('data:text/html,<html><body><h1>Server Error Test</h1><button id="server-btn">Trigger Server Error</button><div id="server-result"></div><script>document.getElementById("server-btn").onclick = async () => { try { const response = await fetch("/api/failing-endpoint"); const data = await response.text(); document.getElementById("server-result").innerText = `Status: ${response.status}, Data: ${data}`; } catch(e) { document.getElementById("server-result").innerText = `Error: ${e.message}`; } }</script></body></html>');
    
    await page.click('#server-btn');
    await page.waitForSelector('#server-result:has-text("500")', { timeout: 5000 });
    
    await lumosAnalyzer.analyzeError({
      errorType: 'HTTP_500_SERVER_ERROR',
      errorMessage: 'HTTP 500 Internal Server Error - Server-side failure',
      scenario: 'Server encountered unexpected error during request processing',
      context: {
        endpoint: '/api/failing-endpoint',
        statusCode: 500,
        errorCategory: 'SERVER_ERROR',
        requestId: 'req_123456789'
      },
      suggestedFixes: [
        'Check server logs for detailed error information',
        'Implement proper error handling and logging',
        'Add server health monitoring',
        'Implement graceful error recovery',
        'Add retry mechanism with exponential backoff'
      ],
      aiInsights: {
        severity: 'CRITICAL',
        patternRecognition: 'Indicates server-side issues requiring immediate attention',
        preventionStrategy: 'Implement comprehensive server monitoring and error tracking'
      }
    });

    console.log('✅ 500 server error analysis completed');
  });

  test('🌐 Scenario 4: Network Timeout Error Analysis', async () => {
    console.log('\n=== Testing Network Timeout Error ===');
    
    // Mock slow/timeout response
    await page.route('**/api/slow-endpoint', route => {
      // Simulate a slow response that will timeout
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Too late!' })
        });
      }, 10000); // 10 second delay
    });

    await page.goto('data:text/html,<html><body><h1>Timeout Test</h1><button id="timeout-btn">Test Slow Endpoint</button><div id="timeout-result"></div><script>document.getElementById("timeout-btn").onclick = async () => { try { const controller = new AbortController(); const timeoutId = setTimeout(() => controller.abort(), 2000); const response = await fetch("/api/slow-endpoint", { signal: controller.signal }); clearTimeout(timeoutId); const data = await response.text(); document.getElementById("timeout-result").innerText = `Success: ${data}`; } catch(e) { document.getElementById("timeout-result").innerText = `Timeout Error: ${e.message}`; } }</script></body></html>');
    
    await page.click('#timeout-btn');
    await page.waitForSelector('#timeout-result:has-text("Timeout Error")', { timeout: 5000 });
    
    await lumosAnalyzer.analyzeError({
      errorType: 'NETWORK_TIMEOUT_ERROR',
      errorMessage: 'Network request timeout - Request took too long to complete',
      scenario: 'API request exceeded timeout threshold',
      context: {
        endpoint: '/api/slow-endpoint',
        timeoutDuration: '2000ms',
        expectedResponseTime: '<1000ms',
        networkConditions: 'normal'
      },
      suggestedFixes: [
        'Increase timeout threshold for slow endpoints',
        'Optimize server response time',
        'Implement request caching where appropriate',
        'Add loading indicators for long-running requests',
        'Implement request cancellation functionality'
      ],
      aiInsights: {
        severity: 'HIGH',
        patternRecognition: 'Common in high-latency network environments or overloaded servers',
        preventionStrategy: 'Implement adaptive timeout strategies and performance monitoring'
      }
    });

    console.log('✅ Network timeout error analysis completed');
  });

  test('🔗 Scenario 5: CORS Error Analysis', async () => {
    console.log('\n=== Testing CORS Error ===');
    
    // Mock CORS error
    await page.route('**/api/cors-endpoint', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          // Missing CORS headers to trigger error
          'Content-Type': 'application/json'
          // Missing: 'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: 'CORS test' })
      });
    });

    await page.goto('data:text/html,<html><body><h1>CORS Test</h1><button id="cors-btn">Test CORS Endpoint</button><div id="cors-result"></div><script>document.getElementById("cors-btn").onclick = async () => { try { const response = await fetch("http://different-domain.com/api/cors-endpoint", { mode: "cors" }); const data = await response.text(); document.getElementById("cors-result").innerText = `Success: ${data}`; } catch(e) { document.getElementById("cors-result").innerText = `CORS Error: ${e.message}`; } }</script></body></html>');
    
    // This will trigger a CORS error in the browser
    await page.click('#cors-btn');
    
    // Wait for CORS error to be displayed
    await page.waitForTimeout(2000);
    
    await lumosAnalyzer.analyzeError({
      errorType: 'CORS_ERROR',
      errorMessage: 'CORS policy blocked cross-origin request',
      scenario: 'Cross-origin resource sharing violation',
      context: {
        origin: page.url(),
        targetDomain: 'different-domain.com',
        requestMode: 'cors',
        missingHeaders: ['Access-Control-Allow-Origin']
      },
      suggestedFixes: [
        'Configure server to include proper CORS headers',
        'Add Access-Control-Allow-Origin header',
        'Implement preflight request handling for complex requests',
        'Use server-side proxy for cross-origin requests',
        'Configure browser for development (not recommended for production)'
      ],
      aiInsights: {
        severity: 'HIGH',
        patternRecognition: 'Common in cross-domain API integration scenarios',
        preventionStrategy: 'Implement comprehensive CORS configuration management'
      }
    });

    console.log('✅ CORS error analysis completed');
  });

  test.afterEach(async () => {
    await lumosAnalyzer.generateReport('http-status-codes');
  });
});
