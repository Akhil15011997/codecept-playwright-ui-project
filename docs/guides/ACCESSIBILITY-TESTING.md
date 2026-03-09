# Accessibility Testing Guide

## Overview

This project includes comprehensive accessibility (a11y) testing using **axe-core** and **axe-playwright** to ensure WCAG 2.1 AA compliance across the Shopify demo application.

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

This will install:
- `axe-core` - Core accessibility rules engine
- `axe-playwright` - Playwright integration for axe-core

### 2. Configuration

The accessibility helper is configured in `codecept.conf.js`:

```javascript
AccessibilityHelper: {
  require: './helpers/AccessibilityHelper.js',
  standard: 'wcag2aa',           // WCAG standard level
  runOnly: ['wcag2a', 'wcag2aa'], // Tags to test
  detailedReport: true,           // Show detailed console output
  attachToAllure: true,           // Attach violations to Allure
}
```

## Running Accessibility Tests

### Run all accessibility tests:
```bash
pnpm test:a11y
```

### Run in headless mode:
```bash
pnpm test:a11y:headless
```

### Run specific scenarios:
```bash
# Test smoke a11y scenarios
pnpm exec codeceptjs run --grep "@smoke @accessibility"

# Test WCAG compliance
pnpm exec codeceptjs run --grep "@wcag"

# Test critical a11y issues
pnpm exec codeceptjs run --grep "@critical @accessibility"
```

## Available Custom Steps

### In Actor (I) Methods

```javascript
// Check entire page for violations
await I.checkPageAccessibility();

// Check WCAG compliance level (A, AA, AAA)
await I.checkWCAGCompliance('AA');

// Check specific element
await I.checkElementAccessibility('form');

// Check specific axe rules
await I.checkAccessibilityRules(['color-contrast', 'image-alt']);

// Get violations without throwing error
const violations = await I.getAccessibilityViolations();
```

### In Step Definitions

All Gherkin steps are available in `step_definitions/accessibility.steps.js`:

```gherkin
Then the page should have no accessibility violations
Then the page should pass WCAG AA compliance checks
Then images should have proper alt text
Then the cart page should pass WCAG a11y checks
Then form labels should be properly associated with inputs
```

## Feature File Structure

### features/accessibility.feature

Contains 16 comprehensive scenarios covering:

1. **Homepage WCAG compliance** - `@smoke @wcag`
2. **Login page accessibility** - `@wcag`
3. **Product page standards** - `@wcag`
4. **Cart page for screen readers** - `@wcag`
5. **Checkout form accessibility** - `@wcag`
6. **Color contrast** - `@critical`
7. **Keyboard navigation** - `@critical`
8. **Navigation menu** - `@wcag`
9. **Search functionality** - `@a11y`
10. **Form validation errors** - `@critical`
11. **Multi-page compliance** - `@a11y @performance`
12. **Image alt text** - `@critical @images`
13. **Heading hierarchy** - `@positive @headings`
14. **Semantic landmarks** - `@a11y @landmarks`
15. **Link text** - `@wcag @links`

## Accessibility Helper Methods

### Main Methods

#### `checkAccessibility(options, context)`
Run axe analysis and assert no violations.

```javascript
await I.checkAccessibility({
  runOnly: ['wcag2aa'],
  rules: {
    'color-contrast': { enabled: true }
  }
}, 'Login Page');
```

#### `checkPageAccessibility()`
Quick check for current page.

```javascript
await I.checkPageAccessibility();
```

#### `checkWCAGCompliance(level)`
Test specific WCAG level (A, AA, or AAA).

```javascript
await I.checkWCAGCompliance('AA');  // Tests wcag2a + wcag2aa
await I.checkWCAGCompliance('AAA'); // Tests wcag2a + wcag2aa + wcag2aaa
```

#### `checkElementAccessibility(selector, options)`
Test specific element or component.

```javascript
await I.checkElementAccessibility('#navigation', { runOnly: ['wcag2aa'] });
```

#### `checkAccessibilityRules(ruleIds)`
Test specific axe rules.

