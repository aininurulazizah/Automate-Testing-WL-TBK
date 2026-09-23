import { expect } from "@playwright/test";

export class Besttrans {
    constructor(page){

        // General
        this.page = page;
        this.close_popup = page.locator('.close-pop-info');
        
        // Reservation Form
        this.keberangkatan_field = page.locator('label:has-text("Keberangkatan") + div.vselect');
        this.tujuan_field = page.locator('label:has-text("Tujuan") + div.vselect');
        this.dropdown_keberangkatan = this.keberangkatan_field.locator('div.vselect-list');
        this.dropdown_tujuan = this.tujuan_field.locator('div.vselect-list');
        this.tanggal_pergi = page.locator('input#tanggal_pergi + input');
        this.pp_checkbox =  page.locator('#is_pp');
        this.tanggal_pulang = page.locator('input#tanggal_pulang + input');
        this.next_month_btn = page.locator('.flatpickr-next-month');
        this.next_month_btn2 = page.locator('.flatpickr-next-month').nth(1);
        this.jumlah_penumpang = page.locator('label:has-text("Penumpang") + div.vselect-penumpang');
        this.dropdown_jml_penumpang = this.jumlah_penumpang.locator('div.vselect-list');
        this.cari_btn = page.locator('button[onclick="return cek()"]'); 
        this.jadwal_cards = page.locator('div#users li');
        this.jadwal_plg_cards = page.locator('div#users').nth(1).locator('li');

        // User Data
        this.nama_pemesan = page.locator('#pemesan');
        this.email_pemesan = page.locator('#email');
        this.nohp_pemesan = page.locator('[name="telepon"]');
        this.nama_penumpang = page.locator('#penumpang1');
        this.carikursi_btn = page.locator('button:has-text("Pilih Kursi")');

        // Seat Page
        this.tab2d = page.locator('#btn-2d');
        this.tab3d = page.locator('#btn-3d')
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.tab_plg = page.locator('button:has-text("Kursi Pulang")');
        this.kursi_plg_tersedia = page.locator('div.seat-blank');
        this.diskon_label_seat_page = page.locator('span#display_diskon');
        this.pembayaran_btn = page.locator('button:has-text("Pembayaran")');

        // Payment Confirmation Page
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit:has-text("Konfirmasi")');
        this.konfirmasi_pembayaran_btn_modal = page.locator('.modal-body button:has-text("Konfirmasi")');

        //Booked Page v1
        this.pesanan_dibuat_label = page.locator('p:has-text("Pesanan Dibuat")');
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + h3');
        this.kode_pembayaran_label = page.locator('p:has-text("Kode Pembayaran") + h3');
        this.total_bayar_label = page.locator('p:has-text("Total Bayar") + h3');
        this.total_harga_label = page.locator('p:has-text("Total Harga") + h3');

        //Booked Page v2
        this.pesanan_dibuat_label_2 = page.locator('p:has-text("Detail Pesanan")');
        this.kode_booking_label_2 = page.locator('p:has-text("Detail Pesanan") + p');
        this.kode_pembayaran_label_2 = page.locator('p:has-text("Kode Pembayaran") + p');
        this.total_bayar_label_2 = page.locator('p:has-text("Total Bayar") + p');
        this.total_harga_label_2 = page.locator('p:has-text("Total Harga") + p');

        //Booked Page v3
        this.total_harga_label_3 = page.locator('p:has-text("Total Harga") + div > p');

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

    getPenumpangTerdaftar(i, n) { // Untuk mendapatkan data penumpang setelah isi data untuk memilih kursi
        return this.page.locator(`[data-passenger-index="${i}"]`).nth(n);
    }

    getMetodeBayar(metode) { // Untuk mendapatkan metode pembayaran sesuai data test
        return this.page.locator(`#container-payment p:has-text("${metode}")`);
    }

    getPlatformBayar(platform) { // Untuk mendapatkan platform pembayaran setelah pilih metode bayar
        return this.page.locator(`input[onclick*="${platform}"]`);
    }

    normalizeRupiah(value) {
        if (!value) return 0;
    
        const text = value.toString().toLowerCase().trim();
        const number = Number(text.replace(/[^0-9]/g, ""));
    
        if (text.includes("rb")) {
            return number * 1000;
        }
    
        return number;
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
        await this.keberangkatan_field.click();
        await this.dropdown_keberangkatan.locator(`span.vselect-option-text > span:text-is("${value}")`).click();
    }

    async isiTujuan(value) {
        await this.tujuan_field.click();
        await this.dropdown_tujuan.locator(`span.vselect-option-text > span:text-is("${value}")`).click();
    }

    async isiTanggalPergi(value) {
        const tanggal_target = this.page.locator(`[aria-label="${value}"]`).first();
        await this.tanggal_pergi.click();
        while(!(await tanggal_target.isVisible())){
            await this.next_month_btn.click();
        }
        await tanggal_target.click();
    }

    async checklistPP() {
        await this.pp_checkbox.evaluate(el => el.click());
    }

    async isiTanggalPulang(value) {
        const elemen_tgl = await this.page.locator(`[aria-label="${value}"]`).nth(1).count();
        const tanggal_target = elemen_tgl !== 0 ? this.page.locator(`[aria-label="${value}"]`).nth(1) : this.page.locator(`[aria-label="${value}"]`);
        await this.tanggal_pulang.click();
        while(!(await tanggal_target.isVisible())){
            await this.next_month_btn2.click();
        }
        await tanggal_target.click();
    }

    async isiJumlahPenumpang(value) {
        await this.jumlah_penumpang.click();
        await this.dropdown_jml_penumpang.locator(`.vselect-option:has-text("${value} Orang")`).click();
        await this.keberangkatan_field.click(); // Untuk menghilangkan dropdown
    }

    async cariTiket() {
        await this.cari_btn.click();
    }

    async pilihJadwal() {
        await this.waitForLoader('div#modal-load', 'show', false);

        const first_jadwal = await this.jadwal_cards.first();
        const harga_tiket = await first_jadwal.locator('div.harga > p').innerText();
        await first_jadwal.locator('button:has-text("Pilih")').first().click();
        return harga_tiket;
    }

    async pilihJadwalPulang() {
        await this.waitForLoader('div#modal-load', 'show', false);

        const first_jadwal = await this.jadwal_plg_cards.first();
        const harga_tiket = await first_jadwal.locator('div.harga > p').innerText();
        await first_jadwal.locator('button:has-text("Pilih")').first().click();
        return harga_tiket;
    }

    async isiDataPenumpang(jml_penumpang, pemesan, penumpang) {
        await this.waitForLoader('div#modal-load', 'show', false);

        const penumpang_dewasa = penumpang.PenumpangDewasa;
        await this.nama_pemesan.fill(pemesan.NamaPemesan);
        await this.email_pemesan.fill(pemesan.Email);
        await this.nohp_pemesan.fill(pemesan.NoHP);

        for(let i = 0; i < jml_penumpang; i++){
            await this.getNamaPenumpang(i+1).fill(penumpang_dewasa[`Penumpang_${i+1}`].NamaPenumpang); 
        }
    }

    async cariKursi() {
        await this.carikursi_btn.click();
    }

    async pilihKursi(jml_penumpang) {
        await this.waitForLoader('div#modal-load', 'show', false);

        await this.tab2d.click();
        for(let i = 0; i < jml_penumpang; i++) {
            await this.getPenumpangTerdaftar(i+1, 0).click();
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async pilihKursiPulang(jml_penumpang) {
        await this.waitForLoader('div#modal-load', 'show', false);

        await this.tab_plg.click();
        await this.tab2d.click();
        for(let i = 0; i < jml_penumpang; i++) {
            await this.getPenumpangTerdaftar(i+1, 0).click();
            await this.kursi_plg_tersedia.nth(i).click();
        }
    }

    async validasiHargaTiketKursi(harga_tiket, jml_penumpang, kursi_tersedia) { //Validasi harga tiket yang terpampang di kursi
        const harga_type = harga_tiket.includes(" - ") ? "range" : "fixed";
        let harga_min;
        let harga_max;

        if (harga_type === "range") {
            [harga_min, harga_max] = (harga_tiket.split(" - "));
            harga_min = this.normalizeRupiah(harga_min);
            harga_max = this.normalizeRupiah(harga_max);

            for (let i = 0; i < jml_penumpang; i++) {
                let harga_kursi;

                if (await kursi_tersedia.nth(i).locator('p').filter({ hasText : /Sale|Promo/i }).count() > 0) {
                    harga_kursi = this.normalizeRupiah(await kursi_tersedia.nth(i).locator('span').nth(2).innerText());
                } else {
                    harga_kursi = this.normalizeRupiah(await kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                }

                expect(harga_kursi).toBeGreaterThanOrEqual(harga_min);
                expect(harga_kursi).toBeLessThanOrEqual(harga_max);
            }
            
        }
        
        if (harga_type === "fixed") {
            for (let i = 0; i < jml_penumpang; i++) {
                
                let harga_kursi;

                if (await kursi_tersedia.nth(i).locator('p').filter({ hasText : /Sale|Promo/i }).count() > 0) {
                    harga_kursi = this.normalizeRupiah(await kursi_tersedia.nth(i).locator('span').nth(2).innerText());
                } else {
                    harga_kursi = this.normalizeRupiah(await kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                }

                expect(harga_kursi).toBe(this.normalizeRupiah(harga_tiket));
            }
        }
        
        return true;

    }

    async validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, current_page, biaya_lainnya, case_flag) {

        switch(current_page) {
            case("seat-page") :

                const list_kursi_tersedia = case_flag === "round-trip" ? this.kursi_plg_tersedia : this.kursi_tersedia;
                let expected_temp = 0;

                if (await this.validasiHargaTiketKursi(harga_tiket, jml_penumpang, list_kursi_tersedia)) {

                    for (let i = 0; i < jml_penumpang; i++) {

                        let current_harga_tiket;

                        if (await list_kursi_tersedia.nth(i).locator('p').filter({ hasText : /Sale|Promo/i }).count() > 0) {
                            current_harga_tiket = this.normalizeRupiah(await list_kursi_tersedia.nth(i).locator('span').nth(2).innerText());
                        } else {
                            current_harga_tiket = this.normalizeRupiah(await list_kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                        }

                        expected_total_tiket += current_harga_tiket;
                        expected_temp += current_harga_tiket;
                    }
                }   

                if (case_flag === "round-trip") {
                    const actual_total_tiket_seat_1 = this.normalizeRupiah(await this.page.locator('.display-price-seat-selected:not(#hargatot)').innerText());
                    expect(actual_total_tiket_seat_1).toBe(expected_temp);
    
                    const actual_total_tiket_seat_2 = this.normalizeRupiah(await this.page.locator('span#hargatot').innerText());
                    expect(actual_total_tiket_seat_2).toBe(expected_temp);

                } else {
                    const actual_total_tiket_seat_1 = this.normalizeRupiah(await this.page.locator('.display-price-seat-selected:not(#hargatot)').innerText());
                    expect(actual_total_tiket_seat_1).toBe(expected_total_tiket);
    
                    const actual_total_tiket_seat_2 = this.normalizeRupiah(await this.page.locator('span#hargatot').innerText());
                    expect(actual_total_tiket_seat_2).toBe(expected_total_tiket);
                }

                return expected_total_tiket;

                break;

            case("payment-page") :
                const actual_total_tiket_payment_1 = this.normalizeRupiah(await this.page.locator('div:has-text("Total Bayar") + div > p ').innerText());
                const actual_total_tiket_payment_2 = this.normalizeRupiah(await this.page.locator('span#hargatot').innerText());

                expect(actual_total_tiket_payment_1).toBe(expected_total_tiket);
                expect(actual_total_tiket_payment_2).toBe(expected_total_tiket);

                return expected_total_tiket;
                break;

            case("success-page") :
                let actual_total_tiket_success;

                if (await this.total_bayar_label.count() > 0) {
                    actual_total_tiket_success = this.normalizeRupiah(await this.total_bayar_label.innerText());
                } else if (await this.total_harga_label.count() > 0) {
                    actual_total_tiket_success = this.normalizeRupiah(await this.total_harga_label.innerText());
                } else if (await this.total_bayar_label_2.count() > 0) {
                    actual_total_tiket_success = this.normalizeRupiah(await this.total_bayar_label_2.innerText());
                } else if (await this.total_harga_label_2.count() > 0) {
                    actual_total_tiket_success = this.normalizeRupiah(await this.total_harga_label_2.innerText());
                } else if (await this.total_harga_label_3.count() > 0) {
                    actual_total_tiket_success = this.normalizeRupiah(await this.total_harga_label_3.innerText());
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

        await this.getMetodeBayar(metode_bayar).click();
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
        if (await this.pesanan_dibuat_label.count() > 0) {
            elements = {
                label_berhasil : this.pesanan_dibuat_label,
                label_kode_booking : this.kode_booking_label,
                label_kode_pembayaran : this.kode_pembayaran_label
            }
        } else {
            elements = {
                label_berhasil : this.pesanan_dibuat_label_2,
                label_kode_booking : this.kode_booking_label_2,
                label_kode_pembayaran : this.kode_pembayaran_label_2
            }
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