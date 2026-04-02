import { expect } from "@playwright/test";

export class Daytrans{
    constructor(page) {

        // General
        this.page = page;
        this.close_popup = page.locator('.close-pop-info');

        // Reservation Form
        this.keberangkatan = page.locator('#berangkat');
        this.tujuan = page.locator('#tujuan');
        this.dropdown_keberangkatan = page.locator('#dropdown-outlet');
        this.dropdown_tujuan = page.locator('#dropdown-outlet2');
        this.tanggal_pergi = page.locator('#tgl_berangkat');
        this.next_month_btn = page.locator('.flatpickr-next-month');
        this.jumlah_penumpang = page.locator('.ss-main .ss-single-selected'); // tidak pakai id karena display none
        this.cari_tiket_btn = page.locator('.btn-search');
        this.jadwal_btn = page.locator('.btn-list-jadwal');
        this.jam_card = page.locator('div#jadwal-list-0 > li');

        // User Data
        this.nama_pemesan = page.locator('#pemesan');
        this.email_pemesan = page.locator('#email');
        this.nohp_pemesan = page.locator('[name="telepon"]');
        this.carikursi_btn = page.locator('#submitModal');
        this.carikursi_confirm_btn = page.locator('#confirmSubmit');

        // Seat Page
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.total_kursi_perarmada = 0;
        this.pilih_next_kursi_btn = page.locator('button:has-text("Pilih Kursi Selanjutnya")');
        this.pembayaran_btn = page.locator('button:has-text("pembayaran")');

        // Payment Confirmation Page
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit:has-text("Konfirmasi")');
        this.konfirmasi_pembayaran_btn_modal = page.locator('.modal-body button:has-text("Konfirmasi")');
        this.detail_harga_card = page.locator('p:has-text("Detail Harga") + div > div > div > div > div');
        this.total_on_detail_keberangkatan_card = page.locator('span#hargatot');

        // Booked Pgae
        this.pesanan_dibuat_label = page.locator('p:has-text("Pesanan Dibuat !")');
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + div > p');
        this.kode_pembayaran_label = page.locator('p:has-text("Kode Pembayaran") + div > div > div').first();
        this.detail_pembayaran_card = page.locator('p:has-text("Detail Pembayaran") + div > div');

        // Login
        this.login_btn = page.locator('a:has-text("Masuk")');
        this.login_phone_btn = page.locator('button:has-text("Nomor Telepon")');
        this.login_whatsapp_btn = page.locator('button:has-text("Whatsapp")');
        this.login_email_btn = page.locator('button:has-text("Email")');
        this.login_google_btn = page.locator('button:has-text("Google")');
        this.phone_field = page.locator('input#no_telepon');
        this.email_field = page.locator('input#email');
        this.submit_tlp_btn = page.locator('button[onclick*="submittlp"]');
        this.submit_email_btn = page.locator('button[onclick*=submitemail]');
        this.submit_otp_btn = page.locator('button[onclick*="submit"]');

        //Non locator
        this.elemenKursiKe = 0;
    }

    getNamaPenumpang(i) { // Untuk mendapatkan object data penumpang dari data test
        return this.page.locator(`#penumpang${i}`);
    }

    getPenumpangTerdaftar(i, n) { // Untuk mendapatkan data penumpang setelah isi data untuk memilih kursi
        return this.page.locator(`[data-passenger-index="${i}"]`).nth(n);
    }

    getKursi(i) {
        return this.page.locator('div.seat-blank').nth(i);
    }

    getJumlahPindahArmada() {
        return this.page.locator(`[data-passenger-index="1"]`).count();
    }

