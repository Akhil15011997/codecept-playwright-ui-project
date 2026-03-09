# Visual Regression Testing - Quick Reference

## 🚀 Quick Commands

```bash
# First-time setup - Generate baselines
pnpm test:visual

# Regular testing - Compare against baselines
pnpm test:visual:headless

# Update baselines after approved changes
pnpm test:visual:update
```

---

## 📋 All Available Commands

| Command | Description |
|---------|-------------|
| `pnpm test:visual` | Run all visual regression tests |
| `pnpm test:visual:headless` | Run visual tests in headless mode (CI/CD) |
| `pnpm test:visual:update` | Update all baseline snapshots |
| `pnpm test:visual:baseline` | Run baseline update test scenarios |
| `pnpm test:visual:chrome` | Chrome-specific visual tests |
| `pnpm test:visual:mobile` | Mobile/responsive viewport tests |
| `pnpm test:visual:smoke` | Quick smoke test visual checks |
| `pnpm test:visual:critical` | Critical path visual tests (headless) |
| `pnpm test:combined` | Combined visual + accessibility tests |
| `pnpm test:combined:headless` | Combined tests in headless mode |

---

## 💡 Common Usage Patterns

### In Step Definitions

```javascript
// Full page snapshot
await I.saveVisualSnapshot('homepage');

// Assert against baseline
await I.assertVisualSnapshot('login-page');

// With dynamic content masking
await I.assertVisualSnapshot('cart-page', {
  mask: ['.timestamp', '.order-id', '.session-id']
});

// Element-specific snapshot
await I.captureElement('.product-card', 'product-component');

// Responsive testing
await I.setViewportSize({ width: 375, height: 667 });
await I.assertVisualSnapshot('mobile-homepage');
```

### In Feature Files (Gherkin)

```gherkin
# Basic visual check
Then the login success page visual snapshot should match baseline

# With masked elements
Then the cart page visual snapshot should match with masked elements

# Component testing
Then the cart item element should visually match baseline

# Responsive testing
Given the user sets viewport to mobile size
Then the mobile login page visual snapshot should match baseline
```

---

## 🎯 Common Scenarios

### Scenario 1: First Time Setup
```bash
# 1. Write your test scenarios in features/ai_visual_a11y.feature
# 2. Run tests to generate baselines
pnpm test:visual

# 3. Commit baselines to git
git add __snapshots__/
git commit -m "Add visual regression baselines"
```

### Scenario 2: Detecting Visual Regressions
```bash
# Run tests (baselines already exist)
pnpm test:visual:headless

# If tests fail, check Allure report for visual diffs
pnpm exec allure serve reports

# Review diff images in reports/screenshots/
```

### Scenario 3: Intentional UI Changes
```bash
# After making approved UI changes
# Update baselines for all affected pages
pnpm test:visual:update

# Or update specific test
pnpm exec codeceptjs run --grep "@visual-login" --update-snapshots

# Commit updated baselines
git add __snapshots__/
git commit -m "Update visual baselines after button redesign"
```

### Scenario 4: CI/CD Pipeline
```bash
# In your CI pipeline (GitHub Actions, GitLab CI, etc.)
# 1. Checkout code (includes __snapshots__ baselines)
# 2. Install dependencies
pnpm install

# 3. Run visual tests in headless mode
pnpm test:visual:headless

# 4. Upload artifacts on failure (diffs, screenshots)
# 5. Generate Allure report with visual diffs
```

---

## ⚙️ Configuration Options

### Global Config (`codecept.conf.js`)

```javascript
VisualRegressionHelper: {
  snapshotDir: './__snapshots__',       // Baseline directory
  threshold: 0.2,                       // 20% pixel tolerance
  maxDiffPixelRatio: 0.01,             // 1% max diff allowed
  animations: 'disabled',               // Disable animations
  fullPage: true,                       // Full page screenshots
  timeout: 30000,                       // 30s timeout
  maskSelectors: ['.timestamp'],        // Global masks
}
```

### Per-Test Options

```javascript
await I.assertVisualSnapshot('page-name', {
  threshold: 0.05,                      // 5% tolerance for this test
  maxDiffPixelRatio: 0.02,             // 2% max diff
  mask: ['.dynamic-element'],           // Test-specific masks
  fullPage: false,                      // Viewport only
  timeout: 60000,                       // 60s timeout
});
```

