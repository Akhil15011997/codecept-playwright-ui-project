const { I } = inject();
const { pageURLs } = require('../configs/environmentFile');

module.exports = {

  searchButton: locate('//textarea[@title="Search"]'),

  async openWebPage () {
    await I.amOnPage(pageURLs.GOOGLE_URL);
    console.log("the page loaded");
    await I.waitForPageLoad();
  },

  async superStep () {
    await I.clickWhenClickable(this.searchButton);
    await I.fillField(this.searchButton,"I am going to type say whattttt");
  }
}
