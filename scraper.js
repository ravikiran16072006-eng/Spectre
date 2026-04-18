const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

async function scrapeWebsite(url, competitorName) {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(response.data);
        $('script, style').remove();
        const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000);
        return { competitor: competitorName, content: text, url, timestamp: new Date().toISOString() };
    } catch (err) {
        console.log(`Scrape failed for ${competitorName}:`, err.message);
        return { competitor: competitorName, content: 'Scrape failed', url };
    }
}

async function getNews(competitorName) {
    try {
        const url = `https://newsapi.org/v2/everything?q=${competitorName}&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;
        const response = await axios.get(url);
        return response.data.articles.map(a => ({
            title: a.title,
            description: a.description,
            publishedAt: a.publishedAt
        }));
    } catch (err) {
        console.log(`News fetch failed for ${competitorName}:`, err.message);
        return [];
    }
}

module.exports = { scrapeWebsite, getNews };