---

## 🎭 Masking Dynamic Content

### Why Mask?
Dynamic content (timestamps, session IDs, etc.) changes on every test run, causing false positives.

### How to Mask

**Method 1: Global (codecept.conf.js)**
```javascript
maskSelectors: ['.timestamp', '.session-id', '[data-dynamic]']
```

**Method 2: Per-Test**
```javascript
await I.assertVisualSnapshot('page', {
  mask: ['.order-number', '.updated-at']
});
```

**Method 3: Runtime Global**
```javascript
await I.setGlobalMasks(['.timestamp', '.user-id']);
// ... multiple tests ...
await I.clearGlobalMasks();
```

---

## 🌐 Viewport Sizes

```javascript
// Mobile (iPhone SE)
await I.setViewportSize({ width: 375, height: 667 });

// Tablet (iPad)
await I.setViewportSize({ width: 768, height: 1024 });

// Desktop HD
await I.setViewportSize({ width: 1920, height: 1080 });

// Desktop 4K
await I.setViewportSize({ width: 3840, height: 2160 });
```

---

## 📊 Threshold Guidelines

| Threshold | Use Case | Description |
|-----------|----------|-------------|
| 0.0 - 0.01 | Pixel-perfect | Static pages, no animations |
| 0.01 - 0.05 | Recommended | Most web pages |
| 0.05 - 0.2 | Lenient | Pages with animations, videos |
| 0.2+ | Very lenient | Dynamic content-heavy pages |

---

## 🐛 Troubleshooting

### Issue: Tests fail locally but pass in CI
**Solution:** Generate baselines in CI environment or use Docker

### Issue: Fonts look different
**Solution:** Increase threshold or ensure same fonts installed

### Issue: Snapshots don't match on different OS
**Solution:** 
```javascript
// Use higher threshold
threshold: 0.05,
maxDiffPixelRatio: 0.03
```

### Issue: Animations causing flaky tests
**Solution:**
```javascript
// Wait for animations
await I.waitForAnimations(1000);
// Or disable in helper config
animations: 'disabled'
```

---

## 📁 Directory Structure

```
__snapshots__/
├── chromium/
│   ├── homepage.png                    # ✅ Baseline (commit to git)
│   ├── login-page.png                  # ✅ Baseline (commit to git)
│   ├── cart-page-actual.png            # ❌ Actual (gitignored)
│   └── cart-page-diff.png              # ❌ Diff (gitignored)
├── firefox/
│   └── ...
└── webkit/
    └── ...
```

**Commit baselines ✅** | **Ignore diffs ❌**

---

## 🏷️ Test Tags

| Tag | Description |
|-----|-------------|
| `@visual` | All visual tests |
| `@visual-smoke` | Quick smoke tests |
| `@visual-critical` | Critical path tests |
| `@visual-login` | Login page tests |
| `@visual-cart` | Cart page tests |
| `@visual-checkout` | Checkout tests |
| `@visual-responsive` | Mobile/tablet tests |
| `@visual-component` | Component-level tests |
| `@visual @a11y` | Combined visual + accessibility |

---

## 📚 More Resources

- **Full Documentation:** [VISUAL-REGRESSION-TESTING.md](./VISUAL-REGRESSION-TESTING.md)
- **Playwright Docs:** https://playwright.dev/docs/test-snapshots
- **Feature File:** [features/ai_visual_a11y.feature](./features/ai_visual_a11y.feature)
- **Helper Code:** [helpers/VisualRegressionHelper.js](./helpers/VisualRegressionHelper.js)

---

## ✅ Checklist for New Tests

- [ ] Write Gherkin scenario in `features/ai_visual_a11y.feature`
- [ ] Add appropriate tags (`@visual`, `@visual-smoke`, etc.)
- [ ] Implement step definitions (or reuse existing)
- [ ] Run test to generate baseline: `pnpm test:visual`
- [ ] Verify snapshot looks correct in `__snapshots__/`
- [ ] Commit baseline to git
- [ ] Run again to verify comparison works: `pnpm test:visual:headless`
- [ ] Add to CI pipeline

---

**🚀 Ready to test? Run:** `pnpm test:visual`
