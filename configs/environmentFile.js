const environment = process.env.ENVIRONMENT || 'staging'; // Default to 'staging' if ENVIRONMENT is not set

let pageURLs;
let testData;

switch (environment) {
case 'prod':
  pageURLs = require('./pageURLs/prod_pageURLs');
  testData = require('./testData/prod_testData');
  break;
case 'staging':
default:
  pageURLs = require('./pageURLs/staging_pageURLs');
  testData = require('./testData/staging_testData');
  break;
}

module.exports = { pageURLs, testData };
