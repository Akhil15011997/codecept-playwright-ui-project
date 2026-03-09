# AI-Powered Self-Healing Test Automation Documentation

## 🤖 Overview

This project implements cutting-edge **AI-powered self-healing** test automation using Playwright Test Agents and OpenAI GPT-4. When selectors break due to UI changes, the system automatically heals them in real-time using intelligent analysis.

### Key Features

- ✅ **OpenAI GPT-4 Integration** - AI-powered locator healing with contextual understanding
- ✅ **Accessibility Tree Analysis** - Semantic locator suggestions using ARIA roles and labels
- ✅ **Zero-Touch Healing** - Automatic retry with healed selectors (no manual intervention)
- ✅ **Intelligent Caching** - Healed selectors persist across test runs for performance
- ✅ **Multiple Fallback Strategies** - OpenAI → Accessibility → Semantic → Fail gracefully
- ✅ **Real-Time DOM Analysis** - Current page context sent to AI for accurate healing
- ✅ **Allure Integration** - Healing reports attached to test results
- ✅ **Minimal Performance Impact** - Healing only triggers on failures

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

This installs:
- `openai@^4.73.0` - OpenAI SDK for GPT-4 API
- All existing dependencies (CodeceptJS, Playwright, etc.)

### 2. Create and Configure OpenAI API Key

#### How to Create an OpenAI API Key:

1. **Sign up for OpenAI Account**
   - Visit https://platform.openai.com/signup
   - Create an account using your email, Google, or Microsoft account
   - Verify your email address if required

2. **Add Payment Method** (Required for API access)
   - Go to https://platform.openai.com/account/billing/overview
   - Click "Add payment method"
   - Enter your credit/debit card details
   - OpenAI uses pay-as-you-go pricing (~$0.003 per healing attempt)

3. **Create API Key**
   - Navigate to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "CodeceptJS AI Healing")
   - **Important**: Copy the key immediately - you won't be able to see it again!
   - Store it securely (never commit to Git)

4. **Set Usage Limits** (Recommended)
   - Go to https://platform.openai.com/account/limits
   - Set monthly budget limits to control costs
   - Recommended: Start with $5-10/month for testing

#### Configure the API Key:

Set your OpenAI API key as an environment variable:

```bash
# Option 1: Export in terminal (temporary - for current session)
export OPENAI_API_KEY="sk-your-api-key-here"

# Option 2: Add to .env file (recommended for local development)
echo "OPENAI_API_KEY=sk-your-api-key-here" >> .env

# Option 3: Add to shell profile (persistent across sessions)
# For macOS/Linux with zsh:
echo 'export OPENAI_API_KEY="sk-your-api-key-here"' >> ~/.zshrc
source ~/.zshrc

# For macOS/Linux with bash:
echo 'export OPENAI_API_KEY="sk-your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

#### Verify API Key Setup:

```bash
# Check if environment variable is set
echo $OPENAI_API_KEY

# Test API connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**Security Best Practices:**
- ✅ Never commit API keys to version control
- ✅ Add `.env` to `.gitignore`
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate keys periodically
- ✅ Set up usage alerts in OpenAI dashboard

### 3. Run AI Healing Tests

```bash
# Run all AI healing tests
pnpm test:ai-healing

# Run in headless mode (CI/CD)
pnpm test:ai-healing:headless

# Run smoke tests only
pnpm test:ai-healing:smoke

# Run OpenAI-specific tests
pnpm test:ai-healing:openai
```

### 4. Enable AI Healing in Your Tests

```javascript
// In your test steps
Given('AI self-healing is enabled', async () => {
  await I.enableAISelfHealing();
});

// When a selector fails, AI automatically heals it
When('the user clicks login button', async () => {
  try {
    await I.click('.login-btn'); // Original selector
  } catch (error) {
    // AI healing kicks in automatically
    const healed = await I.healLocator('.login-btn', 'click');
    await I.click(healed); // Retry with healed selector
  }
});
```

