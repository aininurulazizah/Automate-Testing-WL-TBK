import { expect } from "@playwright/test";

export class Baraya {
    constructor(page){

        // General
        this.page = page;
        this.close_popup = page.locator('.close-pop-info');
        
        // Reservation Form
        this.keberangkatan_field = page.locator('input#berangkat');
        this.tujuan_field = page.locator('input#tujuan');
        this.dropdown_keberangkatan = page.locator('div#dropdown-outlet > div.dropdown-scroll');
        this.dropdown_tujuan = page.locator('div#dropdown-outlet2 > div.dropdown-scroll');
        this.search_lokasi = page.locator('#dropdown-outlet2 #searchQuery');
        this.tanggal_pergi = page.locator('#tanggal');
        this.pp_checkbox =  page.locator('input#is_pp');
        this.tanggal_pulang = page.locator('#tanggal_pulang');
        this.next_month_btn = page.locator('.flatpickr-next-month');
        this.next_month_btn2 = page.locator('.flatpickr-next-month').nth(1);
        this.jumlah_penumpang = page.locator('#penumpangInput');
        this.add_dewasa_btn = page.locator('#btnPlusDewasa');
        this.add_bayi_btn = page.locator('#btnPlusBayi');
        this.simpan_penumpang_btn = page.locator('button:has-text("Simpan")');
        this.cari_btn = page.locator('#submit'); 
        this.expand_jadwal_btn = page.locator('button#btn-toggle-jadwal-pergi');
        this.expand_jadwalplg_btn = page.locator('button[id^="btn-toggle-jadwal-pulang"]');
        this.jadwal_card = page.locator('ul#jadwal-list-pergi > li');
        this.jadwal_plg_card = page.locator('div[id^="jadwal-list-pulang"] > li');

        // User Data
        this.nama_pemesan = page.locator('#pemesan');
        this.email_pemesan = page.locator('#email');
        this.nohp_pemesan = page.locator('[name="telepon"]');
        this.nama_penumpang = page.locator('#penumpang1');
        this.carikursi_btn = page.locator('button:has-text("Pilih Kursi")');

        // Seat Page
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.tab_plg = page.locator('a:has-text("Pulang")');
        this.kursi_plg_tersedia = page.locator('div.seat-blank[onclick*="books_pp"]');
        this.diskon_label_seat_page = page.locator('p.totalDiskon');
        this.biaya_layanan_label = page.locator('#biayalayanan');
        this.pembayaran_btn = page.locator('button:has-text("Pembayaran")');

        // Payment Confirmation Page
        this.diskon_label_payment_page = page.locator('p.totalDiskon');
        this.biaya_tambahan_label_payment_page = page.locator('p#biayalayanan');
        this.total_bayar_label_payment_page = page.locator('p#totalbayar');
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit:has-text("Konfirmasi")');
        this.konfirmasi_pembayaran_btn_modal = page.locator('.modal-body button:has-text("Konfirmasi")');

        //Booked Page
        this.pesanan_dibuat_label = page.locator('p:has-text("Pesanan Dibuat")');
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + h3');
        this.kode_pembayaran_label = page.locator('p:has-text("Kode Pembayaran") + h3');
        this.total_bayar_label = page.locator('p:has-text("Total Bayar") + h3');
        this.total_bayar_label_2 = page.locator('p:has-text("Total Bayar")').locator('..').locator('+ div').locator('p').first();

        // Login
        this.login_btn = page.locator('a:has-text("Masuk")');
        this.login_phone_btn = page.locator('button:has-text("Nomor Telepon")');
        this.login_whatsapp_btn = page.locator('button:has-text("Nomor Whatsapp")');
        this.login_email_btn = page.locator('button:has-text("Email")');
        this.login_google_btn = page.locator('button:has-text("Google")');
        this.phone_field = page.locator('input#telp');
        this.email_field = page.locator('input#email');
        this.submit_btn = page.locator('button:has-text("Masuk")');
        this.submit_otp_btn = page.locator('button[onclick*="submit"]');
        this.regis_instruction = page.getByRole('heading', { name: /Lengkapi\s+Data Kamu/i })
        this.regis_nama_field = page.locator('input#nama');
        this.regis_phone_field = page.locator('input#telp');
        this.regis_email_field = page.locator('input#email');
        this.regis_simpan_btn = page.locator('button:has-text("Simpan")');
    }

