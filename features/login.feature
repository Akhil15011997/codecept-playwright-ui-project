@login @runAll
Feature: Shopify Demo - User Login
  As a customer
  The user wants to log in to the Shopify demo store
  So that they can access their account and shop

  Background:
    Given the user is on the Shopify demo homepage

  @smoke @positive
  Scenario: Successful login with valid credentials
    When the user clicks on the account icon
    And the user enters email "anewTestUser@yopmail.com"
    And the user enters password "Password@1"
    And the user clicks the login button
    Then the user should be successfully logged in
    And the user should see their account page

  @negative
  Scenario: Login fails with invalid email
    When the user clicks on the account icon
    And the user enters email "invalid@email.com"
    And the user enters password "Password@1"
    And the user clicks the login button
    Then the user should see an error message

  @negative
  Scenario: Login fails with invalid password
    When the user clicks on the account icon
    And the user enters email "anewTestUser@yopmail.com"
    And the user enters password "WrongPassword"
    And the user clicks the login button
    Then the user should see an error message

  @negative
  Scenario: Login fails with empty credentials
    When the user clicks on the account icon
    And the user clicks the login button
    Then the user should see validation errors