---

## 📚 How It Works

### Healing Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Test runs with original selector                        │
│    Example: await I.click('.login-button')                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Selector fails?       │
         └───────────────────────┘
                     │
                     │ YES
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AI Healing Triggered                                     │
│    - Gather page context (DOM, accessibility tree, text)    │
│    - Analyze element intent from selector                   │
│    - Check healing cache first                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Healing Strategy #1: OpenAI GPT-4                        │
│    - Send context to GPT-4                                  │
│    - AI suggests robust replacement                         │
│    - Validate selector works                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Failed or N/A
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Healing Strategy #2: Accessibility Tree                  │
│    - Query accessibility snapshot                           │
│    - Find by role + name (semantic match)                   │
│    - Suggest: role=button[name="Login"]                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Failed
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Healing Strategy #3: Semantic Analysis                   │
│    - Try text-based: text="Login"                           │
│    - Try common patterns: button:has-text("Login")          │
│    - Try data attributes: [data-testid="login-btn"]         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Healed selector found?│
         └───────────────────────┘
                     │
                     │ YES
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Success!                                                 │
│    - Cache healed selector                                  │
│    - Retry test with healed selector                        │
│    - Log healing event                                      │
│    - Attach to Allure report                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI Healing Strategies

### Strategy 1: OpenAI GPT-4 Analysis

**Most Intelligent** - Uses GPT-4 to understand page context and suggest best locator.

**Input to GPT-4:**
```text
FAILED SELECTOR: .old-login-btn
ACTION: click
PAGE: Account Login (https://sauce-demo.myshopify.com/account/login)

ELEMENT INTENT: button, Login

ACCESSIBILITY TREE:
- button: "Sign in" 
- textbox: "Email" [name="email"]
- textbox: "Password" [name="password"]

DOM CONTEXT: {...}
VISIBLE TEXT: Account Login Email address Password...
```

**GPT-4 Response:**
```
role=button[name="Sign in"]
```

**Advantages:**
- Understands natural language intent
- Considers full page context
- Suggests most robust selectors
- Adapts to complex scenarios

**Cost:** ~$0.003 per healing attempt

---

### Strategy 2: Accessibility Tree Analysis

**Most Semantic** - Uses Playwright's accessibility snapshot to find elements by role and name.

**Example:**
```javascript
// Failed selector
'.submit-button'

// Accessibility tree query
role=button[name="Submit Order"]

// Why it works
- role='button' is semantic HTML
- name='Submit Order' is visible text
- More stable than CSS classes
```

**Advantages:**
- Zero API cost
- Fast (<100ms)
- Promotes accessible design
- No external dependencies

---

### Strategy 3: Semantic Pattern Matching

**Most Lightweight** - Uses predefined patterns based on selector intent.

**Patterns:**
```javascript
const semanticPatterns = [
  // Text-based
  `text=${intent.text}`,
  `"${intent.text}"`,
  
  // Role-based
  `role=${intent.role}`,
  `role=${intent.role}[name="${intent.text}"]`,
  
  // Button patterns
  `button:has-text("${intent.text}")`,
  `[type="submit"]:has-text("${intent.text}")`,
  
  // Input patterns
  `#${intent.id}`,
  `[name="${intent.name}"]`,
];
```

**Advantages:**
- Instant (no API calls)
- Always available offline
- Predictable results
- Good for common patterns

---

## 🎯 Configuration

### Helper Configuration (codecept.conf.js)

```javascript
AIHealingHelper: {
  require: './helpers/AIHealingHelper.js',
  enabled: true,                          // Enable/disable healing
  openAIApiKey: process.env.OPENAI_API_KEY,  // OpenAI API key
  model: 'gpt-4o',                        // OpenAI model
  maxRetries: 3,                          // Max healing attempts
  healingCacheFile: './.ai-healing-cache.json',  // Cache location
  enableAccessibilityAnalysis: true,      // Use a11y tree
  temperature: 0.3,                       // GPT-4 temperature
  timeout: 10000,                         // Healing timeout (ms)
  logHealing: true,                       // Console logging
  preferSemanticSelectors: true,          // Prefer role/text
  cacheEnabled: true,                     // Persistent cache
  attachToAllure: true,                   // Allure reports
}
```

### Runtime Configuration

```javascript
// Custom healing options
await I.enableAISelfHealing({
  maxRetries: 5,
  logHealing: true,
  openaiEnabled: true,
});

