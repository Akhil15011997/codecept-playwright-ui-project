const { gmailLoginPage } = inject();

Given('The {string} user is logged into gmail', async (userRole) => {
  await gmailLoginPage.loginToGmail(userRole);
});