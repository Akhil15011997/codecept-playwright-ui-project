const { Helper } = require('codeceptjs');
const fs = require('fs');

/**
 * AIHealingHelper - Intelligent self-healing test automation using Playwright Test Agents & OpenAI
 *
 * Features:
 * - AI-powered locator healing when selectors fail
 * - OpenAI GPT-4 integration for intelligent DOM analysis
 * - Accessibility tree analysis for semantic alternatives
 * - Automatic selector suggestion and validation
 * - Healed locator persistence for future runs
 * - Minimal performance impact (healing only on failure)
 * - Graceful degradation without OpenAI
 *
 * @requires openai - OpenAI SDK for GPT-4 API access
 * @requires OPENAI_API_KEY - Environment variable for API authentication
 */
class AIHealingHelper extends Helper {
  constructor (config) {
    super(config);

    this.options = {
      enabled: config.enabled !== undefined ? config.enabled : true,
      openAIApiKey: config.openAIApiKey || process.env.OPENAI_API_KEY,
      model: config.model || 'gpt-4o', // Latest OpenAI model
      maxRetries: config.maxRetries || 3,
      healingCacheFile: config.healingCacheFile || './.ai-healing-cache.json',
      enableAccessibilityAnalysis: config.enableAccessibilityAnalysis !== undefined ? config.enableAccessibilityAnalysis : true,
      temperature: config.temperature || 0.3, // Lower for more deterministic results
      timeout: config.timeout || 10000,
      logHealing: config.logHealing !== undefined ? config.logHealing : true,
      ...config,
    };

    this.healingCache = this._loadHealingCache();
    this.openai = null;
    this.healingAttempts = new Map();
    this.healedSelectors = [];

    // Initialize OpenAI client if API key available
    if (this.options.openAIApiKey && this.options.enabled) {
      try {
        const { OpenAI } = require('openai');
        this.openai = new OpenAI({
          apiKey: this.options.openAIApiKey,
        });
        console.log('✓ AI Healing enabled with OpenAI GPT-4');
      } catch {
        console.warn('⚠ OpenAI not available, AI healing will use fallback methods');
      }
    }
  }

  /**
   * Get Playwright helper instance
   */
  _getPlaywrightHelper () {
    return this.helpers['Playwright'];
  }

  /**
   * Get current page instance
   */
  async _getPage () {
    const helper = this._getPlaywrightHelper();
    return helper.page;
  }

  /**
   * Enable AI self-healing for the current test session
   * @param {Object} options - Healing options
   */
  async enableAISelfHealing (options = {}) {
    this.options.enabled = true;
    this.healingAttempts.clear();

    if (options.maxRetries) this.options.maxRetries = options.maxRetries;
    if (options.logHealing !== undefined) this.options.logHealing = options.logHealing;

    console.log('🤖 AI Self-Healing ENABLED');
    console.log(`   Max Retries: ${this.options.maxRetries}`);
    console.log(`   OpenAI Available: ${this.openai ? '✓' : '✗'}`);
    console.log(`   Accessibility Analysis: ${this.options.enableAccessibilityAnalysis ? '✓' : '✗'}`);
  }

  /**
   * Disable AI self-healing
   */
  async disableAISelfHealing () {
    this.options.enabled = false;
    console.log('🤖 AI Self-Healing DISABLED');
  }