// Disable healing
await I.disableAISelfHealing();
```

---

## 💻 API Reference

### `I.enableAISelfHealing(options)`

Enable AI healing for current test session.

**Options:**
- `maxRetries` (number) - Maximum healing attempts (default: 3)
- `logHealing` (boolean) - Log healing events to console (default: true)
- `openaiEnabled` (boolean) - Use OpenAI GPT-4 (default: true)
- `cacheEnabled` (boolean) - Use persistent caching (default: true)

**Example:**
```javascript
await I.enableAISelfHealing({
  maxRetries: 5,
  logHealing: true,
});
```

---

### `I.healLocator(failedSelector, action, context)`

Manually trigger healing for a failed selector.

**Parameters:**
- `failedSelector` (string) - The selector that failed
- `action` (string) - Action type: 'click', 'fill', 'locate' (default: 'locate')
- `context` (object) - Additional context for AI

**Returns:** `string` - Healed selector or null

**Example:**
```javascript
const healed = await I.healLocator('.old-btn', 'click', {
  intent: 'submit login form',
  role: 'button',
});

if (healed) {
  await I.click(healed);
}
```

---

### `I.healAndRetry(actionFn, selector, options)`

Heal and automatically retry an action.

**Example:**
```javascript
await I.healAndRetry(
  async (sel) => await I.click(sel),
  '.login-button',
  { action: 'click', maxRetries: 2 }
);
```

---

### `I.getHealedSelectors()`

Get all healed selectors from current session.

**Returns:** Array of healing events

**Example:**
```javascript
const healed = await I.getHealedSelectors();
// [
//   {
//     failed: '.old-login-btn',
//     healed: 'role=button[name="Login"]',
//     action: 'click',
//     timestamp: '2026-02-27T10:30:00.000Z'
//   }
// ]
```

---

### `I.clearHealingCache()`

Clear the healing cache file.

**Example:**
```bash
pnpm healing:clear-cache
```

---

### `I.getHealingStats()`

Get healing statistics for current session.

**Returns:**
```javascript
{
  openaiCalled: true,
  attempts: 5,
  healedCount: 3,
  cacheSize: 12
}
```

---

## 🧪 Test Scenarios

### Basic Healing

```gherkin
@ai-healing @smoke
Scenario: AI heals broken login button selector
  Given AI self-healing is enabled
  And the user is on the login page
  When the login button CSS class changes
  And the user attempts to click the broken selector ".old-login-btn"
  Then AI should suggest "role=button[name='Login']"
  And the test should automatically retry with healed selector
```

### OpenAI Healing

```gherkin
@ai-healing @openai
Scenario: OpenAI GPT-4 heals complex form selectors
  Given AI self-healing with OpenAI is enabled
  When the email input selector becomes invalid
  Then OpenAI should analyze the accessibility tree
  And AI should suggest semantic alternative
  And the healed selector should be cached
```

### Caching

```gherkin
@ai-healing @cache
Scenario: Healed selectors are cached for future runs
  Given AI self-healing with cache is enabled
  When the same test runs again in future
  Then AI should use cached healed selector immediately
  And no API calls to OpenAI should be made
```

---

## 📊 Healing Reports

### Console Output

```bash
🤖 AI Self-Healing ENABLED
   Max Retries: 3
   OpenAI Available: ✓
   Accessibility Analysis: ✓

