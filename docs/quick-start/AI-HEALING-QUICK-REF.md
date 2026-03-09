# AI Healing Quick Reference Guide

## ⚡ Quick Commands

```bash
# Setup
export OPENAI_API_KEY="sk-your-key"
pnpm install

# Run Tests
pnpm test:ai-healing                 # All AI healing tests
pnpm test:ai-healing:headless        # CI/CD mode
pnpm test:ai-healing:smoke           # Quick tests
pnpm test:ai-healing:openai          # OpenAI-specific

# Utilities
pnpm healing:clear-cache             # Clear cache
```

---

## 🎯 Common Usage

### Enable Healing
```javascript
await I.enableAISelfHealing();
```

### Heal Selector
```javascript
const healed = await I.healLocator('.old-btn', 'click');
```

### Heal & Retry
```javascript
await I.healAndRetry(
  async (sel) => await I.click(sel),
  '.login-button'
);
```

### Get Statistics
```javascript
const stats = await I.getHealingStats();
const healed = await I.getHealedSelectors();
```

---

## 🧠 Healing Strategies

| Strategy | Speed | Cost | Accuracy |
|----------|-------|------|----------|
| OpenAI GPT-4 | ~2s | $0.003 | ⭐⭐⭐⭐⭐ |
| Accessibility | <100ms | Free | ⭐⭐⭐⭐ |
| Semantic | Instant | Free | ⭐⭐⭐ |

---

## ⚙️ Configuration

```javascript
// codecept.conf.js
AIHealingHelper: {
  enabled: true,
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',
  maxRetries: 3,
  healingCacheFile: './.ai-healing-cache.json',
  temperature: 0.3,
  timeout: 10000,
}
```

---

## 🔍 Example Healing

```javascript
// BEFORE: Brittle CSS class
await I.click('.auth-submit-btn-v2-new');

// AFTER: AI suggests semantic selector
await I.click('role=button[name="Sign in"]');
```

---

## 🐛 Troubleshooting

### No healing happening?
```javascript
await I.enableAISelfHealing({ logHealing: true });
```

### OpenAI errors?
```bash
echo $OPENAI_API_KEY  # Verify key set
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Cache not working?
```bash
ls -la .ai-healing-cache.json
pnpm healing:clear-cache
```

---

## 📊 Healing Report

```javascript
// Get healing report
const report = await I.getHealingReport();
console.log('Healed:', report.healedCount);
console.log('Failed:', report.failedCount);
console.log('Cache hits:', report.cacheHits);
```

---

## 🎓 Step Patterns

### Setup Step
```gherkin
Given AI self-healing is enabled
Given AI self-healing with OpenAI is enabled
Given AI self-healing with cache is enabled
```

### Healing Step
```gherkin
When the user attempts to click the broken selector ".old-btn"
Then AI should suggest "role=button[name='Login']"
Then the test should automatically retry with healed selector
```

### Verification Step
```gherkin
Then healing should be cached
Then OpenAI should analyze the accessibility tree
Then healing report should list all failed selectors
```

---

## 💰 Cost Estimation

| Usage | Monthly Cost |
|-------|-------------|
| 100 tests/day, 5% failure | $0.15 - $0.45 |
| 500 tests/day, 5% failure | $0.75 - $2.25 |
| 1000 tests/day, 5% failure | $1.50 - $4.50 |

**Note:** Caching reduces costs by 80%+ after first run

---

## 📦 Cache Format

```json
{
  ".login-button:click": "role=button[name='Sign in']",
  "#email:fill": "input[type='email'][name='email']"
}
```

---

## 🚀 Best Practices

✅ Enable caching  
✅ Use semantic selectors initially  
✅ Let AI handle brittle CSS  
✅ Review healed selectors periodically  
✅ Monitor API usage  
✅ Commit cache to version control  
❌ Don't commit API keys  

---

## 🌟 Complete Example

```javascript
Feature('Login with AI Healing');

Scenario('Resilient login test', async ({ I }) => {
  // Enable healing
  await I.enableAISelfHealing();
  
  // Navigate
  await I.amOnPage('/login');
  
  // Fill email (auto-heals if selector breaks)
  await I.healAndRetry(
    async (sel) => await I.fillField(sel, 'test@example.com'),
    '#customer_email'
  );
  
  // Fill password
  await I.healAndRetry(
    async (sel) => await I.fillField(sel, 'password123'),
    '#customer_password'
  );
  
  // Submit (auto-heals button selector)
  await I.healAndRetry(
    async (sel) => await I.click(sel),
    '.submit-button'
  );
  
  // Get statistics
  const stats = await I.getHealingStats();
  console.log(`Healed ${stats.healedCount} selectors`);
});
```

---

**Full docs:** [AI-HEALING-TESTING.md](AI-HEALING-TESTING.md)
