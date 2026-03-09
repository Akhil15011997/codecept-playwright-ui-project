@accessibility @a11y @runAll
Feature: Accessibility Testing - Visual and A11y Compliance
  As a QA engineer
  The application should meet WCAG 2.1 AA accessibility standards
  So that all users including those with disabilities can use the platform

  Background:
    Given the user is on the Shopify demo homepage

  @smoke @wcag @positive
  Scenario: Homepage meets WCAG 2.1 AA accessibility standards
    Then the page should have no accessibility violations
    And the page should pass WCAG AA compliance checks

  @wcag @positive
  Scenario: Login page is accessible
    When the user clicks on the account icon
    Then the page should have no accessibility violations
    And the login form should be accessible
    And form labels should be properly associated with inputs

  @wcag @positive
  Scenario: Product page meets accessibility standards
    When the user navigates to a product page
    Then the page should have no accessibility violations
    And images should have proper alt text
    And the add to cart button should be accessible

  @wcag @positive
  Scenario: Cart page is accessible for screen readers
    When the user navigates to a product page
    And the user adds the product to cart
    And the user views the cart
    Then the cart page should pass WCAG a11y checks
    And the cart should have proper ARIA labels
    And the checkout button should be accessible

  @wcag @positive
  Scenario: Checkout form meets accessibility standards
    Given the user has added a product to cart
    When the user proceeds to checkout
    Then the checkout page should have no accessibility violations
    And form fields should have proper labels
    And error messages should be accessible

  @wcag @critical
  Scenario: Color contrast meets WCAG AA requirements
    Then the page should have sufficient color contrast
    And text should be readable for visually impaired users

  @wcag @critical
  Scenario: Keyboard navigation is fully functional
    Then all interactive elements should be keyboard accessible
    And focus indicators should be visible

  @wcag @positive
  Scenario: Navigation menu meets accessibility standards
    Then the navigation menu should have no violations
    And navigation links should have descriptive text
    And menu should be keyboard navigable

  @a11y @positive
  Scenario: Search functionality is accessible
    When the user focuses on the search field
    Then the search input should have proper ARIA attributes
    And search suggestions should be accessible

  @wcag @critical
  Scenario: Form validation errors are accessible
    When the user clicks on the account icon
    And the user clicks the login button
    Then validation errors should be announced to screen readers
    And error messages should be associated with form fields

  @a11y @performance
  Scenario: Multiple pages maintain accessibility standards
    When the user navigates through multiple pages
    Then each page should maintain WCAG AA compliance
    And accessibility should not degrade across navigation

  @wcag @critical @images
  Scenario: All images have appropriate alt text
    Then all images should have descriptive alt attributes
    And decorative images should have empty alt attributes
    And informative images should convey their purpose

  @wcag @positive @headings
  Scenario: Page heading structure is semantic and logical
    Then the page should have a proper heading hierarchy
    And headings should not skip levels
    And the main heading should be h1

  @a11y @landmarks
  Scenario: Page uses semantic HTML landmarks
    Then the page should have proper landmark regions
    And navigation should be in a nav element
    And main content should be in a main element
    And footer should use a footer element

  @wcag @links
  Scenario: All links have descriptive text
    Then all links should have meaningful link text
    And links should not use "click here" or "read more" alone
    And link purpose should be clear from context
