import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Shared Dataset file persistence
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'shared_data.json');

function loadSharedData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        costumes: Array.isArray(parsed.costumes) ? parsed.costumes : [],
        lookbooks: Array.isArray(parsed.lookbooks) ? parsed.lookbooks : [],
      };
    }
  } catch (err) {
    console.error('Error loading shared data:', err);
  }
  return { costumes: [], lookbooks: [] };
}

let sharedData = loadSharedData();

function saveSharedData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(sharedData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving shared data:', err);
  }
}

// API: Get all shared costumes and lookbooks
app.get('/api/data', (req, res) => {
  res.json({
    costumes: sharedData.costumes,
    lookbooks: sharedData.lookbooks,
    timestamp: new Date().toISOString(),
  });
});

// API: Add or update a costume in the shared dataset
app.post('/api/costumes', (req, res) => {
  try {
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({ error: 'Invalid costume item' });
    }

    const existingIndex = sharedData.costumes.findIndex((c: any) => c.id === item.id);
    if (existingIndex >= 0) {
      sharedData.costumes[existingIndex] = item;
    } else {
      sharedData.costumes.unshift(item);
    }

    saveSharedData();
    res.json({ success: true, item, costumes: sharedData.costumes });
  } catch (error: any) {
    console.error('Error adding costume:', error);
    res.status(500).json({ error: 'Failed to add costume', message: error?.message });
  }
});

// API: Update costume
app.put('/api/costumes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = req.body;
    const existingIndex = sharedData.costumes.findIndex((c: any) => c.id === id);
    if (existingIndex >= 0) {
      sharedData.costumes[existingIndex] = { ...sharedData.costumes[existingIndex], ...item };
    } else {
      sharedData.costumes.unshift({ ...item, id });
    }

    saveSharedData();
    res.json({ success: true, costumes: sharedData.costumes });
  } catch (error: any) {
    console.error('Error updating costume:', error);
    res.status(500).json({ error: 'Failed to update costume', message: error?.message });
  }
});

// API: Delete costume from shared dataset
app.delete('/api/costumes/:id', (req, res) => {
  try {
    const { id } = req.params;
    sharedData.costumes = sharedData.costumes.filter((c: any) => c.id !== id);
    saveSharedData();
    res.json({ success: true, costumes: sharedData.costumes });
  } catch (error: any) {
    console.error('Error deleting costume:', error);
    res.status(500).json({ error: 'Failed to delete costume', message: error?.message });
  }
});

// API: Add or update lookbook in shared dataset
app.post('/api/lookbooks', (req, res) => {
  try {
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({ error: 'Invalid lookbook item' });
    }

    const existingIndex = sharedData.lookbooks.findIndex((l: any) => l.id === item.id);
    if (existingIndex >= 0) {
      sharedData.lookbooks[existingIndex] = item;
    } else {
      sharedData.lookbooks.unshift(item);
    }

    saveSharedData();
    res.json({ success: true, item, lookbooks: sharedData.lookbooks });
  } catch (error: any) {
    console.error('Error adding lookbook:', error);
    res.status(500).json({ error: 'Failed to add lookbook', message: error?.message });
  }
});

// API: Delete lookbook from shared dataset
app.delete('/api/lookbooks/:id', (req, res) => {
  try {
    const { id } = req.params;
    sharedData.lookbooks = sharedData.lookbooks.filter((l: any) => l.id !== id);
    saveSharedData();
    res.json({ success: true, lookbooks: sharedData.lookbooks });
  } catch (error: any) {
    console.error('Error deleting lookbook:', error);
    res.status(500).json({ error: 'Failed to delete lookbook', message: error?.message });
  }
});

// API: Reset dataset to empty
app.post('/api/reset-data', (req, res) => {
  try {
    sharedData.costumes = [];
    sharedData.lookbooks = [];
    saveSharedData();
    res.json({ success: true, costumes: [], lookbooks: [] });
  } catch (error: any) {
    console.error('Error resetting data:', error);
    res.status(500).json({ error: 'Failed to reset data', message: error?.message });
  }
});

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

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
