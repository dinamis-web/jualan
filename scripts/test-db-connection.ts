import { prisma } from '../src/lib/prisma';

async function testConnection() {
  console.log('🔄 Menguji koneksi handshake ke database Supabase via Prisma Client...');
  const startTime = Date.now();

  // Execute raw query to verify database connection and version
  const result: Array<{ version: string }> = await prisma.$queryRaw`SELECT version();`;
  const elapsed = Date.now() - startTime;

  console.log('✅ Status Koneksi: Connection Successful!');
  console.log(`⏱️ Waktu Respons: ${elapsed}ms`);
  console.log(`📦 PostgreSQL Info: ${result[0]?.version?.split('on')[0]?.trim()}`);
}

testConnection()
  .catch((err) => {
    console.error('❌ Gagal terhubung ke database:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
