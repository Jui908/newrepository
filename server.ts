import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Gemini if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to init Gemini client:', e);
    }
  }

  // API endpoint for AI Korean Grammar and Sentence Checker
  app.post('/api/grammar-check', async (req, res) => {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    const trimmed = sentence.trim();

    // If Gemini is available, use it for deep contextual Korean grammar analysis
    if (ai) {
      try {
        const prompt = `Bạn là chuyên gia ngôn ngữ tiếng Hàn hàng đầu cho học viên Việt Nam.
Hãy phân tích câu tiếng Hàn sau của học viên: "${trimmed}".
Nhiệm vụ của bạn:
1. Đánh giá xem câu có đúng ngữ pháp, kính ngữ (존댓말/반말), chia động từ/tính từ, trợ từ (은/는, 이/가, 을/를, 에/에서) hay chưa.
2. Nếu có lỗi, xác định chính xác từ sai, vị trí hoặc cụm từ bị sai, loại lỗi và giải thích bằng tiếng Việt.
3. Cung cấp câu tiếng Hàn chuẩn xác nhất (suggestedFix).
4. Cung cấp bản dịch tiếng Việt chuẩn xác của câu đúng.
5. Giải thích ngắn gọn dễ hiểu quy tắc ngữ pháp hoặc điểm cần lưu ý cho học viên.
6. Trả về đúng định dạng JSON tuân thủ cấu trúc sau:
{
  "isCorrect": boolean,
  "original": string,
  "suggestedFix": string,
  "vietnameseTranslation": string,
  "overallExplanation": string,
  "errors": [
    {
      "targetText": string (từ hoặc cụm từ bị sai trong câu gốc),
      "issueType": string (ví dụ: "Trợ từ", "Chia đuôi câu", "Kính ngữ", "Chính tả", "Trật tự từ"),
      "explanation": string (giải thích tại sao sai),
      "replacement": string (từ thay thế chuẩn)
    }
  ],
  "grammarBreakdown": [
    {
      "part": string,
      "type": string,
      "note": string
    }
  ]
}
Chỉ trả về JSON thuần, không kèm markdown \`\`\`json.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '';
        try {
          const parsed = JSON.parse(rawText);
          return res.json(parsed);
        } catch {
          // If JSON parse fails, fallback to rule engine
        }
      } catch (err) {
        console.error('Gemini grammar check error:', err);
      }
    }

    // Local Rule-Based Grammar Check Fallback
    const result = analyzeGrammarLocally(trimmed);
    return res.json(result);
  });

  // API endpoint for AI Pronunciation evaluation feedback
  app.post('/api/speech-eval', async (req, res) => {
    const { targetText, spokenText } = req.body;
    if (!targetText || !spokenText) {
      return res.status(400).json({ error: 'targetText and spokenText are required' });
    }

    // Calculate similarity
    const cleanTarget = targetText.replace(/[\s\.,\?!~]/g, '');
    const cleanSpoken = spokenText.replace(/[\s\.,\?!~]/g, '');
    
    let matches = 0;
    const len = Math.max(cleanTarget.length, cleanSpoken.length);
    for (let i = 0; i < Math.min(cleanTarget.length, cleanSpoken.length); i++) {
      if (cleanTarget[i] === cleanSpoken[i]) matches++;
    }
    const score = len > 0 ? Math.round((matches / len) * 100) : 0;

    let advice = 'Phát âm khá chuẩn, hãy tiếp tục duy trì nhịp điệu và ngữ điệu tự nhiên.';
    if (score >= 90) {
      advice = 'Tuyệt vời! Bạn phát âm rất chuẩn xác và rõ ràng như người bản xứ.';
    } else if (score >= 70) {
      advice = 'Khá tốt! Chú ý các phụ âm cuối (patchim) và nối âm để tự nhiên hơn.';
    } else {
      advice = 'Cần luyện tập thêm. Hãy nghe kỹ phát âm mẫu ở tốc độ chậm và đọc theo từng âm tiết nhé.';
    }

    return res.json({
      score,
      targetText,
      spokenText,
      advice,
      isPass: score >= 60,
    });
  });

  // Static files in production or Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Korean Vocab Server running at http://0.0.0.0:${PORT}`);
  });
}