🔍 Healing: .login-button (action: click)
📦 Cache miss - triggering OpenAI analysis...
🤖 OpenAI suggested: role=button[name="Sign in"]
✓ Selector validated successfully
✓ HEALED: .login-button → role=button[name="Sign in"]
💾 Cached for future runs
```

### Allure Report

Healing events are attached to Allure reports including:
- Failed selector
- Healed replacement
- Healing method used (OpenAI/Accessibility/Semantic)
- Timestamp and context
- AI confidence score

### Healing Cache (`.ai-healing-cache.json`)

```json
{
  ".login-button:click": "role=button[name='Sign in']",
  "#customer_email:fill": "input[type='email'][name='email']",
  ".add-cart:click": "role=button[name='Add to cart']"
}
```

---

## 🚀 Test Scripts

```bash
# AI Healing Tests
pnpm test:ai-healing                 # All AI healing tests
pnpm test:ai-healing:headless        # Headless mode (CI/CD)
pnpm test:ai-healing:smoke           # Quick smoke tests
pnpm test:ai-healing:openai          # OpenAI-specific tests
pnpm test:self-healing               # Self-healing tagged tests
pnpm test:resilient                  # Resilient tests
pnpm test:ai-all                     # All AI-powered tests

# Utilities
pnpm healing:clear-cache             # Clear healing cache

# Combined Tests
pnpm test:combined                   # Visual + Accessibility
pnpm test:combined:headless          # Combined headless
```

---

## 🔧 Advanced Configuration

### Custom Healing Logic

You can extend the helper with custom healing strategies:

```javascript
// In your helper or test
class CustomHealing extends AIHealingHelper {
  async _healWithCustomLogic(page, context) {
    // Your custom healing logic
    const customSelector = '...';
    return customSelector;
  }
}
```

### Proactive Healing

Scan and suggest improvements before failures:

```javascript
Given('AI healing is in proactive mode', async () => {
  await I.enableProactiveHealing();
  
  // Analyze all selectors
  await I.analyzeSelectorsProactively();
  
  // Get fragile selectors
  const fragile = await I.findFragileSelectors();
  
  // Export suggestions
  await I.exportHealingSuggestions('./suggestions.json');
});
```

---

## 💰 Cost Estimation

### OpenAI API Costs (GPT-4o)

- **Input:** ~$2.50 per 1M tokens
- **Output:** ~$10.00 per 1M tokens
- **Average healing:** ~500 input + 50 output tokens
- **Cost per healing:** ~$0.001 - $0.003

### Monthly Estimates

| Tests per Day | Failures | Healing Attempts | Monthly Cost |
|---------------|----------|------------------|--------------|
| 100           | 5%       | 150              | $0.15 - $0.45|
| 500           | 5%       | 750              | $0.75 - $2.25|
| 1000          | 5%       | 1500             | $1.50 - $4.50|

**Note:** Caching dramatically reduces costs after initial healing.

---

## 🎛️ CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests with AI Healing

on: [push, pull_request]

jobs:
  test-with-healing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Download healing cache
        run: |
          # Download from previous successful runs
          gh run download --name healing-cache || true
      
      - name: Run tests with AI healing
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: pnpm test:ai-healing:headless
      
      - name: Upload healing cache
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: healing-cache
          path: .ai-healing-cache.json
      
      - name: Upload healing report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: healing-report
          path: healing-suggestions.json
```

---

## 🛡️ Best Practices

### 1. Cache Management
- ✅ Commit healing cache to version control for team
- ✅ Use cache to eliminate recurring API calls
- ✅ Clear cache after major UI changes
- ❌ Don't commit cache with sensitive data

### 2. OpenAI API Key Security
- ✅ Use environment variables
- ✅ Never commit API keys to git
- ✅ Use GitHub Secrets in CI/CD
- ✅ Rotate keys periodically

### 3. Healing Strategy
- ✅ Enable all three fallback strategies
- ✅ Let OpenAI handle complex cases
- ✅ Use accessibility tree for semantic elements
- ✅ Monitor healing success rate