```javascript
await I.checkAccessibilityRules([
  'color-contrast',
  'image-alt',
  'button-name',
  'label'
]);
```

#### `getAccessibilityViolations(options)`
Get violations without throwing error (for reporting).

```javascript
const violations = await I.getAccessibilityViolations();
console.log(`Found ${violations.length} violations`);
```

## Common Axe Rules

### Critical Rules
- `color-contrast` - Text color contrast
- `image-alt` - Image alt attributes
- `label` - Form labels
- `button-name` - Button accessible names
- `link-name` - Link accessible names

### Important Rules
- `heading-order` - Heading hierarchy
- `landmark-one-main` - Main landmark
- `page-has-heading-one` - Single H1
- `aria-allowed-attr` - Valid ARIA attributes
- `focus-order-semantics` - Keyboard focus

### Full Rule List
See: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md

## Violation Reporting

### Console Output
When violations are found, detailed output includes:
- Violation ID and description
- Impact level (critical, serious, moderate, minor)
- WCAG criteria violated
- Help text and links
- Element selectors and HTML snippets
- Remediation guidance

### Allure Integration
Violations are automatically attached to Allure reports as JSON:
- Total violations by impact
- Detailed violation data
- Element locations
- Remediation suggestions

### Video/Trace Capture
Tests with violations trigger:
- Screenshot capture
- Video recording (if enabled)
- Playwright trace (if enabled)

## Best Practices

### 1. Test Early and Often
Run a11y tests on every page and component.

### 2. Fix Critical Issues First
Priority order: critical → serious → moderate → minor

### 3. Test User Flows
Ensure accessibility across complete user journeys.

### 4. Use Specific Rules
Test specific rules for targeted component testing.

### 5. Combine with Manual Testing
Automated testing catches ~40% of a11y issues. Manual testing is essential.

### 6. Test with Real Assistive Technology
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Browser zoom (200%+)

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Accessibility Tests
  run: pnpm test:a11y:headless

- name: Upload Allure Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: allure-report
    path: reports/
```

## Troubleshooting

### Issue: axe is not defined
**Solution**: Ensure page has loaded before running checks.

```javascript
await I.waitForElement('body', 10);
await I.checkPageAccessibility();
```

### Issue: Too many violations
**Solution**: Start with critical rules only.

```javascript
await I.checkAccessibilityRules(['color-contrast', 'image-alt']);
```

### Issue: False positives
**Solution**: Disable specific rules if needed.

```javascript
await I.checkAccessibility({
  rules: {
    'color-contrast': { enabled: false } // If legitimate issue
  }
});
```

## WCAG Guidelines Reference

### WCAG 2.1 Levels

**Level A (Minimum)**
- Basic accessibility requirements
- Most critical issues

**Level AA (Recommended)**
- Mid-range accessibility
- Industry standard for compliance
- Required by most regulations

**Level AAA (Enhanced)**
- Highest level of accessibility
- Not required but recommended for critical services

### Four Principles (POUR)

1. **Perceivable** - Information must be presentable to users
2. **Operable** - UI components must be operable
3. **Understandable** - Information and UI must be understandable
4. **Robust** - Content must be robust enough for assistive technologies

## Resources

- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [axe-playwright Documentation](https://github.com/abhinaba-ghosh/axe-playwright)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/resources/)
- [A11y Project](https://www.a11yproject.com/)

## Examples

### Test Login Form
```gherkin
Scenario: Login form is accessible
  When the user clicks on the account icon
  Then the page should have no accessibility violations
  And form labels should be properly associated with inputs
```

### Test Product Page
```gherkin
Scenario: Product page meets standards
  When the user navigates to a product page
  Then the page should have no accessibility violations
  And images should have proper alt text
  And the add to cart button should be accessible
```

### Custom Accessibility Check in Page Object
```javascript
// In page object
async verifyAccessibility() {
  await I.checkAccessibility({
    runOnly: ['wcag2aa'],
    context: this.locators.mainContent
  }, 'Product Page Main Content');
}
```

---

**Note**: Accessibility testing is an ongoing process. Regular testing and updates ensure your application remains accessible to all users.
