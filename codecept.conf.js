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
      // Video & Trace configuration - only capture on first retry for efficiency
      video: 'retain-on-failure', // Options: 'off', 'on', 'retain-on-failure', 'on-first-retry'
      trace: 'retain-on-failure', // Options: true, false, 'on-first-retry', 'retain-on-failure'
      // Additional Playwright configuration for better debugging
      screenshot: 'on', // Options: 'off', 'on', 'only-on-failure'
      // Chromium-specific settings for better performance
      chromium: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    },
    AccessibilityHelper: {
      require: './helpers/AccessibilityHelper.js',
      // Accessibility testing configuration
      standard: 'wcag2aa', // WCAG standard level
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'], // Tags to test
      detailedReport: true, // Show detailed console output
      attachToAllure: true, // Attach violations to Allure report
    },
    VisualRegressionHelper: {
      require: './helpers/VisualRegressionHelper.js',
      // Visual regression testing configuration
      snapshotDir: './__snapshots__', // Directory for storing baseline snapshots
      updateSnapshots: false, // Set to true to update all baselines (or use --update-snapshots flag)
      threshold: 0.2, // Pixel difference threshold (0-1) - 0.2 = 20% tolerance
      maxDiffPixelRatio: 0.01, // Maximum acceptable diff pixel ratio (0-1) - 0.01 = 1%
      animations: 'disabled', // Disable animations for consistent screenshots
      fullPage: true, // Take full page screenshots by default
      timeout: 30000, // Screenshot timeout in milliseconds
      // Global selectors to mask in all screenshots (dynamic content)
      maskSelectors: [
        '.timestamp',
        '.date-updated',
        '[data-timestamp]',
        '.session-id',
      ],
      // Browser-specific configuration
      browserName: 'chromium', // Used for organizing snapshots by browser
    },
    AIHealingHelper: {
      require: './helpers/AIHealingHelper.js',
      // AI-powered self-healing configuration
      enabled: true, // Enable AI healing (can be disabled for specific runs)
      openAIApiKey: process.env.OPENAI_API_KEY, // OpenAI API key from environment
      model: 'gpt-4o', // OpenAI model (gpt-4o, gpt-4-turbo, gpt-3.5-turbo)
      maxRetries: 3, // Maximum healing attempts per selector
      healingCacheFile: './.ai-healing-cache.json', // Cache file for healed selectors
      enableAccessibilityAnalysis: true, // Use accessibility tree for healing
      temperature: 0.3, // OpenAI temperature (0-1, lower = more deterministic)
      timeout: 10000, // Healing timeout per attempt (ms)
      logHealing: true, // Log healing attempts to console
      // Advanced options
      preferSemanticSelectors: true, // Prefer role/text over CSS
      cacheEnabled: true, // Enable persistent caching
      attachToAllure: true, // Attach healing reports to Allure
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
  name: 'codecept-playwright-ui-project'
}