const { I } = inject();
const { testData, pageURLs } = require('../configs/environmentFile');


module.exports = {

  async loginToGmail (userRole) {

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

  }
}