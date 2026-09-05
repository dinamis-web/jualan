import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('[Gemini] Init error:', err);
    }
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientName, tone, contextType, offerDetails } = body || {};
    const ai = getGeminiClient();

    if (!ai) {
      return NextResponse.json(
        {
          error: 'Gemini API key is not configured on server',
          fallbackNeeded: true,
        },
        { status: 503 }
      );
    }

    const prompt = `Anda adalah sales copywriter profesional Indonesia untuk usaha jasa lokal (seperti servis AC, pembersihan, atau jasa teknis lainnya).
Buatlah SATU draf pesan WhatsApp yang sangat efektif, ringkas, persuasif, dan tidak bertele-tele untuk calon customer bernama "${recipientName || 'Bapak/Ibu'}".
Konteks situasi: "${contextType || 'Follow-up prospek'}".
Nada bicara: "${tone || 'sopan'}".
${offerDetails ? `Detail penawaran khusus: "${offerDetails}".` : ''}

Panduan:
- Bahasa Indonesia alami sehari-hari tanpa istilah asing yang rumit.
- Maksimal 3-4 kalimat padat.
- Langsung ada Call-To-Action (CTA) ramah untuk booking atau konfirmasi jadwal.
- Berikan HANYA teks pesannya saja tanpa pengantar atau tanda petik pembungkus.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = response.text?.trim() || '';
    if (!generatedText) {
      return NextResponse.json(
        { error: 'Empty AI response', fallbackNeeded: true },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: generatedText, source: 'gemini' });
  } catch (error: any) {
    console.error('[API /api/ai/generate-message error]:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to generate message',
        fallbackNeeded: true,
      },
      { status: 500 }
    );
  }
}
