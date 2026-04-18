const express = require('express');
const cors = require('cors');
const { runAgent } = require('./scheduler');
const { recallMemory, getMemoryHistory } = require('./memory');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Run agent manually
// Chat with agent
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const { recallMemory } = require('./memory');
        const { analyzeCompetitor } = require('./analyzer');
        const Groq = require('groq-sdk');

        const groq = new Groq({
            apiKey: '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'
        });

        // Recall all competitor memory from Hindsight
        const notionMemory = await recallMemory('Notion', 'latest');
        const asanaMemory = await recallMemory('Asana', 'latest');
        const linearMemory = await recallMemory('Linear', 'latest');

        const prompt = `
You are Specter, an elite competitive intelligence AI agent.
You have access to the following memory about competitors:

NOTION: ${notionMemory}
ASANA: ${asanaMemory}  
LINEAR: ${linearMemory}

The user is asking: "${message}"

Answer in 2-3 short sharp sentences based on the memory above.
Be direct, confident and actionable like a strategy consultant.
    `;

        const response = await groq.chat.completions.create({
            model: 'qwen/qwen3-32b',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300
        });

        const reply = response.choices[0].message.content;
        res.json({ success: true, reply });

    } catch (err) {
        console.log('Chat error:', err.message);
        res.json({ success: false, reply: 'Sorry, I could not process that right now.' });
    }
});
app.get('/api/run', async (req, res) => {
    console.log('🚀 Manual agent run triggered');
    try {
        const results = await runAgent();
        res.json({ success: true, results });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Get latest memory for a competitor
app.get('/api/insights/:competitor', async (req, res) => {
    try {
        const memory = await recallMemory(req.params.competitor, 'latest');
        res.json({ competitor: req.params.competitor, memory });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// Get full history for a competitor
app.get('/api/history/:competitor', async (req, res) => {
    try {
        const history = await getMemoryHistory(req.params.competitor);
        res.json({ competitor: req.params.competitor, history });
    } catch (err) {
        res.json({ error: err.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: '🤖 Specter Agent is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Specter backend running on http://localhost:${PORT}`);
});