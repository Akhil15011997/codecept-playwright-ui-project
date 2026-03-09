const { Helper } = require('codeceptjs');
const { injectAxe } = require('axe-playwright');

/**
 * Accessibility Helper for CodeceptJS using axe-core/playwright
 * Provides automated WCAG accessibility testing capabilities
 */
class AccessibilityHelper extends Helper {
  constructor (config) {
    super(config);
    this.options = {
      // Default axe configuration
      rules: config.rules || {},
      // WCAG level: 'wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa'
      standard: config.standard || 'wcag2aa',
      // Tags to include in testing
      runOnly: config.runOnly || ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
      // Output detailed results to console
      detailedReport: config.detailedReport !== false,
      // Attach violations to Allure report
      attachToAllure: config.attachToAllure !== false,
    };
  }

  /**
   * Get the current Playwright page instance
   */
  _getPage () {
    const helper = this.helpers['Playwright'];
    if (!helper) {
      throw new Error('Playwright helper is not configured');
    }
    return helper.page;
  }

  /**
   * Inject axe-core into the current page
   */
  async injectAxeCore () {
    const page = this._getPage();
    await injectAxe(page);
    this.debug('axe-core injected into page');
  }

  /**
   * Run accessibility analysis on the current page
   * @param {Object} options - Axe options (runOnly, rules, etc.)
   * @returns {Object} Axe results
   */
  async analyzeAccessibility (options = {}) {
    const page = this._getPage();

    // Inject axe if not already injected
    try {
      await injectAxe(page);
    } catch (error) {
      this.debug('axe-core already injected or injection failed:', error.message);
    }

    // Merge options with defaults
    const axeOptions = {
      runOnly: {
        type: 'tag',
        values: options.runOnly || this.options.runOnly,
      },
      ...options,
    };

    // Run axe analysis
    this.debug('Running accessibility analysis with options:', JSON.stringify(axeOptions));

    const results = await page.evaluate((options) => {
      return window.axe.run(options);
    }, axeOptions);

    return results;
  }

  /**
   * Check accessibility and assert no violations
   * @param {Object} options - Axe configuration options
   * @param {string} context - Optional context description for reporting
   */
  async checkAccessibility (options = {}, context = '') {
    const page = this._getPage();
    const currentUrl = await page.url();
    const contextDesc = context || currentUrl;

    try {
      const results = await this.analyzeAccessibility(options);

      const violations = results.violations || [];
      const passes = results.passes || [];
      const incomplete = results.incomplete || [];

      // Log summary
      this.debug(`Accessibility check for: ${contextDesc}`);
      this.debug(`✓ Passes: ${passes.length}`);
      this.debug(`✗ Violations: ${violations.length}`);
      this.debug(`⚠ Incomplete: ${incomplete.length}`);

      // Attach to Allure if configured
      if (this.options.attachToAllure && violations.length > 0) {
        await this._attachViolationsToAllure(violations, contextDesc);
      }

      // Detailed reporting
      if (this.options.detailedReport && violations.length > 0) {
        this._logDetailedViolations(violations);
      }

      // Assert no violations
      if (violations.length > 0) {
        const violationSummary = violations.map(v =>
          `- ${v.id}: ${v.description} (Impact: ${v.impact}, ${v.nodes.length} occurrence(s))`
        ).join('\n');

        throw new Error(
          `Accessibility violations found on ${contextDesc}:\n${violationSummary}\n\n` +
          `Total violations: ${violations.length}\n` +
          `See detailed report in Allure for remediation guidance.`
        );
      }

      return {
        violations,
        passes,
        incomplete,
        url: currentUrl,
      };
    } catch (error) {
      if (error.message && error.message.includes('Accessibility violations')) {
        throw error;
      }
      const message = error.message || 'Unknown error';
      throw new Error(`Accessibility check failed: ${message}`, { cause: error });
    }
  }

  /**
   * Check specific elements for accessibility violations
   * @param {string} selector - CSS selector or xpath
   * @param {Object} options - Axe options
   */
  async checkElementAccessibility (selector, options = {}) {
    const page = this._getPage();

    await injectAxe(page);

    const elementOptions = {
      ...options,
      context: selector,
    };

    return await this.checkAccessibility(elementOptions, `Element: ${selector}`);
  }

  /**
   * Get accessibility violations without throwing error
   * Useful for reporting and analysis
   * @param {Object} options - Axe options
   */
  async getAccessibilityViolations (options = {}) {
    const results = await this.analyzeAccessibility(options);
    return results.violations || [];
  }

