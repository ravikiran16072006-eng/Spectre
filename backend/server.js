const express = require('express');
const cors = require('cors');
const { scrapeCompetitor } = require('./scraper');
const { storeMemory, recallMemory } = require('./memory');
const { analyzeCompetitor } = require('./analyzer');

const app = express();
app.use(cors());
app.use(express.json());

// Targets to track
const competitors = [
  { name: 'Notion', url: 'https://notion.so' },
  { name: 'Asana', url: 'https://asana.com' },
  { name: 'Linear', url: 'https://linear.app' }
];

// In-memory data store for the dashboard (mocked initial state from template)
let systemState = {
  alerts: [
    { id: 1, comp: 'NOTION', title: 'Pricing dropped from $16 to $12/user', desc: 'This is the second price cut in 3 months. Cross-referencing with 15 recent AI engineer hires — likely aggressive pricing ahead of an AI feature launch.', urgency: 'High', date: 'Today, 9:42 AM' },
    { id: 2, comp: 'ASANA', title: 'New integrations page detected', desc: 'Asana added 6 new integrations including Slack AI and Salesforce. Memory shows they added 4 integrations last quarter.', urgency: 'Med', date: 'Yesterday, 3:15 PM' },
    { id: 3, comp: 'LINEAR', title: 'New blog post: "Linear for enterprises"', desc: 'Linear published content targeting enterprise customers for the first time. Possible upmarket move.', urgency: 'Low', date: 'Apr 16, 11:00 AM' }
  ],
  timeline: [
    { comp: 'Notion', color: 'red', text: 'Price cut $16 → $12/user', date: 'Apr 18, 2026' },
    { comp: 'Notion', color: 'amber', text: '15 AI engineer job postings detected', date: 'Apr 10, 2026' },
    { comp: 'Notion', color: 'blue', text: 'Homepage copy updated — "AI-first workspace"', date: 'Apr 3, 2026' }
  ],
  memoryLog: [
    { key: 'notion_pricing', value: '$12/user as of Apr 18' },
    { key: 'notion_jobs_latest', value: '15 ML/AI roles open Apr 10' }
  ]
};

// Main Agent Runner
async function runAgent() {
  console.log('[Agent] Running competitive intel pipeline...');
  const newAlerts = [];
  
  for (let c of competitors) {
    console.log(`[Agent] Processing ${c.name}...`);
    // 1. Scrape
    const currentData = await scrapeCompetitor(c.url);
    if (!currentData) continue;
    
    // 2. Recall Memory
    const pastMemory = await recallMemory(c.name, `What is the latest known information for ${c.name}?`);
    
    // 3. Analyze
    const analysis = await analyzeCompetitor(c.name, currentData, pastMemory);
    
    // 4. Store new insight
    await storeMemory(c.name, analysis.insight, 'insight');
    
    // 5. Update state
    if (analysis.title && analysis.title !== 'Analysis Error') {
      newAlerts.push({
        id: Date.now(),
        comp: c.name.toUpperCase(),
        title: analysis.title,
        desc: analysis.description,
        urgency: analysis.urgency,
        date: 'Just now'
      });
      
      systemState.timeline.unshift({
        comp: c.name,
        color: analysis.urgency === 'High' ? 'red' : analysis.urgency === 'Med' ? 'amber' : 'green',
        text: analysis.title,
        date: new Date().toLocaleDateString()
      });
      
      systemState.memoryLog.unshift({
        key: `${c.name.toLowerCase()}_${Date.now()}`,
        value: analysis.insight.substring(0, 50) + '...'
      });
    }
  }
  
  if (newAlerts.length > 0) {
    systemState.alerts = [...newAlerts, ...systemState.alerts];
  }
  
  return newAlerts;
}

// Routes
app.get('/api/run', async (req, res) => {
  try {
    const alerts = await runAgent();
    res.json({ success: true, newAlerts: alerts, state: systemState });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/data', (req, res) => {
  res.json(systemState);
});

app.post('/api/prompt', (req, res) => {
  // Generic prompt endpoint
  const prompt = req.body.prompt;
  res.json({ response: `Agent received your query: "${prompt}". Insights will be based on Hindsight memory and Groq.` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Competitive Intel Agent running on port ${PORT}`);
});

module.exports = { runAgent };
