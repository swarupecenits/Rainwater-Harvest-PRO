
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
app.use(cors({ origin: ['https://rain-wise.netlify.app', 'https://rainwater-harvest.netlify.app'] }));

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

// Roof image analysis endpoint (beta)
// Accepts: { image: <base64 data URL or raw base64>, filename?: string }
// Returns: { quality, score, notes[], recommendations[], areaEstimate, captureQuality, runoffPotential, summary }
app.post('/api/roof-ai-analyze', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server missing Google Gemini API key' });
    }
    const { image, filename } = req.body || {};
    if (!image) {
      return res.status(400).json({ error: 'image (base64) required' });
    }

    // Normalize base64 (strip data URL prefix if present) and extract mime type
    let base64Data = image;
    let mimeType = 'image/jpeg';
    const dataUrlMatch = /^data:(.*?);base64,(.*)$/.exec(image);
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1] || 'image/jpeg';
      base64Data = dataUrlMatch[2];
    } else if (image.includes(',')) {
      // Fallback split if unusual format
      base64Data = image.split(',').pop();
    }

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: 'You analyze rooftop images for rainwater harvesting suitability.' });

    // Vision + text prompt (multimodal) so model can vary score based on actual image content.
    const analysisPrompt = `You are an expert in rainwater harvesting potential analysis.
You are given a rooftop image (possibly aerial or satellite). Use ONLY visible cues.
Scoring rubric (0-100):
  90-100: Extremely clean roof, large unobstructed area, optimal drainage, no visible debris.
  75-89: Generally clean, minor debris or partial shading, good drainage.
  55-74: Moderate suitability, notable debris, patchy staining, partial obstructions, uneven surfaces.
  35-54: Significant issues: heavy debris, many obstructions, staining suggesting pooling.
  0-34: Very poor: severe damage, extensive vegetation, unusable for collection without major remediation.
Produce a concise JSON ONLY response (no markdown) with this schema:
{
  "quality": "Excellent|Good|Moderate|Poor",
  "score": <0-100 integer>,
  "captureQuality": "High|Moderate|Low|Variable",
  "runoffPotential": "High|Medium|Low",
  "areaEstimate": <integer square meters or null>,
  "notes": ["short observation", ...],
  "recommendations": ["action item", ...],
  "summary": "1-2 sentence plain language summary"
}
Consider roof clarity, obstructions, debris, slope cues (shadows), drainage paths, edge integrity and potential collection surfaces.
If uncertain about any numeric value, use a plausible conservative estimate or null for areaEstimate.
Avoid repeating generic phrasing; tailor observations to visible elements (e.g., debris type, discoloration, shadow patterns).
Return ONLY valid JSON.`;

    let rawText;
    try {
      const result = await model.generateContent([
        { inlineData: { data: base64Data, mimeType } },
        { text: analysisPrompt }
      ]);
      rawText = result.response.text();
    } catch (gemErr) {
      console.error('[Gemini Analyze Error]', gemErr?.response || gemErr.message || gemErr);
      return res.status(502).json({ error: 'Upstream AI error', detail: gemErr.message || 'Unknown Gemini error' });
    }

    // Attempt to extract JSON (remove stray backticks or text)
    let jsonString = rawText.trim();
    jsonString = jsonString.replace(/^```json|^```|```$/gmi, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      console.warn('[Parse Warning] Falling back to default structure. Raw:', rawText);
      parsed = {
        quality: 'Moderate',
        score: 60,
        captureQuality: 'Moderate',
        runoffPotential: 'Medium',
        areaEstimate: null,
        notes: ['Automatic parsing failed; using fallback values'],
        recommendations: ['Retry analysis later'],
        summary: 'Initial automated analysis placeholder.'
      };
    }

    // Minimal validation and shaping
    const responsePayload = {
      quality: parsed.quality || 'Moderate',
      score: typeof parsed.score === 'number' ? parsed.score : 55,
      captureQuality: parsed.captureQuality || 'Moderate',
      runoffPotential: parsed.runoffPotential || 'Medium',
      areaEstimate: typeof parsed.areaEstimate === 'number' ? parsed.areaEstimate : null,
      notes: Array.isArray(parsed.notes) ? parsed.notes.slice(0, 10) : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 10) : [],
      summary: parsed.summary || 'Summary not available.'
    };

    res.json(responsePayload);
  } catch (err) {
    console.error('[RoofAI Analyze Unexpected]', err);
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
