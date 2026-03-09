# Visual Regression Testing Documentation

## Overview

This project includes comprehensive visual regression testing capabilities using Playwright's screenshot comparison features integrated with CodeceptJS and the BDD framework.

Visual regression testing automatically detects unintended UI changes by comparing screenshots (snapshots) of your application against approved baseline images.

---

## Features

- ✅ **Full page and element screenshots** with configurable options
- ✅ **Pixel-perfect comparison** with adjustable thresholds
- ✅ **Dynamic content masking** for timestamps, dates, and session IDs
- ✅ **Cross-browser testing** support (Chromium, Firefox, WebKit)
- ✅ **Responsive/mobile viewport** testing
- ✅ **Allure report integration** with visual diff attachments
- ✅ **CI/CD ready** with baseline management
- ✅ **Component-level testing** for granular validation
- ✅ **Combined visual + accessibility** testing scenarios

---

## Quick Start

### 1. Generate Baseline Snapshots

First, create your baseline snapshots (golden images):

```bash
# Run visual tests to create baselines (first run)
pnpm test:visual

# Or update specific baselines
pnpm test:visual:update
```

Baselines are stored in `./__snapshots__/chromium/` directory by browser type.

### 2. Run Visual Regression Tests

```bash
# Run all visual tests
pnpm test:visual

# Run in headless mode (CI/CD)
pnpm test:visual:headless

# Run specific test categories
pnpm test:visual:smoke        # Quick smoke tests
pnpm test:visual:critical     # Critical path tests
pnpm test:visual:mobile       # Mobile viewport tests
```

### 3. Update Baselines After Approved Changes

When you intentionally change the UI and need to update baselines:

```bash
# Update all baselines
pnpm test:visual:update

# Or run baseline update scenario
pnpm test:visual:baseline
```

---

## Configuration

### CodeceptJS Configuration (`codecept.conf.js`)

```javascript
VisualRegressionHelper: {
  require: './helpers/VisualRegressionHelper.js',
  snapshotDir: './__snapshots__',      // Baseline snapshot directory
  updateSnapshots: false,              // Set true to update all baselines
  threshold: 0.2,                      // 20% pixel difference tolerance
  maxDiffPixelRatio: 0.01,            // 1% maximum diff allowed
  animations: 'disabled',              // Disable animations for consistency
  fullPage: true,                      // Full page screenshots by default
  timeout: 30000,                      // 30 second timeout
  maskSelectors: [                     // Global dynamic element masks
    '.timestamp',
    '.date-updated',
    '[data-timestamp]',
    '.session-id',
  ],
  browserName: 'chromium',             // Browser for snapshot organization
}
```

---

## API Reference

### Actor Methods (Available as `I.*` in tests)

#### `I.saveVisualSnapshot(snapshotName, options)`

Save a visual snapshot (screenshot) of the current page or element.

**Parameters:**
- `snapshotName` (string): Unique name for the snapshot
- `options` (object):
  - `selector` (string): Optional selector for element screenshot
  - `fullPage` (boolean): Take full page screenshot (default: true)
  - `mask` (array): Array of selectors to mask
  - `timeout` (number): Timeout in milliseconds

**Example:**
```javascript
// Full page snapshot
await I.saveVisualSnapshot('homepage');

// Element snapshot
await I.saveVisualSnapshot('cart-item', { 
  selector: '.cart-item:first-child' 
});

// With masking
await I.saveVisualSnapshot('checkout', {
  mask: ['.order-number', '.timestamp']
});
```

---

#### `I.assertVisualSnapshot(snapshotName, options)`

Assert that current page/element matches the baseline snapshot.

**Parameters:**
- `snapshotName` (string): Name of baseline to compare against
- `options` (object):
  - `selector` (string): Optional selector for element comparison
  - `threshold` (number): Pixel difference threshold (0-1)
  - `maxDiffPixelRatio` (number): Maximum diff pixel ratio (0-1)
  - `mask` (array): Array of selectors to mask