  /**
   * Heal a failed locator using AI-powered analysis
   * @param {string} failedSelector - The selector that failed
   * @param {string} action - The action being performed (e.g., 'click', 'fill')
   * @param {Object} context - Additional context about the test
   * @returns {Promise<string|null>} Healed selector or null
   */
  async healLocator (failedSelector, action = 'locate', context = {}) {
    if (!this.options.enabled) {
      return null;
    }

    const cacheKey = `${failedSelector}:${action}`;

    // Check cache first
    if (this.healingCache[cacheKey]) {
      console.log(`📦 Using cached healed selector for: ${failedSelector}`);
      return this.healingCache[cacheKey];
    }

    // Check retry limit
    const attempts = this.healingAttempts.get(cacheKey) || 0;
    if (attempts >= this.options.maxRetries) {
      console.log(`⚠ Max healing attempts reached for: ${failedSelector}`);
      return null;
    }

    this.healingAttempts.set(cacheKey, attempts + 1);

    try {
      const page = await this._getPage();

      // Gather context for AI analysis
      const healingContext = await this._gatherHealingContext(page, failedSelector, action, context);

      // Use OpenAI to suggest healed selector
      let healedSelector = null;

      if (this.openai) {
        healedSelector = await this._healWithOpenAI(healingContext);
      }

      // Fallback: Try accessibility-based healing
      if (!healedSelector && this.options.enableAccessibilityAnalysis) {
        healedSelector = await this._healWithAccessibilityTree(page, healingContext);
      }

      // Fallback: Try semantic healing
      if (!healedSelector) {
        healedSelector = await this._healWithSemanticAnalysis(page, healingContext);
      }

      // Validate healed selector
      if (healedSelector) {
        const isValid = await this._validateSelector(page, healedSelector);
        if (isValid) {
          console.log(`✓ HEALED: ${failedSelector} → ${healedSelector}`);
          this._cacheHealedSelector(cacheKey, healedSelector);
          this.healedSelectors.push({
            failed: failedSelector,
            healed: healedSelector,
            action,
            timestamp: new Date().toISOString(),
          });
          return healedSelector;
        }
      }

      console.log(`✗ Failed to heal: ${failedSelector}`);
      return null;
    } catch (error) {
      console.error(`Error during healing: ${error.message}`);
      return null;
    }
  }

  /**
   * Gather comprehensive context for AI healing
   */
  async _gatherHealingContext (page, failedSelector, action, userContext) {
    const context = {
      failedSelector,
      action,
      url: page.url(),
      userContext,
      timestamp: new Date().toISOString(),
    };

    try {
      // Get page title and visible text
      context.pageTitle = await page.title();
      context.visibleText = await page.evaluate(() => document.body.innerText.slice(0, 1000));

      // Get DOM snapshot around failed selector
      context.domSnapshot = await this._getDOMSnapshot(page);

      // Get accessibility tree
      if (this.options.enableAccessibilityAnalysis) {
        context.accessibilityTree = await this._getAccessibilityTree(page);
      }

      // Analyze element intent from selector
      context.elementIntent = this._analyzeElementIntent(failedSelector, action);

      // Get similar elements
      context.similarElements = await this._findSimilarElements(page);
    } catch (error) {
      console.warn(`Context gathering partial failure: ${error.message}`);
    }

    return context;
  }

