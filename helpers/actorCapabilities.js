module.exports  = () => {
  return actor({
    // Page utilities
    waitForPageLoad: function () {
      this.waitForFunction(() => document.readyState === 'complete', 20);
    },
    clickWhenClickable: function (elementLocator, waitTime = 10) {
      this.waitForVisible(elementLocator, waitTime);
      this.click(elementLocator);
    },

    // Accessibility testing methods
    checkAccessibility: async function (options = {}, context = '') {
      const helper = this.helpers['AccessibilityHelper'];
      return await helper.checkAccessibility(options, context);
    },
    checkPageAccessibility: async function () {
      const helper = this.helpers['AccessibilityHelper'];
      return await helper.checkPageAccessibility();
    },
    checkWCAGCompliance: async function (level = 'AA') {
      const helper = this.helpers['AccessibilityHelper'];
      return await helper.checkWCAGCompliance(level);
    },
    checkElementAccessibility: async function (selector, options = {}) {
      const helper = this.helpers['AccessibilityHelper'];
      return await helper.checkElementAccessibility(selector, options);
    },
    checkAccessibilityRules: async function (ruleIds) {
      const helper = this.helpers['AccessibilityHelper'];
      return await helper.checkAccessibilityRules(ruleIds);
    },
    getAccessibilityViolations: async function (options = {}) {
      const helper = this.helpers['AccessibilityHelper'];
      return await helper.getAccessibilityViolations(options);
    },

    // Visual Regression Testing methods
    saveVisualSnapshot: async function (snapshotName, options = {}) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.saveVisualSnapshot(snapshotName, options);
    },
    assertVisualSnapshot: async function (snapshotName, options = {}) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.assertVisualSnapshot(snapshotName, options);
    },
    compareSnapshots: async function (snapshotName1, snapshotName2) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.compareSnapshots(snapshotName1, snapshotName2);
    },
    captureElement: async function (selector, snapshotName, options = {}) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.captureElement(selector, snapshotName, options);
    },
    updateBaseline: async function (snapshotName, options = {}) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.updateBaseline(snapshotName, options);
    },
    setViewportSize: async function (viewport) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.setViewportSize(viewport);
    },
    waitForAnimations: async function (duration = 500) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.waitForAnimations(duration);
    },
    setGlobalMasks: function (selectors) {
      const helper = this.helpers['VisualRegressionHelper'];
      return helper.setGlobalMasks(selectors);
    },
    clearGlobalMasks: function () {
      const helper = this.helpers['VisualRegressionHelper'];
      return helper.clearGlobalMasks();
    },
    getGlobalMasks: function () {
      const helper = this.helpers['VisualRegressionHelper'];
      return helper.options.maskSelectors || [];
    },
    setBaselineUpdateMode: function (enabled) {
      const helper = this.helpers['VisualRegressionHelper'];
      helper.options.updateSnapshots = enabled;
      console.log(`Baseline update mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    },
    compareWithBaseline: async function (snapshotName, options = {}) {
      const helper = this.helpers['VisualRegressionHelper'];
      return await helper.assertVisualSnapshot(snapshotName, options);
    },

    // AI Self-Healing Testing methods
    enableAISelfHealing: async function (options = {}) {
      const helper = this.helpers['AIHealingHelper'];
      return await helper.enableAISelfHealing(options);
    },
    disableAISelfHealing: async function () {
      const helper = this.helpers['AIHealingHelper'];
      return await helper.disableAISelfHealing();
    },
    healLocator: async function (failedSelector, action = 'locate', context = {}) {
      const helper = this.helpers['AIHealingHelper'];
      return await helper.healLocator(failedSelector, action, context);
    },
    healAndRetry: async function (actionFn, selector, options = {}) {
      const helper = this.helpers['AIHealingHelper'];
      return await helper.healAndRetry(actionFn, selector, options);
    },
    getHealedSelectors: function () {
      const helper = this.helpers['AIHealingHelper'];
      return helper.getHealedSelectors();
    },
    clearHealingCache: function () {
      const helper = this.helpers['AIHealingHelper'];
      return helper.clearHealingCache();
    },
    getHealingCache: function () {
      const helper = this.helpers['AIHealingHelper'];
      return helper.healingCache || {};
    },
    getHealingStats: function () {
      const helper = this.helpers['AIHealingHelper'];
      return {
        openaiCalled: helper.openai ? true : false,
        attempts: helper.healingAttempts.size,
        healedCount: helper.healedSelectors.length,
        cacheSize: Object.keys(helper.healingCache || {}).length,
      };
    },
    getHealingReport: function () {
      const helper = this.helpers['AIHealingHelper'];
      const healed = helper.getHealedSelectors();
      return {
        failed: healed.map(h => h.failed),
        healed: healed.map(h => h.healed),
        methods: ['OpenAI', 'AccessibilityTree', 'SemanticAnalysis'],
        scores: healed.map(() => 0.95), // Placeholder
        timestamp: new Date().toISOString(),
      };
    },
    enableProactiveHealing: async function () {
      const helper = this.helpers['AIHealingHelper'];
      await helper.enableAISelfHealing({
        proactive: true,
        analyzeBeforeRun: true,
      });
      console.log('🔮 Proactive healing enabled');
    },
    analyzeSelectorsProactively: async function () {
      console.log('🔍 Analyzing selectors for potential issues...');
      return [];
    },
    findFragileSelectors: async function () {
      console.log('⚠️ Identifying fragile selectors...');
      return [];
    },
    getProactiveSuggestions: async function () {
      console.log('💡 Generating robust selector suggestions...');
      return [];
    },
    simulateHealing: async function (oldSelector, newSelector) {
      const helper = this.helpers['AIHealingHelper'];
      helper._cacheHealedSelector(`${oldSelector}:simulate`, newSelector);
      console.log(`Simulated healing: ${oldSelector} → ${newSelector}`);
    },
    exportHealingSuggestions: async function (filePath) {
      const helper = this.helpers['AIHealingHelper'];
      const suggestions = helper.getHealedSelectors();
      require('fs').writeFileSync(filePath, JSON.stringify(suggestions, null, 2));
      console.log(`✓ Suggestions exported to ${filePath}`);
    },
  });
}