    getMetodeBayar(metode) { // Untuk mendapatkan metode pembayaran sesuai data test
        return this.page.locator(`#container-payment p:has-text("${metode}")`);
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

    parseText(text) {
        return text
            .toLowerCase()
            .replace(/[\s\-().]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .trim()
    }

    async closePopup(value) {
        while (await value.isVisible()) {
            await value.click(); 
            await this.page.waitForTimeout(1000);
        }
    }

    async isiKeberangkatan(value) {
        await this.keberangkatan.click();
        await this.dropdown_keberangkatan.locator(`text=${value}`).first().click();
    }

    async isiTujuan(value) {
        await this.tujuan.click();
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

    async isiJumlahPenumpang(value) {
        const selected = await this.page.locator('.ss-single-selected span:has-text("Orang")').innerText();
        if (selected !== `${value} Orang`) {
            await this.jumlah_penumpang.click();
            await this.page.locator(`.ss-option:has-text("${value}")`).click();
            await this.page.locator('body').click({ force: true }); // klik body untuk menutup dropdown setelah pilih opsi
        }
    }

    async cariTiket() {
        await this.cari_tiket_btn.click();
    }

    async pilihJadwal(){
        await this.jadwal_btn.first().click(); //Pilih jadwal
        const jam_card = this.jam_card.first(); //Ambil card pertama dari list jam berangkat
        const harga_tiket = this.jam_card.first().locator('h4.harga').nth(1).innerText(); //Ambil harga tiketnya
        await jam_card.locator('button:has-text("Beli")').click(); //Pilih jam
        return harga_tiket; //Kembalikan harga tiket di jam terpilih untuk kebutuhan validasi harga tiket
    }

    async isiDataPenumpang(jml_penumpang, pemesan, penumpang) {
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
        await this.carikursi_confirm_btn.click();
    }

    async pilihKursi(jml_penumpang) { // n = 0 (tidak ada perpindahan armada)
        for(let i = 0; i < jml_penumpang; i++){
            await this.getPenumpangTerdaftar(i+1, 0).click();
            await this.getKursi(i).click();
        }
    }

    async pilihKursiConnRes(jml_penumpang, n) {
        for (let i = 0; i < jml_penumpang; i++) {
          await this.getPenumpangTerdaftar(i+1, n).click(); // Dapatkan/klik penumpang terdaftar untuk pilih kursi
          await this.getKursi(this.total_kursi_perarmada+i).click(); // Pilih kursi 
        }

        this.elemenKursiKe = this.total_kursi_perarmada;
        const kursiSaatIni = await this.kursi_tersedia.count(); // Hitung banyak kursi saat ini untuk membantu pemilihan kursi di armada selanjutnya
        this.total_kursi_perarmada = kursiSaatIni;
    }

    async validasiHargaTiketKursi(harga_tiket, jml_penumpang, connectingRes) { //Validasi harga tiket yang terpampang di kursi
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

                if (!connectingRes) {
                    kursi = await this.getKursi(i).locator('span');
                } else {
                    kursi = await this.getKursi(this.elemenKursiKe+i).locator('span');
                }
                
                if (await kursi.first().innerText() === "Promo") {
                    harga_kursi = this.normalizeRupiah(await kursi.nth(1).innerText());
                } else {
                    harga_kursi = this.normalizeRupiah(await kursi.first().innerText());
                }
                
                if (!connectingRes) {
                    expect(harga_kursi).toBeGreaterThanOrEqual(harga_min);
                }

                expect(harga_kursi).toBeLessThanOrEqual(harga_max);
            }
            
        }
        
        if (harga_type === "fixed") {
            for (let i = 0; i < jml_penumpang; i++) {
                const harga_kursi = this.normalizeRupiah(await this.getKursi(i).locator('span').innerText());
                expect(harga_kursi).toBe(this.normalizeRupiah(harga_tiket));
            }
        }
        
        return true;

    }

    async validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, current_page, biaya_lainnya, connectingRes, n) { // Validasi total harga tiket yang dipilih

        switch(current_page) {
            case("seat-page") :

                let current_harga_tiket;
                let current_total_tiket = 0;
                let kursi;

                if (await this.validasiHargaTiketKursi(harga_tiket, jml_penumpang, connectingRes)) {
                    for (let i = 0; i < jml_penumpang; i++) {

                        if (!connectingRes) {
                            kursi = await this.getKursi(i).locator('span');
                        } else {
                            kursi = await this.getKursi(this.elemenKursiKe+i).locator('span');
                        }

                        if (await kursi.first().innerText() === "Promo") {
                            current_harga_tiket = this.normalizeRupiah(await kursi.nth(1).innerText());
                            expected_total_tiket += current_harga_tiket;
                            current_total_tiket += current_harga_tiket;
                        } else {
                            current_harga_tiket = this.normalizeRupiah(await kursi.first().innerText());
                            expected_total_tiket += current_harga_tiket;
                            current_total_tiket += current_harga_tiket;
                        }
                    }
                }   

                const connectingId = connectingRes ? `connecting${n}` : 'connecting1';

                const actual_total_tiket_seat_1 = this.normalizeRupiah(await this.page.locator(`div#${connectingId} p`).nth(1).innerText());
                const actual_total_tiket_seat_2 = this.normalizeRupiah(await this.page.locator('span#hargatot').innerText());
                
                expect(actual_total_tiket_seat_1).toBe(current_total_tiket);
                expect(actual_total_tiket_seat_2).toBe(expected_total_tiket);

                return expected_total_tiket;

                break;

            case("payment-page") :
                const detail_harga_card_count = await this.detail_harga_card.count();
                let expected_total_tiket_payment = this.normalizeRupiah(await this.detail_harga_card.first().locator('p').nth(1).innerText());

                for (let i = 0; i < detail_harga_card_count; i++) {
                    const detail = this.parseText(await this.detail_harga_card.nth(i).locator('p').first().innerText());
                    const nominal = this.normalizeRupiah(await this.detail_harga_card.nth(i).locator('p').nth(1).innerText());

                    if (biaya_lainnya.Potongan.includes(detail)) {
                        expected_total_tiket_payment -= nominal;
                    }

                    if (biaya_lainnya.Tambahan.includes(detail)) {
                        expected_total_tiket_payment += nominal;
                    }
                }

                // Ambil actual total di Card Detail Harga dan Card Detail Keberangkatan
                const actual_total_tiket_payment_1 = this.normalizeRupiah(await this.detail_harga_card.last().locator('p').nth(1).innerText());
                const actual_total_tiket_payment_2 = this.normalizeRupiah(await this.total_on_detail_keberangkatan_card.innerText());
                
                expect(actual_total_tiket_payment_1).toBe(expected_total_tiket_payment);
                expect(actual_total_tiket_payment_2).toBe(expected_total_tiket_payment);

                return expected_total_tiket_payment;

                break;

            case("success-page") :
                const actual_total_tiket_success = this.normalizeRupiah(await this.detail_pembayaran_card.last().locator('div').nth(1).innerText());
                expect(actual_total_tiket_success).toBe(expected_total_tiket);

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
        await this.getMetodeBayar(metode_bayar).click();
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
        await this.submit_tlp_btn.click();
    }

    async submitEmail() {
        await this.submit_email_btn.click();
    }

    async isiOTP() {
        await this.page.pause();
    }

    async submitOTP() {
        await this.submit_otp_btn.click();
        await this.page.waitForTimeout(2000);
    }
 }
