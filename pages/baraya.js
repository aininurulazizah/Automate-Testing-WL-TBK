import { expect } from "@playwright/test";

export class Baraya {
    constructor(page){

        // General
        this.page = page;
        this.close_popup = page.locator('.close-pop-info');
        
        // Reservation Form
        this.keberangkatan = page.locator('#dropdownOutlet');
        this.tujuan = page.locator('.col-12 .mx-0 .px-0 .btn-group #dropdownOutlet2');
        this.dropdown_tujuan = page.locator('#dropdown-outlet2');
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
        this.jadwal_card = page.locator('ul#jadwal-list-pergi > li');
        this.pilihjadwal_btn_first = page.locator('button:has-text("Pilih")').first();
        this.pilihjadwal_btn_plg_first = page.locator('button[onclick^="sendJadwalpp"]').first();

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
        this.pembayaran_btn = page.locator('button:has-text("Pembayaran")');

        // Payment Confirmation Page
        this.diskon_label_payment_page = page.locator('p.totalDiskon');
        this.biaya_tambahan_label_payment_page = page.locator('p#biayalayanan');
        this.total_bayar_label_payment_page = page.locator('p#totalbayar');
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit:has-text("Konfirmasi")');
        this.konfirmasi_pembayaran_btn_modal = page.locator('.modal-body button:has-text("Konfirmasi")');

        //Booked Page
        this.pesanan_dibuat_label = page.locator('p:has-text("Pesanan Dibuat !")');
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + h3');
        this.kode_pembayaran_label = page.locator('p:has-text("Kode Pembayaran") + h3');
        this.total_bayar_label_success_page = page.locator('p:has-text("Total Bayar") + h3');

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
        return this.page.locator(`img[alt=${platform}]`);
    }

    normalizeRupiah(value) {
        if (!value) return 0;

        return Number(
            value
                .toString()
                .replace(/[^0-9]/g, "") // hapus semua selain angka
        );
    }

    async closePopup(value) {
        while (await value.isVisible()) {
            await value.click(); 
            await this.page.waitForTimeout(1000);
        }
    }

    async isiKeberangkatan(value) {
        await this.keberangkatan.click();
        await this.page.locator(`text=${value}`).first().click();
    }

    async isiTujuan(value) {
        await this.search_lokasi.fill(value);
        await this.page.waitForTimeout(1000);
        await this.dropdown_tujuan.locator(`text=${value}`).first().click();
    }

    async isiTanggalPergi(value) {
        const tanggal_target = this.page.locator(`[aria-label="${value}"]`);
        await this.tanggal_pergi.click();
        while(!(await tanggal_target.isVisible())){
            await this.next_month_btn.click();
        }
        await tanggal_target.click();
    }

    async checklistPP() {
        await this.pp_checkbox.click();
    }

    async isiTanggalPulang(value) {
        const tanggal_target = this.page.locator(`[aria-label="${value}"]`);
        await this.tanggal_pulang.click();
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
        const first_jadwal = await this.jadwal_card.first();
        const harga_tiket = await first_jadwal.locator('h4.harga').first().innerText();
        await first_jadwal.locator('button:has-text("Pilih")').first().click();
        return harga_tiket;
    }

    async pilihJadwalPulang() {
        await this.pilihjadwal_btn_plg_first.click();
    }

    async isiDataPenumpang(jml_penumpang, pemesan, penumpang) {
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
        await this.carikursi_btn.click();
    }

    async pilihKursi(jml_penumpang) {
        const jml_dewasa = jml_penumpang.Dewasa;
        for(let i = 0; i < jml_dewasa; i++) {
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async pilihKursiPulang(jml_penumpang) {
        const jml_dewasa = jml_penumpang.Dewasa;
        await this.tab_plg.click();
        for(let i = 0; i < jml_dewasa; i++) {
            await this.kursi_plg_tersedia.nth(i).click();
        }
    }

    async validasiHargaTiketKursi(harga_tiket, jml_penumpang) { //Validasi harga tiket yang terpampang di kursi
        const jml_penumpang_d = jml_penumpang.Dewasa;
        const harga_type = harga_tiket.includes(" - ") ? "range" : "fixed";
        let harga_min;
        let harga_max;

        if (harga_type === "range") {
            [harga_min, harga_max] = (harga_tiket.split(" - "));
            harga_min = this.normalizeRupiah(harga_min);
            harga_max = this.normalizeRupiah(harga_max);

            for (let i = 0; i < jml_penumpang_d; i++) {
                const harga_kursi = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').innerText());
                expect(harga_kursi).toBeGreaterThanOrEqual(harga_min);
                expect(harga_kursi).toBeLessThanOrEqual(harga_max);
            }
            
        }
        
        if (harga_type === "fixed") {
            for (let i = 0; i < jml_penumpang_d; i++) {
                const harga_kursi = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').innerText());
                expect(harga_kursi).toBe(this.normalizeRupiah(harga_tiket));
            }
        }
        
        return true;

    }

    async validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, current_page, biaya_lainnya) {

        const jml_penumpang_d = jml_penumpang.Dewasa;

        switch(current_page) {
            case("seat-page") :

                if (await this.validasiHargaTiketKursi(harga_tiket, jml_penumpang)) {
                    for (let i = 0; i < jml_penumpang_d; i++) {
                        const current_harga_tiket = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').innerText());
                        expected_total_tiket += current_harga_tiket;
                    }
                }   

                const actual_total_tiket_seat_1 = this.normalizeRupiah(await this.page.locator('span.display-price-seat-selected').innerText());
                expect(actual_total_tiket_seat_1).toBe(expected_total_tiket);

                const diskon = this.normalizeRupiah(await this.diskon_label_seat_page.innerText());
                expected_total_tiket -= diskon;
                const actual_total_tiket_seat_2 = this.normalizeRupiah(await this.page.locator('p#totalbayar').innerText());
                expect(actual_total_tiket_seat_2).toBe(expected_total_tiket);

                return expected_total_tiket;

                break;

            case("payment-page") :
                const total_diskon = this.normalizeRupiah(await this.diskon_label_payment_page.innerText());
                const biaya_tambahan = this.normalizeRupiah(await this.biaya_tambahan_label_payment_page.innerText());
                const actual_total_tiket_payment = this.normalizeRupiah(await this.total_bayar_label_payment_page.innerText());

                expected_total_tiket -= total_diskon;
                expected_total_tiket += biaya_tambahan;

                expect(actual_total_tiket_payment).toBe(expected_total_tiket);

                return expected_total_tiket;
                break;

            case("success-page") :
                const actual_total_tiket_success = this.normalizeRupiah(await this.total_bayar_label_success_page.innerText());
                expect(actual_total_tiket_success).toBe(expected_total_tiket);

                return expected_total_tiket;
                break;
        }
    }

    async klikBayar() {
        await this.pembayaran_btn.click();
        await this.page.waitForTimeout(5000);
    }

    async pilihMetodePembayaran(metode_bayar, platform_bayar){
        await this.getPlatformBayar(platform_bayar).click();
    }

    async checklistKetentuan() {
        await this.check_ketentuan_btn.click();
    }

    async konfirmasiPembayaran() {
        await this.konfirmasi_pembayaran_btn.click()
        await this.konfirmasi_pembayaran_btn_modal.click();
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