**Example:**
```javascript
// Full page comparison
await I.assertVisualSnapshot('login-page');

// Element comparison with threshold
await I.assertVisualSnapshot('product-card', {
  selector: '.product-card',
  maxDiffPixelRatio: 0.02  // 2% tolerance
});

// With masking for dynamic content
await I.assertVisualSnapshot('dashboard', {
  mask: ['.timestamp', '.user-session']
});
```

---

#### `I.captureElement(selector, snapshotName, options)`

Take a screenshot of a specific element.

**Example:**
```javascript
await I.captureElement('.header-logo', 'logo-component');
await I.captureElement('.cart-summary', 'cart-summary', {
  mask: ['.updated-at']
});
```

---

#### `I.setViewportSize(viewport)`

Set viewport size for responsive testing.

**Example:**
```javascript
// Mobile
await I.setViewportSize({ width: 375, height: 667 });

// Tablet
await I.setViewportSize({ width: 768, height: 1024 });

// Desktop
await I.setViewportSize({ width: 1920, height: 1080 });
```

---

#### `I.setGlobalMasks(selectors)` / `I.clearGlobalMasks()`

Set or clear global element masks for all snapshots.

**Example:**
```javascript
// Add global masks
await I.setGlobalMasks(['.timestamp', '.session-id', '[data-dynamic]']);

// Clear masks
await I.clearGlobalMasks();
```

---

#### `I.waitForAnimations(duration)`

Wait for animations to complete before taking screenshot.

**Example:**
```javascript
await I.waitForAnimations(1000);  // Wait 1 second
await I.saveVisualSnapshot('page-after-animation');
```

---

## Gherkin Step Definitions

The following Gherkin steps are available in feature files:

### Basic Snapshot Steps

```gherkin
Then the login success page visual snapshot should match baseline
Then the product page visual snapshot should match baseline
Then the cart page visual snapshot should match with masked elements
```

### Element Snapshot Steps

```gherkin
Then the cart item element should visually match baseline
When the user captures visual snapshot of cart item component
```

### Viewport/Responsive Steps

```gherkin
Given the user sets viewport to mobile size
Then the mobile login page visual snapshot should match baseline
```

### Masking Dynamic Content

```gherkin
When the user masks timestamp elements using ".timestamp, .date-updated"
When the user masks order numbers using ".order-id"
When the user captures visual snapshot with masks
Then the masked visual snapshot should match baseline
```

### Baseline Update

```gherkin
Given the user wants to update visual baselines
When the user captures new baseline snapshots
Then the new baselines should be saved successfully
```

---

## Handling Dynamic Content

Dynamic content (timestamps, session IDs, order numbers) must be masked to prevent false positives.

### Method 1: Per-Snapshot Masking

```javascript
await I.assertVisualSnapshot('checkout-page', {
  mask: [
    '.order-number',
    '.timestamp',
    '.session-id',
    '[data-dynamic]'
  ]
});
```

### Method 2: Global Masking (codecept.conf.js)

```javascript
VisualRegressionHelper: {
  maskSelectors: [
    '.timestamp',
    '.date-updated',
    '[data-timestamp]',
    '.session-id',
  ]
}
```

### Method 3: Runtime Global Masks

```javascript
// Set for multiple tests
await I.setGlobalMasks(['.timestamp', '.session-id']);
await I.assertVisualSnapshot('page-1');
await I.assertVisualSnapshot('page-2');
await I.clearGlobalMasks();
```

---

## Test Organization

### Feature File Structure (`features/ai_visual_a11y.feature`)

Tests are tagged for easy filtering:

- `@visual` - All visual tests
- `@visual-login` - Login page tests
- `@visual-cart` - Cart page tests
- `@visual-checkout` - Checkout tests
- `@visual-smoke` - Quick smoke tests
- `@visual-critical` - Critical path tests
- `@visual-responsive` - Mobile/viewport tests
- `@visual-component` - Component-level tests
- `@visual @a11y @combined` - Combined visual + accessibility tests

