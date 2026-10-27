import { expect } from "@playwright/test";

export class Daytrans{
    constructor(page) {

        // General
        this.page = page;
        this.close_popup = page.locator('.close-pop-info');

        // Reservation Form
        this.keberangkatan = page.locator('#schedule-desktop-search-origin');
        this.tujuan = page.locator('#schedule-desktop-search-destination');
        this.clear_search_keberangkatan = page.locator('button[aria-label="Hapus pencarian"]').first(); 
        this.clear_search_tujuan = page.locator('button[aria-label="Hapus pencarian"]').nth(1); 
        this.tanggal_pergi = page.locator('#schedule-desktop-search-date');
        this.save_date_btn = page.locator('[data-testid="shuttle-date-sheet-save"] > button');
        this.jumlah_penumpang = page.locator('span:text-is("Penumpang") + div');
        this.jml_penumpang_plus = this.jumlah_penumpang.locator('button[aria-label="Tambah penumpang"]');
        this.jml_penumpang_min = this.jumlah_penumpang.locator('button[aria-label="Kurangi penumpang"]');
        this.cari_tiket_btn = page.locator('button:text-is("Cari")');
        this.jadwal_cards = page.locator('aside + div > div > div');

        // User Data
        this.nama_pemesan = page.locator('#shuttle-orderer-name');
        this.email_pemesan = page.locator('#shuttle-orderer-email');
        this.nohp_pemesan = page.locator('#shuttle-orderer-phone');
        this.carikursi_btn = page.locator('button:has-text("Lanjut Pilih Kursi")');

        // Seat Page
        this.list_kursi_container = page.locator('div[data-testid="shuttle-seat-picker"]');
        this.kursi_tersedia = this.list_kursi_container.locator('button:not(:disabled)');
        this.details_container = page.locator(`aside > div > div`);
        this.total_kursi_perarmada = 0;
        this.pilih_next_kursi_btn = page.locator('button:has-text("Pilih Kursi Selanjutnya")');
        this.pembayaran_btn = this.details_container.nth(3).locator('button');

        // Payment Confirmation Page
        this.metode_bayar_btn = page.locator('button:has-text("Pilih metode pembayaran")');
        this.check_ketentuan_btn = page.locator('input[data-testid="terms-consent-agree"]');
        this.konfirmasi_pembayaran_btn = page.locator('button:has-text("Bayar Sekarang")');
        this.konfirmasi_pembayaran_btn_modal = page.locator('button[data-testid="terms-consent-continue"]');
        this.detail_harga_card = page.locator('[data-testid="shuttle-detail-harga-card"]');
        this.total_on_detail_keberangkatan_card = page.locator('span#hargatot');

        // Booked Pgae
        this.pesanan_dibuat_label = page.locator('p:has-text("Bayar Sebelum")');
        this.kode_booking_label = page.locator('div:has-text("Keberangkatan") + p');
        this.kode_pembayaran_label = page.locator('p:has-text("Total Pembayaran") + div > span');
        this.detail_pembayaran_card = page.locator('p:has-text("Detail Pembayaran") + div > div');

        // Login
        this.login_btn = page.locator('button:has-text("Log In")');
        this.login_container = page.locator('div#auth-modal');
        this.email_phone_field = this.login_container.locator('input#auth-main-user');
        this.pin_field = this.login_container.locator('input#auth-login-pin');
        this.submit_btn = this.login_container.locator('button:has-text("Masuk")');
        this.verif_pin_btn = this.login_container.locator('button:has-text("Verifikasi PIN")');
        this.login_google_btn = this.login_container.locator('button:has-text("Lanjutkan dengan Google")');

        //Non locator
        this.elemenKursiKe = 0;
    }

    getNamaPenumpang(i) { // Untuk mendapatkan object data penumpang dari data test
        return this.page.locator(`[id="passengers.${i}.name"]`);
    }

    getPenumpangTerdaftar(i, n) { // Untuk mendapatkan data penumpang setelah isi data untuk memilih kursi
        const list_section = this.details_container.nth(1);
        return list_section.locator('button').nth(i);
    }

    getJumlahPindahArmada() {
        return this.page.locator(`[data-passenger-index="1"]`).count();
    }

    getPlatformBayar(platform) { // Untuk mendapatkan platform pembayaran setelah pilih metode bayar
        return this.page.locator(`section[aria-label="${platform}"]`);
    }

    normalizeRupiah(value) {
        if (!value) return 0;

        return Number(
            value
                .toString()
                .replace(/[^0-9]/g, "") // hapus semua selain angka
        );
    }

