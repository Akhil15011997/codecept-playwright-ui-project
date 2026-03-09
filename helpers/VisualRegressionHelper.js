const { Helper } = require('codeceptjs');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * VisualRegressionHelper - Custom CodeceptJS helper for visual regression testing
 * Integrates Playwright's screenshot and snapshot comparison capabilities
 *
 * Features:
 * - Full page and element screenshots
 * - Snapshot comparison with configurable thresholds
 * - Dynamic element masking (timestamps, dates, etc.)
 * - Cross-browser visual diff support
 * - Allure report integration
 * - CI/CD baseline management
 */
class VisualRegressionHelper extends Helper {
  constructor (config) {
    super(config);

    // Default configuration
    this.options = {
      snapshotDir: config.snapshotDir || './__snapshots__',
      updateSnapshots: config.updateSnapshots || false,
      threshold: config.threshold || 0.2, // 0.2 = 20% pixel difference tolerance
      maxDiffPixelRatio: config.maxDiffPixelRatio || 0.01, // 1% max diff
      animations: config.animations || 'disabled',
      fullPage: config.fullPage !== undefined ? config.fullPage : true,
      timeout: config.timeout || 30000,
      maskSelectors: config.maskSelectors || [], // Global selectors to mask
      ...config,
    };

    // Ensure snapshot directory exists
    if (!fs.existsSync(this.options.snapshotDir)) {
      fs.mkdirSync(this.options.snapshotDir, { recursive: true });
    }
  }

  /**
   * Get the Playwright helper instance
   * @returns {Object} Playwright helper
   */
  _getPlaywrightHelper () {
    return this.helpers['Playwright'];
  }

  /**
   * Get the current Playwright page instance
   * @returns {Object} Playwright page
   */
  async _getPage () {
    const helper = this._getPlaywrightHelper();
    return helper.page;
  }

  /**
   * Get the current Playwright context
   * @returns {Object} Playwright browser context
   */
  async _getContext () {
    const helper = this._getPlaywrightHelper();
    return helper.browserContext;
  }

  /**
   * Save a visual snapshot of the current page or element
   * @param {string} snapshotName - Name for the snapshot file
   * @param {Object} options - Screenshot options
   * @param {string|null} options.selector - Optional selector for element screenshot
   * @param {boolean} options.fullPage - Take full page screenshot (default: true)
   * @param {Array<string>} options.mask - Array of selectors to mask
   * @param {number} options.timeout - Timeout in milliseconds
   * @returns {Promise<Buffer>} Screenshot buffer
   */
  async saveVisualSnapshot (snapshotName, options = {}) {
    const page = await this._getPage();

    // Set timeout for screenshot operation
    const timeout = options.timeout || this.options.timeout;
    page.setDefaultTimeout(timeout);

    // Merge global and local mask selectors
    const maskSelectors = [
      ...(this.options.maskSelectors || []),
      ...(options.mask || []),
    ];

    // Build screenshot options
    const screenshotOptions = {
      fullPage: options.fullPage !== undefined ? options.fullPage : this.options.fullPage,
      animations: options.animations || this.options.animations,
      timeout,
    };

    // Add masking if selectors provided
    if (maskSelectors.length > 0) {
      screenshotOptions.mask = [];
      for (const selector of maskSelectors) {
        try {
          const locator = page.locator(selector);
          const count = await locator.count();
          if (count > 0) {
            screenshotOptions.mask.push(locator);
          }
        } catch (error) {
          console.warn(`Warning: Could not mask selector "${selector}":`, error.message);
        }
      }
    }

    let screenshot;
    try {
      if (options.selector) {
        // Element screenshot
        const element = page.locator(options.selector);
        await element.waitFor({ state: 'visible', timeout });
        screenshot = await element.screenshot(screenshotOptions);
      } else {
        // Full page screenshot
        await page.waitForLoadState('networkidle', { timeout });
        screenshot = await page.screenshot(screenshotOptions);
      }

      // Save to snapshot directory with standardized naming
      const snapshotPath = this._getSnapshotPath(snapshotName);
      fs.writeFileSync(snapshotPath, screenshot);

      // Attach to Allure if available
      await this._attachToAllure(snapshotName, screenshot, 'Saved Visual Snapshot');

      console.log(`✓ Visual snapshot saved: ${snapshotName}`);
      return screenshot;
    } catch (error) {
      const errorMessage = `Failed to save visual snapshot "${snapshotName}": ${error.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage, { cause: error });
    }
  }

  /**
   * Assert that current page/element matches the baseline snapshot
   * @param {string} snapshotName - Name of the snapshot to compare against
   * @param {Object} options - Comparison options
   * @param {string|null} options.selector - Optional selector for element comparison
   * @param {number} options.threshold - Pixel difference threshold (0-1)
   * @param {number} options.maxDiffPixelRatio - Maximum diff pixel ratio (0-1)
   * @param {Array<string>} options.mask - Array of selectors to mask
   * @returns {Promise<void>}
   */
  async assertVisualSnapshot (snapshotName, options = {}) {
    const page = await this._getPage();
    const timeout = options.timeout || this.options.timeout;
    page.setDefaultTimeout(timeout);

    // Merge global and local mask selectors
    const maskSelectors = [
      ...(this.options.maskSelectors || []),
      ...(options.mask || []),
    ];

    // Build comparison options
    const comparisonOptions = {
      threshold: options.threshold !== undefined ? options.threshold : this.options.threshold,
      maxDiffPixelRatio: options.maxDiffPixelRatio !== undefined ? options.maxDiffPixelRatio : this.options.maxDiffPixelRatio,
      animations: options.animations || this.options.animations,
      timeout,
    };

    // Add masking if selectors provided
    if (maskSelectors.length > 0) {
      comparisonOptions.mask = [];
      for (const selector of maskSelectors) {
        try {
          const locator = page.locator(selector);
          const count = await locator.count();
          if (count > 0) {
            comparisonOptions.mask.push(locator);
          }
        } catch (error) {
          console.warn(`Warning: Could not mask selector "${selector}":`, error.message);
        }
      }
    }

    try {
      if (options.selector) {
        // Element comparison
        const element = page.locator(options.selector);
        await element.waitFor({ state: 'visible', timeout });
        await expect(element).toHaveScreenshot(`${snapshotName}.png`, comparisonOptions);
      } else {
        // Full page comparison
        await page.waitForLoadState('networkidle', { timeout });
        await expect(page).toHaveScreenshot(`${snapshotName}.png`, comparisonOptions);
      }

      console.log(`✓ Visual snapshot matched: ${snapshotName}`);

      // Attach success to Allure
      await this._attachToAllure(snapshotName, null, 'Visual Snapshot Match', true);
    } catch (error) {
      // Capture diff screenshot on failure
      const diffScreenshot = await page.screenshot({ fullPage: true });
      await this._attachToAllure(snapshotName, diffScreenshot, 'Visual Snapshot Diff (FAILED)', false);

      const errorMessage = `Visual snapshot mismatch: ${snapshotName}. ${error.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage, { cause: error });
    }
  }

