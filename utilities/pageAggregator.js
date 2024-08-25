const fs = require('fs');
const path = require('path');

function getPages (dir) {
  const pages = {};
  fs.readdirSync(dir)
    .filter(file => file.endsWith('.page.js'))
    .forEach(file => {
      const pageName = path.basename(file, '.page.js');
      pages[pageName] = path.join(dir, file);
    });
  return pages;
}

// Update the path here to reflect your actual directory
const pagesDirectory = path.join(__dirname, '../pages');

module.exports = getPages(pagesDirectory);
