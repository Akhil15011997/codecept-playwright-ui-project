# CodeceptJS Playwright BDD Test Automation Framework

> **A production-ready, AI-powered BDD test automation framework** built with CodeceptJS and Playwright, featuring intelligent self-healing tests, comprehensive visual regression testing, and WCAG 2.2 AA accessibility validation. Supports cross-browser testing with enterprise-grade reporting and CI/CD integration.

---

## 📦 Current Versions

- **CodeceptJS**: 3.7.6
- **Playwright**: 1.58.2
- **@playwright/test**: 1.58.2
- **OpenAI SDK**: 4.73.0 (for AI self-healing)
- **Husky**: 9.1.7 (latest format)
- **Node.js**: Latest LTS recommended (v20+)

---

## ✨ Key Features

### 🤖 AI-Powered Self-Healing Tests
- Automatically repairs broken selectors when UI changes using OpenAI GPT-4
- 3-tier healing strategy: OpenAI → Accessibility Tree → Semantic Patterns
- Persistent caching reduces API costs by 80%+ after initial healing
- Zero-touch integration with graceful fallback

### 📸 Visual Regression Testing
- Pixel-perfect screenshot comparison with configurable thresholds
- Dynamic content masking (timestamps, session IDs, etc.)
- Cross-browser and responsive viewport testing
- Automatic baseline management for CI/CD

### ♿ Accessibility Testing
- WCAG 2.2 Level AA compliance validation
- Automated color contrast checking
- Keyboard navigation testing
- Screen reader compatibility verification

### 📊 Enterprise Reporting
- Allure reports with visual diffs and healing logs
- Video recording on test failures
- Playwright trace viewer integration
- Custom HTML reports

