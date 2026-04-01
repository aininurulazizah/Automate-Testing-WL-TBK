import { test, expect } from "@playwright/test"
import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { Semeru } from "../pages/semeru"
import { testData } from "../test-data/reservasi_data";
import { saveToCsv } from "../utils/helper";

const sites = [
    {tag: '@daytrans', url: 'https://www.daytrans.co.id/', locator: Daytrans, data: testData.Daytrans, roundTrip: false, connectingRes: true},
    {tag: '@baraya', url: 'https://www.baraya-travel.com/', locator: Baraya, data: testData.Baraya, roundTrip: true, connectingRes: false},
    {tag: '@aragon', url: 'https://www.aragontrans.com/', locator: Aragon, data: testData.Aragon, roundTrip: false, connectingRes: false},
    {tag: '@jackal', url: 'https://www.jackalholidays.com/', locator: Jackal, data: testData.Jackal, roundTrip: true, connectingRes: false},
    {tag: '@btm', url: 'https://www.btmshuttle.id/', locator: Btm, data: testData.Btm, roundTrip: false, connectingRes: false},
    {tag: '@semeru', url: 'https://www.semerutrans.com/', locator: Semeru, data: testData.Semeru, roundTrip: false, connectingRes: false}
]

const data_Pemesan = testData.Pemesan;

const data_Penumpang = testData.Penumpang;

for (const site of sites) {

    test.setTimeout(60000);

    test(`${site.tag} - Test Case 1 - One Way Trip`, async({page}) => {

        const web = new site.locator(page);
    
        await page.goto(site.url);
        
        if(web.close_popup){ // Close popup jika ada
            await web.closePopup(web.close_popup);
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

        if(path === "/book/pemesan") {
            await web.isiDataPenumpang(jml_penumpang, data_Pemesan, data_Penumpang);
            await web.cariKursi();
            await web.pilihKursi(jml_penumpang);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya);
        } 
        
        if(path === "/book/pilihkursi") {
            await web.pilihKursi(jml_penumpang, harga_tiket);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya);
            await web.isiDataPenumpang(jml_penumpang, data_Pemesan, data_Penumpang);
            await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "data-page", site.data.BiayaLainnya);
        }

        await web.klikBayar();

        await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);

        expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "payment-page", site.data.BiayaLainnya);

        await web.checklistKetentuan();

        await web.konfirmasiPembayaran();

        await page.waitForURL(/selesai/);

        //Expected Result
        await expect(page).toHaveURL(/selesai/);
        await expect(web.pesanan_dibuat_label).toBeVisible();
        await expect(web.kode_booking_label).toBeVisible();
        await expect(web.kode_pembayaran_label).toBeVisible();
        await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "success-page", site.data.BiayaLainnya);

        const booking_code = await web.kode_booking_label.innerText();

        saveToCsv(site.tag, booking_code, 'One Way Trip');

        // await page.pause();

        
    })

    if(site.roundTrip) {

        test(`${site.tag} - Test Case 2 - Round Trip`, async({page}) => {
    
            const web = new site.locator(page);
    
            await page.goto(site.url);
    
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

            await web.isiDataPenumpang(jml_penumpang, data_Pemesan, data_Penumpang);
                
            await web.cariKursi();
                
            await web.pilihKursi(jml_penumpang);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya);
                
            await web.pilihKursiPulang(site.data.JumlahPenumpang);
            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket_plg, jml_penumpang, expected_total_tiket, "seat-page", site.data.BiayaLainnya);

            await web.klikBayar();
    
            await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);

            expected_total_tiket = await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "payment-page", site.data.BiayaLainnya);
    
            await web.checklistKetentuan();
    
            await web.konfirmasiPembayaran();

            await page.waitForURL(/selesai/);

            //Expected Result
            await expect(page).toHaveURL(/selesai/);
            await expect(web.pesanan_dibuat_label).toBeVisible();
            await expect(web.kode_booking_label).toBeVisible();
            await expect(web.kode_pembayaran_label).toBeVisible();
            await web.validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, "success-page", site.data.BiayaLainnya);

            const booking_code = await web.kode_booking_label.innerText();

            saveToCsv(site.tag, booking_code, 'Round Trip');

            // await page.pause();
    
        })

    }


    if(site.connectingRes) {

        test(`${site.tag} - Test Case 3 - Connecting Reservation`, async({page}) => {
    
            const web = new site.locator(page);
    
            await page.goto(site.url);
    
            if(web.close_popup) {
                await web.closePopup(web.close_popup);
            }
    
            await web.isiKeberangkatan(site.data.ConnectingReservation.Keberangkatan);
    
            await web.isiTujuan(site.data.ConnectingReservation.Tujuan);
    
            await web.isiTanggalPergi(site.data.TanggalPergi);
    
            if(web.jumlah_penumpang){
                await web.isiJumlahPenumpang(site.data.JumlahPenumpang); // Isi jumlah penumpang
            }
    
            await web.cariTiket(); // Cari tiket
    
            await web.pilihJadwal(); // Pilih Jadwal Keberangkatan

            await web.isiDataPenumpang(site.data.JumlahPenumpang, data_Pemesan, data_Penumpang);
                
            await web.cariKursi();

            let n = 0; // armada ke berapa
            while(true) {

                await web.pilihKursiConnRes(site.data.JumlahPenumpang, n); // Pilih kursi

                if(await web.pilih_next_kursi_btn.isVisible()) {

                    await web.pilihKursiNextArmada(); // Klik button 'Pilih Kursi Selanjutnya' jika ada

                } else {
                    break; // Jika tidak ada button pilih kursi selanjutnya maka perulangan selesai
                }
                n++ ;
            }

            await web.klikBayar();
    
            await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);
    
            await web.checklistKetentuan();
    
            await web.konfirmasiPembayaran();

            await page.waitForURL(/selesai/);

            //Expected Result
            await expect(page).toHaveURL(/selesai/);
            await expect(web.pesanan_dibuat_label).toBeVisible();
            await expect(web.kode_booking_label).toBeVisible();
            await expect(web.kode_pembayaran_label).toBeVisible();            

            const booking_code = await web.kode_booking_label.innerText();

            saveToCsv(site.tag, booking_code, 'Connecting Reservation');

            // await page.pause();
    
        })
    
    }

}