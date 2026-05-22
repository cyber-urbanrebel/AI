# EDDIE AI — Personal Assistant

A fast, streaming AI assistant powered by Groq + LLaMA 3.3 70B.

## Stack
- Node.js + Express (backend)
- Groq SDK (LLaMA 3.3 70B)
- Vanilla JS frontend (in `/public`)
- Server-Sent Events for streaming

## Setup

1. **Clone the repo**
```bash
git clone https://github.com/cyber-urbanrebel/AI.git
cd AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```
GROQ_API_KEY=your-groq-api-key-here
PORT=4000
```

4. **Run**
```bash
npm start
```

5. Open `http://localhost:4000` in your browser.

## Get a Free Groq API Key
👉 https://console.groq.com

## File Structure
```
/
├── server.js        # Express backend + Groq streaming
├── package.json
├── .env             # API key (never commit this!)
└── public/
    └── index.html   # Frontend UI
```

## .gitignore
`.env` and `node_modules/` are already ignored by `.gitignore`.

