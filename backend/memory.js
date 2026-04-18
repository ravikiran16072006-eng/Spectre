const axios = require('axios');
require('dotenv').config();

const HINDSIGHT_URL = 'https://api.hindsight.vectorize.io/v1';

async function storeMemory(competitor, data, type = 'text') {
  try {
    await axios.post(`${HINDSIGHT_URL}/memory`, {
      key: `${competitor.toLowerCase()}_latest`,
      value: typeof data === 'string' ? data : JSON.stringify(data)
    }, {
      headers: { 
        'Authorization': `Bearer ${process.env.HINDSIGHT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`[Memory] Stored memory for ${competitor}.`);
  } catch (err) {
    console.error(`[Memory] Failed to store for ${competitor}:`, err.response?.data || err.message);
  }
}

async function recallMemory(competitor, query) {
  try {
    const key = `${competitor.toLowerCase()}_latest`;
    const { data } = await axios.get(`${HINDSIGHT_URL}/memory/${key}`, {
      headers: { 'Authorization': `Bearer ${process.env.HINDSIGHT_API_KEY}` }
    });
    console.log(`[Memory] Recalled memory for ${competitor}.`);
    return data.value || data || "No prior memory.";
  } catch (err) {
    console.error(`[Memory] Failed to recall for ${competitor}:`, err.response?.data || err.message);
    return "No prior memory (error recalling).";
  }
}

module.exports = { storeMemory, recallMemory };
