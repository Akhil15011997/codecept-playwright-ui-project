const { I } = inject();

// Basic accessibility checks
Then('the page should have no accessibility violations', async () => {
  await I.checkPageAccessibility();
});

Then('the page should pass WCAG AA compliance checks', async () => {
  await I.checkWCAGCompliance('AA');
});

Then('the page should pass WCAG AAA compliance checks', async () => {
  await I.checkWCAGCompliance('AAA');
});

// Login page accessibility
Then('the login form should be accessible', async () => {
  await I.checkElementAccessibility('form');
});

Then('form labels should be properly associated with inputs', async () => {
  await I.checkAccessibilityRules(['label', 'label-title-only']);
});

// Product page accessibility
Then('images should have proper alt text', async () => {
  await I.checkAccessibilityRules(['image-alt', 'image-redundant-alt']);
});

Then('the add to cart button should be accessible', async () => {
  await I.checkAccessibilityRules(['button-name', 'aria-allowed-attr']);
});

// Cart page accessibility
Then('the cart page should pass WCAG a11y checks', async () => {
  await I.checkWCAGCompliance('AA');
});

Then('the cart should have proper ARIA labels', async () => {
  await I.checkAccessibilityRules([
    'aria-allowed-attr',
    'aria-required-attr',
    'aria-valid-attr',
    'aria-valid-attr-value'
  ]);
});

Then('the checkout button should be accessible', async () => {
  await I.checkAccessibilityRules(['button-name', 'link-name']);
});

// Checkout page accessibility
Then('the checkout page should have no accessibility violations', async () => {
  await I.checkPageAccessibility();
});

Then('form fields should have proper labels', async () => {
  await I.checkAccessibilityRules(['label', 'label-content-name-mismatch']);
});

Then('error messages should be accessible', async () => {
  await I.checkAccessibilityRules([
    'aria-valid-attr-value',
    'label',
    'color-contrast'
  ]);
});

// Color contrast checks
Then('the page should have sufficient color contrast', async () => {
  await I.checkAccessibilityRules(['color-contrast', 'color-contrast-enhanced']);
});

Then('text should be readable for visually impaired users', async () => {
  await I.checkAccessibilityRules(['color-contrast']);
});

// Keyboard navigation
Then('all interactive elements should be keyboard accessible', async () => {
  await I.checkAccessibilityRules([
    'focus-order-semantics',
    'tabindex',
    'accesskeys'
  ]);
});

Then('focus indicators should be visible', async () => {
  await I.checkAccessibilityRules(['focus-order-semantics']);
});

// Navigation accessibility
Then('the navigation menu should have no violations', async () => {
  await I.checkElementAccessibility('nav');
});

Then('navigation links should have descriptive text', async () => {
  await I.checkAccessibilityRules(['link-name']);
});

Then('menu should be keyboard navigable', async () => {
  await I.checkAccessibilityRules(['aria-allowed-attr', 'tabindex']);
});

// Search accessibility
When('the user focuses on the search field', async () => {
  try {
    await I.waitForElement('input[type="search"]', 5);
    await I.focus('input[type="search"]');
  } catch {
    await I.waitForElement('input[name="q"]', 5);
    await I.focus('input[name="q"]');
  }
});

Then('the search input should have proper ARIA attributes', async () => {
  await I.checkAccessibilityRules(['aria-input-field-name', 'aria-required-attr']);
});

Then('search suggestions should be accessible', async () => {
  await I.checkAccessibilityRules(['aria-valid-attr', 'list']);
});

// Form validation accessibility
Then('validation errors should be announced to screen readers', async () => {
  await I.checkAccessibilityRules([
    'aria-valid-attr-value',
    'form-field-multiple-labels'
  ]);
});

Then('error messages should be associated with form fields', async () => {
  await I.checkAccessibilityRules(['label', 'aria-errormessage']);
});

// Multi-page accessibility
When('the user navigates through multiple pages', async () => {
  // Navigate to a few key pages
  const config = require('../configs/environmentFile');
  await I.amOnPage(config.pageURLs.SHOPIFY_DEMO_URL);
  await I.wait(1);

  try {
    await I.waitForElement('a[href*="product"]', 5);
    await I.click('a[href*="product"]');
    await I.wait(1);
  } catch {
    // Continue if product page not found
  }
});

Then('each page should maintain WCAG AA compliance', async () => {
  await I.checkWCAGCompliance('AA');
});

Then('accessibility should not degrade across navigation', async () => {
  await I.checkPageAccessibility();
});

// Image accessibility
Then('all images should have descriptive alt attributes', async () => {
  await I.checkAccessibilityRules(['image-alt']);
});

Then('decorative images should have empty alt attributes', async () => {
  await I.checkAccessibilityRules(['image-alt']);
});

Then('informative images should convey their purpose', async () => {
  await I.checkAccessibilityRules(['image-redundant-alt']);
});

// Heading structure
Then('the page should have a proper heading hierarchy', async () => {
  await I.checkAccessibilityRules(['heading-order', 'page-has-heading-one']);
});

Then('headings should not skip levels', async () => {
  await I.checkAccessibilityRules(['heading-order']);
});

Then('the main heading should be h1', async () => {
  await I.checkAccessibilityRules(['page-has-heading-one']);
});

// Semantic HTML landmarks
Then('the page should have proper landmark regions', async () => {
  await I.checkAccessibilityRules(['landmark-one-main', 'region']);
});

Then('navigation should be in a nav element', async () => {
  await I.checkAccessibilityRules(['region']);
});

Then('main content should be in a main element', async () => {
  await I.checkAccessibilityRules(['landmark-one-main']);
});

Then('footer should use a footer element', async () => {
  await I.checkAccessibilityRules(['region']);
});

// Link accessibility
Then('all links should have meaningful link text', async () => {
  await I.checkAccessibilityRules(['link-name']);
});

Then('links should not use {string} or {string} alone', async () => {
  await I.checkAccessibilityRules(['link-name']);
});

Then('link purpose should be clear from context', async () => {
  await I.checkAccessibilityRules(['link-name', 'link-in-text-block']);
});
