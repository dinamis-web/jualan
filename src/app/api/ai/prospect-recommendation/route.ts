import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('[Gemini] Initialization error:', err);
    }
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prospectName, status, potential, lastActivity, notes } = body || {};
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

    const prompt = `Analisis prospek penjualan bisnis jasa di Indonesia berikut:
- Nama Prospek: ${prospectName}
- Status Saat Ini: ${status}
- Nilai Potensi: Rp${potential}
- Aktivitas Terakhir: ${lastActivity}
- Catatan: ${notes || '-'}

Berikan:
1. Rekomendasi 1 kalimat strategi agar prospek tidak lepas / cold.
2. 1 usulan aksi konkret hari ini.
Keluaran dalam format JSON: {"recommendation": "...", "suggestedAction": "..."}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || '';
    let parsed = {
      recommendation: 'Lakukan follow-up terjadwal hari ini.',
      suggestedAction: 'Kirim pesan follow-up santai',
    };
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      parsed.recommendation = text;
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('[API /api/ai/prospect-recommendation error]:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to analyze prospect',
        fallbackNeeded: true,
      },
      { status: 500 }
    );
  }
}
