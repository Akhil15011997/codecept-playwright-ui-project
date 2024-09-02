const { pageFile1 } = inject();

Given('I have a defined step', async () => {
  await pageFile1.openWebPage();
});

When('I have a super step', async () => {
  await pageFile1.superStep();
});