### 🔄 CI/CD Ready
- GitHub Actions integration examples
- Docker support
- Parallel test execution
- Baseline artifact management

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Latest LTS version ([download here](https://nodejs.org/en/download/package-manager/current))
- **pnpm**: Install globally with `npm install -g pnpm`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd codecept-playwright-ui-project

# Install dependencies
pnpm install

# (Optional) Set up OpenAI for AI self-healing
export OPENAI_API_KEY="sk-your-api-key-here"
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run with specific tag
pnpm test:prod:tag @smoke

# Run in headless mode
pnpm test:headless:tag @regression

# Visual regression tests
pnpm test:visual

# Accessibility tests
pnpm test:a11y

# AI self-healing tests
pnpm test:ai-healing

# Combined tests (Visual + Accessibility)
pnpm test:combined
```

---

## 📚 Documentation

### Quick Start Guides
- **[AI Healing Quick Reference](docs/quick-start/AI-HEALING-QUICK-REF.md)** - Common AI healing commands and patterns
- **[Visual Testing Quick Reference](docs/quick-start/VISUAL-TESTING-QUICK-REF.md)** - Visual regression testing cheat sheet

### Comprehensive Guides
- **[AI-Powered Self-Healing Testing](docs/guides/AI-HEALING-TESTING.md)** - Complete guide to AI healing with OpenAI integration
- **[Visual Regression Testing](docs/guides/VISUAL-REGRESSION-TESTING.md)** - Full visual testing documentation
- **[Accessibility Testing](docs/guides/ACCESSIBILITY-TESTING.md)** - WCAG 2.1 AA compliance testing guide

---

## 🤖 AI Self-Healing Tests

This framework includes cutting-edge AI-powered self-healing that automatically repairs broken selectors when UI changes.

### How It Works

When a selector fails:
1. **AI Analysis**: OpenAI GPT-4 analyzes page context, accessibility tree, and DOM structure
2. **Intelligent Healing**: Suggests semantic, stable selectors (role-based, text-based, ARIA)
3. **Validation**: Verifies healed selector works before using it
4. **Caching**: Persists healed selectors to disk for future runs (80%+ cost reduction)

### Setup OpenAI API Key

```bash
# 1. Sign up at https://platform.openai.com/signup
# 2. Add payment method at https://platform.openai.com/account/billing/overview
# 3. Create API key at https://platform.openai.com/api-keys
# 4. Set environment variable
export OPENAI_API_KEY="sk-your-api-key-here"
```

**Detailed instructions**: See [AI Healing Documentation](docs/guides/AI-HEALING-TESTING.md#how-to-create-an-openai-api-key)

### Run AI Healing Tests

```bash
pnpm test:ai-healing                 # All AI healing tests
pnpm test:ai-healing:headless        # Headless mode (CI/CD)
pnpm test:ai-healing:smoke           # Quick smoke tests
pnpm test:ai-healing:openai          # OpenAI-specific tests
pnpm healing:clear-cache             # Clear healing cache
```

### Cost Estimation

| Daily Tests | Failures (5%) | Monthly Cost |
|-------------|---------------|--------------|
| 100         | 150 healings  | $0.15 - $0.45 |
| 500         | 750 healings  | $0.75 - $2.25 |
| 1000        | 1500 healings | $1.50 - $4.50 |

*Note: Caching reduces costs by 80%+ after first run*

### Usage Example

```javascript
// Enable AI healing
await I.enableAISelfHealing();

// Automatic healing on failure
await I.healAndRetry(
  async (sel) => await I.click(sel),
  '.login-button'
);

// Manual healing
const healed = await I.healLocator('.old-btn', 'click');
if (healed) {
  await I.click(healed); // Uses healed selector
}

// Get statistics
const stats = await I.getHealingStats();
console.log(`Healed ${stats.healedCount} selectors`);
```

---

---

## 📸 Visual Regression Testing

Comprehensive visual testing with pixel-perfect screenshot comparison and intelligent diff detection.

### Quick Commands

```bash
pnpm test:visual                  # Run all visual tests
pnpm test:visual:headless         # Headless mode (CI/CD)
pnpm test:visual:update           # Update baselines after approved UI changes
pnpm test:visual:critical         # Critical path tests only
pnpm test:visual:mobile           # Mobile/responsive tests
pnpm test:combined                # Visual + Accessibility combined
```

### Features
- ✅ Full page and element-level screenshots
- ✅ Configurable pixel difference thresholds
- ✅ Dynamic content masking (timestamps, IDs, etc.)
- ✅ Cross-browser testing (Chromium, Firefox, WebKit)
- ✅ Mobile/responsive viewport testing
- ✅ Allure integration with visual diffs
- ✅ Automatic baseline management for CI/CD

### Usage Example

```javascript
// Capture full page
await I.saveVisualSnapshot('homepage');

// Assert against baseline with masking
await I.assertVisualSnapshot('login-page', {
  mask: ['.timestamp', '.session-id'],
  maxDiffPixelRatio: 0.01
});

// Capture specific element
await I.captureElement('.product-card', 'product-component');

// Set mobile viewport
await I.setViewportSize({ width: 375, height: 667 });
await I.assertVisualSnapshot('mobile-homepage');
```

### Snapshot Storage
```
__snapshots__/
  chromium/
    homepage.png
    login-page.png
  firefox/
  webkit/
```

**Full documentation**: [Visual Regression Testing Guide](docs/guides/VISUAL-REGRESSION-TESTING.md)

---

## ♿ Accessibility Testing (WCAG 2.2 AA)

Automated accessibility testing using **axe-playwright** with WCAG 2.2 Level AA compliance validation. Our custom `AccessibilityHelper` integrates seamlessly with CodeceptJS for comprehensive accessibility audits.

### Quick Commands

```bash
pnpm test:a11y                    # All accessibility tests
pnpm test:a11y:headless           # Headless mode
pnpm test:combined                # Combined with visual tests
pnpm exec codeceptjs run examples/accessibility_test.js  # Run examples
```

### Features
- ✅ **WCAG 2.2 AA Compliance** - Latest accessibility standards (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa)
- ✅ **Automated Audits** - Powered by axe-core accessibility engine
- ✅ **Detailed Reporting** - Violation descriptions, impact levels, HTML snippets, and remediation guidance
- ✅ **Flexible Targeting** - Audit full pages, specific sections, or individual elements
- ✅ **Impact Filtering** - Filter by critical, serious, moderate, or minor issues
- ✅ **Export Results** - Save audit results as JSON for further analysis
- ✅ **Best Practices** - Includes WCAG best practices and common issue detection

### Installation

```bash
# Install axe-playwright dependency
pnpm add -D axe-playwright
```

The `AccessibilityHelper` is already configured in [codecept.conf.js](codecept.conf.js#L15).

### Core API Methods

#### `I.runAudit(options)`
Runs accessibility audit and returns detailed results.

**Options:**
- `context` - CSS selector to audit specific element(s)
- `runOnly` - Array of WCAG tags or rule IDs to check
- `exclude` - Array of CSS selectors to exclude from audit
- `detailedReport` - Include full HTML snippets (default: false)

**Returns:** `{ violations: [], passes: number, incomplete: number, inapplicable: number }`

#### `I.assertNoViolations(options, message)`
Asserts the page/element has no accessibility violations. Throws detailed error if violations found.

#### `I.getViolationsByImpact(impact)`
Filter violations by impact level: `'critical'`, `'serious'`, `'moderate'`, `'minor'`.

#### `I.getViolationsSummary()`
Get violation count summary by impact level.

#### `I.saveAuditResults(filename, directory)`
Export audit results to JSON file.

### Usage Examples

```javascript
Feature('Accessibility Testing');

Scenario('Full page accessibility audit', async ({ I }) => {
  I.amOnPage('/dashboard');
  
  // Run complete audit
  const results = await I.runAudit();
  
  // Log summary
  console.log(`Violations: ${results.violations.length}`);
  console.log(`Passed checks: ${results.passes}`);
  
  // Save detailed report
  await I.saveAuditResults('dashboard-audit.json', './reports/accessibility');
});

Scenario('Assert no violations', async ({ I }) => {
  I.amOnPage('/login');
  
  // Throws error with detailed violations if found
  await I.assertNoViolations();
});

Scenario('Audit specific section', async ({ I }) => {
  I.amOnPage('/products');
  
  // Audit navigation menu only
  const results = await I.runAudit({
    context: 'nav.main-menu',
    runOnly: ['wcag2aa', 'best-practice']
  });
});

Scenario('Check specific rules', async ({ I }) => {
  I.amOnPage('/checkout');
  
  // Check specific accessibility rules
  await I.assertNoViolations({
    runOnly: ['color-contrast', 'image-alt', 'label', 'button-name']
  }, 'Form inputs must have labels and sufficient contrast');
});

Scenario('Filter by impact level', async ({ I }) => {
  I.amOnPage('/settings');
  
  await I.runAudit();
  
  // Get only critical issues
  const critical = await I.getViolationsByImpact('critical');
  const serious = await I.getViolationsByImpact('serious');
  
  // Assert no critical or serious issues
  if (critical.length > 0 || serious.length > 0) {
    throw new Error(`Found ${critical.length} critical and ${serious.length} serious issues`);
  }
});

Scenario('Exclude third-party content', async ({ I }) => {
  I.amOnPage('/');
  
  // Exclude ads and widgets from audit
  const results = await I.runAudit({
    exclude: ['#google-ads', '.third-party-widget', 'iframe']
  });
});
```

### Common Violations to Monitor

| Rule ID | Description | WCAG Guideline |
|---------|-------------|----------------|
| `color-contrast` | Text must have sufficient contrast (4.5:1 normal, 3:1 large) | 1.4.3 |
| `image-alt` | Images must have descriptive alt attributes | 1.1.1 |
| `label` | Form inputs must have associated labels | 3.3.2 |
| `button-name` | Buttons must have accessible names | 4.1.2 |
| `heading-order` | Headings must follow proper hierarchy (h1→h2→h3) | 1.3.1 |
| `landmark-one-main` | Page must have exactly one main landmark | 1.3.1 |
| `aria-hidden-focus` | Focusable elements must not be hidden | 4.1.2 |

### WCAG 2.2 What's New

WCAG 2.2 adds these new success criteria:

- **Focus Not Obscured (Minimum)** - Focused elements must be at least partially visible
- **Focus Not Obscured (Enhanced)** - Focused elements must be fully visible
- **Dragging Movements** - Provide alternatives to dragging interactions
- **Target Size (Minimum)** - Interactive elements must be at least 24×24px
- **Consistent Help** - Help mechanisms must appear consistently
- **Redundant Entry** - Avoid asking for same information multiple times
- **Accessible Authentication (Minimum)** - No cognitive function tests for login

### Best Practices

1. **Test Early and Often** - Run accessibility audits during development
2. **Prioritize by Impact** - Fix critical issues first, then serious, moderate, minor
3. **Test Different States** - Default, hover, focus, error, loading, modal states
4. **Combine with Manual Testing** - Automated tools catch ~30-40% of issues; manual testing required
5. **Document Known Issues** - Track exceptions and workarounds in issue tracker
6. **Include in CI/CD** - Block deployments on critical violations

**Full documentation**: See [examples/accessibility_test.js](examples/accessibility_test.js) for comprehensive examples

---

## 🎥 Video & Trace Reports

Automatic capture of test execution details for debugging failed tests.

### What's Captured
- **Videos**: `reports/videos/` - Only recorded on failures
- **Traces**: `reports/trace/` - Only captured on failures
- **Screenshots**: `reports/screenshots/` - Always captured

### View Traces

```bash
# Online viewer
# Upload to https://trace.playwright.dev

# Local viewer
pnpm exec playwright show-trace reports/trace/<trace-file>.zip
```

### Configuration

In [codecept.conf.js](codecept.conf.js):
```javascript
video: 'retain-on-failure',  // Options: 'off', 'on', 'retain-on-failure'
trace: 'retain-on-failure',  // Options: true, false, 'retain-on-failure', 'on-first-retry'
```

---

## 🔄 Migration & Updates

This project was recently updated to the latest versions (February 2026). 

### Running the Migration Script
To update dependencies in the future:
```bash
chmod +x migrate-to-latest.sh
./migrate-to-latest.sh
```

### Important Files
- `MIGRATION-CHECKLIST.md` - Comprehensive checklist for breaking changes and verification steps
- `migrate-to-latest.sh` - Automated script for updating dependencies
- `package.json.backup` - Backup of dependencies before migration

---

## 📊 Allure Reports

Generate comprehensive HTML reports with screenshots, videos, and test metadata.

```bash
# Generate and open Allure report
pnpm exec allure serve reports

# Generate report without opening browser
pnpm exec allure generate reports -o allure-report --clean
```

### What's Included in Reports
- ✅ Test execution timeline
- ✅ Pass/fail statistics with trends
- ✅ Screenshots and videos
- ✅ Visual regression diffs
- ✅ AI healing events and statistics
- ✅ Accessibility violations
- ✅ Browser logs and network activity

---

## 🪝 Git Hooks (Husky)

Automated code quality checks before commits using Husky 9.x.

### Pre-commit Hook
Automatically runs before each commit to:
- ✅ Lint all staged `.js` files with ESLint
- ✅ Ensure zero linting warnings (`--max-warnings=0`)
- ✅ Block commits if linting fails

### How It Works
```bash
git add .
git commit -m "Your message"
# → Husky intercepts commit
# → Runs .husky/pre-commit script
# → lint-staged checks only staged files
# → ESLint validates code
# → Commit proceeds only if all checks pass
```

### Manual Testing
```bash
git add .
.husky/pre-commit
```

### Configuration Files
- `package.json` → `"prepare": "husky"` initializes hooks
- `package.json` → `"lint-staged"` config for what to check
- `.husky/pre-commit` → Pre-commit hook script

---

## 🛠️ Useful Commands

### Testing Commands

```bash
# Run specific feature file
pnpm exec codeceptjs run --features features/gmailLogin.feature

# Run tests with specific tag
pnpm exec codeceptjs run --grep "@smoke"

# Run in debug mode
pnpm exec codeceptjs run --debug

# Run in verbose mode
pnpm exec codeceptjs run --verbose

# Generate step definition skeleton
pnpm exec codeceptjs gherkin:snippets

# Dry run (list tests without executing)
pnpm exec codeceptjs dry-run
```

### Playwright Tools

```bash
# Launch Playwright codegen (record interactions)
pnpm playwright codegen

# Inspect selectors
pnpm playwright codegen --target javascript

# Show trace viewer
pnpm exec playwright show-trace reports/trace/<file>.zip
```

### Linting

```bash
# Check for linting issues
pnpm lint

# Auto-fix linting issues
npx eslint . --fix
```

### Test Suites by Category

```bash
# AI Self-Healing Tests
pnpm test:ai-healing                 # All AI healing tests
pnpm test:ai-healing:headless        # Headless mode
pnpm test:ai-healing:smoke           # Quick smoke tests
pnpm test:ai-healing:openai          # OpenAI-specific tests
pnpm test:self-healing               # Self-healing tagged
pnpm test:resilient                  # Resilient tagged
pnpm test:ai-all                     # All AI tests
pnpm healing:clear-cache             # Clear healing cache

# Visual Regression Tests
pnpm test:visual                     # All visual tests
pnpm test:visual:update              # Update baselines
pnpm test:visual:smoke               # Quick visual smoke tests
pnpm test:visual:critical            # Critical path tests
pnpm test:visual:mobile              # Mobile/responsive tests

# Accessibility Tests
pnpm test:a11y                       # All accessibility tests
pnpm test:a11y:headless              # Headless a11y tests

# Combined Testing
pnpm test:combined                   # Visual + Accessibility
pnpm test:combined:headless          # Combined headless

# Environment-specific
pnpm test:prod:tag @smoke            # Production environment
pnpm test:staging:tag @regression    # Staging environment
pnpm test:headless:tag @critical     # Headless mode
```

---

---

## 🏗️ Project Structure

```
codecept-playwright-ui-project/
├── codecept.conf.js              # Main CodeceptJS configuration
├── package.json                  # Dependencies and npm scripts
├── .husky/                       # Git hooks (pre-commit linting)
├── features/                     # Gherkin feature files (BDD scenarios)
│   ├── basic.feature
│   ├── gmailLogin.feature
│   └── ai_visual_a11y.feature    # AI healing, visual, a11y tests
├── step_definitions/             # Step implementation files
│   ├── firstSteps.steps.js
│   ├── gmailLogin.steps.js
│   ├── secondSteps.steps.js
│   └── aiHealing.steps.js        # AI healing step definitions
├── pages/                        # Page Object Models
│   ├── gmailLoginPage.page.js
│   ├── pageFile1.page.js
│   └── pageFile2.page.js
├── helpers/                      # Custom CodeceptJS helpers
│   ├── AIHealingHelper.js        # 🤖 AI self-healing (OpenAI GPT-4)
│   ├── AccessibilityHelper.js    # ♿ WCAG 2.2 AA testing
│   ├── VisualRegressionHelper.js # 📸 Visual regression testing
│   └── actorCapabilities.js      # Custom I.* methods
├── hooks/                        # Before/After suite hooks
│   └── beforeAfterSuite.js
├── configs/                      # Environment configurations
│   ├── environmentFile.js
│   ├── pageURLs/
│   │   ├── prod_pageURLs.js
│   │   └── staging_pageURLs.js
│   └── testData/
│       ├── prod_testData.js
│       └── staging_testData.js
├── utilities/                    # Helper utility functions
│   ├── pageAggregator.js
│   └── stepDefinitionAggregator.js
├── reports/                      # Test execution reports
│   ├── videos/                   # Video recordings (on failure)
│   ├── trace/                    # Playwright traces (on failure)
│   └── screenshots/              # Test screenshots
├── __snapshots__/                # Visual regression baselines
│   ├── chromium/
│   ├── firefox/
│   └── webkit/
├── docs/                         # 📚 Documentation
│   ├── quick-start/              # Quick reference guides
│   │   ├── AI-HEALING-QUICK-REF.md
│   │   └── VISUAL-TESTING-QUICK-REF.md
│   └── guides/                   # Comprehensive guides
│       ├── AI-HEALING-TESTING.md
│       ├── VISUAL-REGRESSION-TESTING.md
│       └── ACCESSIBILITY-TESTING.md
└── README.md                     # This file

```

### Key Files & Directories

**Configuration:**
- `codecept.conf.js` - Main framework configuration (helpers, plugins, browser settings)
- `eslint.config.mjs` - ESLint linting rules
- `jsconfig.json` - JavaScript project configuration

**Feature Files:**
- BDD scenarios written in Gherkin syntax
- Tagged for selective test execution (@smoke, @regression, @ai-healing, etc.)
- Located in `features/` directory

**Helpers:**
- `AIHealingHelper.js` - Intelligent selector healing with OpenAI GPT-4
- `AccessibilityHelper.js` - WCAG 2.2 AA compliance testing with axe-playwright
- `VisualRegressionHelper.js` - Screenshot comparison testing
- `actorCapabilities.js` - Exposes helper methods as `I.*` methods

**Documentation:**
- Quick reference guides in `docs/quick-start/`
- Comprehensive guides in `docs/guides/`
- README.md for project overview

---

## 🔄 Migration & Updates

This project was recently updated to the latest versions (February 2026).

### Running Future Migrations

```bash
# Make migration script executable
chmod +x migrate-to-latest.sh

# Run migration
./migrate-to-latest.sh
```

### Important Notes
- Backup created at `package.json.backup` before migration
- Review `MIGRATION-CHECKLIST.md` for breaking changes
- Test thoroughly after updates

### Rollback if Needed

```bash
mv package.json.backup package.json
pnpm install
```

---

## 🐛 Troubleshooting

### Tests Failing After Update?
1. Review breaking changes in dependency changelogs
2. Check for deprecated locator strategies (use `getBy*` methods)
3. Verify video/trace settings aren't causing issues
4. Run `pnpm lint` to check for code issues
5. Clear node_modules and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

### OpenAI API Errors?
```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Test API connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check usage/quota
# Visit https://platform.openai.com/usage
```

### Visual Regression Tests Failing?
```bash
# Update baselines after approved UI changes
pnpm test:visual:update

# Clear old snapshots
rm -rf __snapshots__/

# Re-run tests to generate new baselines
pnpm test:visual
```

### AI Healing Not Working?
```bash
# Enable logging
await I.enableAISelfHealing({ logHealing: true });

# Check if helper is loaded
const helper = this.helpers['AIHealingHelper'];
console.log('Helper loaded:', !!helper);

# Clear cache if stale
pnpm healing:clear-cache
```

### Linting Errors?
```bash
# Check specific file
npx eslint path/to/file.js

# Auto-fix issues
npx eslint . --fix

# Check ESLint configuration
cat eslint.config.mjs
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
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
      
      - name: Download AI healing cache
        run: gh run download --name healing-cache || true
      
      - name: Run tests
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          pnpm test:headless:tag @smoke
          pnpm test:visual:headless
          pnpm test:ai-healing:headless
      
      - name: Upload healing cache
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: healing-cache
          path: .ai-healing-cache.json
      
      - name: Upload Allure results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: allure-results
          path: reports/
      
      - name: Publish Allure report
        if: always()
        uses: simple-elf/allure-report-action@master
        with:
          allure_results: reports
```

### Environment Variables for CI/CD

```bash
# Required
OPENAI_API_KEY="sk-..."          # For AI healing tests

# Optional
HEADLESS=true                    # Force headless mode
ENVIRONMENT=staging              # Target environment
```

---

## 📚 Additional Resources

### Framework Documentation
- [CodeceptJS Documentation](https://codecept.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Cucumber/Gherkin BDD](https://cucumber.io/docs/gherkin/)

### Testing Resources
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Playwright Trace Viewer](https://trace.playwright.dev/)

### Project-Specific Guides
- [AI Healing Testing Guide](docs/guides/AI-HEALING-TESTING.md)
- [Visual Regression Testing Guide](docs/guides/VISUAL-REGRESSION-TESTING.md)
- [Accessibility Testing Guide](docs/guides/ACCESSIBILITY-TESTING.md)
- [AI Healing Quick Reference](docs/quick-start/AI-HEALING-QUICK-REF.md)
- [Visual Testing Quick Reference](docs/quick-start/VISUAL-TESTING-QUICK-REF.md)

---

## 📄 License

[Your License Here]

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Note**: All commits must pass linting checks (enforced by Husky pre-commit hook)

---

## 🙏 Acknowledgments

Built with:
- [CodeceptJS](https://codecept.io/) - Modern end-to-end testing framework
- [Playwright](https://playwright.dev/) - Browser automation library
- [OpenAI GPT-4](https://openai.com/) - AI-powered test healing
- [Allure](https://docs.qameta.io/allure/) - Test reporting framework
- [Cucumber/Gherkin](https://cucumber.io/) - BDD scenario syntax

---

**🚀 Ready to run intelligent, self-healing tests? Get started with [Quick Start](#-quick-start) above!**