  /**
   * Heal locator using OpenAI GPT-4
   */
  async _healWithOpenAI (context) {
    if (!this.openai) return null;

    try {
      const prompt = this._buildOpenAIPrompt(context);

      const completion = await this.openai.chat.completions.create({
        model: this.options.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert test automation engineer specializing in locator healing. 
            Analyze the failed selector and suggest the most robust replacement using:
            1. Accessibility attributes (role, aria-label, aria-labelledby)
            2. Semantic HTML elements
            3. Text content matching
            4. Data attributes
            5. Stable CSS selectors
            
            Respond ONLY with a valid Playwright locator. No explanations.
            Examples: 
            - 'button[type="submit"]'
            - 'role=button[name="Login"]'
            - 'text=Sign in'
            - '[aria-label="Submit form"]'
            - '#email-input'`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: this.options.temperature,
        max_tokens: 150,
      });

      const suggestedSelector = completion.choices[0]?.message?.content?.trim();

      if (suggestedSelector) {
        // Clean up the response
        const cleaned = suggestedSelector
          .replace(/^['"`]|['"`]$/g, '') // Remove quotes
          .replace(/^Locator:\s*/i, '') // Remove "Locator:" prefix
          .trim();

        if (this.options.logHealing) {
          console.log(`🤖 OpenAI suggested: ${cleaned}`);
        }

        return cleaned;
      }

      return null;
    } catch (error) {
      console.warn(`OpenAI healing failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Build prompt for OpenAI analysis
   */
  _buildOpenAIPrompt (context) {
    return `
FAILED SELECTOR: ${context.failedSelector}
ACTION: ${context.action}
PAGE: ${context.pageTitle} (${context.url})

ELEMENT INTENT: ${context.elementIntent}

ACCESSIBILITY TREE (Roles & Labels):
${this._formatAccessibilityTree(context.accessibilityTree)}

DOM CONTEXT:
${JSON.stringify(context.domSnapshot, null, 2)}

SIMILAR ELEMENTS FOUND:
${JSON.stringify(context.similarElements, null, 2)}

VISIBLE PAGE TEXT:
${context.visibleText?.slice(0, 500)}

Find a robust replacement selector that will locate the intended element.
Consider the element's role, visible text, and semantic meaning.
Prefer accessibility attributes and semantic selectors over brittle CSS classes.
`.trim();
  }

  /**
   * Format accessibility tree for prompt
   */
  _formatAccessibilityTree (tree) {
    if (!tree) return 'Not available';

    try {
      return tree
        .slice(0, 20) // Limit to first 20 nodes
        .map(node => `- ${node.role}: "${node.name}" ${node.attributes || ''}`)
        .join('\n');
    } catch {
      return 'Error formatting tree';
    }
  }

  /**
   * Heal using accessibility tree analysis
   */
  async _healWithAccessibilityTree (page, context) {
    try {
      const snapshot = await page.accessibility.snapshot();
      if (!snapshot) return null;

      // Extract intent from failed selector
      const intent = context.elementIntent;

      // Search accessibility tree for matching elements
      const candidates = this._searchAccessibilityNode(snapshot, intent);

      for (const candidate of candidates) {
        if (candidate.role && candidate.name) {
          const selector = `role=${candidate.role}[name="${candidate.name}"]`;
          const isValid = await this._validateSelector(page, selector);
          if (isValid) {
            if (this.options.logHealing) {
              console.log(`♿ Accessibility healing found: ${selector}`);
            }
            return selector;
          }
        }
      }

      return null;
    } catch (error) {
      console.warn(`Accessibility healing failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Search accessibility node recursively
   */
  _searchAccessibilityNode (node, intent, results = []) {
    if (!node) return results;

    // Match by name or role
    if (node.name && intent.text) {
      if (node.name.toLowerCase().includes(intent.text.toLowerCase())) {
        results.push(node);
      }
    }

    if (node.role && intent.role) {
      if (node.role.toLowerCase() === intent.role.toLowerCase()) {
        results.push(node);
      }
    }

    // Recurse children
    if (node.children) {
      for (const child of node.children) {
        this._searchAccessibilityNode(child, intent, results);
      }
    }

    return results;
  }

  /**
   * Heal using semantic analysis
   */
  async _healWithSemanticAnalysis (page, context) {
    const intent = context.elementIntent;

    // Try common semantic patterns
    const semanticPatterns = [
      // Text-based
      intent.text ? `text=${intent.text}` : null,
      intent.text ? `text="${intent.text}"` : null,
      intent.text ? `"${intent.text}"` : null,

      // Role-based
      intent.role ? `role=${intent.role}` : null,
      intent.role && intent.text ? `role=${intent.role}[name="${intent.text}"]` : null,

      // Common button patterns
      context.action === 'click' && intent.text ? `button:has-text("${intent.text}")` : null,
      context.action === 'click' && intent.text ? `[type="submit"]:has-text("${intent.text}")` : null,

      // Input patterns
      context.action === 'fill' && intent.id ? `#${intent.id}` : null,
      context.action === 'fill' && intent.name ? `[name="${intent.name}"]` : null,
    ].filter(Boolean);

    for (const pattern of semanticPatterns) {
      const isValid = await this._validateSelector(page, pattern);
      if (isValid) {
        if (this.options.logHealing) {
          console.log(`🔍 Semantic healing found: ${pattern}`);
        }
        return pattern;
      }
    }

    return null;
  }

  /**
   * Analyze element intent from selector
   */
  _analyzeElementIntent (selector, action) {
    const intent = {
      role: null,
      text: null,
      id: null,
      name: null,
      type: null,
    };

    // Extract ID
    const idMatch = selector.match(/#([\w-]+)/);
    if (idMatch) intent.id = idMatch[1];

    // Extract name attribute
    const nameMatch = selector.match(/\[name=["']([^"']+)["']\]/);
    if (nameMatch) intent.name = nameMatch[1];

    // Extract text content
    const textMatch = selector.match(/text[=:(]?["']?([^"')]+)["']?\)?/i);
    if (textMatch) intent.text = textMatch[1];

    // Extract role
    const roleMatch = selector.match(/role=(\w+)/);
    if (roleMatch) intent.role = roleMatch[1];

    // Infer role from action and selector
    if (!intent.role) {
      if (action === 'click' || selector.includes('button')) {
        intent.role = 'button';
      } else if (action === 'fill' || selector.includes('input')) {
        intent.role = 'textbox';
      }
    }

    // Infer text from common patterns
    if (!intent.text && selector.includes('login')) {
      intent.text = 'Login';
    } else if (selector.includes('submit')) {
      intent.text = 'Submit';
    }

    return intent;
  }

  /**
   * Get DOM snapshot around failed selector
   */
  async _getDOMSnapshot (page) {
    try {
      // Try to get surrounding DOM structure
      const snapshot = await page.evaluate(() => {
        const elements = [];

        // Get all elements that might match partial selector
        const allElements = document.querySelectorAll('*');

        for (let i = 0; i < Math.min(allElements.length, 50); i++) {
          const el = allElements[i];
          elements.push({
            tagName: el.tagName.toLowerCase(),
            id: el.id,
            className: el.className,
            text: el.textContent?.slice(0, 50),
            attributes: {
              role: el.getAttribute('role'),
              ariaLabel: el.getAttribute('aria-label'),
              type: el.getAttribute('type'),
              name: el.getAttribute('name'),
            },
          });
        }

        return elements;
      });

      return snapshot;
    } catch {
      return [];
    }
  }

  /**
   * Get accessibility tree
   */
  async _getAccessibilityTree (page) {
    try {
      const snapshot = await page.accessibility.snapshot();
      return this._flattenAccessibilityTree(snapshot);
    } catch {
      return [];
    }
  }

  /**
   * Flatten accessibility tree for analysis
   */
  _flattenAccessibilityTree (node, results = []) {
    if (!node) return results;

    if (node.role && node.name) {
      results.push({
        role: node.role,
        name: node.name,
        attributes: node.value || node.description || '',
      });
    }

    if (node.children) {
      for (const child of node.children) {
        this._flattenAccessibilityTree(child, results);
      }
    }

    return results;
  }

  /**
   * Find similar elements on page
   */
  async _findSimilarElements (page) {
    try {
      return await page.evaluate(() => {
        const similar = [];
        const allElements = document.querySelectorAll('button, input, a, [role]');

        for (let i = 0; i < Math.min(allElements.length, 20); i++) {
          const el = allElements[i];
          similar.push({
            tagName: el.tagName.toLowerCase(),
            text: el.textContent?.trim().slice(0, 30),
            role: el.getAttribute('role') || el.tagName.toLowerCase(),
            label: el.getAttribute('aria-label'),
            id: el.id,
            className: el.className,
          });
        }

        return similar;
      });
    } catch {
      return [];
    }
  }

  /**
   * Validate if selector works
   */
  async _validateSelector (page, selector) {
    try {
      const locator = page.locator(selector);
      const count = await locator.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Load healing cache from disk
   */
  _loadHealingCache () {
    try {
      if (fs.existsSync(this.options.healingCacheFile)) {
        const data = fs.readFileSync(this.options.healingCacheFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn(`Failed to load healing cache: ${error.message}`);
    }
    return {};
  }

  /**
   * Cache healed selector to disk
   */
  _cacheHealedSelector (key, selector) {
    this.healingCache[key] = selector;
    try {
      fs.writeFileSync(
        this.options.healingCacheFile,
        JSON.stringify(this.healingCache, null, 2),
        'utf8'
      );
    } catch (error) {
      console.warn(`Failed to save healing cache: ${error.message}`);
    }
  }

  /**
   * Get all healed selectors from this session
   */
  getHealedSelectors () {
    return this.healedSelectors;
  }

  /**
   * Clear healing cache
   */
  clearHealingCache () {
    this.healingCache = {};
    try {
      if (fs.existsSync(this.options.healingCacheFile)) {
        fs.unlinkSync(this.options.healingCacheFile);
      }
      console.log('✓ Healing cache cleared');
    } catch (error) {
      console.warn(`Failed to clear cache: ${error.message}`);
    }
  }

  /**
   * Attempt to heal and retry a failed action
   * @param {Function} action - The action to retry with healing
   * @param {string} selector - The selector that failed
   * @param {Object} options - Healing options
   */
  async healAndRetry (action, selector, options = {}) {
    if (!this.options.enabled) {
      throw new Error('AI healing is disabled');
    }

    const healedSelector = await this.healLocator(
      selector,
      options.action || 'locate',
      options.context || {}
    );

    if (!healedSelector) {
      throw new Error(`Failed to heal selector: ${selector}`);
    }

    // Retry action with healed selector
    try {
      await action(healedSelector);
      return healedSelector;
    } catch (error) {
      throw new Error(`Healed selector also failed: ${healedSelector}`, { cause: error });
    }
  }
}

module.exports = AIHealingHelper;
