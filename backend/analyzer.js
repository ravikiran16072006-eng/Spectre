const { Groq } = require('groq-sdk');

const groq = new Groq({ apiKey: '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' });

async function analyzeCompetitor(competitorName, newData, pastMemory) {
  try {
    const prompt = `
You are a competitive intelligence analyst for a startup.

Competitor: ${competitorName}

Past memory (what we knew before):
${pastMemory}

Fresh data collected today:
${JSON.stringify(newData, null, 2)}

Based on changes between past and present data:
1. What has changed?
2. What is this competitor likely planning?
3. What should our startup do in response?
4. Urgency level: LOW / MEDIUM / HIGH

Keep your answer short, sharp, and actionable.
    `;

    const response = await groq.chat.completions.create({
      model: 'qwen/qwen3-32b',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.log('Analysis failed:', err.message);
    return 'Analysis unavailable';
  }
}

module.exports = { analyzeCompetitor };