import { expect } from "@playwright/test";

export class Btm{
    constructor(page) {

        // General
        this.page = page;
        this.close_popup = page.locator('.close-pop-info')

        // Reservation Form
        this.keberangkatan = page.locator('.ss-single-selected').first();
        this.tujuan = page.locator('.ss-single-selected').nth(1);
        this.tanggal_pergi = page.locator('input.datepicker[readonly]');
        this.next_month_btn = page.locator('.flatpickr-next-month');
        this.jumlah_penumpang = page.locator('.ss-main .ss-single-selected span:has-text("Orang")');
        this.cari_btn = page.locator('button:has-text("Cari Tiket")');
        this.jadwal_card = page.locator('div#users > div > li');

        // User Data
        this.nama_pemesan = page.locator('#pemesan');
        this.email_pemesan = page.locator('#email');
        this.nohp_pemesan = page.locator('input[name="telepon"]');
        this.carikursi_btn = page.locator('button:has-text("Pilih Kursi")');

        // Seat Page
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.total_kursi_perarmada = 0;
        this.pilih_next_kursi_btn = page.locator('button:has-text("Pilih Kursi Selanjutnya")');
        this.total_bayar_label_general = page.locator('span#hargatot');
        this.pembayaran_btn = page.locator('button:has-text("Pembayaran")');

        // Payment Confirmation Page
        this.total_bayar_label_payment = page.locator('div:has-text("Total Bayar") + div > p');
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button:has-text("Konfirmasi ")').first();
        this.konfirmasi_pembayaran_btn_modal = page.locator('button:has-text("Konfirmasi ")').nth(1);

        // Booked Page
        this.pesanan_dibuat_label = page.locator('p:has-text("Pesanan Dibuat !")');
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + h3');
        this.kode_pembayaran_label = page.locator('p:has-text("Kode Pembayaran") + h3');
        this.total_bayar_label_success_page = page.locator('p:has-text("Total Bayar") + h3');

        // Login
        this.login_btn = page.locator('a:has-text("Daftar/Masuk")');
        this.login_phone_btn = page.locator('button:has-text("Login dengan Nomor Telepon")');
        this.login_whatsapp_btn = page.locator('button:has-text("Login dengan Whatsapp")');
        this.login_email_btn = page.locator('button:has-text("Login dengan Email")');
        this.login_google_btn = page.locator('button:has-text("Login dengan Google")');
        this.phone_field = page.locator('input#no_telepon');
        this.email_field = page.locator('input#email');
        this.submit_tlp_btn = page.locator('button[onclick*="submittlp"]');
        this.submit_email_btn = page.locator('button[onclick*="submitemail"]');
        this.submit_otp_btn = page.locator('button[onclick*="submit"]');
        this.regis_instruction = page.locator('p:has-text("Daftar Akun")');
        this.regis_nama_field = page.locator('input#nama');
        this.regis_phone_field = page.locator('input[name="telp"]');
        this.regis_email_field = page.locator('input[name="email"]');
        this.regis_tanggal_lahir = page.locator('input[placeholder="Tanggal ulang tahun"][type="text"]');
        this.prev_month_btn = page.locator('.flatpickr-prev-month');
        this.regis_alamat_field = page.locator('textarea[name="alamat"]');
        this.regis_simpan_btn = page.locator('button:has-text("Daftar")');

    }

    getNamaPenumpang(i) {
        return this.page.locator(`#penumpang${i}`);
    }

    getPenumpangTerdaftar(i) { // Untuk mendapatkan data penumpang setelah isi data untuk memilih kursi
        return this.page.locator(`[data-passenger-index="${i}"]`);
    }

    getJumlahPindahArmada() {
        return this.page.locator(`[data-passenger-index="1"]`).count();
    }

    getJumlahKursi() {
        return this.kursi_tersedia.count();
    }

    getPlatformBayar(platform) {
        return this.page.locator(`img[alt=${platform}]`);
    }