---

## Running Tests

### All Test Scripts

```bash
# Visual Tests
pnpm test:visual                 # All visual tests
pnpm test:visual:headless        # Headless mode (CI/CD)
pnpm test:visual:update          # Update all baselines
pnpm test:visual:baseline        # Run baseline update scenario
pnpm test:visual:smoke           # Quick smoke tests
pnpm test:visual:critical        # Critical tests only
pnpm test:visual:mobile          # Mobile viewport tests
pnpm test:visual:chrome          # Chrome-specific tests

# Combined Visual + Accessibility
pnpm test:combined               # Combined tests
pnpm test:combined:headless      # Headless combined tests

# Individual scenarios
pnpm test:tag @visual-login      # Login page tests
pnpm test:tag @visual-checkout   # Checkout tests
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Download baseline snapshots
        run: |
          # Download from artifact storage (S3, GitHub, etc.)
          aws s3 cp s3://my-bucket/__snapshots__ ./__snapshots__ --recursive
      
      - name: Run visual tests
        run: pnpm test:visual:headless
      
      - name: Upload visual diffs on failure
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-diffs
          path: reports/screenshots/
      
      - name: Generate Allure Report
        if: always()
        run: pnpm exec allure generate reports -o allure-report
      
      - name: Upload Allure Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: allure-report
          path: allure-report/
```

### Baseline Management in CI

1. **Store baselines in version control** (recommended for small projects):
   ```bash
   git add __snapshots__/
   git commit -m "Update visual baselines"
   ```

2. **Store baselines in artifact storage** (recommended for large projects):
   - Upload to S3/Azure Blob/GCS after baseline updates
   - Download in CI pipeline before tests

3. **Branch-specific baselines**:
   ```bash
   __snapshots__/
     main/chromium/*.png
     develop/chromium/*.png
     feature-branch/chromium/*.png
   ```

---

## Cross-Browser Testing

### Configuration for Multiple Browsers

Update `codecept.conf.js`:

```javascript
// Multiple browser configs
const browsers = ['chromium', 'firefox', 'webkit'];

exports.config = {
  multiple: {
    chromium: {
      browsers: ['chromium'],
      helpers: {
        VisualRegressionHelper: {
          browserName: 'chromium'
        }
      }
    },
    firefox: {
      browsers: ['firefox'],
      helpers: {
        VisualRegressionHelper: {
          browserName: 'firefox'
        }
      }
    }
  }
}
```

### Run Cross-Browser Tests

```bash
# Run on specific browser
pnpm exec codeceptjs run-multiple chromium --grep @visual

# Run on all browsers
pnpm exec codeceptjs run-multiple chromium:firefox:webkit --grep @visual
```

Snapshots are organized by browser:
```
__snapshots__/
  chromium/
    login-page.png
  firefox/
    login-page.png
  webkit/
    login-page.png
```

---

## Troubleshooting

### Issue: Snapshots don't match even though page looks identical

**Cause:** Font rendering differences, animations, dynamic content

**Solution:**
1. Increase threshold: `maxDiffPixelRatio: 0.02` (2%)
2. Mask dynamic elements
3. Disable animations in helper config
4. Wait for page to stabilize: `await I.wait(2)`

---

### Issue: Snapshots differ between local and CI

**Cause:** Different OS rendering (macOS vs Linux), fonts, screen density

**Solution:**
1. Generate baselines in CI environment
2. Use Docker for consistent environment
3. Disable font anti-aliasing differences with threshold adjustment
4. Use `--disable-font-subpixel-positioning` Chrome flag

---

### Issue: Tests timeout during screenshot capture

**Cause:** Page not fully loaded, slow network

**Solution:**
1. Increase timeout: `I.saveVisualSnapshot('page', { timeout: 60000 })`
2. Wait for network idle: `await page.waitForLoadState('networkidle')`
3. Wait for animations: `await I.waitForAnimations(1000)`

