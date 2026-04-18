const cron = require('node-cron');
const { scrapeWebsite, getNews } = require('./scraper');
const { storeMemory, recallMemory } = require('./memory');
const { analyzeCompetitor } = require('./analyzer');

const COMPETITORS = [
    { name: 'Notion', url: 'https://www.notion.so/pricing' },
    { name: 'Asana', url: 'https://asana.com/pricing' },
    { name: 'Linear', url: 'https://linear.app/pricing' },
];

async function runAgent() {
    console.log('🤖 Agent running at', new Date().toISOString());
    const results = [];

    for (const comp of COMPETITORS) {
        console.log(`\n🔍 Analyzing ${comp.name}...`);

        // Step 1: Scrape fresh data
        const webData = await scrapeWebsite(comp.url, comp.name);
        const newsData = await getNews(comp.name);

        // Step 2: Recall past memory from Hindsight
        const pastMemory = await recallMemory(comp.name, 'latest');

        // Step 3: Analyze with Groq LLM
        const insight = await analyzeCompetitor(
            comp.name,
            { web: webData.content.slice(0, 1000), news: newsData },
            pastMemory
        );

        // Step 4: Store fresh data in Hindsight memory
        await storeMemory(comp.name, 'latest', webData.content.slice(0, 2000));
        await storeMemory(comp.name, `snapshot_${Date.now()}`,
            JSON.stringify({ web: webData, news: newsData }));

        console.log(`\n💡 Insight for ${comp.name}:\n${insight}`);
        results.push({
            competitor: comp.name,
            insight,
            timestamp: new Date().toISOString()
        });
    }

    console.log('\n✅ Agent run complete!');
    return results;
}

// Run every day at 9am
cron.schedule('0 9 * * *', runAgent);

module.exports = { runAgent };