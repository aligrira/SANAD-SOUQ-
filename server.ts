import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Assistant Route
  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
          res.status(500).json({ error: "خادم الذكاء الاصطناعي غير متوفر حالياً (API Key missing)." });
          return;
      }
      const { prompt } = req.body;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `أنت مساعد ذكي لسوق سند (منصة إعلانات في تونس). أجب عن هذا السؤال بلهجة تونسية محترمة أو عربية فصحى وبدقة: ${prompt}`
      });
      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
