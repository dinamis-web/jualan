import { prisma } from "../src/lib/prisma";

async function verifyTahap2() {
  console.log("🔍 Memeriksa tabel dan skema database Supabase...");
  
  const tables: Array<{ table_name: string }> = await prisma.$queryRawUnsafe(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log(`✅ Berhasil mengambil daftar tabel (${tables.length} tabel ditemukan):`);
  tables.forEach((t, i) => {
    console.log(`   ${i + 1}. ${t.table_name}`);
  });

  // Verify models exist
  const expectedTables = [
    "businesses",
    "closings",
    "daily_actions",
    "prospect_activities",
    "prospects",
    "sales_targets",
    "strategies",
    "users"
  ];

  const existingTableNames = tables.map(t => t.table_name);
  const missing = expectedTables.filter(t => !existingTableNames.includes(t));

  if (missing.length === 0) {
    console.log("\n🎉 Seluruh 8 tabel entitas DINAMIS MONEY terverifikasi ada di Supabase!");
  } else {
    console.warn("\n⚠️ Tabel yang belum ditemukan:", missing);
  }
}

verifyTahap2()
  .catch((e) => {
    console.error("❌ Error saat verifikasi Tahap 2:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
