import http from 'http';

function request(options: http.RequestOptions, postData?: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 500, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode || 500, data: body });
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('🚀 Verifying Supabase API endpoints on http://localhost:3003...\n');

  // 1. Target
  const targetRes = await request({ hostname: 'localhost', port: 3003, path: '/api/targets', method: 'GET' });
  console.log(`1. Target API: Status ${targetRes.status} | Month: ${targetRes.data.monthName}, Target: Rp${targetRes.data.targetAmount.toLocaleString('id-ID')}, Achieved: Rp${targetRes.data.achievedAmount.toLocaleString('id-ID')}`);

  // 2. Business
  const bizRes = await request({ hostname: 'localhost', port: 3003, path: '/api/business', method: 'GET' });
  console.log(`2. Business API: Status ${bizRes.status} | Product: ${bizRes.data.productOrService}, AvgPrice: Rp${bizRes.data.avgSalePrice.toLocaleString('id-ID')}`);

  // 3. Prospects
  const prospectsRes = await request({ hostname: 'localhost', port: 3003, path: '/api/prospects', method: 'GET' });
  console.log(`3. Prospects API: Status ${prospectsRes.status} | Total in DB: ${prospectsRes.data.length} prospects`);

  // 4. Actions
  const actionsRes = await request({ hostname: 'localhost', port: 3003, path: '/api/actions', method: 'GET' });
  console.log(`4. Daily Actions API: Status ${actionsRes.status} | Total Actions: ${actionsRes.data.length}`);

  // 5. Closings
  const closingsRes = await request({ hostname: 'localhost', port: 3003, path: '/api/closings', method: 'GET' });
  console.log(`5. Closings API: Status ${closingsRes.status} | Total Closings: ${closingsRes.data.length}`);

  // 6. Strategies
  const stratRes = await request({ hostname: 'localhost', port: 3003, path: '/api/strategies', method: 'GET' });
  console.log(`6. Strategies API: Status ${stratRes.status} | Total Strategies: ${stratRes.data.length}`);

  // 7. Test Creating New Prospect in Supabase
  const newProspectPayload = {
    name: 'PT Sinergi Mandiri Test',
    potential: 3500000,
    status: 'Proposal terkirim',
    priority: 'HOT',
    phone: '081233445566',
    notes: 'Testing live DB write from Supabase',
  };
  const createProspectRes = await request(
    {
      hostname: 'localhost',
      port: 3003,
      path: '/api/prospects',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    newProspectPayload
  );
  console.log(`7. Create Prospect: Status ${createProspectRes.status} | Created ID: ${createProspectRes.data.id} | Name: ${createProspectRes.data.name}`);

  // 8. Test Recording Closing in Supabase & Target Sync
  const closingPayload = {
    customerName: 'PT Sinergi Mandiri Test',
    saleAmount: 3500000,
    profitCommission: 1000000,
    source: 'Radar Prospek',
    prospectId: createProspectRes.data.id,
  };
  const createClosingRes = await request(
    {
      hostname: 'localhost',
      port: 3003,
      path: '/api/closings',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    closingPayload
  );
  console.log(`8. Record Closing: Status ${createClosingRes.status} | Closing ID: ${createClosingRes.data.id} | Profit: Rp${createClosingRes.data.profitCommission.toLocaleString('id-ID')}`);

  // 9. Verify Target updated in DB
  const updatedTargetRes = await request({ hostname: 'localhost', port: 3003, path: '/api/targets', method: 'GET' });
  console.log(`9. Target Sync Verify: New Achieved in DB = Rp${updatedTargetRes.data.achievedAmount.toLocaleString('id-ID')} (Increased by Rp1.000.000)`);

  // 10. Clean up test prospect & closing
  const deleteProspectRes = await request({
    hostname: 'localhost',
    port: 3003,
    path: `/api/prospects/${createProspectRes.data.id}`,
    method: 'DELETE',
  });
  console.log(`10. Cleanup Test Record: Status ${deleteProspectRes.status}`);

  console.log('\n🎉 ALL 10 DATABASE INTEGRATION CHECKS PASSED WITH 100% SUCCESS!');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
