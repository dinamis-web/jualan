import {
  IAIService,
  GenerateMessageRequest,
  GenerateMessageResponse,
  ProspectAnalysisRequest,
  ProspectAnalysisResponse,
} from '../contracts/IAIService';

export class AIService implements IAIService {
  async generateFollowUpMessage(request: GenerateMessageRequest): Promise<GenerateMessageResponse> {
    try {
      const res = await fetch('/api/ai/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          return { message: data.message, source: 'gemini' };
        }
      }
    } catch (err) {
      console.warn('[AIService] Server API unavailable, using contextual fallback engine:', err);
    }

    // High quality contextual fallback template
    const fallback = this.getFallbackMessage(request);
    return { message: fallback, source: 'template' };
  }

  async analyzeProspectNextStep(request: ProspectAnalysisRequest): Promise<ProspectAnalysisResponse> {
    try {
      const res = await fetch('/api/ai/prospect-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendation) {
          return {
            recommendation: data.recommendation,
            suggestedAction: data.suggestedAction || 'Kirim follow-up pesan sekarang',
          };
        }
      }
    } catch (err) {
      console.warn('[AIService] Server recommendation unavailable, using rule-based recommendation:', err);
    }

    // Rule-based recommendation engine
    if (request.status === 'Proposal terkirim') {
      return {
        recommendation: 'Tanyakan apakah ada bagian penawaran yang perlu disesuaikan dengan kebutuhan anggaran mereka.',
        suggestedAction: 'Telepon atau kirim follow-up WhatsApp hari ini',
      };
    }
    if (request.status === 'Minta penawaran') {
      return {
        recommendation: 'Kirimkan opsi paket bundling dengan penawaran slot terbatas minggu ini.',
        suggestedAction: 'Kirim rincian penawaran & jadwal',
      };
    }
    return {
      recommendation: 'Bangun kembali kehangatan komunikasi dengan menanyakan kondisi AC atau kendala mereka.',
      suggestedAction: 'Sapa santai via WhatsApp',
    };
  }

  private getFallbackMessage(request: GenerateMessageRequest): string {
    const { recipientName, tone, contextType } = request;

    if (contextType === 'Customer Lama') {
      if (tone === 'sopan') {
        return `Selamat siang Pak/Bu ${recipientName}, semoga senantiasa sehat. Izin menanyakan bagaimana performa pendingin AC setelah perawatan terakhir? Mengingat sudah beberapa bulan, kami siap bantu jadwalkan perawatan berkala agar udara tetap segar dan hemat listrik.`;
      }
      if (tone === 'santai') {
        return `Halo Kak ${recipientName}! Gimana kabar? Cuma mau ingetin AC-nya udah waktunya dicek lagi nih biar tetap adem dan nggak bocor. Kalau mau diservis minggu ini, kabari ya!`;
      }
      return `PROMO KHUSUS CUSTOMER SETIA! Halo Kak ${recipientName}, ada diskon 20% untuk servis cuci AC kedua & ketiga minggu ini. Slot terbatas untuk 5 pemesan pertama ya!`;
    }

    if (contextType === 'Referral') {
      if (tone === 'sopan') {
        return `Selamat siang Bapak/Ibu, terima kasih banyak atas kepercayaannya pada layanan kami. Jika ada rekan atau keluarga yang membutuhkan perawatan AC terpercaya, kami sangat berterima kasih bila diperkenankan membantu beliau dengan diskon khusus referral.`;
      }
      if (tone === 'santai') {
        return `Halo Kak! Makasih ya udah puas sama hasil cuci AC kemarin. Kalau ada teman atau tetangga yang mau cuci juga, kenalin ke kami ya, nanti ada bonus potongan servis buat Kakak!`;
      }
      return `KABAR GEMBIRA! Rekomendasikan 2 teman cuci AC, dapatkan 1 voucher servis GRATIS untuk jadwal berikutnya. Yuk bagikan kontak kami!`;
    }

    // Default Follow-Up
    if (tone === 'sopan') {
      return `Selamat siang Pak/Bu ${recipientName}, izin menanyakan apakah rincian penawaran yang kami kirimkan sebelumnya sudah sempat dipelajari? Jika ada hal yang perlu disesuaikan, kami siap bantu diskusikan.`;
    }
    if (tone === 'santai') {
      return `Halo Kak ${recipientName}, mau cek penawaran kemarin apakah ada yang mau ditanyakan dulu? Teknisi kami siap jadwalkan kunjungan kapan saja Kakak senggang.`;
    }
    return `PENAWARAN SPESIAL HARI INI: Konfirmasi SPK/booking hari ini untuk Pak/Bu ${recipientName} dan dapatkan free pengecekan freon gratis di semua unit!`;
  }
}

export const aiService = new AIService();
