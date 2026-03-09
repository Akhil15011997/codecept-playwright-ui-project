@visual @regression
Feature: AI-Powered Visual Regression and Accessibility Testing
  As a QA engineer
  I want to perform visual regression testing on the Shopify demo site
  So that I can detect unintended visual changes and ensure UI consistency across deployments

  Background:
    Given the user is on the Shopify demo homepage

  @visual-login @smoke
  Scenario: Login page visual regression baseline
    Given the user navigates to the login page
    When the user enters valid email "hello@saucedemo.com"
    And the user enters valid password "saucedemo123"
    And the user clicks the login button
    Then the login should be successful
    And the login success page visual snapshot should match baseline

  @visual-cart @critical
  Scenario: Shopping cart page visual regression with dynamic element masking
    Given the user is logged in successfully
    And the user navigates to the product page
    When the user adds product to cart
    And the user navigates to cart page
    Then the cart page visual snapshot should match with masked elements

  @visual-checkout @critical
  Scenario: Checkout completion page visual regression
    Given the user is logged in successfully
    And the user has products in cart
    When the user proceeds to checkout
    And the user enters shipping information
      | firstName | lastName | address           | city        | postalCode | country       |
      | John      | Doe      | 123 Test Street   | New York    | 10001      | United States |
    And the user completes the order
    Then the checkout complete page should visually match baseline

  @visual-product @smoke
  Scenario: Product listing page visual consistency check
    Given the user is logged in successfully
    When the user navigates to the product page
    Then the product page visual snapshot should match baseline

  @visual-element @component
  Scenario: Cart item component visual regression
    Given the user is logged in successfully
    And the user has added a product to cart
    When the user views the cart
    Then the cart item element should visually match baseline

  @visual-responsive @mobile
  Scenario: Mobile viewport visual regression for login page
    Given the user sets viewport to mobile size
    And the user navigates to the login page
    When the user views the mobile login page
    Then the mobile login page visual snapshot should match baseline

  @visual-cross-browser @chrome
  Scenario: Cross-browser visual consistency - Chrome
    Given the user is on the homepage in Chrome browser
    When the user takes a visual snapshot of homepage
    Then the Chrome homepage snapshot should match baseline

  @visual-full-journey @e2e
  Scenario: Complete user journey visual regression
    Given the user starts on the homepage
    When the user logs in successfully
    And the user saves homepage visual snapshot
    And the user browses products
    And the user saves product page visual snapshot
    And the user adds items to cart
    And the user saves cart page visual snapshot
    And the user completes checkout process
    And the user saves checkout success visual snapshot
    Then all journey visual snapshots should match their baselines

  @visual-update @baseline
  Scenario: Update visual baselines after approved UI changes
    Given the user wants to update visual baselines
    When the user navigates through key pages
    And the user captures new baseline snapshots
    Then the new baselines should be saved successfully

  @visual-comparison @diff
  Scenario: Detect visual differences on login page
    Given the user has baseline snapshot for login page
    When the user navigates to the current login page
    And the user compares current page with baseline
    Then any visual differences should be reported
    And the diff percentage should be within acceptable threshold

  # Combined Visual + Accessibility Testing Scenarios

  @visual @a11y @combined
  Scenario: Login page combined visual and accessibility validation
    Given the user navigates to the login page
    When the user runs visual regression check
    And the user runs accessibility audit
    Then the page should pass both visual and accessibility tests

  @visual @a11y @combined
  Scenario: Cart page combined visual and WCAG compliance check
    Given the user is logged in with items in cart
    When the user checks cart page visual consistency
    And the user validates WCAG 2.1 AA compliance for cart
    Then the cart page should be visually consistent and accessible

  @visual @a11y @combined @critical
  Scenario: Checkout flow combined validation
    Given the user is ready to checkout
    When the user completes checkout with visual snapshots
    And the user validates accessibility at each checkout step
    Then all checkout pages should be visually consistent and accessible
    And no critical accessibility violations should exist

  @visual-smoke @quick
  Scenario Outline: Quick visual smoke test for critical pages
    Given the user navigates to "<page>" page
    When the user captures visual snapshot for "<page>"
    Then the "<page>" visual snapshot should match baseline within 2% threshold

    Examples:
      | page             |
      | login            |
      | products         |
      | cart             |
      | checkout-info    |
      | checkout-success |

  @visual-component-library
  Scenario: Component-level visual regression for cart elements
    Given the user has items in shopping cart
    When the user captures visual snapshot of cart item component
    And the user captures visual snapshot of cart summary component
    And the user captures visual snapshot of checkout button
    Then all cart components should visually match their baselines

  @visual-dynamic-content
  Scenario: Visual regression with dynamic content masking
    Given the user is viewing a page with dynamic timestamps
    When the user masks timestamp elements using ".timestamp, .date-updated"
    And the user masks order numbers using ".order-id"
    And the user captures visual snapshot with masks
    Then the masked visual snapshot should match baseline
    And dynamic elements should be excluded from comparison
