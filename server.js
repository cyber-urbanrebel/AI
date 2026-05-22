require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            "You are EDDIE, a sharp and confident personal AI assistant. You give direct, helpful answers with a bold personality. You're witty but efficient — no fluff, just results.",
        },
        ...messages,
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Groq error:', err.message);
    res.write(`data: ${JSON.stringify({ error: 'Stream failed. Check your API key and try again.' })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`EDDIE AI is running at http://localhost:${PORT}`);
});