  /**
   * Log detailed violation information to console
   * @private
   */
  _logDetailedViolations (violations) {
    console.log('\n' + '='.repeat(80));
    console.log('ACCESSIBILITY VIOLATIONS DETECTED');
    console.log('='.repeat(80) + '\n');

    violations.forEach((violation, index) => {
      console.log(`${index + 1}. ${violation.id.toUpperCase()}`);
      console.log(`   Description: ${violation.description}`);
      console.log(`   Impact: ${violation.impact.toUpperCase()}`);
      console.log(`   WCAG: ${violation.tags.filter(tag => tag.startsWith('wcag')).join(', ')}`);
      console.log(`   Help: ${violation.help}`);
      console.log(`   Help URL: ${violation.helpUrl}`);
      console.log(`   Occurrences: ${violation.nodes.length}\n`);

      violation.nodes.forEach((node, nodeIndex) => {
        console.log(`   Occurrence ${nodeIndex + 1}:`);
        console.log(`     Target: ${node.target.join(' ')}`);
        console.log(`     HTML: ${node.html.substring(0, 100)}...`);
        console.log(`     Failure Summary: ${node.failureSummary}\n`);
      });

      console.log('-'.repeat(80) + '\n');
    });
  }

  /**
   * Attach violation details to Allure report
   * @private
   */
  async _attachViolationsToAllure (violations, context) {
    const allurePlugin = this.helpers['Allure'];

    if (!allurePlugin) {
      this.debug('Allure plugin not available for attachment');
      return;
    }

    const violationReport = {
      context,
      timestamp: new Date().toISOString(),
      summary: {
        total: violations.length,
        critical: violations.filter(v => v.impact === 'critical').length,
        serious: violations.filter(v => v.impact === 'serious').length,
        moderate: violations.filter(v => v.impact === 'moderate').length,
        minor: violations.filter(v => v.impact === 'minor').length,
      },
      violations: violations.map(v => ({
        id: v.id,
        description: v.description,
        impact: v.impact,
        tags: v.tags,
        help: v.help,
        helpUrl: v.helpUrl,
        occurrences: v.nodes.length,
        nodes: v.nodes.map(node => ({
          target: node.target,
          html: node.html,
          failureSummary: node.failureSummary,
        })),
      })),
    };

    // Attach as JSON
    const reportJson = JSON.stringify(violationReport, null, 2);

    try {
      // Create attachment
      const container = require('codeceptjs').container;
      const recorder = container.recorder();

      recorder.add('attach accessibility report', async () => {
        const plugin = container.plugins('allure');
        if (plugin) {
          plugin.addAttachment(
            'Accessibility Violations Report',
            reportJson,
            'application/json'
          );
        }
      });
    } catch (error) {
      this.debug('Failed to attach to Allure:', error.message);
    }
  }

  /**
   * Custom Gherkin step: Check page accessibility
   */
  async checkPageAccessibility () {
    await this.checkAccessibility({}, 'Current Page');
  }

  /**
   * Check accessibility with specific WCAG level
   * @param {string} level - WCAG level (A, AA, AAA)
   */
  async checkWCAGCompliance (level = 'AA') {
    const wcagLevel = `wcag2${level.toLowerCase()}`;
    const runOnly = [wcagLevel];

    if (level === 'AA') {
      runOnly.push('wcag2a'); // AA includes A
    } else if (level === 'AAA') {
      runOnly.push('wcag2a', 'wcag2aa'); // AAA includes A and AA
    }

    await this.checkAccessibility({ runOnly }, `WCAG ${level} Compliance`);
  }

  /**
   * Check for specific accessibility rules
   * @param {Array} ruleIds - Array of axe rule IDs to check
   */
  async checkAccessibilityRules (ruleIds) {
    const options = {
      runOnly: {
        type: 'rule',
        values: ruleIds,
      },
    };

    await this.checkAccessibility(options, `Rules: ${ruleIds.join(', ')}`);
  }

  /**
   * Disable specific accessibility rules
   * @param {Array} ruleIds - Array of axe rule IDs to disable
   */
  async checkAccessibilityExcludingRules (ruleIds, context = '') {
    const rules = {};
    ruleIds.forEach(ruleId => {
      rules[ruleId] = { enabled: false };
    });

    await this.checkAccessibility({ rules }, context);
  }
}

module.exports = AccessibilityHelper;
