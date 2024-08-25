const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  bootstrap: async () => {
    console.log('Cleaning up reports (Only the latest 3 will be available for viewing if exists)');;

    const reportsDir = path.join(__dirname, '../reports');

    // Get a list of all files in the reports directory
    fs.readdir(reportsDir, (err, files) => {
      if (err) {
        return console.error(`Unable to scan directory: ${err}`);
      }

      // Sort files by their creation time (newest first)
      const sortedFiles = files
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(reportsDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)
        .map(file => file.name);

      // Keep only the latest 3 files, delete the rest
      const filesToDelete = sortedFiles.slice(3);

      filesToDelete.forEach(file => {
        const filePath = path.join(reportsDir, file);
        fs.unlink(filePath, err => {
          if (err) {
            console.error(`Failed to delete file: ${filePath} - ${err}`);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      });
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
