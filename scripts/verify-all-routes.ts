import http from 'http';

const routes = [
  '/',
  '/api/health',
  '/api/targets',
  '/api/business',
  '/api/prospects',
  '/api/actions',
  '/api/closings',
  '/api/strategies',
];

function fetchRoute(path: string): Promise<{ path: string; status: number; bytes: number }> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3003${path}`, (res) => {
      let size = 0;
      res.on('data', (chunk) => {
        size += chunk.length;
      });
      res.on('end', () => {
        resolve({ path, status: res.statusCode || 500, bytes: size });
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🌐 Verifying all application routes on port 3003:\n');
  let allOk = true;

  for (const path of routes) {
    const res = await fetchRoute(path);
    const isOk = res.status === 200;
    if (!isOk) allOk = false;
    console.log(`${isOk ? '✅' : '❌'} Route: ${res.path.padEnd(20)} | Status: ${res.status} | Size: ${res.bytes} bytes`);
  }

  if (allOk) {
    console.log('\n🎉 ALL ROUTES RETURNED 200 OK WITH CLEAN RESPONSES!');
  } else {
    console.error('\n⚠️ Some routes failed!');
    process.exit(1);
  }
}

main().catch(console.error);
