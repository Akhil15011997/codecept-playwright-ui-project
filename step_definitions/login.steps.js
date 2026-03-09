const { loginPage } = inject();

Given('the user is on the Shopify demo homepage', async () => {
  await loginPage.goToHomepage();
});

Given('the user is on the login page', async () => {
  await loginPage.goToLoginPage();
});

When('the user clicks on the account icon', async () => {
  await loginPage.clickAccountIcon();
});

When('the user enters email {string}', async (email) => {
  await loginPage.enterEmail(email);
});

When('the user enters password {string}', async (password) => {
  await loginPage.enterPassword(password);
});

When('the user clicks the login button', async () => {
  await loginPage.clickLoginButton();
});

When('the user logs in with email {string} and password {string}', async (email, password) => {
  await loginPage.login(email, password);
});

Then('the user should be successfully logged in', async () => {
  await loginPage.verifyLoginSuccess();
});

Then('the user should see their account page', async () => {
  await loginPage.verifyAccountPage();
});

Then('the user should see an error message', async () => {
  await loginPage.verifyErrorMessage();
});

Then('the user should see validation errors', async () => {
  await loginPage.verifyValidationErrors();
});

When('the user logs out', async () => {
  await loginPage.logout();
});
