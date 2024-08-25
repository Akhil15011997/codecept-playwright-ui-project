const { I } = inject();

module.exports = {

  async clickSearchButton () {
    await I.pressKey('Enter');
    await I.wait(5);
  },
}