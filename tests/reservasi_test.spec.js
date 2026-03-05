import { test, expect } from "@playwright/test"
import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { testData } from "../test-data/reservasi_data";
import { saveToCsv } from "../utils/helper";

const sites = [
    {tag: '@daytrans', url: 'https://www.daytrans.co.id/', locator: Daytrans, data: testData.Daytrans, roundTrip: false, connectingRes: true},
    {tag: '@baraya', url: 'https://www.baraya-travel.com/', locator: Baraya, data: testData.Baraya, roundTrip: true, connectingRes: false},
    {tag: '@aragon', url: 'https://www.aragontrans.com/', locator: Aragon, data: testData.Aragon, roundTrip: false, connectingRes: false},
    {tag: '@jackal', url: 'https://www.jackalholidays.com/', locator: Jackal, data: testData.Jackal, roundTrip: true, connectingRes: false},
    {tag: '@btm', url: 'https://www.btmshuttle.id/', locator: Btm, data: testData.Btm, roundTrip: false, connectingRes: true}
]

const data_Pemesan = testData.Pemesan;

const data_Penumpang = testData.Penumpang;

const fs = require('fs');

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

        if(web.jumlah_penumpang){
            await web.isiJumlahPenumpang(site.data.JumlahPenumpang); // Isi jumlah penumpang
        }

        await web.cariTiket(); // Cari tiket

        await web.pilihJadwal(); // Pilih Jadwal Keberangkatan

        const path = new URL(page.url()).pathname;

        if(path === "/book/pemesan") {
            await web.isiDataPenumpang(site.data.JumlahPenumpang, data_Pemesan, data_Penumpang);
            await web.cariKursi();
            await web.pilihKursi(site.data.JumlahPenumpang);
        } 
        
        if(path === "/book/pilihkursi") {
            await web.pilihKursi(site.data.JumlahPenumpang);
            await web.isiDataPenumpang(site.data.JumlahPenumpang, data_Pemesan, data_Penumpang);
        }

        await web.klikBayar();

        await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);

        await web.checklistKetentuan();

        await web.konfirmasiPembayaran();

        await page.waitForURL(/selesai/);

        const booking_code = await web.kode_booking_label;

        // fs.appendFileSync('output/booking_code.csv', `${booking_code}\n`);

        saveToCsv(site.tag, booking_code);

        await page.pause();

        
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
    
            if(web.jumlah_penumpang){
                await web.isiJumlahPenumpang(site.data.JumlahPenumpang); // Isi jumlah penumpang
            }
    
            await web.cariTiket(); // Cari tiket
    
            await web.pilihJadwal(); // Pilih Jadwal Keberangkatan
    
            await web.pilihJadwalPulang(); // Pilih Jadwal Pulang

            await web.isiDataPenumpang(site.data.JumlahPenumpang, data_Pemesan, data_Penumpang);
                
            await web.cariKursi();
                
            await web.pilihKursi(site.data.JumlahPenumpang);
                
            await web.pilihKursiPulang(site.data.JumlahPenumpang);
            
            await web.klikBayar();
    
            await web.pilihMetodePembayaran(site.data.MetodeBayar, site.data.PlatformBayar);
    
            await web.checklistKetentuan();
    
            await web.konfirmasiPembayaran();

            await page.waitForURL(/selesai/);

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

            // await page.pause();
    
        })
    
    }

}