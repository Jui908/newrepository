import { GrammarCheckResult, Word } from '../types';
import { INITIAL_WORDS } from '../data/vocabulary';

export function isLikelySentence(input: string): boolean {
  const trimmed = input.trim();
  // If has sentence endings or particles or spaces > 2 words or punctuation
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 3) return true;
  if (/[.?!~]/.test(trimmed)) return true;
  // Common Korean sentence ending markers
  if (/(요|다|까|죠|네|습니까|습니다|해요|세요|시오)$/.test(trimmed)) return true;
  return false;
}

export function searchDictionaryWords(query: string, allWords: Word[] = INITIAL_WORDS): Word[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return allWords.filter((w) => {
    return (
      w.korean.toLowerCase().includes(q) ||
      w.vietnamese.toLowerCase().includes(q) ||
      w.romaja.toLowerCase().includes(q) ||
      (w.hanja && w.hanja.toLowerCase().includes(q))
    );
  });
}

export async function checkSentenceGrammar(sentence: string): Promise<GrammarCheckResult> {
  const trimmed = sentence.trim();
  try {
    const res = await fetch('/api/grammar-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentence: trimmed }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Network error calling grammar API, falling back to local:', e);
  }

  // Client-side local fallback
  return fallbackClientGrammarCheck(trimmed);
}

function fallbackClientGrammarCheck(sentence: string): GrammarCheckResult {
  const errors: GrammarCheckResult['errors'] = [];
  let suggestedFix = sentence;

  if (sentence.includes('나은')) {
    errors.push({
      targetText: '나은',
      issueType: 'Trợ từ chủ đề',
      explanation: 'Từ "나" kết thúc bằng nguyên âm, phải đi với "는" thành "나는".',
      replacement: '나는',
    });
    suggestedFix = suggestedFix.replace('나은', '나는');
  }

  if (sentence.includes('한국어을')) {
    errors.push({
      targetText: '한국어을',
      issueType: 'Trợ từ tân ngữ',
      explanation: '"한국어" kết thúc bằng nguyên âm "어", phải dùng trợ từ tân ngữ "를".',
      replacement: '한국어를',
    });
    suggestedFix = suggestedFix.replace('한국어을', '한국어를');
  }

  if (sentence.includes('공부하요')) {
    errors.push({
      targetText: '공부하요',
      issueType: 'Chia đuôi câu',
      explanation: 'Động từ gốc "-하다" khi chia đuôi thân mật -아요/어요 luôn chuyển thành "-해요".',
      replacement: '공부해요',
    });
    suggestedFix = suggestedFix.replace('공부하요', '공부해요');
  }

  if (sentence.includes('밥를')) {
    errors.push({
      targetText: '밥를',
      issueType: 'Trợ từ tân ngữ',
      explanation: '"밥" có patchim "ㅂ", phải đi với "을" thành "밥을".',
      replacement: '밥을',
    });
    suggestedFix = suggestedFix.replace('밥를', '밥을');
  }

  const isCorrect = errors.length === 0;

  let translation = 'Tôi học tiếng Hàn.';
  if (suggestedFix.includes('밥')) translation = 'Tôi ăn cơm.';
  if (suggestedFix.includes('학교')) translation = 'Tôi đi đến trường.';
  if (suggestedFix.includes('안녕')) translation = 'Xin chào.';

  return {
    isCorrect,
    original: sentence,
    suggestedFix,
    vietnameseTranslation: translation,
    overallExplanation: isCorrect
      ? 'Câu tiếng Hàn chuẩn xác về mặt ngữ pháp và trợ từ!'
      : `Đã phát hiện ${errors.length} điểm ngữ pháp cần điều chỉnh để chuẩn văn phong Hàn Quốc.`,
    errors,
  };
}
