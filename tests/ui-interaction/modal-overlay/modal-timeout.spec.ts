import { test, expect, type Page } from '@playwright/test';
import { LumosAnalyzer } from '../../shared/utils/lumos-analyzer';

/**
 * Modal Overlay Click Interception Timeout Tests
 * 
 * This test suite demonstrates the exact error scenario you provided:
 * - Target button blocked by overlapping modal element
 * - 60-second timeout with 107 retry attempts
 * - "subtree intercepts pointer events" error
 * 
 * Real Error Example:
 * Error: locator.click: Test timeout of 60000ms exceeded.
 * - Target: getByRole('button', { name: 'Back', exact: true })
 * - Blocking: <div class="modal bottom overlay-active svelte-1bprkf6">
 * - Problem: "subtree intercepts pointer events"
 */

test.describe('🎭 Modal Overlay Error Analysis', () => {
  let page: Page;
  let lumosAnalyzer: LumosAnalyzer;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    lumosAnalyzer = new LumosAnalyzer(page, 'modal-overlay');
    await page.goto('/tests/ui-interaction/modal-overlay/test-page.html');
  });

  test('🚫 Scenario 1: Modal Overlay Blocking Click (Real-World Error)', async () => {
    console.log('\n=== Testing Modal Overlay Click Interception ===');
    
    // Trigger modal that will block subsequent interactions
    await page.click('[data-testid="open-blocking-modal"]');
    
    // Wait for modal to appear and become blocking
    await expect(page.locator('.modal.overlay-active')).toBeVisible();
    
    // Attempt to click target button that will be blocked
    // This should reproduce the exact error scenario
    const backButton = page.getByRole('button', { name: 'Back', exact: true });
    
    // Capture the error scenario
    const startTime = Date.now();
    let errorCaptured = false;
    let errorDetails = '';
    
    try {
      // This will timeout due to modal overlay blocking the click
      await backButton.click({ timeout: 5000 });
    } catch (error) {
      errorCaptured = true;
      errorDetails = error.toString();
      console.log('🐛 Modal Overlay Error Captured:', errorDetails);
    }
    
    const endTime = Date.now();
    const timeoutDuration = endTime - startTime;
    
    // Verify we captured the expected error
    expect(errorCaptured).toBe(true);
    expect(errorDetails).toContain('timeout');
    expect(timeoutDuration).toBeGreaterThan(4000); // Should have timed out
    
    // Take screenshot for visual analysis
    await page.screenshot({ 
      path: 'tests/shared/outputs/screenshots/modal-blocking-error.png',
      fullPage: true 
    });
    
    // Run Lumos AI analysis on this specific error
    await lumosAnalyzer.analyzeError({
      errorType: 'UI_INTERACTION_BLOCKING',
      errorMessage: errorDetails,
      scenario: 'Modal overlay intercepting click events',
      context: {
        targetElement: 'button[name="Back"]',
        blockingElement: '.modal.overlay-active',
        timeoutDuration,
        retryAttempts: 'Multiple (simulated)',
        rootCause: 'Z-index layering conflict with modal overlay'
      },
      suggestedFixes: [
        'Wait for modal to close before attempting click',
        'Add explicit modal dismissal step',
        'Use force click option to bypass overlay',
        'Implement modal-aware waiting strategy',
        'Add z-index validation checks'
      ],
      aiInsights: {
        severity: 'HIGH',
        patternRecognition: 'Common in SPA applications with modal libraries',
        preventionStrategy: 'Implement modal state management in test utilities'
      }
    });
    
    console.log('✅ Modal overlay error analysis completed');
  });

  test('🔧 Scenario 2: Smart Modal Dismissal Strategy', async () => {
    console.log('\n=== Testing Smart Modal Handling ===');
    
    // Open blocking modal
    await page.click('[data-testid="open-blocking-modal"]');
    await expect(page.locator('.modal.overlay-active')).toBeVisible();
    
    // Smart approach: Detect and dismiss modal first
    const modalPresent = await page.locator('.modal.overlay-active').isVisible();
    if (modalPresent) {
      console.log('🤖 AI Strategy: Modal detected, dismissing before target action');
      
      // Try multiple dismissal strategies
      try {
        // Strategy 1: Click close button
        await page.click('.modal .close-button', { timeout: 2000 });
      } catch {
        try {
          // Strategy 2: Click backdrop
          await page.click('.modal-backdrop', { timeout: 2000 });
        } catch {
          // Strategy 3: Press Escape
          await page.keyboard.press('Escape');
        }
      }
      
      // Wait for modal to be dismissed
      await expect(page.locator('.modal.overlay-active')).not.toBeVisible({ timeout: 5000 });
    }
    
    // Now the target action should succeed
    const backButton = page.getByRole('button', { name: 'Back', exact: true });
    await backButton.click(); // Should work now
    
    console.log('✅ Smart modal handling strategy successful');
  });

  test('⚡ Scenario 3: Force Click Bypass Strategy', async () => {
    console.log('\n=== Testing Force Click Strategy ===');
    
    // Open blocking modal
    await page.click('[data-testid="open-blocking-modal"]');
    await expect(page.locator('.modal.overlay-active')).toBeVisible();
    
    // Use force click to bypass modal overlay
    const backButton = page.getByRole('button', { name: 'Back', exact: true });
    
    try {
      await backButton.click({ force: true, timeout: 2000 });
      console.log('✅ Force click strategy successful');
    } catch (error) {
      await lumosAnalyzer.analyzeError({
        errorType: 'FORCE_CLICK_FAILED',
        errorMessage: error.toString(),
        scenario: 'Force click failed on overlay-blocked element',
        context: { strategy: 'force_click_bypass' }
      });
    }
  });

  test('🔍 Scenario 4: Element Visibility vs Clickability Analysis', async () => {
    console.log('\n=== Testing Visibility vs Clickability ===');
    
    const backButton = page.getByRole('button', { name: 'Back', exact: true });
    
    // Before modal
    const beforeModal = await lumosAnalyzer.analyzeElementState(backButton, 'before-modal');
    
    // Open blocking modal
    await page.click('[data-testid="open-blocking-modal"]');
    await expect(page.locator('.modal.overlay-active')).toBeVisible();
    
    // After modal (element visible but not clickable)
    const afterModal = await lumosAnalyzer.analyzeElementState(backButton, 'after-modal');
    
    // Compare states for AI learning
    await lumosAnalyzer.compareElementStates(beforeModal, afterModal, 'modal-blocking-analysis');
    
    console.log('✅ Element state analysis completed');
  });

  test.afterEach(async () => {
    // Generate test report for this specific modal scenario
    await lumosAnalyzer.generateReport('modal-overlay-timeout');
  });
});
