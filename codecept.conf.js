require('@babel/register')({
  extensions: ['.js']
});

const { bootstrap, teardown } = require('./hooks/beforeAfterSuite');
const { setHeadlessWhen } = require('@codeceptjs/configure');
const getStepDefinitions = require('./utilities/stepDefinitionAggregator');
const getPages = require('./utilities/pageAggregator');


setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  output: './reports',
  helpers: {
    Playwright: {
      browser: 'chromium',
      restart: "keep",
      keepBrowserState: true,
      keepCookies: true,
      url: 'http://localhost',
      show: true,
    }
  },
  include: {
    I: './helpers/actorCapabilities.js',
    ...getPages
  },
  mocha: {},
  bootstrap: bootstrap,
  timeout: null,
  teardown: teardown,
  gherkin: {
    features: './features/*.feature',
    steps: getStepDefinitions,
  },
  plugins: {
    tryTo: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true
    },
    retryTo: {
      enabled: true
    },
    eachElement: {
      enabled: true
    },
    pauseOnFail: {},
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
      outputDir: 'reports',
      disableScreenshotsReporting: false
    }
  },
  stepTimeout: 0,
  stepTimeoutOverride: [{
    pattern: 'wait.*',
    timeout: 0
  },
  {
    pattern: 'amOnPage',
    timeout: 0
  }
  ],
  reporters: [
    'allure'
  ],
  tests: 'features/*.feature',
  name: 'codecept-playwright-project'
}