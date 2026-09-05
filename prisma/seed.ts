import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding on Supabase...');

  // 1. Strategies
  const existingStrategies = await prisma.strategy.count();
  if (existingStrategies === 0) {
    console.log('Inserting strategies...');
    await prisma.strategy.createMany({
      data: [
        {
          rank: 1,
          title: 'CUSTOMER LAMA',
          label: 'Prioritas utama',
          labelColor: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40',
          description: 'Mulai dari orang yang sudah mengenal layananmu.',
          iconKey: 'users',
          iconColor: 'text-[#10B981] bg-[#10B981]/15',
        },
        {
          rank: 2,
          title: 'REFERRAL',
          label: 'Peluang tinggi',
          labelColor: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40',
          description: 'Minta rekomendasi dari customer yang puas.',
          iconKey: 'user-plus',
          iconColor: 'text-[#F59E0B] bg-[#F59E0B]/15',
        },
        {
          rank: 3,
          title: 'WHATSAPP',
          label: 'Tambah peluang',
          labelColor: 'bg-white/10 text-gray-300 border-white/20',
          description: 'Jangkau calon customer yang relevan.',
          iconKey: 'message-circle',
          iconColor: 'text-white bg-white/10',
        },
        {
          rank: 4,
          title: 'KONTEN LOKAL',
          label: 'Bangun permintaan',
          labelColor: 'bg-white/10 text-gray-300 border-white/20',
          description: 'Buat orang sekitar sadar layananmu tersedia.',
          iconKey: 'map-pin',
          iconColor: 'text-white bg-white/10',
        },
      ],
    });
  }

  // 2. Default Target
  const existingTargets = await prisma.salesTarget.count();
  if (existingTargets === 0) {
    console.log('Inserting default target...');
    await prisma.salesTarget.create({
      data: {
        monthName: 'September',
        targetAmount: 5000000,
        achievedAmount: 1500000,
        avgCommission: 100000,
      },
    });
  }

  // 3. Default Business Profile
  const existingBusiness = await prisma.business.count();
  if (existingBusiness === 0) {
    console.log('Inserting default business profile...');
    await prisma.business.create({
      data: {
        productOrService: 'Jasa cuci AC',
        avgSalePrice: 100000,
        buyerPersona: ['Rumah tangga', 'Perusahaan'],
        salesChannels: ['WhatsApp', 'Customer lama', 'Referral'],
      },
    });
  }

  // 4. Daily Actions
  const existingActions = await prisma.dailyAction.count();
  if (existingActions === 0) {
    console.log('Inserting default daily actions...');
    await prisma.dailyAction.createMany({
      data: [
        {
          code: '01',
          title: 'Hubungi 5 customer lama',
          label: 'Customer lama',
          completedCount: 2,
          targetCount: 5,
          isCompleted: false,
          detailTitle: 'HUBUNGI CUSTOMER LAMA',
          detailDesc: 'Mulai dari customer yang pernah membeli dan kemungkinan masih membutuhkan layananmu.',
          suggestedTemplate: 'Halo Pak Budi, bagaimana kondisi AC di rumah setelah terakhir dibersihkan? Kalau sudah mulai kurang dingin, minggu ini masih ada jadwal servis yang tersedia.',
          defaultCustomerName: 'Pak Budi',
          date: 'Hari ini',
        },
        {
          code: '02',
          title: 'Minta referral dari 2 customer',
          label: 'Referral',
          completedCount: 0,
          targetCount: 2,
          isCompleted: false,
          detailTitle: 'MINTA REFERRAL DARI CUSTOMER PUAS',
          detailDesc: 'Customer yang puas adalah sumber penjualan termudah tanpa biaya iklan.',
          suggestedTemplate: 'Halo Bu Siti, terima kasih sudah mempercayakan servis AC kemarin. Jika ada tetangga atau keluarga yang butuh cuci AC, boleh kenalkan kami ya Bu. Kami beri potongan Rp25.000 untuk beliau dan diskon servis berikutnya untuk Ibu.',
          defaultCustomerName: 'Bu Siti',
          date: 'Hari ini',
        },
        {
          code: '03',
          title: 'Follow-up 3 prospek aktif',
          label: 'Follow-up',
          completedCount: 1,
          targetCount: 3,
          isCompleted: false,
          detailTitle: 'FOLLOW-UP PROSPEK AKTIF',
          detailDesc: 'Jangan biarkan prospek yang sudah minta penawaran mendingin.',
          suggestedTemplate: 'Selamat siang Pak Bambang (CV Maju), izin menanyakan apakah rincian penawaran servis AC kemarin sudah sempat dicek? Kami siap bantu survey hari ini jika dibutuhkan.',
          defaultCustomerName: 'Pak Bambang (CV Maju)',
          date: 'Hari ini',
        },
        {
          code: '04',
          title: 'Cari 5 calon customer baru',
          label: 'Calon baru',
          completedCount: 0,
          targetCount: 5,
          isCompleted: false,
          detailTitle: 'CARI 5 CALON CUSTOMER BARU',
          detailDesc: 'Tambah darah segar untuk pipeline penjualanmu hari ini melalui WhatsApp atau lingkungan sekitar.',
          suggestedTemplate: 'Halo kak, kami dari tim servis AC terpercaya area sekitar. Sedang ada slot promo cuci bersih anti-bocor minggu ini. Mau kami bantu cek jadwal yang pas?',
          defaultCustomerName: 'Prospek Sekitar',
          date: 'Hari ini',
        },
      ],
    });
  }

  // 5. Prospects & Timeline
  const existingProspects = await prisma.prospect.count();
  if (existingProspects === 0) {
    console.log('Inserting initial prospects and timeline...');

    const prospectsData = [
      // 3 HOT Prospects
      {
        name: 'CV Maju',
        potential: 2000000,
        status: 'Proposal terkirim',
        priority: 'HOT',
        lastActivity: 'Proposal dikirim 4 hari lalu',
        daysInactive: 4,
        nextRecommendation: 'Follow-up hari ini',
        phone: '081234567890',
        notes: 'Pak Bambang (Procurement) butuh perawatan 20 unit AC kantor.',
        isMoneyLeak: true,
        leakReason: 'Proposal dikirim 4 hari lalu',
        timeline: [
          { timeAgo: '6 hari lalu', event: 'Pertama dihubungi via WA', type: 'WHATSAPP' },
          { timeAgo: '4 hari lalu', event: 'Proposal dikirim ke email kantor', type: 'PROPOSAL' },
          { timeAgo: 'Hari ini', event: 'Follow-up disarankan untuk penentuan SPK', type: 'NOTE' },
        ],
      },
      {
        name: 'Andi',
        potential: 500000,
        status: 'Minta penawaran',
        priority: 'HOT',
        lastActivity: 'Sudah minta penawaran',
        daysInactive: 2,
        nextRecommendation: 'Kirim rincian diskon paket',
        phone: '081398765432',
        notes: 'Mau cuci 5 AC rumah tinggal sebelum acara arisan keluarga.',
        isMoneyLeak: true,
        leakReason: 'Penawaran sudah dikirim',
        timeline: [
          { timeAgo: '3 hari lalu', event: 'Chat tanya harga cuci borongan', type: 'WHATSAPP' },
          { timeAgo: '2 hari lalu', event: 'Sudah minta penawaran paket 5 unit', type: 'PROPOSAL' },
        ],
      },
      {
        name: 'Siti',
        potential: 300000,
        status: 'Minta dihubungi lagi',
        priority: 'HOT',
        lastActivity: 'Minta dihubungi minggu ini',
        daysInactive: 3,
        nextRecommendation: 'Telepon untuk booking jadwal Sabtu',
        phone: '081578901234',
        notes: 'Customer rutin 4 bulan lalu. AC kamar utama mulai menetes.',
        isMoneyLeak: true,
        leakReason: 'Minta dihubungi kembali minggu ini',
        timeline: [
          { timeAgo: '5 hari lalu', event: 'Pesan pengingat servis dikirim', type: 'WHATSAPP' },
          { timeAgo: '3 hari lalu', event: 'Minta dihubungi kembali minggu ini', type: 'CALL' },
        ],
      },

      // 7 WARM Prospects
      {
        name: 'Budi',
        potential: 250000,
        status: 'Tanya harga',
        priority: 'WARM',
        lastActivity: 'Baru tanya harga',
        daysInactive: 5,
        nextRecommendation: 'Kirim testimoni & slot teknisi besok',
        phone: '081711223344',
        notes: 'AC kantor ruko 2 lantai.',
        isMoneyLeak: true,
        leakReason: 'Tidak ada follow-up 5 hari',
        timeline: [{ timeAgo: '5 hari lalu', event: 'Tanya pricelist lewat DM', type: 'NOTE' }],
      },
      {
        name: 'Rina',
        potential: 150000,
        status: 'Tertarik',
        priority: 'WARM',
        lastActivity: 'Pernah merespons',
        daysInactive: 4,
        nextRecommendation: 'Tanya kendala AC saat ini',
        phone: '081822334455',
        notes: 'Tanya servis AC split 1 PK.',
        timeline: [{ timeAgo: '4 hari lalu', event: 'Merespons story promo Instagram', type: 'NOTE' }],
      },
      {
        name: 'Pak Hendra (Kantor Akuntan)',
        potential: 800000,
        status: 'Minta penawaran',
        priority: 'WARM',
        lastActivity: 'Tertarik paket tahunan',
        daysInactive: 6,
        nextRecommendation: 'Jadwalkan survey lokasi gratis',
        phone: '081299887766',
        timeline: [{ timeAgo: '6 hari lalu', event: 'Rekomendasi dari teman kuliah', type: 'NOTE' }],
      },
      {
        name: 'Toko Berkah Snack',
        potential: 600000,
        status: 'Tanya harga',
        priority: 'WARM',
        lastActivity: 'Tanya harga 4 unit',
        daysInactive: 3,
        nextRecommendation: 'Berikan promo cuci bertiga hemat',
        phone: '081344556677',
        timeline: [{ timeAgo: '3 hari lalu', event: 'Chat WA tanya garansi pengerjaan', type: 'WHATSAPP' }],
      },
      {
        name: 'Ibu Ratna',
        potential: 350000,
        status: 'Tertarik',
        priority: 'WARM',
        lastActivity: 'Tertarik paket cuci besar',
        daysInactive: 4,
        nextRecommendation: 'Follow-up jadwal akhir pekan',
        phone: '081566778899',
        timeline: [{ timeAgo: '4 hari lalu', event: 'Tanya beda cuci biasa vs cuci kimia', type: 'NOTE' }],
      },
      {
        name: 'Klinik Medika Sehat',
        potential: 1200000,
        status: 'Sudah dihubungi',
        priority: 'WARM',
        lastActivity: 'Sudah kirim profil servis',
        daysInactive: 5,
        nextRecommendation: 'Follow-up penanggung jawab umum',
        phone: '081122334455',
        timeline: [{ timeAgo: '5 hari lalu', event: 'Kirim company profile via WA', type: 'WHATSAPP' }],
      },
      {
        name: 'Pak Doni',
        potential: 200000,
        status: 'Tertarik',
        priority: 'WARM',
        lastActivity: 'Pernah merespons',
        daysInactive: 7,
        nextRecommendation: 'Sapa kembali & tawarkan slot kosong',
        phone: '081233445566',
        timeline: [{ timeAgo: '7 hari lalu', event: 'Merespons broadcast WhatsApp', type: 'WHATSAPP' }],
      },

      // 10 COLD Prospects
      {
        name: 'PT Cahaya Logistik',
        potential: 1500000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'Kontak diperoleh dari pameran',
        daysInactive: 12,
        nextRecommendation: 'Kirim perkenalan singkat & brosur',
        phone: '081200011122',
        timeline: [{ timeAgo: '12 hari lalu', event: 'Tukar kartu nama', type: 'NOTE' }],
      },
      {
        name: 'Bu Diana',
        potential: 200000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'Simpan nomor dari grup RT',
        daysInactive: 14,
        nextRecommendation: 'Share tips merawat AC di grup',
        phone: '081311122233',
        timeline: [{ timeAgo: '14 hari lalu', event: 'Kontak masuk dari RT', type: 'NOTE' }],
      },
      {
        name: 'Studio Foto Kreasindo',
        potential: 400000,
        status: 'Sudah dihubungi',
        priority: 'COLD',
        lastActivity: 'Belum respon pesan pertama',
        daysInactive: 10,
        nextRecommendation: 'Follow-up santai 3 hari lagi',
        phone: '081422233344',
        timeline: [{ timeAgo: '10 hari lalu', event: 'Kirim perkenalan', type: 'NOTE' }],
      },
      {
        name: 'Cafe Kopi Teman',
        potential: 750000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'Baru dapat kontak manager',
        daysInactive: 9,
        nextRecommendation: 'Hubungi PIC operasional cafe',
        phone: '081533344455',
        timeline: [{ timeAgo: '9 hari lalu', event: 'Mampir dan minta kontak PIC', type: 'NOTE' }],
      },
      {
        name: 'Pak Rudi Hartono',
        potential: 300000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'Referral dari Pak Joko',
        daysInactive: 11,
        nextRecommendation: 'Chat sebutkan nama Pak Joko',
        phone: '081644455566',
        timeline: [{ timeAgo: '11 hari lalu', event: 'Diberi kontak oleh kawan', type: 'NOTE' }],
      },
      {
        name: 'Kos Pelangi 88',
        potential: 1000000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'Temuan prospek lingkungan kosan',
        daysInactive: 15,
        nextRecommendation: 'Tawarkan paket borongan kamar kos',
        phone: '081755566677',
        timeline: [{ timeAgo: '15 hari lalu', event: 'Catat nomor pemilik kos', type: 'NOTE' }],
      },
      {
        name: 'Ibu Maya',
        potential: 150000,
        status: 'Sudah dihubungi',
        priority: 'COLD',
        lastActivity: 'AC baru diservis orang lain bulan lalu',
        daysInactive: 20,
        nextRecommendation: 'Simpan untuk follow-up 2 bulan lagi',
        phone: '081866677788',
        timeline: [{ timeAgo: '20 hari lalu', event: 'Sudah ada langganan lain', type: 'NOTE' }],
      },
      {
        name: 'Gym Prima Bugar',
        potential: 900000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'AC ruang fitness sering panas',
        daysInactive: 8,
        nextRecommendation: 'Kirim penawaran cek freon & cuci',
        phone: '081977788899',
        timeline: [{ timeAgo: '8 hari lalu', event: 'Cek lokasi gym', type: 'NOTE' }],
      },
      {
        name: 'Pak Eko Wahyudi',
        potential: 250000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'Kartu nama masuk',
        daysInactive: 18,
        nextRecommendation: 'Kirim broadcast tips hemat listrik AC',
        phone: '081288899900',
        timeline: [{ timeAgo: '18 hari lalu', event: 'Terima kontak', type: 'NOTE' }],
      },
      {
        name: 'Apotek Sarika',
        potential: 450000,
        status: 'Baru dikenal',
        priority: 'COLD',
        lastActivity: 'Butuh suhu stabil ruang obat',
        daysInactive: 13,
        nextRecommendation: 'Hubungi bagian logistik apotek',
        phone: '081399900011',
        timeline: [{ timeAgo: '13 hari lalu', event: 'Catat kebutuhan pendingin', type: 'NOTE' }],
      },
    ];

    for (const p of prospectsData) {
      const { timeline, ...prospectFields } = p;
      await prisma.prospect.create({
        data: {
          ...prospectFields,
          timeline: {
            create: timeline,
          },
        },
      });
    }
  }

  // 6. Closings
  const existingClosings = await prisma.closing.count();
  if (existingClosings === 0) {
    console.log('Inserting default closings history...');
    await prisma.closing.createMany({
      data: [
        {
          customerName: 'Keluarga Bpk. Hendra',
          saleAmount: 300000,
          profitCommission: 100000,
          source: 'Customer lama',
          date: 'Hari ini',
        },
        {
          customerName: 'Kantor Notaris Ayu',
          saleAmount: 600000,
          profitCommission: 200000,
          source: 'Referral',
          date: 'Kemarin',
        },
      ],
    });
  }

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
