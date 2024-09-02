const { I } = inject();

module.exports = {

  searchButton: locate('//textarea[@title="Search"]'),

  async openWebPage () {
    await I.amOnPage("https://www.google.com");
    console.log("the page loaded");
    await I.waitForPageLoad();
  },

  async superStep () {
    await I.clickWhenClickable(this.searchButton);
    await I.fillField(this.searchButton,"I am going to type say whattttt");
    await I.clickWhenClickable('//a[contains(text(),"this locator does not exist)]"');
  }
}
