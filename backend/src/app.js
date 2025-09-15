
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(cors({ origin: '*' }));

// Health check endpoint
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Gemini AI Chat Endpoint
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('[RoofAI] GOOGLE_API_KEY (or GEMINI_API_KEY) not set. /api/roof-ai-chat will return 500 until configured.');
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

app.post('/api/roof-ai-chat', async (req, res) => {
  const startedAt = Date.now();
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server missing Google Gemini API key' });
    }
    const { messages, analysis } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const contextBlock = analysis ? `Roof Analysis Context:\nScore: ${analysis.score}\nQuality: ${analysis.quality}\nRunoff Potential: ${analysis.runoffPotential}\nCapture Quality: ${analysis.captureQuality}\nArea Estimate: ${analysis.areaEstimate || 'N/A'} m^2\nObservations: ${(analysis.notes||[]).join('; ')}\nRecommendations: ${(analysis.recommendations||[]).join('; ')}` : 'No analysis context yet.';

    const systemPrompt = 'You are a helpful assistant specializing in rainwater harvesting rooftop suitability. Use the provided analysis context when answering. If the user asks for actionable improvements, be concise and list them as bullet points. If they ask before an analysis is run, instruct them to upload and analyse an image first. Avoid hallucinating measurements.';

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contextBlock },
      ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
    ];

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: chatMessages[0].content });
    const history = chatMessages.slice(1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    let answer = '(No response)';
    try {
      const chat = model.startChat({ history });
      const lastUser = history.filter(h => h.role === 'user').slice(-1)[0];
      const prompt = lastUser ? lastUser.parts[0].text : 'Provide guidance based on context.';
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      answer = response.text() || '(Empty response)';
    } catch (gemErr) {
      console.error('[Gemini Chat Error]', gemErr?.response || gemErr.message || gemErr);
      return res.status(502).json({ error: 'Upstream AI error', detail: gemErr.message || 'Unknown Gemini error' });
    }

    res.json({ reply: answer, model: GEMINI_MODEL, latencyMs: Date.now() - startedAt });
  } catch (err) {
    console.error('[RoofAI Chat Unexpected]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Other API routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));
