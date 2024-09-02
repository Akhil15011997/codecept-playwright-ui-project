const { pageFile2 } = inject();
const { I } = inject();
const { testData, pageURLs } = require('../configs/environmentFile');


When('I have my final step here in the second file', async () => {
  pageFile2.clickSearchButton();
});



Given('The {string} user is logged into gmail', async (userRole) => {

  await I.amOnPage(pageURLs.GMAIL_URL);
  const userCredentials = testData.users[userRole];
  if (!userCredentials) {
    throw new Error(`No credentials found for user role: ${userRole}`);
  }
  await I.fillField('identifier', userCredentials.username);
  await I.clickWhenClickable('#identifierNext');
  await I.fillField('password', userCredentials.password);
  await I.clickWhenClickable('#passwordNext');
  await I.waitForElement('div[role="main"]', 10);
});


