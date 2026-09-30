## Automated Testing - Reservasi Tiket Bus - Trans Berjaya Khatulistiwa (TBK)
### Deskripsi
Proyek automasi testing untuk proses pemesanan reservasi tiket bus/shuttle pada penyedia layanan di TBK.

### Tools & Prerequisites
- **Node.js v18+** (v22.11.0 digunakan) — Runtime JavaScript untuk menjalankan Playwright
- **Git** — Version control
- **Playwright** — Framework automated UI testing
- **Visual Studio Code** (atau editor lain) — Code editor
  
### Cara Menjalankan
1. Clone repository :
   ```
   git clone https://github.com/aininurulazizah/Automate-Testing-WL-TBK.git
   ```
3. Install dependensi yang dibutuhkan :
   ```
   npm install
   ```
4. Isi credential akses web staging (jika ingin menjalankan test di env staging) pada file .env.example lalu ubah nama file menjad .env
5. Menjalankan test semua mitra :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1
    ```
6. Menjalankan test pada mitra tertentu :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@[nama_mitra]'
    ```
    Contoh melakukan testing pada Daytrans :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@daytrans'
    ```
7. Menjalankan test untuk kondisi case tertentu, misalnya jalankan test case reservasi dengan kondisi pulang pergi (Rountrip) :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '[kondisi]'
    ```
    Contoh melakukan testing reservasi pulang pergi : 
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep 'Round Trip'
    ```
    Ini akan dijalankan di semua mitra yang memiliki kondisi yang case tersebut.
8. Menjalankan test spesifik (kondisi tertentu pada mitra tertentu) :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '[nama test case spesifik]'
    ```
    Contoh melakukan testing connecting reservation pada BTM :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@btm - Test Case 3 - Connecting Reservation'
    ```
9. Menjalankan test dengan lebih dari satu kata kunci (bisa mitra/test case) :
   ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '[kata kunci 1]|[kata kunci 2]|[kata kunci n]'
    ```
    Contoh melakukan testing pada mitra Daytrans, Baraya, dan BTM :
    ```
    npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1 --grep '@daytrans|@baraya|@btm'
    ```
10. Jika ingin menjalankan automate test dengan environment tetentu, tambahkan `$env:ENV='production';` untuk env production atau `$env:ENV='staging'` untuk env staging sebelum command `npx playwright test ...`
   Contoh melakukan testing semua mitra pada env staging :
    ```
     $env:ENV='staging'; npx playwright test ./reservasi_test.spec.js --project=chromium --headed --workers=1
    ```



   Note : 
    `--project-chromium` jika ingin menggunakan webdriver tertentu, disini menggunakan chrome.
    `--headed` menampilkan proses automate testing berjalan. Hapus jika ingin membiarkan proses berjalan di latar belakang.
    `--workers=1` menentukan berapa jendela browser yang akan dijalankan. Default jendela browser adalah dua dan dijalankan secara paralel.


   
### Daftar Test Case

