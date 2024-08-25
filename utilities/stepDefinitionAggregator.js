const fs = require('fs');
const path = require('path');

function getStepDefinitions (dir) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.steps.js'))
    .map(file => path.join(dir, file));
}

const stepsDirectory = path.join(__dirname, '../step_definitions');

module.exports = getStepDefinitions(stepsDirectory);