    parseText(text) {
        return text
            .toLowerCase()
            .replace(/[\s\-().]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .trim()
    }

    async waitForLoader(selector, loader_class, to_have) {
        const loaders = this.page.locator(selector);
        const count = await loaders.count();
    
        for (let i = 0; i < count; i++) {
            
            const loader = loaders.nth(i);
    
            if (to_have) {
                await expect(loader).toHaveClass(new RegExp(loader_class), { timeout: 120000 });
            } else {
                await expect(loader).not.toHaveClass(new RegExp(loader_class), { timeout: 120000 });
            }
        }
    }

    async waitForScheduleSectionLoader() {
        const loaders = await this.page.locator('div[id^="loading-jadwal-"]');
        for (let i = 0; i < loaders.count(); i++) {
            await expect(loaders).nth(i).toBeHidden({timeout: 120000});
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
        if (await this.keberangkatan.inputValue()) {
            await this.clear_search_keberangkatan.click();
        }
        await this.keberangkatan.click();
        await this.keberangkatan.fill(value);
        await this.page.locator(`button:has-text("${value}")`).click();
    }

    async isiTujuan(value) {
        if (await this.tujuan.inputValue()) {
            await this.clear_search_tujuan.click();
        }
        await this.tujuan.click();
        await this.tujuan.fill(value);
        await this.page.locator(`button:has-text("${value}")`).click();
    }

    async isiTanggalPergi(value) {
        const formatted_value = value.replace(/^(\w+) (\d+), (\d{4})$/,'$2 $1 $3');
        const tanggal_target = this.page.locator(`[aria-label*="${formatted_value}"]`);

        await this.tanggal_pergi.click();
        await tanggal_target.click();
        await this.save_date_btn.click();
    }

    async isiJumlahPenumpang(value) {
        let current_jml = this.normalizeRupiah(await this.jumlah_penumpang.innerText());

        while(current_jml !== value) {
            await this.jml_penumpang_plus.click();
            current_jml = this.normalizeRupiah(await this.jumlah_penumpang.innerText());
        }
    }

    async cariTiket() {
        await this.cari_tiket_btn.click();
        await this.waitForLoader('#modal-load', 'show', false);
    }

    async pilihJadwal(){
        const jadwal_card = await this.jadwal_cards.first();
        const harga_tiket = await jadwal_card.locator('span:has-text("Rp")').nth(1).innerText();
        const pilih_btn = await jadwal_card.locator('button:has-text("Pilih Jadwal")');

        await pilih_btn.click();
        await this.page.waitForTimeout(2000);

        return harga_tiket;
    }

    async isiDataPenumpang(jml_penumpang, pemesan, penumpang) {
        const penumpang_dewasa = penumpang.PenumpangDewasa;
        await this.nama_pemesan.fill(pemesan.NamaPemesan);
        await this.email_pemesan.fill(pemesan.Email);
        await this.nohp_pemesan.fill(pemesan.NoHP);
        
        for(let i = 0; i < jml_penumpang; i++){
            await this.getNamaPenumpang(i).fill(penumpang_dewasa[`Penumpang_${i+1}`].NamaPenumpang); 
        }
    }

    async cariKursi() {
        await this.carikursi_btn.click();
    }

    async pilihKursi(jml_penumpang) { // n = 0 (tidak ada perpindahan armada)
        for(let i = 0; i < jml_penumpang; i++){
            await this.getPenumpangTerdaftar(i, 0).click();
            await this.kursi_tersedia.nth(i).click();
            await this.page.waitForTimeout(1000);
        }
    }

    async pilihKursiConnRes(jml_penumpang, pemesan, penumpang, n) {
        await this.waitForLoader('div[id^="load-layout-kursi"]', 'd-none', true);
        await this.page.waitForTimeout(1000);

        for (let i = 0; i < jml_penumpang; i++) {
          await this.getPenumpangTerdaftar(i+1, n).click(); // Dapatkan/klik penumpang terdaftar untuk pilih kursi
          await this.getKursi(this.total_kursi_perarmada+i).click(); // Pilih kursi 
        }

        this.elemenKursiKe = this.total_kursi_perarmada;
        const kursiSaatIni = await this.kursi_tersedia.count(); // Hitung banyak kursi saat ini untuk membantu pemilihan kursi di armada selanjutnya
        this.total_kursi_perarmada = kursiSaatIni;
    }

    async validasiHargaTiketKursi(harga_tiket, jml_penumpang, case_flag) { //Validasi harga tiket yang terpampang di kursi
        const harga_type = harga_tiket.includes(" - ") ? "range" : "fixed";
        let harga_min;
        let harga_max;
        let harga_kursi;
        let kursi;

        if (harga_type === "range") {
            [harga_min, harga_max] = (harga_tiket.split(" - "));
            harga_min = this.normalizeRupiah(harga_min);
            harga_max = this.normalizeRupiah(harga_max);

            for (let i = 0; i < jml_penumpang; i++) {

                if (case_flag !== 'connecting') {
                    kursi = await this.getKursi(i).locator('span');
                } else {
                    kursi = await this.getKursi(this.elemenKursiKe+i).locator('span');
                }
                
                if (/Sale|Promo/i.test(await kursi.first().innerText())) {
                    harga_kursi = this.normalizeRupiah(await kursi.nth(1).innerText());
                } else {
                    harga_kursi = this.normalizeRupiah(await kursi.first().innerText());
                }
                
                if (case_flag !== 'connecting') {
                    expect(harga_kursi).toBeGreaterThanOrEqual(harga_min);
                }

                expect(harga_kursi).toBeLessThanOrEqual(harga_max);
            }
            
        }
        
        if (harga_type === "fixed") {
            for (let i = 0; i < jml_penumpang; i++) {
                if (case_flag !== 'connecting') {
                    kursi = await this.getKursi(i).locator('span');
                } else {
                    kursi = await this.getKursi(this.elemenKursiKe+i).locator('span');
                }
                
                if (/Sale|Promo/i.test(await kursi.first().innerText())) {
                    harga_kursi = this.normalizeRupiah(await kursi.nth(1).innerText());
                } else {
                    harga_kursi = this.normalizeRupiah(await kursi.first().innerText());
                }

                expect(harga_kursi).toBe(this.normalizeRupiah(harga_tiket));
            }
        }
        
        return true;

    }

    async validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, current_page, biaya_lainnya, case_flag, n) { // Validasi total harga tiket yang dipilih

        switch(current_page) {
            case("seat-page") :

                harga_tiket = this.normalizeRupiah(harga_tiket);
                expected_total_tiket = (harga_tiket * jml_penumpang) + (1500 * jml_penumpang); //Tambahan asuransi

                const details_section = this.details_container.nth(2);
                const actual_total_tiket_seat = this.normalizeRupiah(await details_section.locator('span:has-text("Total") + div > div').first().innerText());
                
                expect(actual_total_tiket_seat).toBe(expected_total_tiket);

                return expected_total_tiket;

                break;

            case("payment-page") :
                const biaya_layanan = this.normalizeRupiah(
                    await this.detail_harga_card
                        .locator('div').first()
                        .locator('div:has-text("Biaya Layanan")')
                        .locator('span:has-text("Rp")')
                        .innerText()
                );

                expected_total_tiket += biaya_layanan;

                const actual_total_tiket_payment = this.normalizeRupiah(
                    await this.detail_harga_card
                        .locator('> div').nth(1)
                        .locator('span:has-text("Rp")')
                        .innerText()
                )

                expect(actual_total_tiket_payment).toBe(expected_total_tiket);

                return expected_total_tiket;

                break;

            case("success-page") :

                return expected_total_tiket;
                break;
        }
    }


    async klikBayar() {
        await this.pembayaran_btn.click();
    }
      

    async pilihKursiNextArmada() {
        await this.pilih_next_kursi_btn.click();
    }

    async pilihMetodePembayaran(metode_bayar, platform_bayar){
        await this.page.waitForTimeout(1000);
        await this.metode_bayar_btn.click();
        await this.page.waitForTimeout(1000);
        await this.getPlatformBayar(platform_bayar).click();
    }

    async checklistKetentuan() {
        
    }

    async konfirmasiPembayaran() {
        await this.konfirmasi_pembayaran_btn.click();
        await this.check_ketentuan_btn.click();
        await this.konfirmasi_pembayaran_btn_modal.click();
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
        
    }

    async pilihViaEmail() {
        
    }

    async pilihViaGoogle() {
        await this.login_google_btn.click();
    }

    async isiNoTelp(no_telp) {
        await this.email_phone_field.fill(no_telp);
    }

    async isiEmail(email) {
        await this.email_phone_field.fill(email);
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

    async isiPin(pin) {
        await this.pin_field.fill(pin);
    }

    async verifikasiPin() {
        await this.verif_pin_btn.click();
    }

    async isiOTP() {
        
    }

    async submitOTP() {

    }

    async defaultLogin(data) {
        await this.klikButtonLogin();
        await this.isiEmail(data.Email);
        await this.submitEmail();
        await this.isiPin(data.Pin);
        await this.verifikasiPin();
    }
 }
