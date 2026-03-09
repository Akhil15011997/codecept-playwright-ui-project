
  # ========================================
  # AI-POWERED SELF-HEALING TEST SCENARIOS
  # ========================================

  @ai-healing @self-healing @resilient
  Feature: AI-Powered Self-Healing Test Automation
    # As a QA engineer
    # I want tests to automatically heal broken locators using AI
    # So that UI changes don't break my test suite

  @ai-healing @smoke @critical
  Scenario: AI heals broken login button selector
    Given AI self-healing is enabled
    And the user is on the login page
    When the login button CSS class changes
    And the user attempts to click the broken selector ".old-login-btn"
    Then AI should analyze the page and suggest "role=button[name='Login']"
    And the test should automatically retry with healed selector
    And the user should successfully log in

  @ai-healing @openai @intelligent
  Scenario: OpenAI GPT-4 heals complex form selectors
    Given AI self-healing with OpenAI is enabled
    And the user is on the checkout page
    When the email input selector "#customer_email" becomes invalid
    And the user attempts to fill email with broken selector
    Then OpenAI should analyze the accessibility tree
    And AI should suggest semantic alternative "input[type='email'][name*='email']"
    And the healed selector should be cached for future tests
    And the form should be filled successfully

  @ai-healing @accessibility-tree @semantic
  Scenario: AI uses accessibility tree to heal button locator
    Given AI self-healing is enabled with accessibility analysis
    And the user navigates to the product page
    When the add to cart button changes from "button.add-cart" to "button.product-add"
    And the user attempts to click with outdated selector
    Then AI should query the accessibility tree for role=button
    And AI should find button with accessible name "Add to cart"
    And the test should heal to "role=button[name='Add to cart']"
    And the product should be added to cart successfully

  @ai-healing @multi-retry @resilient
  Scenario: AI healing with multiple retry attempts
    Given AI self-healing is enabled with max 3 retries
    And the user is on a dynamic page
    When a critical selector fails
    Then AI should attempt healing with OpenAI first
    And if OpenAI fails AI should try accessibility tree analysis
    And if still failing AI should try semantic pattern matching
    And the best working selector should be returned
    And healing attempt should be logged for debugging

  @ai-healing @cache @performance
  Scenario: Healed selectors are cached for future runs
    Given AI self-healing with cache is enabled
    And the user runs a test that heals selector "button.old" to "button.new"
    When the same test runs again in future
    Then AI should use cached healed selector immediately
    And no API calls to OpenAI should be made
    And test performance should be optimal
    And cache should persist across test sessions

  @ai-healing @real-time @dynamic
  Scenario: Real-time healing during test execution
    Given AI self-healing monitor is active
    And the user is running login flow test
    When the password input selector "#pass" suddenly fails
    Then AI healing should trigger automatically
    And DOM should be analyzed in real-time
    And GPT-4 should receive current page context
    And healed selector should be used within 2 seconds
    And test should continue without manual intervention
    And failure should be prevented

  @ai-healing @semantic-matching @text-based
  Scenario: AI heals using semantic text matching
    Given AI self-healing is enabled
    And the user is on the checkout page
    When the submit button class changes
    And selector "button.checkout-submit" fails
    Then AI should analyze button text content
    And AI should suggest text-based selector 'button:has-text("Complete Order")'
    And the healed selector should work reliably
    And order should be submitted successfully

  @ai-healing @data-attributes @robust
  Scenario: AI suggests data-testid as robust alternative
    Given AI self-healing with smart suggestions is enabled
    And the user encounters a flaky CSS selector
    When ".dynamic-class-name" fails repeatedly
    Then OpenAI should analyze element structure
    And AI should identify stable data-testid attribute
    And AI should suggest "[data-testid='product-card']"
    And the robust selector should prevent future failures

  @ai-healing @cross-page @comprehensive
  Scenario: AI healing works across multiple pages
    Given AI self-healing is enabled for entire test suite
    When the user navigates from login to cart to checkout
    And multiple selectors fail due to UI redesign
    Then AI should heal login email selector
    And AI should heal cart quantity selector
    And AI should heal checkout button selector
    And all healed selectors should be cached
    And complete user journey should pass

  @ai-healing @fallback @graceful
  Scenario: Graceful degradation when OpenAI unavailable
    Given AI self-healing is enabled
    But OpenAI API is unavailable or rate-limited
    When a selector fails during test execution
    Then AI should fallback to accessibility tree analysis
    And if that fails AI should try semantic pattern matching
    And warning should be logged about degraded healing
    And test should still attempt to heal without OpenAI
    And basic healing should work without external API

  @ai-healing @report @analytics
  Scenario: AI healing generates detailed healing report
    Given AI self-healing with logging is enabled
    When tests complete with healed selectors
    Then healing report should list all failed selectors
    And report should show healed alternatives
    And report should include AI confidence scores
    And report should show healing method used (OpenAI/Accessibility/Semantic)
    And report should be attached to Allure results
    And developers should be notified of UI changes requiring attention

  @ai-healing @proactive @maintenance
  Scenario: Proactive healing suggestions before failure
    Given AI healing is in proactive mode
    When the user runs regression suite
    Then AI should analyze all selectors in page objects
    And AI should identify potentially fragile selectors
    And AI should suggest more robust alternatives
    And suggestions should be exported to JSON report
    And team can proactively update selectors

  @ai-healing @combined @visual-healing
  Scenario: Combined AI healing with visual regression
    Given AI self-healing and visual testing are both enabled
    When UI changes affect both selectors and appearance
    Then AI should heal broken locators first
    And visual test should run with healed selectors
    And visual diff should capture intentional UI changes
    And test should distinguish between locator issues and visual changes
    And comprehensive report should cover both aspects

