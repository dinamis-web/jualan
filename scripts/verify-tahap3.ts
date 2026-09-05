import { prisma } from "../src/lib/prisma";

async function verifyTahap3() {
  console.log("📊 Memeriksa data seeder di Supabase...");

  const strategies = await prisma.strategy.count();
  console.log(`   - Strategies     : ${strategies}`);

  const targets = await prisma.salesTarget.count();
  console.log(`   - Sales Targets  : ${targets}`);

  const business = await prisma.business.count();
  console.log(`   - Business       : ${business}`);

  const actions = await prisma.dailyAction.count();
  console.log(`   - Daily Actions  : ${actions}`);

  const prospects = await prisma.prospect.count();
  console.log(`   - Prospects      : ${prospects}`);

  const closings = await prisma.closing.count();
  console.log(`   - Closings       : ${closings}`);

  if (
    strategies >= 4 &&
    targets >= 1 &&
    business >= 1 &&
    actions >= 4 &&
    prospects >= 20 &&
    closings >= 2
  ) {
    console.log("\n🎉 Seluruh data inisial lengkap tersimpan di Supabase!");
  } else {
    console.warn("\n⚠️ Beberapa data belum lengkap:", { strategies, targets, business, actions, prospects, closings });
  }
}

verifyTahap3()
  .catch((e) => {
    console.error("Error in verifyTahap3:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