### 4. Test Design
- ✅ Write page objects with semantic selectors initially
- ✅ Use data-testid attributes where appropriate
- ✅ Let AI handle brittle CSS classes
- ✅ Review healed selectors periodically

### 5. Performance
- ✅ Enable caching to reduce latency
- ✅ Set reasonable timeout limits
- ✅ Use headless mode in CI/CD
- ✅ Monitor API usage

---

## 🐛 Troubleshooting

### Issue: OpenAI API errors

**Solution:**
```bash
# Check API key
echo $OPENAI_API_KEY

# Test API connection
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check usage/quota
https://platform.openai.com/usage
```

---

### Issue: Healing not triggering

**Solution:**
```javascript
// Verify helper is loaded
const helper = this.helpers['AIHealingHelper'];
console.log('Helper loaded:', !!helper);

// Check if enabled
await I.enableAISelfHealing();

// Verify healing attempt
const stats = await I.getHealingStats();
console.log('Healing stats:', stats);
```

---

### Issue: Cache not persisting

**Solution:**
```bash
# Check file permissions
ls -la .ai-healing-cache.json

# Manual cache save
echo '{}' > .ai-healing-cache.json
chmod 644 .ai-healing-cache.json

# Verify cache location in config
```

---

### Issue: Slow healing

**Solution:**
- Decrease `timeout` in config (default: 10000ms)
- Enable caching to skip API calls
- Use simpler OpenAI model (gpt-3.5-turbo)
- Reduce `maxRetries`

---

## 📈 Monitoring & Analytics

### Track Healing Metrics

```javascript
// Get session statistics
const stats = await I.getHealingStats();
console.log('Healing Statistics:', {
  totalAttempts: stats.attempts,
  successfulHealing: stats.healedCount,
  cacheHits: stats.cacheSize,
  openaiUsed: stats.openaiCalled,
});

// Get all healed selectors
const healed = await I.getHealedSelectors();
console.log('Healed Selectors:', healed.length);

// Generate report
const report = await I.getHealingReport();
// Attach to monitoring system
```

---

## 🎓 Examples

### Example 1: Login Button Healing

```javascript
// Original test (brittle selector)
await I.click('.auth-submit-btn');

// With AI healing
try {
  await I.click('.auth-submit-btn'); // May fail after UI change
} catch (error) {
  const healed = await I.healLocator('.auth-submit-btn', 'click');
  // Healed: role=button[name="Sign in"]
  await I.click(healed); // Succeeds!
}
```

### Example 2: Form Field Healing

```javascript
// Email input changed from #email to #customer_email
try {
  await I.fillField('#email', 'test@example.com');
} catch (error) {
  const healed = await I.healLocator('#email', 'fill', {
    fieldType: 'email',
    intent: 'enter email address'
  });
  // Healed: input[type="email"][name="email"]
  await I.fillField(healed, 'test@example.com');
}
```

### Example 3: Automatic Healing in Step

```javascript
// Define custom step with auto-healing
When('the user submits the form', async () => {
  await I.healAndRetry(
    async (selector) => await I.click(selector),
    'button.submit',
    { 
      action: 'click',
      context: { intent: 'submit form' }
    }
  );
});
```

---

## 🌟 Summary

AI-powered self-healing is now fully integrated into your CodeceptJS Playwright framework:

✅ **OpenAI GPT-4 integration** for intelligent healing  
✅ **3-tier fallback strategy** (OpenAI → Accessibility → Semantic)  
✅ **Zero-touch healing** with automatic retry  
✅ **Persistent caching** for performance  
✅ **Allure integration** for visibility  
✅ **15+ test scenarios** demonstrating capabilities  
✅ **Comprehensive API** for customization  
✅ **CI/CD ready** with environment variables  
✅ **Cost-effective** with intelligent caching  

**Get started:** `pnpm install && pnpm test:ai-healing`

**Set API key:** `export OPENAI_API_KEY="sk-your-key"`

🚀 **Your tests are now resilient to UI changes!**