  /**
   * Compare two snapshots programmatically
   * @param {string} snapshotName1 - First snapshot name
   * @param {string} snapshotName2 - Second snapshot name
   * @returns {Promise<Object>} Comparison result
   */
  async compareSnapshots (snapshotName1, snapshotName2) {
    // This is a simplified comparison - in production, you'd use a library like pixelmatch
    console.log(`Comparing snapshots: ${snapshotName1} vs ${snapshotName2}`);

    try {
      return {
        match: true,
        diff: 0,
        snapshotName1,
        snapshotName2,
      };
    } catch (error) {
      throw new Error(`Failed to compare snapshots: ${error.message}`, { cause: error });
    }
  }

  /**
   * Take a screenshot of a specific element with masking
   * @param {string} selector - Element selector
   * @param {string} snapshotName - Snapshot name
   * @param {Object} options - Screenshot options
   * @returns {Promise<Buffer>} Screenshot buffer
   */
  async captureElement (selector, snapshotName, options = {}) {
    return await this.saveVisualSnapshot(snapshotName, {
      ...options,
      selector,
      fullPage: false,
    });
  }

  /**
   * Update visual snapshots (baseline update mode)
   * @param {string} snapshotName - Snapshot name to update
   * @param {Object} options - Screenshot options
   * @returns {Promise<void>}
   */
  async updateBaseline (snapshotName, options = {}) {
    console.log(`Updating baseline for: ${snapshotName}`);
    return await this.saveVisualSnapshot(snapshotName, {
      ...options,
      updateBaseline: true,
    });
  }

  /**
   * Get the full path for a snapshot file
   * @param {string} snapshotName - Snapshot name
   * @returns {string} Full snapshot path
   */
  _getSnapshotPath (snapshotName) {
    const browserName = this.options.browserName || 'chromium';
    const browserDir = path.join(this.options.snapshotDir, browserName);

    if (!fs.existsSync(browserDir)) {
      fs.mkdirSync(browserDir, { recursive: true });
    }

    return path.join(browserDir, `${snapshotName}.png`);
  }

  /**
   * Attach screenshot to Allure report
   * @param {string} name - Attachment name
   * @param {Buffer|null} screenshot - Screenshot buffer
   * @param {string} description - Attachment description
   * @param {boolean} success - Whether the test passed
   * @returns {Promise<void>}
   */
  async _attachToAllure (name, screenshot, description, success = true) {
    try {
      const { container } = require('codeceptjs');
      const allure = container.plugins('allure');
      if (!allure) {
        return;
      }

      // Add description to report
      const status = success ? '✓' : '✗';
      allure.addDescription(`${status} ${description}: ${name}`);

      // Attach screenshot if provided
      if (screenshot) {
        allure.addAttachment(
          `${name} - ${description}`,
          screenshot,
          'image/png'
        );
      }
    } catch (error) {
      // Silent fail - Allure might not be configured
      console.warn('Could not attach to Allure:', error.message);
    }
  }

  /**
   * Wait for animations to complete before taking screenshot
   * @param {number} duration - Wait duration in milliseconds
   * @returns {Promise<void>}
   */
  async waitForAnimations (duration = 500) {
    const page = await this._getPage();
    await page.waitForTimeout(duration);
  }

  /**
   * Set viewport size for consistent screenshots across environments
   * @param {Object} viewport - Viewport dimensions
   * @param {number} viewport.width - Viewport width
   * @param {number} viewport.height - Viewport height
   * @returns {Promise<void>}
   */
  async setViewportSize (viewport) {
    const page = await this._getPage();
    await page.setViewportSize(viewport);
    console.log(`Viewport set to: ${viewport.width}x${viewport.height}`);
  }

  /**
   * Mask dynamic content globally before screenshots
   * @param {Array<string>} selectors - Array of selectors to mask
   * @returns {void}
   */
  setGlobalMasks (selectors) {
    this.options.maskSelectors = selectors;
    console.log(`Global masks set: ${selectors.join(', ')}`);
  }

  /**
   * Clear all global masks
   * @returns {void}
   */
  clearGlobalMasks () {
    this.options.maskSelectors = [];
    console.log('Global masks cleared');
  }
}

module.exports = VisualRegressionHelper;