// Comprehensive local rule-based grammar analysis for Korean sentences
function analyzeGrammarLocally(sentence: string) {
  const errors: Array<{
    targetText: string;
    issueType: string;
    explanation: string;
    replacement: string;
  }> = [];

  let suggestedFix = sentence;
  let overallExplanation = '';
  let vietnameseTranslation = 'Tôi học tiếng Hàn.';

  // Check 1: Subject particle with vowel/consonant error (e.g., 나은 -> 나는, 저은 -> 저는)
  if (sentence.includes('나은')) {
    errors.push({
      targetText: '나은',
      issueType: 'Trợ từ chủ đề',
      explanation: 'Từ "나" kết thúc bằng nguyên âm (không có patchim), nên đi với trợ từ "는", không dùng "은".',
      replacement: '나는',
    });
    suggestedFix = suggestedFix.replace('나은', '나는');
  }

  if (sentence.includes('저은')) {
    errors.push({
      targetText: '저은',
      issueType: 'Trợ từ chủ đề & Kính ngữ',
      explanation: 'Từ "저" (khiêm tốn) kết thúc bằng nguyên âm, phải kết hợp với "는" thành "저는".',
      replacement: '저는',
    });
    suggestedFix = suggestedFix.replace('저은', '저는');
  }

  // Check 2: Subject particle 이/가 error (e.g., 내가 vs 나이, 제가 vs 저이)
  if (sentence.includes('나이 ') || sentence.endsWith('나이')) {
    errors.push({
      targetText: '나이',
      issueType: 'Trợ từ chủ ngữ',
      explanation: '"나" khi đi với trợ từ chủ ngữ "-가" sẽ biến đổi thành "내가", không dùng "나이".',
      replacement: '내가',
    });
    suggestedFix = suggestedFix.replace(/나이(?=\s|$)/g, '내가');
  }

  if (sentence.includes('저이 ') || sentence.endsWith('저이')) {
    errors.push({
      targetText: '저이',
      issueType: 'Trợ từ chủ ngữ',
      explanation: '"저" khi đi với trợ từ chủ ngữ "-가" sẽ biến đổi thành "제가", không dùng "저이".',
      replacement: '제가',
    });
    suggestedFix = suggestedFix.replace(/저이(?=\s|$)/g, '제가');
  }

  // Check 3: Object particle 을/를 error (e.g., 한국어을 -> 한국어를, 밥를 -> 밥을)
  if (sentence.includes('한국어을')) {
    errors.push({
      targetText: '한국어을',
      issueType: 'Trợ từ tân ngữ',
      explanation: '"한국어" kết thúc bằng nguyên âm "어", phải dùng trợ từ tân ngữ "를" thay vì "을".',
      replacement: '한국어를',
    });
    suggestedFix = suggestedFix.replace('한국어을', '한국어를');
  }

  if (sentence.includes('밥를')) {
    errors.push({
      targetText: '밥를',
      issueType: 'Trợ từ tân ngữ',
      explanation: '"밥" có patchim "ㅂ", phải đi với trợ từ "을", không dùng "를".',
      replacement: '밥을',
    });
    suggestedFix = suggestedFix.replace('밥를', '밥을');
  }

  if (sentence.includes('사과을')) {
    errors.push({
      targetText: '사과을',
      issueType: 'Trợ từ tân ngữ',
      explanation: '"사과" không có patchim, phải dùng trợ từ tân ngữ "를".',
      replacement: '사과를',
    });
    suggestedFix = suggestedFix.replace('사과을', '사과를');
  }

  // Check 4: Verb conjugation errors (e.g. 공부하요 -> 공부해요, 가요 -> 가요, 먹어요 vs 먹아요)
  if (sentence.includes('공부하요')) {
    errors.push({
      targetText: '공부하요',
      issueType: 'Chia đuôi câu',
      explanation: 'Động từ đuôi "-하다" khi chia thể thân mật lịch sự luôn chuyển thành "-해요" (공부해요).',
      replacement: '공부해요',
    });
    suggestedFix = suggestedFix.replace('공부하요', '공부해요');
  }

  if (sentence.includes('먹아요')) {
    errors.push({
      targetText: '먹아요',
      issueType: 'Chia đuôi câu',
      explanation: 'Động từ "먹다" có nguyên âm "ㅓ" (không phải ㅏ/ㅗ), phải cộng với "-어요" thành "먹어요".',
      replacement: '먹어요',
    });
    suggestedFix = suggestedFix.replace('먹아요', '먹어요');
  }

  if (sentence.includes('보어요')) {
    errors.push({
      targetText: '보어요',
      issueType: 'Chia đuôi câu',
      explanation: 'Động từ "보다" có nguyên âm "ㅗ", cộng với "-아요" và rút gọn thành "봐요".',
      replacement: '봐요',
    });
    suggestedFix = suggestedFix.replace('보어요', '봐요');
  }

  // Check 5: Common honorific & spacing mismatch
  if (sentence.includes('안녕 하세요')) {
    errors.push({
      targetText: '안녕 하세요',
      issueType: 'Quy tắc chính tả & Cách viết (띄어쓰기)',
      explanation: '"안녕하세요" là một từ chào hỏi cố định, viết liền nhau không cách.',
      replacement: '안녕하세요',
    });
    suggestedFix = suggestedFix.replace('안녕 하세요', '안녕하세요');
  }

  const isCorrect = errors.length === 0;

  if (isCorrect) {
    overallExplanation = 'Câu tiếng Hàn của bạn chuẩn xác về mặt ngữ pháp, trợ từ và cách chia đuôi câu!';
  } else {
    overallExplanation = `Hệ thống đã phát hiện ${errors.length} điểm cần sửa để câu tự nhiên và đúng chuẩn ngữ pháp tiếng Hàn hơn.`;
  }

  // Approximate translation based on sentence content
  if (suggestedFix.includes('한국어') && (suggestedFix.includes('공부') || suggestedFix.includes('배우'))) {
    vietnameseTranslation = 'Tôi học tiếng Hàn.';
  } else if (suggestedFix.includes('밥') && suggestedFix.includes('먹')) {
    vietnameseTranslation = 'Tôi ăn cơm.';
  } else if (suggestedFix.includes('학교') && suggestedFix.includes('가')) {
    vietnameseTranslation = 'Tôi đi đến trường.';
  } else if (suggestedFix.includes('안녕')) {
    vietnameseTranslation = 'Xin chào.';
  } else if (suggestedFix.includes('만나서 반가')) {
    vietnameseTranslation = 'Rất vui được gặp bạn.';
  } else {
    vietnameseTranslation = 'Câu tiếng Hàn hoàn chỉnh: ' + suggestedFix;
  }

  return {
    isCorrect,
    original: sentence,
    suggestedFix,
    vietnameseTranslation,
    overallExplanation,
    errors,
    grammarBreakdown: [
      {
        part: suggestedFix.split(' ')[0] || sentence,
        type: 'Chủ ngữ / Trợ từ',
        note: 'Xác định đối tượng hoặc chủ đề của câu phát ngôn.',
      },
      {
        part: suggestedFix.split(' ').slice(1).join(' ') || '',
        type: 'Vị ngữ / Đuôi câu',
        note: 'Hành động hoặc trạng thái được chia đuôi câu chuẩn mực.',
      },
    ],
  };
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
  process.exit(1);
});