    getNamaPenumpang(i) {
        return this.page.locator(`#penumpang${i}`);
    }

    getNamaBayi(i) {
        return this.page.locator(`#bayi${i}`);
    }

    getPlatformBayar(platform) { // Untuk mendapatkan platform pembayaran setelah pilih metode bayar
        return this.page.locator(`input[onclick*="${platform}"]`);
    }

    normalizeRupiah(value) {
        if (!value) return 0;

        return Number(
            value
                .toString()
                .replace(/[^0-9]/g, "") // hapus semua selain angka
        );
    }

    async waitForLoader(element, loader_class, to_have) {
        const loader = await this.page.locator(`${element}`);
        if (to_have) {
            await expect(loader).toHaveClass(new RegExp(loader_class), {timeout: 120000});
        } else {
            await expect(loader).not.toHaveClass(new RegExp(loader_class), {timeout: 120000});
        }
    }

    async closePopup(value) {
        await this.page.waitForTimeout(1000);

        while (await value.isVisible()) {
            await value.click(); 
            await this.page.waitForTimeout(1000);
        }
    }

    async isiKeberangkatan(value) {
        await this.waitForLoader('img#loadT', 'd-none', true);

        await this.keberangkatan_field.click();
        await this.dropdown_keberangkatan.locator(`p.btn-text:has-text("${value}")`).click();
    }

    async isiTujuan(value) {
        await this.waitForLoader('img#loadT', 'd-none', true);

        if (!this.dropdown_tujuan.isVisible()) {
            await this.tujuan_field.click();
        }

        await this.dropdown_tujuan.locator(`p.btn-text:has-text("${value}")`).click();
    }

    async isiTanggalPergi(value) {
        await this.tanggal_pergi.click();
        const calendar = await this.page.locator(`div.flatpickr-calendar.open`);
        const tanggal_target = await calendar.locator(`[aria-label="${value}"]`);
        
        while(!(await tanggal_target.isVisible())){
            await this.next_month_btn.click();
        }
        await tanggal_target.click();
    }

    async checklistPP() {
        await this.pp_checkbox.click();
    }

    async isiTanggalPulang(value) {
        await this.tanggal_pulang.click();
        const calendar = await this.page.locator(`div.flatpickr-calendar.open`);
        const tanggal_target = await calendar.locator(`[aria-label="${value}"]`);
        
        while(!(await tanggal_target.isVisible())){
            await this.next_month_btn2.click();
        }
        await tanggal_target.click();
    }

    async isiJumlahPenumpang(value) {
        let value_dewasa = Number(await this.page.locator('#inputDewasa').getAttribute('value'));
        let value_bayi = Number(await this.page.locator('#inputBayi').getAttribute('value'));
        await this.jumlah_penumpang.click();
        while(value_dewasa !== value.Dewasa){
            await this.add_dewasa_btn.click();
            value_dewasa++;
        }
        while(value_bayi !== value.Bayi){
            await this.add_bayi_btn.click();
            value_bayi++;
        }
        await this.simpan_penumpang_btn.click();
    }

    async cariTiket() {
        await this.cari_btn.click();
    }

    async pilihJadwal() {
        await this.waitForLoader('div#modal-load', 'show', false);
        await this.page.waitForTimeout(1000);

        if (await this.expand_jadwal_btn.count() > 0) {
            await this.expand_jadwal_btn.click();
        }

        const first_jadwal = await this.jadwal_card.first();
        const harga_tiket = await first_jadwal.locator('h4.harga').first().innerText();
        await first_jadwal.locator('button:has-text("Pilih")').first().click();
        return harga_tiket;
    }

    async pilihJadwalPulang() {
        await this.waitForLoader('div#modal-load', 'show', false);
        await this.page.waitForTimeout(1000);

        if (await this.expand_jadwalplg_btn.count() > 0) {
            await this.expand_jadwalplg_btn.click();
        }

        const first_jadwal = await this.jadwal_plg_card.first();
        const harga_tiket = await first_jadwal.locator('h4.harga').first().innerText();
        await first_jadwal.locator('button:has-text("Pilih")').first().click();
        return harga_tiket;
    }

