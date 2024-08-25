module.exports  = () => {
  return actor({
    waitForPageLoad: function () {
      this.waitForFunction(() => document.readyState === 'complete', 20);
    },
    clickWhenClickable: function (elementLocator, waitTime = 10) {
      this.waitForVisible(elementLocator, waitTime);
      this.click(elementLocator);
    },
  });
}