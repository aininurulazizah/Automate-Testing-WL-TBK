const fs = require('fs');
const path = require('path');

const source = path.resolve(
  __dirname,
  '../reports/dashboard-data.json'
);

// Path dashboard bisa diberikan sebagai argument
// Lokal: npm run copy-dashboard -- ../../dabang-automate-test-v1.0.0
// GitHub Actions: npm run copy-dashboard -- dashboard
const dashboardPath = process.argv[2];

if (!dashboardPath) {
  console.error('❌ Path dashboard belum diberikan.');
  console.error(
    'Contoh: npm run copy-dashboard -- <dashboard-path>'
  );
  process.exit(1);
}

const dashboardRoot = path.resolve(__dirname, dashboardPath);

const currentDataDestination = path.join(
  dashboardRoot,
  'src/data/dashboard-data.json'
);

const historyDestinationDir = path.join(
  dashboardRoot,
  'src/data/executions'
);

try {
  if (!fs.existsSync(source)) {
    throw new Error(`Source file tidak ditemukan: ${source}`);
  }

  // Baca dashboard-data.json
  const dashboardData = JSON.parse(
    fs.readFileSync(source, 'utf8')
  );

  // Ambil tanggal eksekusi dari generatedAt
  const executionDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(dashboardData.generatedAt));

  // Pastikan folder executions tersedia
  fs.mkdirSync(historyDestinationDir, { recursive: true });


  // Update dashboard-data.json

  fs.copyFileSync(
    source,
    currentDataDestination
  );


  // Simpan history berdasarkan tanggal

  const historyDestination = path.join(
    historyDestinationDir,
    `${executionDate}.json`
  );

  fs.copyFileSync(
    source,
    historyDestination
  );

  console.log('✅ Dashboard data berhasil diupdate.');
  console.log(
    `   Current: ${currentDataDestination}`
  );
  console.log(
    `   History: ${historyDestination}`
  );

} catch (err) {
  console.error('❌ Gagal copy dashboard data');
  console.error(err.message);
  process.exit(1);
}