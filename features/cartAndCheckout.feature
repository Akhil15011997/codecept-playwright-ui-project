@cart @checkout @runAll
Feature: Shopify Demo - Shopping Cart and Checkout
  As a customer
  The user wants to add products to cart and complete checkout
  So that they can purchase items from the store

  Background:
    Given the user is on the Shopify demo homepage

  @smoke @positive
  Scenario: Add a single product to cart
    When the user navigates to a product page
    And the user adds the product to cart
    Then the user should see the cart with 1 item
    And the product should be displayed in the cart

  @positive
  Scenario: Add multiple products to cart
    When the user navigates to a product page
    And the user adds the product to cart
    And the user continues shopping
    And the user navigates to another product page
    And the user adds the product to cart
    Then the user should see the cart with 2 items

  @positive
  Scenario: Update product quantity in cart
    When the user navigates to a product page
    And the user adds the product to cart
    And the user views the cart
    And the user updates the quantity to 3
    Then the cart should show quantity of 3
    And the cart total should be updated

  @positive
  Scenario: Remove product from cart
    When the user navigates to a product page
    And the user adds the product to cart
    And the user views the cart
    And the user removes the product from cart
    Then the cart should be empty

  @smoke @checkout @positive
  Scenario: Proceed to checkout from cart
    When the user navigates to a product page
    And the user adds the product to cart
    And the user views the cart
    And the user proceeds to checkout
    Then the user should be on the checkout page
    And the user should see checkout form

  @checkout @positive
  Scenario: Complete checkout with valid information
    Given the user has added a product to cart
    When the user proceeds to checkout
    And the user enters shipping information
    And the user enters payment information
    And the user completes the order
    Then the user should see order confirmation
    And the user should receive an order number

  @negative
  Scenario: Cannot checkout with empty cart
    When the user views the cart
    Then the checkout button should be disabled
