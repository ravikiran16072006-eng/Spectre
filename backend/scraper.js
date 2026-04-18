const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCompetitor(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
      }
    });
    const $ = cheerio.load(data);
    
    // Remove scripts and styles
    $('script, style').remove();
    
    // Extract text from headers and paragraphs
    let text = [];
    $('h1, h2, h3, p, li').each((i, el) => {
      text.push($(el).text().trim());
    });
    
    // basic cleanup and return
    return text.filter(t => t.length > 10).join(' ').substring(0, 8000); // chunking to fit context
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    return null;
  }
}

module.exports = { scrapeCompetitor };