    getGenderRegistration(gender) {
        if(gender === "Perempuan") {
            return this.page.locator(`div.d-flex.gender.wanita >> div:has-text('Perempuan')`);
        }
        if(gender === "Laki-laki") {
            return this.page.locator(`div.d-flex.genderpria >> div:has-text('Laki-laki')`);
        }
        
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
            await this.page.waitForTimeout (1000);
        }
    }

    async isiKeberangkatan(value) {
        await this.keberangkatan.click();
        await this.page.locator('.ss-option', { hasText: value }).first().click();
    }

    async isiTujuan(value) {
        await this.tujuan.click();
        await this.page.locator('.ss-option', { hasText: value }).nth(1).click();
    }

    async isiTanggalPergi(value) {
        await this.isiTanggal(value, "next", this.tanggal_pergi, "id-ID");
    }

    async isiJumlahPenumpang(value) {
        const selected = await this.page.locator('.ss-single-selected span:has-text("Orang")').innerText();
        if (selected !== `${value} Orang`) {
            await this.jumlah_penumpang.click();
            await this.page.locator(`.ss-option:has-text("${value} Orang")`).click();
            await this.page.locator('body').click({ force: true }); // klik body untuk menutup dropdown setelah pilih opsi
        }
    }

    async cariTiket() {
        await this.cari_btn.click();
    }

    async pilihJadwal() {
        const harga_tiket = await this.jadwal_card.first().locator('div.harga > p').innerText();
        const jadwal_button = await this.jadwal_card.first().locator('button:has-text("Pilih")')
        await jadwal_button.click();
        return harga_tiket;
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
        let path = new URL(this.page.url()).pathname;
        while (path !== "/book/pilihkursi") {
          await this.carikursi_btn.click();
          await this.page.waitForLoadState('networkidle'); //nunggu navigasi selesai load
          path = new URL(this.page.url()).pathname;
        }
      }
      

    async pilihKursi(jml_penumpang) {
        for(let i = 0; i < jml_penumpang; i++){
            await this.getPenumpangTerdaftar(i+1).click();
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async pilihKursiConnRes(jml_penumpang, n) {
        await this.pilihKursi(jml_penumpang)
    }

    async pilihKursiNextArmada() {
        await this.pilih_next_kursi_btn.click();
        await this.page.waitForTimeout(3000);
    }

    async validasiHargaTiketKursi(harga_tiket, jml_penumpang) { //Validasi harga tiket yang terpampang di kursi
        const harga_type = harga_tiket.includes(" - ") ? "range" : "fixed";
        let harga_min;
        let harga_max;

        if (harga_type === "range") {
            [harga_min, harga_max] = (harga_tiket.split(" - "));
            harga_min = this.normalizeRupiah(harga_min);
            harga_max = this.normalizeRupiah(harga_max);

            for (let i = 0; i < jml_penumpang; i++) {
                const harga_kursi = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                expect(harga_kursi).toBeGreaterThanOrEqual(harga_min);
                expect(harga_kursi).toBeLessThanOrEqual(harga_max);
            }
            
        }
        
        if (harga_type === "fixed") {
            for (let i = 0; i < jml_penumpang; i++) {
                const harga_kursi = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                expect(harga_kursi).toBe(this.normalizeRupiah(harga_tiket));
            }
        }
        
        return true;

    }

    async validasiTotalHargaTiket(harga_tiket, jml_penumpang, expected_total_tiket, current_page, biaya_lainnya) {

        switch(current_page) {
            case("seat-page") :

                if (await this.validasiHargaTiketKursi(harga_tiket, jml_penumpang)) {
                    for (let i = 0; i < jml_penumpang; i++) {
                        const current_harga_tiket = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                        expected_total_tiket += current_harga_tiket;
                    }
                }   

                const actual_total_tiket_seat = this.normalizeRupiah(await this.total_bayar_label_general.innerText());
                const diskon = this.normalizeRupiah(await this.page.locator('span#display_diskon').innerText())

                expected_total_tiket -= diskon;

                expect(actual_total_tiket_seat).toBe(expected_total_tiket);

                return expected_total_tiket;

                break;

            case("payment-page") :
                const actual_total_tiket_payment_1 = this.normalizeRupiah(await this.total_bayar_label_general.innerText());
                const actual_total_tiket_payment_2 = this.normalizeRupiah(await this.total_bayar_label_payment.innerText());

                expect(actual_total_tiket_payment_1).toBe(expected_total_tiket);
                expect(actual_total_tiket_payment_2).toBe(expected_total_tiket);

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
    }

    async pilihMetodePembayaran(metode_bayar, platform_bayar) {
        await this.getPlatformBayar(platform_bayar).click();
    }

    async checklistKetentuan() {
        await this.check_ketentuan_btn.click();
    }

    async konfirmasiPembayaran() {
        await this.konfirmasi_pembayaran_btn.click();
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

    async isiTanggal(value, nextOrPrev, tgl_elm, locale) {
        const date = new Date(value);
        const bulan = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
        const hari = date.getDate();
        const tahun = date.getFullYear();
        const tanggal_target_id = `${bulan} ${hari}, ${tahun}`;
        // console.log(`hari, tanggal, bulan : ${bulan} ${hari}, ${tahun}`);

        const tanggal_target = this.page.locator(`span[aria-label="${tanggal_target_id}"]`);
        await tgl_elm.click();

        if(nextOrPrev === "next") {
            while(!(await tanggal_target.isVisible())){
                await this.next_month_btn.click();
            }
            await tanggal_target.click();
        }

        if(nextOrPrev === "prev") {
            while(!(await tanggal_target.isVisible())){
                await this.prev_month_btn.click();
            }
            await tanggal_target.click();            
        }

    }

    async isiDataRegistrasi(value, byTelpOrEmail) {
        await this.regis_nama_field.fill(value.Nama);
        if(byTelpOrEmail === 'byTelp') {
            await this.regis_email_field.fill(value.Email);
        }
        if(byTelpOrEmail === 'byEmail') {
            await this.regis_phone_field.fill(value.NoTelepon);
        }
        await this.isiTanggal(value.TanggalLahir, "prev", this.regis_tanggal_lahir, "en-US");
        await this.getGenderRegistration(value.JenisKelamin).click();
        await this.regis_alamat_field.fill(value.Alamat)
        await this.page.pause();
        await this.regis_simpan_btn.click();
    }

}