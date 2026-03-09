const { I } = inject();
const config = require("../configs/environmentFile");

class LoginPage {
  constructor () {
    // Locators
    this.locators = {
      accountIcon: 'a[href="/account/login"]',
      accountIconAlt: 'a.header__icon--account',
      emailInput: '#CustomerEmail',
      passwordInput: '#CustomerPassword',
      loginButton: 'button[type="submit"]',
      loginSubmitButton: 'button:has-text("Sign in")',
      errorMessage: '.errors',
      errorList: '.errors ul li',
      fieldError: '.field--error',
      accountGreeting: '.account-greeting',
      accountPage: 'h1:has-text("My Account")',
      logoutLink: 'a[href="/account/logout"]',
    };

    // URLs
    this.urls = {
      homepage: config.pageURLs.SHOPIFY_DEMO_URL,
      loginPage: config.pageURLs.SHOPIFY_DEMO_URL + 'account/login',
    };
  }

  /**
   * Navigate to the Shopify demo homepage
   */
  async goToHomepage () {
    await I.amOnPage(this.urls.homepage);
    await I.waitForElement('body', 10);
  }

  /**
   * Navigate directly to the login page
   */
  async goToLoginPage () {
    await I.amOnPage(this.urls.loginPage);
    await I.waitForElement(this.locators.emailInput, 10);
  }

  /**
   * Click on the account icon to access login
   */
  async clickAccountIcon () {
    // Navigate directly to login page for Shopify demo
    await this.goToLoginPage();
  }

  /**
   * Enter email in the login form
   * @param {string} email - User email address
   */
  async enterEmail (email) {
    await I.waitForElement(this.locators.emailInput, 5);
    await I.fillField(this.locators.emailInput, email);
  }

  /**
   * Enter password in the login form
   * @param {string} password - User password
   */
  async enterPassword (password) {
    await I.waitForElement(this.locators.passwordInput, 5);
    await I.fillField(this.locators.passwordInput, password);
  }

  /**
   * Click the login/sign in button
   */
  async clickLoginButton () {
    try {
      await I.click(this.locators.loginButton);
    } catch {
      await I.click(this.locators.loginSubmitButton);
    }
    await I.wait(2); // Wait for navigation/response
  }

  /**
   * Perform complete login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async login (email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Verify successful login by checking for account elements
   */
  async verifyLoginSuccess () {
    try {
      await I.waitForElement(this.locators.accountPage, 10);
      await I.see('My Account');
    } catch {
      // Alternative verification - check for logout link
      await I.waitForElement(this.locators.logoutLink, 10);
    }
  }

  /**
   * Check if logged in by looking for logout link
   */
  async verifyAccountPage () {
    await I.waitForElement(this.locators.logoutLink, 10);
    await I.seeElement(this.locators.logoutLink);
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage () {
    await I.waitForElement(this.locators.errorMessage, 5);
    await I.seeElement(this.locators.errorMessage);
  }

  /**
   * Verify validation errors for empty fields
   */
  async verifyValidationErrors () {
    // Check if error styling is present or error messages shown
    const errorPresent = await I.grabNumberOfVisibleElements(this.locators.errorMessage);
    const fieldErrorPresent = await I.grabNumberOfVisibleElements(this.locators.fieldError);

    if (errorPresent === 0 && fieldErrorPresent === 0) {
      throw new Error('Expected validation errors but none found');
    }
  }

  /**
   * Logout from the account
   */
  async logout () {
    await I.waitForElement(this.locators.logoutLink, 5);
    await I.click(this.locators.logoutLink);
    await I.wait(2);
  }
}

module.exports = new LoginPage();
module.exports.LoginPage = LoginPage;
