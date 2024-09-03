const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  bootstrap: async () => {
    console.log('Deleting the reports directory...');

    const reportsDir = path.join(__dirname, '../reports');

    // Delete the reports directory and all its contents
    fs.rm(reportsDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Failed to delete directory: ${reportsDir} - ${err}`);
      } else {
        console.log(`Deleted directory: ${reportsDir}`);
      }
    });
  },

  teardown: async () => {
    console.log('Opening the allure report, press ctrl+c to exit');
    exec('npx allure serve reports', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
      }
      console.log(`Command output: ${stdout}`);
    });
  }
};