| Mitra | Case | Nama Test Case |
|--------|------|----------------|
| Daytrans | One Way Trip | @daytrans - Test Case 1 - One Way Trip |
| Daytrans | Connecting Reservation | @daytrans - Test Case 3 - Connecting Reservation |
| Baraya | One Way Trip | @baraya - Test Case 1 - One Way Trip |
| Baraya | Round Trip | @baraya - Test Case 2 - Round Trip |
| Besttrans | One Way Trip | @besttrans - Test Case 1 - One Way Trip |
| Besttrans | Round Trip | @besttrans - Test Case 2 - Round Trip |
| Aragon | One Way Trip | @aragon - Test Case 1 - One Way Trip |
| Jackal | One Way Trip | @jackal - Test Case 1 - One Way Trip |
| Jackal | Round Trip | @jackal - Test Case 2 - Round Trip |
| Btm | One Way Trip | @btm - Test Case 1 - One Way Trip |
| Semeru | One Way Trip | @semeru - Test Case 1 - One Way Trip |
| Joglosemar | One Way Trip | @joglosemar - Test Case 1 - One Way Trip |
| Joglosemar | Round Trip | @joglosemar - Test Case 2 - Round Trip |
| Kruzz | One Way Trip | @kruzz - Test Case 1 - One Way Trip |
| Kruzz | Round Trip | @kruzz - Test Case 2 - Round Trip |
| Gracias | One Way Trip | @gracias - Test Case 1 - One Way Trip |
| Gracias | Round Trip | @gracias - Test Case 2 - Round Trip |
| Kpm | One Way Trip | @kpm - Test Case 1 - One Way Trip |
| Kpm | Round Trip | @kpm - Test Case 2 - Round Trip |
| Wbtrans | One Way Trip | @wbtrans - Test Case 1 - One Way Trip |
| Wbtrans | Round Trip | @wbtrans - Test Case 2 - Round Trip |
| Sadya | One Way Trip | @sadya - Test Case 1 - One Way Trip |
| Sadya | Round Trip | @sadya - Test Case 2 - Round Trip |
| Mstrans | One Way Trip | @mstrans - Test Case 1 - One Way Trip |
| Mstrans | Round Trip | @mstrans - Test Case 2 - Round Trip |
| Raputri | One Way Trip | @raputri - Test Case 1 - One Way Trip |
| Raputri | Round Trip | @raputri - Test Case 2 - Round Trip |
| Mrtrans | One Way Trip | @mrtrans - Test Case 1 - One Way Trip |
| Sunjaya | One Way Trip | @sunjaya - Test Case 1 - One Way Trip |
| Sunjaya | Round Trip | @sunjaya - Test Case 2 - Round Trip |
| Binasarana | One Way Trip | @binasarana - Test Case 1 - One Way Trip |
| Transkita | One Way Trip | @transkita - Test Case 1 - One Way Trip |
| Transkita | Round Trip | @transkita - Test Case 2 - Round Trip |
| Cgtrans | One Way Trip | @cgtrans - Test Case 1 - One Way Trip |
| Cgtrans | Round Trip | @cgtrans - Test Case 2 - Round Trip |
| Ztrans | One Way Trip | @ztrans - Test Case 1 - One Way Trip |
| Ztrans | Round Trip | @ztrans - Test Case 2 - Round Trip |
| Putraremaja | One Way Trip | @putraremaja - Test Case 1 - One Way Trip |
| Putraremaja | Round Trip | @putraremaja - Test Case 2 - Round Trip |
| Banyumili | One Way Trip | @banyumili - Test Case 1 - One Way Trip |
| Banyumili | Round Trip | @banyumili - Test Case 2 - Round Trip |
| Ctu | One Way Trip | @ctu - Test Case 1 - One Way Trip |
| Ctu | Round Trip | @ctu - Test Case 2 - Round Trip |
| Krakaline | One Way Trip | @krakaline - Test Case 1 - One Way Trip |
| Krakaline | Round Trip | @krakaline - Test Case 2 - Round Trip |
| Pelitamas | One Way Trip | @pelitamas - Test Case 1 - One Way Trip |
| Pelitamas | Round Trip | @pelitamas - Test Case 2 - Round Trip |
| Aoshuttle | One Way Trip | @aoshuttle - Test Case 1 - One Way Trip |
| Aoshuttle | Round Trip | @aoshuttle - Test Case 2 - Round Trip |
| Adibuzz | One Way Trip | @adibuzz - Test Case 1 - One Way Trip |
| Adibuzz | Round Trip | @adibuzz - Test Case 2 - Round Trip |
| Marita | One Way Trip | @marita - Test Case 1 - One Way Trip |
| Marita | Round Trip | @marita - Test Case 2 - Round Trip |
| Trikusuma | One Way Trip | @trikusuma - Test Case 1 - One Way Trip |
| Trikusuma | Round Trip | @trikusuma - Test Case 2 - Round Trip |
| Wisatakomodo | One Way Trip | @wisatakomodo - Test Case 1 - One Way Trip |
| Wisatakomodo | Round Trip | @wisatakomodo - Test Case 2 - Round Trip |
| Sariharum | One Way Trip | @sariharum - Test Case 1 - One Way Trip |
| Sariharum | Round Trip | @sariharum - Test Case 2 - Round Trip |
| Ats | One Way Trip | @ats - Test Case 1 - One Way Trip |
| Ats | Round Trip | @ats - Test Case 2 - Round Trip |
| Ans | One Way Trip | @ans - Test Case 1 - One Way Trip |
| Ans | Round Trip | @ans - Test Case 2 - Round Trip |
| Riyan | One Way Trip | @riyan - Test Case 1 - One Way Trip |
| Riyan | Round Trip | @riyan - Test Case 2 - Round Trip |
| Minanga | One Way Trip | @minanga - Test Case 1 - One Way Trip |
| Minanga | Round Trip | @minanga - Test Case 2 - Round Trip |
| Harumbsi | One Way Trip | @harumbsi - Test Case 1 - One Way Trip |
| Harumbsi | Round Trip | @harumbsi - Test Case 2 - Round Trip |
| Yantigroup | One Way Trip | @yantigroup - Test Case 1 - One Way Trip |
| Yantigroup | Round Trip | @yantigroup - Test Case 2 - Round Trip |
| Selamat | One Way Trip | @selamat - Test Case 1 - One Way Trip |
| Namaste | One Way Trip | @namaste - Test Case 1 - One Way Trip |
| Namaste | Round Trip | @namaste - Test Case 2 - Round Trip |
| Royalkencana | One Way Trip | @royalkencana - Test Case 1 - One Way Trip |
| Royalkencana | Round Trip | @royalkencana - Test Case 2 - Round Trip |
| Sabila | One Way Trip | @sabila - Test Case 1 - One Way Trip |
| Kupuayu | One Way Trip | @kupuayu - Test Case 1 - One Way Trip |
| Kupuayu | Round Trip | @kupuayu - Test Case 2 - Round Trip |

### Notes
- Untuk saat ini automated test ini akan dijalankan secara otomatis setiap pukul 06.00 pagi dan notifikasi hasil testing akan dikirimkan ke [Telegram](https://t.me/+ZXzmUv7vd-YxOTA9)
