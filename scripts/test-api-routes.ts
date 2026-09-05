import { prisma } from '../src/lib/prisma';

async function testApi() {
  console.log('Testing Prisma Database Connection...');
  const target = await prisma.salesTarget.findFirst();
  console.log('Target found:', target?.monthName, 'Target:', target?.targetAmount);

  const prospectsCount = await prisma.prospect.count();
  console.log('Prospects count in DB:', prospectsCount);

  const actionsCount = await prisma.dailyAction.count();
  console.log('Actions count in DB:', actionsCount);

  const closingsCount = await prisma.closing.count();
  console.log('Closings count in DB:', closingsCount);

  const strategiesCount = await prisma.strategy.count();
  console.log('Strategies count in DB:', strategiesCount);

  console.log('✅ All Prisma queries succeeded!');
}

testApi()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
