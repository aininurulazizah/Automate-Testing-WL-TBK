import { expect } from '@playwright/test';

export class Aragon {
    constructor(page){

        // General
        this.page = page;
        this.close_popup = page.locator('.close-pop-info')
        
        // Reservation Form
        this.layanan_shuttle = page.locator('text=Shuttle');
        this.layanan_travel = page.locator('text=Travel');
        this.keberangkatan = page.locator('#berangkat');
        this.tujuan = page.locator('#tujuan');
        this.dropdown_tujuan = page.locator('#dropdown-outlet2');
        this.tanggal_pergi = page.locator('#tgl_berangkat');
        this.next_month_btn = page.locator('.flatpickr-calendar.animate.open > .flatpickr-months > .flatpickr-next-month');
        this.cari_btn = page.locator('#btn-send');
        this.pilihjadwal_btn_first = page.locator('a:has-text("Pesan")').first();

        // User Data
        this.kursi_tersedia = page.locator('div.seat-blank[onclick]');
        this.isidata_btn = page.locator('button:has-text("Selanjutnya")');

        // Seat Page
        this.nama_pemesan = page.locator('input#pemesan');
        this.email_pemesan = page.locator('#email');
        this.nohp_pemesan = page.locator('[name="nohp"]');
        this.nama_penumpang = page.locator('#penumpang1');
        this.pembayaran_btn = page.locator('button:has-text("Selanjutnya")');

        // Payment Confirmation Page
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit:has-text("Konfirmasi")');

        // Booked Page
        this.pesanan_dibuat_label = page.locator('p:has-text("Pesanan Dibuat !")')
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + div > p');
        this.kode_pembayaran_label = page.locator('p:has-text("Kode Pembayaran") + div > div > div').first();

        // Login
        this.login_btn = page.locator('a:has-text("Login & Sign Up")');
        this.login_phone_btn = page.locator('button:has-text("Dengan Nomor Telepon")').first();
        this.login_whatsapp_btn = page.locator('button:has-text("Dengan Nomor Whatsapp")');
        this.login_google_btn = page.locator('button:has-text("Dengan Google")').first();
        this.phone_field = page.locator('input[name="telepon"]').first();
        this.submit_btn = page.locator('button:has-text("Kirim")').first();
        this.submit_otp_btn = page.locator('button[onclick*="submit"]');
        this.regis_nama_field = page.locator('input[name="nama"]');
        this.regis_phone_field = page.locator('input[name="telepon"]');
        this.regis_email_field = page.locator('input[name="email"][type="email"]');
        this.regis_alamat_field = page.locator('textarea[name="alamat"]');
        this.regis_simpan_btn = page.locator('button#post-btn-daftar');
    }

    getNamaPenumpang(i) { // Untuk mendapatkan object data penumpang dari data test
        return this.page.locator(`#penumpang${i}`);
    }

    getPlatformBayar(platform) { // Untuk mendapatkan platform pembayaran setelah pilih metode bayar
        return this.page.locator(`img[alt=${platform}]`);
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

    async cariTiket() {
        await this.cari_btn.click();
    }

    async pilihJadwal(){
        let path = new URL(this.page.url()).pathname;
        while (path === "/book/tiket") {
            await this.pilihjadwal_btn_first.click();
            path = new URL(this.page.url()).pathname;
        }
    }

    async pilihKursi(jml_penumpang) {
        for(let i = 0; i < jml_penumpang; i++) {
            let seatClass = await this.kursi_tersedia.nth(i).getAttribute('class');
            const selectedSeatClass = "seat-select";
            while (!seatClass.includes(selectedSeatClass)) {
                await this.kursi_tersedia.nth(i).click();
                seatClass = await this.kursi_tersedia.nth(i).getAttribute('class');
            }
        }
        await this.isidata_btn.click();
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

    async klikBayar() {
        await this.pembayaran_btn.click();
    }

    async pilihMetodePembayaran(metode_bayar, platform_bayar){
        await this.getPlatformBayar(platform_bayar).click();
    }

    async checklistKetentuan() {
        await this.check_ketentuan_btn.click();
    }

    async konfirmasiPembayaran() {
        await this.konfirmasi_pembayaran_btn.click()
    }

    // Login

    async klikButtonLogin() {
        await this.login_btn.click();
    }

    async pilihViaTelepon() {
        await this.login_phone_btn.click();
    }

    async pilihViaGoogle() {
        await this.login_google_btn.click();
    }

    async isiNoTelp(no_telp) {
        await this.phone_field.fill(no_telp);
    }

    async pilihAkun() {
        await this.page.pause();
    }

    async submitNoTelp() {
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
        await this.regis_alamat_field.fill(value.Alamat);
        await this.page.pause();
        // await this.regis_simpan_btn.click();
    }

}