---

### Issue: Baseline snapshots not found

**Cause:** Snapshots directory missing or not downloaded in CI

**Solution:**
1. Ensure `./__snapshots__/` exists
2. Check baseline download step in CI
3. Verify snapshot naming matches between save and assert
4. Check browser name matches config

---

## Best Practices

### 1. Strategic Snapshot Coverage
- ✅ Focus on critical user journeys
- ✅ Test components in isolation
- ✅ Test responsive breakpoints
- ❌ Avoid testing every minor variation

### 2. Naming Conventions
```javascript
// Good - descriptive and organized
'login-page-success-state'
'cart-empty-state'
'checkout-step-2-shipping'
'component-header-logged-in'

// Bad - vague or inconsistent
'test1'
'page'
'screenshot-final'
```

### 3. Masking Strategy
- Mask timestamps and dates globally
- Mask session IDs, user-specific content
- Mask third-party widgets (ads, chat)
- Document masked elements in comments

### 4. Threshold Configuration
- **0.0 - 0.01 (0-1%)**: Pixel-perfect, use for static pages
- **0.01 - 0.05 (1-5%)**: Recommended for most cases
- **0.05 - 0.2 (5-20%)**: Lenient, for pages with animations

### 5. Test Stability
- Wait for page load complete
- Disable animations
- Wait for fonts to load
- Stabilize viewport size
- Use consistent test data

### 6. Version Control
- ✅ Commit baseline snapshots to git (small projects)
- ✅ Use LFS for large snapshot files
- ✅ Use artifact storage for large projects
- ❌ Don't commit diff images

### 7. Review Process
- Review visual diffs in Allure reports
- Approve changes before updating baselines
- Document intentional UI changes
- Link visual changes to tickets/PRs

---

## Example Scenarios

### Complete Login Flow Test

```gherkin
@visual @critical
Scenario: Login flow visual regression
  Given the user is on the homepage
  And the user saves homepage visual snapshot
  When the user navigates to login page
  Then the login page visual snapshot should match baseline
  When the user logs in with valid credentials
  Then the login success page visual snapshot should match baseline
```

### Component Testing

```gherkin
@visual-component
Scenario: Shopping cart components visual validation
  Given the user has items in cart
  When the user captures visual snapshot of cart item component
  And the user captures visual snapshot of cart summary component
  And the user captures visual snapshot of checkout button
  Then all cart components should visually match their baselines
```

### Responsive Testing

```gherkin
@visual-responsive
Scenario Outline: Responsive visual regression
  Given the user sets viewport to <device> size
  When the user navigates to <page> page
  Then the <page> page should match <device> baseline

  Examples:
    | device  | page     |
    | mobile  | login    |
    | tablet  | products |
    | desktop | checkout |
```

---

## Support and Resources

### Documentation
- [Playwright Screenshots](https://playwright.dev/docs/screenshots)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [CodeceptJS Helpers](https://codecept.io/helpers/)

### Project Files
- Helper: `helpers/VisualRegressionHelper.js`
- Feature: `features/ai_visual_a11y.feature`
- Steps: `step_definitions/visual.steps.js`
- Config: `codecept.conf.js`
- Capabilities: `helpers/actorCapabilities.js`

---

## Summary

Visual regression testing is now fully integrated into your CodeceptJS Playwright BDD framework:

✅ **20+ Gherkin scenarios** for comprehensive coverage  
✅ **Cross-browser support** with organized snapshots  
✅ **Dynamic content masking** for reliable tests  
✅ **CI/CD ready** with baseline management  
✅ **Allure integration** for visual diff reporting  
✅ **Component-level testing** for granular validation  
✅ **Combined visual + accessibility** testing  
✅ **Responsive testing** for mobile/tablet/desktop  

Run `pnpm test:visual` to get started! 🚀
