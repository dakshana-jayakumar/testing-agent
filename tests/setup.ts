// Playwright test setup file
// This file is executed before each test file

import { test as base, expect } from '@playwright/test';
import { Page, Browser, BrowserContext } from '@playwright/test';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';

// Extend the base test to include custom fixtures
export const test = base.extend({
  // Custom page fixture with error handling
  page: async ({ page }, use) => {
    // Setup page error handlers
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Console error: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });

    await use(page);
  },
});

// Export expect for use in tests
export { expect };

// Helper functions for testing
export const createMockError = (message: string, stack?: string) => {
  const error = new Error(message);
  if (stack) {
    error.stack = stack;
  }
  return error;
};

export const waitForElementWithTimeout = async (page: Page, selector: string, timeout = 5000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.log(`Element ${selector} not found within ${timeout}ms`);
    return false;
  }
};

export const takeScreenshotOnFailure = async (page: Page, testName: string) => {
  try {
    await page.screenshot({
      path: `test-results/screenshots/${testName}-failure-${Date.now()}.png`,
      fullPage: true,
    });
  } catch (error) {
    console.log(`Failed to take screenshot: ${error}`);
  }
};

// Common test utilities for Lumos testing
export const simulateError = async (page: Page, errorType: string) => {
  switch (errorType) {
    case 'reference':
      await page.evaluate(() => {
        // @ts-ignore - Intentional reference error for testing
        nonExistentVariable.someProperty;
      });
      break;
    case 'type':
      await page.evaluate(() => {
        // @ts-ignore - Intentional type error for testing
        null.someMethod();
      });
      break;
    case 'network':
      await page.route('**/api/**', route => route.abort());
      await page.goto('/api/test');
      break;
    default:
      throw new Error(`Unknown error type: ${errorType}`);
  }
};

export const setupTestPage = async (page: Page, htmlContent?: string) => {
  const defaultHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lumos Test Page</title>
    </head>
    <body>
      <div id="test-container">
        <h1>Test Page</h1>
        <button id="test-button">Click Me</button>
        <input id="test-input" placeholder="Enter text" />
        <div id="test-output"></div>
      </div>
    </body>
    </html>
  `;

  const content = htmlContent || defaultHtml;
  await page.setContent(content);
};

// Lumos-specific test helpers
export const analyzePage = async (page: Page) => {
  return await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      errors: (window as any).errorLog || [],
      performance: {
        timing: performance.timing,
        navigation: performance.navigation,
      },
    };
  });
};

export const injectLumosAnalyzer = async (page: Page) => {
  await page.addInitScript(() => {
    // Initialize Lumos analyzer on the page
    (window as any).lumosAnalyzer = {
      errors: [],
      patterns: [],
      captureError: (error: Error) => {
        (window as any).lumosAnalyzer.errors.push({
          message: error.message,
          stack: error.stack,
          timestamp: Date.now(),
        });
      },
    };

    // Override console.error to capture errors
    const originalError = console.error;
    console.error = (...args) => {
      (window as any).lumosAnalyzer.captureError(new Error(args.join(' ')));
      originalError.apply(console, args);
    };

    // Capture unhandled errors
    window.addEventListener('error', event => {
      (window as any).lumosAnalyzer.captureError(event.error);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      (window as any).lumosAnalyzer.captureError(new Error(event.reason));
    });
  });
};
