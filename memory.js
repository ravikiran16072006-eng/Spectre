const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://api.hindsight.vectorize.io/v1';
const HEADERS = {
    'Authorization': `Bearer ${process.env.HINDSIGHT_API_KEY}`,
    'Content-Type': 'application/json'
};

async function storeMemory(competitor, dataType, content) {
    try {
        await axios.post(`${BASE_URL}/memory`, {
            key: `${competitor}_${dataType}`,
            value: typeof content === 'string' ? content : JSON.stringify(content)
        }, { headers: HEADERS });
        console.log(`✅ Memory stored: ${competitor}_${dataType}`);
    } catch (err) {
        console.log('Store memory failed:', err.message);
    }
}

async function recallMemory(competitor, dataType) {
    try {
        const response = await axios.get(
            `${BASE_URL}/memory/${competitor}_${dataType}`,
            { headers: HEADERS }
        );
        return response.data.value || 'No previous memory found';
    } catch (err) {
        return 'No previous memory found';
    }
}

async function getMemoryHistory(competitor) {
    try {
        const response = await axios.get(
            `${BASE_URL}/memory?prefix=${competitor}`,
            { headers: HEADERS }
        );
        return response.data || [];
    } catch (err) {
        return [];
    }
}

module.exports = { storeMemory, recallMemory, getMemoryHistory };