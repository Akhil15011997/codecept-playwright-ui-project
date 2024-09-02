const { pageFile2 } = inject();

When('I have my final step here in the second file', async () => {
  pageFile2.clickSearchButton();
});