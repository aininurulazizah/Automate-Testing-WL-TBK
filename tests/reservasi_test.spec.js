import { test, expect } from "@playwright/test"
import { sites } from "../utils/sites";
import { saveToCsv } from "../utils/helper";
import { clearBrowserState } from "../utils/helper";
import { testData, createPemesan } from "../test-data/reservasi_data";
import { testData as loginData} from "../test-data/login_data";

const ENV = process.env.ENV || 'production';

test.setTimeout(90000);

for (const site of sites.filter(site => site.enabled)) {

    test(`${site.tag} - Test Case 1 - One Way Trip`, async({page}) => {

        const web = new site.locator(page);
    
        await page.goto(site.urls[ENV]);

        await clearBrowserState(page);
        
        if(web.close_popup){ // Close popup jika ada
            await web.closePopup(web.close_popup);
        }

        if(site.login === true) {
            const mitra = site.tag
            .replace("@", "")
            .replace(/^./, letter => letter.toUpperCase());

            await web.defaultLogin(loginData[mitra]);
        }

        await web.isiKeberangkatan(site.data.Keberangkatan); // Isi field keberagkatan

        await web.isiTujuan(site.data.Tujuan); // Isi field tujuan

        await web.isiTanggalPergi(site.data.TanggalPergi); // Isi field tanggal pergi

        const jml_penumpang = site.data.JumlahPenumpang;
        if(web.jumlah_penumpang){
            await web.isiJumlahPenumpang(jml_penumpang); // Isi jumlah penumpang
        }

        await web.cariTiket(); // Cari tiket

        const harga_tiket = await web.pilihJadwal(); // Pilih Jadwal Keberangkatan sekaligus mendapatkan harga tiket

        const path = new URL(page.url()).pathname;

        let expected_total_tiket = 0;

        const pemesan = createPemesan();

        if( path === "/book/pemesan" || 
            path === "/book/forms" ||
            path === "/shuttle/order/form"
          ) {
            await web.isiDataPenumpang(jml_penumpang, pemesan, testData.Penumpang, site.data.BiayaLainnya);
            await web.cariKursi();
            await web.pilihKursi(jml_penumpang, pemesan, testData.Penumpang);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya);
        } 
        
        if(path === "/book/pilihkursi") {
            await web.pilihKursi(jml_penumpang, harga_tiket);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya);
            await web.isiDataPenumpang(jml_penumpang, pemesan, testData.Penumpang, site.data.BiayaLainnya);
            await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "data-page", site.data.BiayaLainnya);
        }

        await web.klikBayar();

        await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);

        expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "payment-page", site.data.BiayaLainnya);

        await web.checklistKetentuan();

        await web.konfirmasiPembayaran();

        await page.waitForURL(/selesai|tiket\/detail|book\/completed|payment/);

        //Expected Result
        await expect(page).toHaveURL(/selesai|tiket\/detail|book\/completed|payment/);
        
        const bookedPageElements = await web.cekBookedPageVersion();
        
        for (const locator of Object.values(bookedPageElements)) {
            await expect(locator).toBeVisible();
        }
        
        await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "success-page", site.data.BiayaLainnya);

        //Save booking code
        const booking_code = await bookedPageElements.label_kode_booking.innerText();

        await test.info().attach('booking_code', {
            body: booking_code,
            contentType: 'text/plain',
        });

        saveToCsv(site.tag, booking_code, 'One Way Trip');

        // await page.pause();
   
    })

    if(site.roundTrip) {

        test(`${site.tag} - Test Case 2 - Round Trip`, async({page}) => {
    
            const web = new site.locator(page);
    
            await page.goto(site.urls[ENV]);

            await clearBrowserState(page);
    
            if(web.close_popup) {
                await web.closePopup(web.close_popup);
            }
    
            await web.isiKeberangkatan(site.data.Keberangkatan);
    
            await web.isiTujuan(site.data.Tujuan);
    
            await web.isiTanggalPergi(site.data.TanggalPergi);
    
            await web.checklistPP();  
    
            await web.isiTanggalPulang(site.data.TanggalPulang);
    
            const jml_penumpang = site.data.JumlahPenumpang
            if(web.jumlah_penumpang){
                await web.isiJumlahPenumpang(jml_penumpang); // Isi jumlah penumpang
            }
    
            await web.cariTiket(); // Cari tiket
    
            const harga_tiket = await web.pilihJadwal(); // Pilih Jadwal Keberangkatan
    
            const harga_tiket_plg = await web.pilihJadwalPulang(); // Pilih Jadwal Pulang

            let expected_total_tiket = 0;

            const pemesan = createPemesan();

            await web.isiDataPenumpang(jml_penumpang, pemesan, testData.Penumpang, site.data.BiayaLainnya);   

            await web.cariKursi();
                
            await web.pilihKursi(jml_penumpang, pemesan, testData.Penumpang);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya);
                
            await web.pilihKursiPulang(site.data.JumlahPenumpang);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket_plg, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya, "round-trip");

            await web.klikBayar();
    
            await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);

            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "payment-page", site.data.BiayaLainnya);
    
            await web.checklistKetentuan();
    
            await web.konfirmasiPembayaran();

            await page.waitForURL(/selesai|tiket\/detail|book\/completed|payment/);

            //Expected Result
            await expect(page).toHaveURL(/selesai|tiket\/detail|book\/completed|payment/);
            
            const bookedPageElements = await web.cekBookedPageVersion();
        
            for (const locator of Object.values(bookedPageElements)) {
                await expect(locator).toBeVisible();
            }
            
            await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "success-page", site.data.BiayaLainnya);

            // Save booking code
            const booking_code = await bookedPageElements.label_kode_booking.innerText();

            await test.info().attach('booking_code', {
                body: booking_code,
                contentType: 'text/plain',
            });

            saveToCsv(site.tag, booking_code, 'Round Trip');

            // await page.pause();
    
        })

    }


    if(site.connectingRes) {

        test(`${site.tag} - Test Case 3 - Connecting Reservation`, async({page}) => {
    
            const web = new site.locator(page);
    
            await page.goto(site.urls[ENV]);

            await clearBrowserState(page);
    
            if(web.close_popup) {
                await web.closePopup(web.close_popup);
            }

            if(site.login === true) {
                const mitra = site.tag
                .replace("@", "")
                .replace(/^./, letter => letter.toUpperCase());
    
                await web.defaultLogin(loginData[mitra]);
            }
    
            await web.isiKeberangkatan(site.data.ConnectingReservation.Keberangkatan);
    
            await web.isiTujuan(site.data.ConnectingReservation.Tujuan);
    
            await web.isiTanggalPergi(site.data.TanggalPergi);
    
            const jml_penumpang = site.data.JumlahPenumpang;
            if(web.jumlah_penumpang){
                await web.isiJumlahPenumpang(jml_penumpang); // Isi jumlah penumpang
            }
    
            await web.cariTiket(); // Cari tiket
    
            const harga_tiket = await web.pilihJadwal(); // Pilih Jadwal Keberangkatan

            let expected_total_tiket = 0;

            const pemesan = createPemesan();

            await web.isiDataPenumpang(jml_penumpang, pemesan, testData.Penumpang, site.data.BiayaLainnya);  

            await web.cariKursi();

            let n = 0; // armada ke berapa
            while(true) {

                await web.pilihKursiConnRes(jml_penumpang, pemesan, testData.Penumpang, n); // Pilih kursi
                expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya, "connecting", n);

                if(await web.pilih_next_kursi_btn.isVisible()) {

                    await web.pilihKursiNextArmada(); // Klik button 'Pilih Kursi Selanjutnya' jika ada

                } else {
                    break; // Jika tidak ada button pilih kursi selanjutnya maka perulangan selesai
                }
                n++ ;
            }

            await web.klikBayar();
    
            await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);
    
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "payment-page", site.data.BiayaLainnya, "connecting");

            await web.checklistKetentuan();
    
            await web.konfirmasiPembayaran();

            await page.waitForURL(/selesai|tiket\/detail|book\/completed|payment/);

            //Expected Result
            await expect(page).toHaveURL(/selesai|tiket\/detail|book\/completed|payment/);

            const bookedPageElements = await web.cekBookedPageVersion();
        
            for (const locator of Object.values(bookedPageElements)) {
                await expect(locator).toBeVisible();
            }

            await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "success-page", site.data.BiayaLainnya);

            //Save booking code
            const booking_code = await bookedPageElements.label_kode_booking.innerText();

            await test.info().attach('booking_code', {
                body: booking_code,
                contentType: 'text/plain',
            });

            saveToCsv(site.tag, booking_code, 'Connecting Reservation');

            // await page.pause();
    
        })
    
    }

}