import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI SDK on the server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Prompt enhancement endpoint with gemini-3.8-flash
app.post('/api/gemini/enhance-prompt', async (req, res) => {
  try {
    const { rawPrompt, garmentType, gender, era, colorTone } = req.body;

    if (!ai) {
      return res.status(200).json({
        enhancedPrompt: `Thiết kế hình ảnh trang phục cổ phục Việt Nam truyền thống phối phong cách đương đại: ${garmentType || 'Áo Ngũ Thân'} dành cho ${gender || 'Nam'}, cảm hứng ${era || 'Triều Nguyễn'}. Tông màu ${colorTone || 'Xanh chàm'}. Cài vạt sang bên phải (Hữu nhậm - right overlapping lapel), cổ đứng truyền thống. Dáng đứng chính diện toàn thân (full-body front view centered), phông nền studio trắng tinh khiết cô lập (isolated clean white background for virtual try-on mannequin), ánh sáng tự nhiên dịu nhẹ, chất lượng chi tiết cao cấp nhìn rõ vân vải lụa.`,
        note: 'Default enhanced prompt format applied',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Bạn là chuyên gia nghiên cứu và tạo mẫu cổ phục Việt Nam. Hãy viết lại câu lệnh (prompt) sau đây thành một prompt tạo ảnh (Image Generation Prompt) cực kỳ chuẩn mực, chi tiết và đẹp mắt:
Ý tưởng: "${rawPrompt || garmentType}"
Giới tính: ${gender || 'Nam'}
Thời kỳ: ${era || 'Triều Nguyễn'}
Màu sắc: ${colorTone || 'Trang nhã'}

Bắt buộc tuân thủ các quy tắc:
1. Áo cài vạt sang phải (Hữu nhậm - right lapel), cổ đứng kín đáo.
2. Góc chụp: Người mẫu đứng thẳng chính diện toàn thân (full-body front view centered), hai tay buông tự nhiên hoặc giơ nhẹ ngang thân.
3. Phông nền: Phông nền trắng studio cô lập sạch sẽ (clean isolated white background for mannequin virtual try-on) để ghép vào ma-nơ-canh ảo.
4. Tả rõ chất liệu (lụa, gấm, sa), đường may và hoa văn triều đại.
Chỉ trả về đoạn văn bản prompt hoàn chỉnh, không kèm giải thích rườm rà.`,
    });

    res.json({
      enhancedPrompt: response.text || rawPrompt,
    });
  } catch (error: any) {
    console.error('Error enhancing prompt with Gemini:', error);
    res.status(500).json({
      error: 'Failed to enhance prompt',
      message: error?.message,
    });
  }
});

// Costume generation endpoint
app.post('/api/gemini/generate-costume', async (req, res) => {
  try {
    const { prompt, garmentType, gender, colorTone } = req.body;

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY detected in runtime environment. Using client fallback presets.',
      });
    }

    const fullPrompt = prompt || `Thiết kế hình ảnh trang phục cổ phục Việt Nam truyền thống phối phong cách đương đại: ${garmentType || 'Áo Ngũ Thân'} dành cho ${gender || 'Nam'}, màu sắc ${colorTone || 'Xanh chàm'}. Cài vạt chéo sang bên phải (Hữu nhậm), cổ đứng. Dáng đứng chính diện toàn thân, phông nền studio trắng cô lập hoàn toàn (isolated clean white background for virtual try-on mannequin), ánh sáng studio tự nhiên sắc nét.`;

    // Attempt image generation using gemini-3.1-flash-lite-image
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4',
        },
      },
    });

    let foundImageUrl: string | null = null;
    let foundText: string | null = null;

    if (imageResponse?.candidates?.[0]?.content?.parts) {
      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          foundImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          foundText = part.text;
        }
      }
    }

    if (foundImageUrl) {
      return res.json({
        imageUrl: foundImageUrl,
        description: foundText,
        garmentType,
      });
    }

    return res.json({
      fallback: true,
      text: foundText,
      message: 'Gemini generated description without inline image part.',
    });
  } catch (error: any) {
    console.warn('Gemini generation warning (falling back gracefully):', error?.message);
    res.status(200).json({
      fallback: true,
      error: error?.message,
      message: 'Server handled Gemini request with graceful fallback.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve static assets from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, mount Vite dev server as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
