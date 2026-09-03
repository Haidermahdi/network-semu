import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Network Tutor API Endpoint
  app.post("/api/ask-network-ai", async (req, res) => {
    try {
      const { question, context } = req.body;
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Graceful fallback if API key is not configured
        return res.json({
          answer: `[إجابة تعليمية نموذجية]: في شبكات الحاسوب، السويتش (Switch) يعمل في الطبقة الثانية (Layer 2 - Data Link) ويعتمد على عناوين الماك (MAC Addresses) لتوجيه الفريمات داخل نفس الشبكة المحلية (LAN). أما الراوتر (Router) فيعمل في الطبقة الثالثة (Layer 3 - Network) ويعتمد على عناوين الـ IP لتوجيه الحزم (Packets) بين شبكات مختلفة (Inter-network). الملاحظة الجوهرية هي: عنوان الـ IP يمثل الهوية النهائية (من أين وإلى أين)، لذلك لا يتغير عبر المسار، بينما عنوان الـ MAC يمثل وسيلة النقل المحلية الحالية، لذلك يتم استبداله في كل قفزة (Hop) بين جهاز وآخر!`,
          mode: "fallback"
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `أنت مهندس شبكات خبير ومحاضر مبسط متخصص في مفاهيم السويتشينغ (Switching) والراوتينغ (Routing) وحركة البيانات (Packet Flow) ونموذج OSI/TCP-IP.
اشرح بلغة عربية سلسلة وسهلة الفهم للمتعلم، مع استخدام مصطلحات الشبكات بالإنجليزية بين قوسين (مثل: MAC Address, Routing Table, Default Gateway, TTL, Encapsulation, Broadcast Domain).
استخدم تشبيهات ذكية من الحياة الواقعية (مثل البريد، الطرق السريعة، أبراج الشركات).
كن دقيقاً علمياً ومختصراً ومرتباً في نقاط واضحة.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nالسياق التعليمي الحالي: ${context || "عام حول السويتشينغ والراوتينغ"}\n\nسؤال المستخدم: ${question}` }] }
        ]
      });

      res.json({
        answer: response.text,
        mode: "gemini"
      });
    } catch (err: any) {
      console.error("AI Network API error:", err);
      res.status(500).json({
        error: "Failed to generate explanation",
        message: err.message
      });
    }
  });

  // AI Story Translation API Endpoint
  app.post("/api/translate-story", async (req, res) => {
    try {
      const { story } = req.body;
      if (!story) {
        return res.status(400).json({ error: "Story is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return without translating if API key is not configured (frontend will use fallback)
        return res.json({ story, status: "fallback" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are an expert Cisco CCNA/CCNP network engineer and professional technical translator.
Your task is to translate a complete "Human Network Story" object from Arabic to English.

Translate ONLY the Arabic fields of the JSON object into high-quality technical English. Keep all IDs, IP addresses, MAC addresses, coordinate percentages (xPosition, yPosition), and coverIcon names EXACTLY as they are.

Translate or add English keys:
- titleAr -> titleEn
- subtitleAr -> subtitleEn
- difficulty -> difficultyEn (translate to "Beginner", "Intermediate", "Advanced", or "Expert")
- storySummaryAr -> storySummaryEn
- realWorldScenarioDescriptionAr -> realWorldScenarioDescriptionEn
- ciscoCoreLessonAr -> ciscoCoreLessonEn

For each character in characters array:
- nameAr -> nameEn
- roleAr -> roleEn
- initialSpeech -> initialSpeechEn
- carryingItem -> carryingItemEn (if present)

For each step in steps array:
- titleAr -> titleEn
- storyNarrativeAr -> storyNarrativeEn
- technicalAnalogyAr -> technicalAnalogyEn
- payloadContentAr -> payloadContentEn
- highlightedEventAr -> highlightedEventEn
- speechBubbles -> speechBubblesEn (this is an object where the keys are character IDs and values are their speeches - translate those speeches to English!)

Return the resulting object inside a JSON response under the key "story". Keep all formatting valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nHere is the JSON object to translate:\n${JSON.stringify(story, null, 2)}` }] }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      let translatedStory = null;
      try {
        translatedStory = JSON.parse(response.text);
      } catch (e) {
        console.error("Failed to parse Gemini output as JSON, attempting cleanup", e);
        // Fallback or retry logic if needed, but let's send error or original
      }

      if (translatedStory) {
        res.json({ story: translatedStory, status: "success" });
      } else {
        res.json({ story, status: "fallback_parse_error" });
      }
    } catch (err: any) {
      console.error("AI translation error:", err);
      res.status(500).json({
        error: "Failed to translate story",
        message: err.message
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Network Simulator Server running at http://localhost:${PORT}`);
  });
}

startServer();