    async isiDataPenumpang(jml_penumpang, pemesan, penumpang) {
        await this.waitForLoader('div#modal-load', 'show', false);

        const jml_dewasa = jml_penumpang.Dewasa;
        const jml_bayi = jml_penumpang.Bayi;
        const penumpang_dewasa = penumpang.PenumpangDewasa;
        const penumpang_bayi = penumpang.PenumpangBayi;
        await this.nama_pemesan.fill(pemesan.NamaPemesan);
        await this.email_pemesan.fill(pemesan.Email);
        await this.nohp_pemesan.fill(pemesan.NoHP);

        for (let i = 0; i < jml_dewasa; i++) {
            await this.getNamaPenumpang(i+1).fill(penumpang_dewasa[`Penumpang_${i+1}`].NamaPenumpang);
        }
    
        for (let i = 0; i < jml_bayi; i++) {
            await this.getNamaBayi(i+1).fill(penumpang_bayi[`PenumpangBayi_${i+1}`].NamaPenumpang);
        }
    }

    async cariKursi() {
        let path = new URL(this.page.url()).pathname;

        while(path === "/book/pemesan") {
            await this.carikursi_btn.click();
            path = new URL(this.page.url()).pathname;
        }
    }

    async pilihKursi(jml_penumpang) {
        await this.waitForLoader('div#modal-load', 'show', false);
        await this.page.waitForTimeout(1000);

        const jml_dewasa = jml_penumpang.Dewasa;
        for(let i = 0; i < jml_dewasa; i++) {
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async pilihKursiPulang(jml_penumpang) {
        await this.waitForLoader('div#modal-load', 'show', false);
        await this.page.waitForTimeout(1000);

        const jml_dewasa = jml_penumpang.Dewasa;
        await this.tab_plg.click();
        for(let i = 0; i < jml_dewasa; i++) {
            await this.kursi_plg_tersedia.nth(i).click();
        }
    }

    async validasiHargaTiketKursi(harga_tiket, jml_penumpang, kursi_tersedia) { //Validasi harga tiket yang terpampang di kursi
        const jml_penumpang_d = jml_penumpang.Dewasa;
        const harga_type = harga_tiket.includes(" - ") ? "range" : "fixed";
        let harga_min;
        let harga_max;

        if (harga_type === "range") {
            [harga_min, harga_max] = (harga_tiket.split(" - "));
            harga_min = this.normalizeRupiah(harga_min);
            harga_max = this.normalizeRupiah(harga_max);

            for (let i = 0; i < jml_penumpang_d; i++) {
                const harga_kursi = this.normalizeRupiah(await kursi_tersedia.nth(i).locator('span').innerText());
                expect(harga_kursi).toBeGreaterThanOrEqual(harga_min);
                expect(harga_kursi).toBeLessThanOrEqual(harga_max);
            }
            
        }
        
        if (harga_type === "fixed") {
            for (let i = 0; i < jml_penumpang_d; i++) {
                let harga_kursi;

                if (await kursi_tersedia.nth(i).locator('p').filter({ hasText : /Sale|Promo/i }).count() > 0) {
                    harga_kursi = this.normalizeRupiah(await kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                } else {
                    harga_kursi = this.normalizeRupiah(await kursi_tersedia.nth(i).locator('span').nth(0).innerText());
                }

                expect(harga_kursi).toBe(this.normalizeRupiah(harga_tiket));
            }
        }
        
        return true;

    }

    async validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, current_page, biaya_lainnya, case_flag) {

        const jml_penumpang_d = jml_penumpang.Dewasa;

        switch(current_page) {
            case("seat-page") :

            const list_kursi_tersedia = case_flag === "round-trip" ? this.kursi_plg_tersedia : this.kursi_tersedia;

                if (await this.validasiHargaTiketKursi(harga_tiket, jml_penumpang, list_kursi_tersedia)) {
                    for (let i = 0; i < jml_penumpang_d; i++) {
                        let current_harga_tiket;

                        if (await list_kursi_tersedia.nth(i).locator('p').filter({ hasText : /Sale|Promo/i }).count() > 0) {
                            current_harga_tiket = this.normalizeRupiah(await list_kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                        } else {
                            current_harga_tiket = this.normalizeRupiah(await list_kursi_tersedia.nth(i).locator('span').nth(0).innerText());
                        }
                        expected_total_tiket += current_harga_tiket;
                    }
                }   

                await this.page.waitForTimeout(1000);

                if (await this.biaya_layanan_label.count() > 0) {
                    expected_total_tiket += this.normalizeRupiah(await this.biaya_layanan_label.innerText());
                }
                
                const actual_total_tiket_seat_1 = this.normalizeRupiah(await this.page.locator('span.display-price-seat-selected').innerText());
                
                try {
                    expect(actual_total_tiket_seat_1).toBe(expected_total_tiket);
                } catch {
                    expect(expected_total_tiket).toBeLessThanOrEqual(actual_total_tiket_seat_1)
                }

                const actual_total_tiket_seat_2 = this.normalizeRupiah(await this.page.locator('p#totalbayar').innerText());
                
                try {
                    expect(actual_total_tiket_seat_2).toBe(expected_total_tiket);
                } catch {
                    expect(expected_total_tiket).toBeLessThanOrEqual(actual_total_tiket_seat_2)
                }

                return expected_total_tiket;

                break;

            case("payment-page") :
                // const total_diskon = this.normalizeRupiah(await this.diskon_label_payment_page.innerText());
                // const biaya_tambahan = this.normalizeRupiah(await this.biaya_tambahan_label_payment_page.innerText());
                const actual_total_tiket_payment = this.normalizeRupiah(await this.total_bayar_label_payment_page.innerText());

                // expected_total_tiket -= total_diskon;
                // expected_total_tiket += biaya_tambahan;

                expect(actual_total_tiket_payment).toBe(expected_total_tiket);

                return expected_total_tiket;
                break;

            case("success-page") :
                let actual_total_tiket_success;

                if (await this.total_bayar_label.count() > 0) {
                    actual_total_tiket_success = this.normalizeRupiah(await this.total_bayar_label.innerText());
                } else if (await this.total_bayar_label_2.count() > 0) {
                    actual_total_tiket_success = this.normalizeRupiah(await this.total_bayar_label_2.innerText());
                }

                expect(actual_total_tiket_success).toBe(expected_total_tiket);

                return expected_total_tiket;
                break;
        }
    }

    async klikBayar() {
        await this.pembayaran_btn.click();
    }

    async pilihMetodePembayaran(metode_bayar, platform_bayar){
        await this.waitForLoader('div#modal-load', 'show', false);
        await this.waitForLoader('div#load-container-payment', 'd-none', true);

        await this.getPlatformBayar(platform_bayar).click({ force: true });
    }

    async checklistKetentuan() {
        await this.check_ketentuan_btn.click();
    }

    async konfirmasiPembayaran() {
        await this.konfirmasi_pembayaran_btn.click()
        await this.konfirmasi_pembayaran_btn_modal.click();

        await this.waitForLoader('div#modal-load', 'show', false);
    }

    async cekBookedPageVersion() {
        let elements;

        elements = {
            label_berhasil : this.pesanan_dibuat_label,
            label_kode_booking : this.kode_booking_label,
            label_kode_pembayaran : this.kode_pembayaran_label
        }

        return elements;
    }

    // Login

    async klikButtonLogin() {
        await this.login_btn.click();
    }

    async pilihViaTelepon() {
        await this.login_phone_btn.click();
    }

    async pilihViaEmail() {
        await this.login_email_btn.click();
    }

    async pilihViaGoogle() {
        await this.login_google_btn.click();
    }

    async isiNoTelp(no_telp) {
        await this.phone_field.fill(no_telp);
    }

    async isiEmail(email) {
        await this.email_field.fill(email);
    }

    async pilihAkun() {
        await this.page.pause();
    }

    async submitNoTelp() {
        await this.submit_btn.click();
    }

    async submitEmail() {
        await this.submit_btn.click();
    }

    async isiOTP() {
        await this.page.pause();
    }

    async submitOTP() {
        await this.submit_otp_btn.click();
        await this.page.waitForTimeout(2000);
    }

    async isiDataRegistrasi(value, byTelpOrEmail) {
        await this.regis_nama_field.fill(value.Nama);
        if(byTelpOrEmail === 'byTelp') {
            await this.regis_email_field.fill(value.Email);
        }
        if(byTelpOrEmail === 'byEmail') {
            await this.regis_phone_field.fill(value.NoTelepon);
        }
        await this.page.pause();
        await this.regis_simpan_btn.click();
    }

}