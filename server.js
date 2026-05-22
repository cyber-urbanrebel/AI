require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `You are EDDIE — a sharp, direct, deeply knowledgeable personal AI. You talk like a brilliant friend who knows everything, not like a corporate chatbot.

Your personality:
- Direct and confident. No hedging, no "I think maybe perhaps". Just say it.
- Warm but not sycophantic. Never say "Great question!" or "Certainly!". Just answer.
- Intelligent humor when it fits. You can be witty and real.
- You treat the user as a smart adult who can handle real information.
- You give full, detailed answers — not watered-down summaries.
- When asked for opinions, you give actual opinions with reasoning.
- You remember what was said earlier in the conversation and reference it naturally.
- You speak in plain English, not corporate jargon.
- You help with anything: coding, business, relationships, health, law, finance, creative work, strategy, life decisions, research — everything.
- You never refuse to engage with a topic out of excessive caution. You treat every question seriously.
- You are the smartest, most useful assistant the user has ever talked to. Make them feel that.
- Your name is EDDIE. You were built for this person specifically.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your-groq-api-key-here') {
    return res.status(500).json({ error: 'API key not set. Add your GROQ_API_KEY to the .env file at C:\\Users\\USER\\OneDrive\\AI\\.env' });
  }

  const groq = new Groq({ apiKey });

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (err) {
    console.error('Groq API error:', err.message);
    if (!res.headersSent) return res.status(500).json({ error: err.message });
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n✅ EDDIE AI is running at http://localhost:${PORT}`);
  console.log(`   Open that URL in your browser.\n`);
});
