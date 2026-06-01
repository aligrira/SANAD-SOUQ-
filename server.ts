import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set payload limit to 10MB to support uploading high-quality compressed image files from Android and mobile PWAs
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Ensure local uploads fallback directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("SanadSouq: Created fallback local uploads folder at:", uploadsDir);
  }

  // CORS Middleware to support mobile apps (APK / Capacitor)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Image Upload Route (Cloudinary with Local Static Storage fallback)
  app.post("/api/upload", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        res.status(400).json({ error: "لم يتم استلام ملف الصورة المرسلة." });
        return;
      }

      // Check for Cloudinary Credentials
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (cloudName && apiKey && apiSecret) {
        console.log("SanadSouq: Cloudinary credentials found. Uploading to Cloudinary...");
        
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "sanadsouk_products";
        
        // Calculate SHA-1 Signature of sorted parameters to authenticate request securely
        const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");
        
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        
        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: image,
            api_key: apiKey,
            timestamp: timestamp,
            signature: signature,
            folder: folder
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("SanadSouq: Cloudinary Upload successful! URL:", result.secure_url);
          res.json({ secure_url: result.secure_url });
          return;
        } else {
          const errorMsg = await response.text();
          console.error("SanadSouq API: Signed Cloudinary upload failed:", errorMsg);
          // Fall through to local fallback
        }
      }

      // Local Fallback: Save base64 string directly inside public/uploads/
      const uniqueId = crypto.randomUUID();
      const filename = `${uniqueId}.jpg`;
      const base64Content = image.replace(/^data:image\/\w+;base64,/, "");
      const bufferData = Buffer.from(base64Content, "base64");

      fs.writeFileSync(path.join(uploadsDir, filename), bufferData);
      
      const servedUrl = `/uploads/${filename}`;
      console.log("SanadSouq: Local upload saved successfully. Accessible at:", servedUrl);
      res.json({ secure_url: servedUrl });

    } catch (error: any) {
      console.error("SanadSouq: Internal failure inside /api/upload handler:", error);
      res.status(500).json({ error: `فشل في رفع ومعالجة الصورة: ${error?.message || error}` });
    }
  });

  // AI Assistant Route
  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
          res.status(500).json({ error: "خادم الذكاء الاصطناعي غير متوفر حالياً (API Key missing)." });
          return;
      }
      const aiClient = new GoogleGenAI({ apiKey });
      const { prompt } = req.body;
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `أنت مساعد ذكي لسوق سند (منصة إعلانات في تونس). أجب بلهجة تونسية محترمة أو عربية فصحى. يجب أن تكون إجابتك نصاً واضحاً، مباشراً، وبسيطاً. يمنع منعاً باتاً استخدام الإيموجي (السمايلات) أو النجوم (*) أو أي تنسيق معقد. فقط نص عادي مقروء: ${prompt}`
      });
      res.json({ text: response.text });
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      res.status(500).json({ error: `حدث خطأ في الاتصال الداخلي: ${e.message || 'Unknown error'}` });
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
