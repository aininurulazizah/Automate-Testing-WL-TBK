export class Jackal{
    constructor(page){

        // General
        this.page = page;
        this.keberangkatan = page.locator('#keberangkatan');
        
        // Reservation Form
        this.tujuan = page.locator('#tujuan');
        this.tanggal_pergi = page.locator('input[type="text"][readonly]');
        this.pp_checkbox =  page.locator('div.transition-all').first();
        this.tanggal_pulang = page.locator('input.tgl_pulang[readonly]');
        this.next_month_btn = page.locator('.flatpickr-next-month');
        this.next_month_btn2 = page.locator('.flatpickr-next-month').nth(1);
        this.jumlah_penumpang = page.locator('.ss-main .ss-single-selected span:has-text("Orang")');
        this.cari_btn = page.locator('button:has-text("Cari Tiket")');
        this.pilihjadwal_btn_first = page.locator('button:has-text("Pilih")').first();
        this.pilihjadwal_btn_plg_first = page.locator('button[onclick^="sendJadwalpp"]').first();

        // User Data
        this.nama_pemesan = page.locator('#pemesan');
        this.email_pemesan = page.locator('#email');
        this.nohp_pemesan = page.locator('#nohp');
        this.alamat_pemesan = page.locator('#alamat');
        this.carikursi_btn = page.locator('button:has-text("Selanjutnya")');

        // Seat Page
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.tab_plg = page.locator('a:has-text("Pulang")');
        this.kursi_plg_tersedia = page.locator('div.seat-blank[onclick*="books_pp"]');
        this.pembayaran_btn = page.locator('button:has-text("Selanjutnya")');

        // Payment Confirmation Page
        this.check_ketentuan_btn = page.locator('label[for="ketentuan"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit:has-text("Konfirmasi Reservasi")');
        this.konfirmasi_pembayaran_btn_modal = page.locator('.modal-footer button:has-text("Ya, Lanjutkan")');

        // Booked Page
        this.pesanan_dibuat_label = page.locator('h5:has-text("Transaksi Berhasil !")');
        this.kode_booking_label = page.locator('p:has-text("kode booking") + h4');
        this.kode_pembayaran_label = page.locator('p:has-text("kode bayar") + h4');

        // Login
        this.login_btn = page.locator('a:has-text("Login")').first();
        this.login_phone_btn = page.locator('button:has-text("Dengan Nomor Telepon")').first();
        this.login_whatsapp_btn = page.locator('button:has-text("Dengan Whatsapp")');
        this.login_email_btn = page.locator('button:has-text("Dengan Email")');
        this.login_google_btn = page.locator('button:has-text("Dengan Google")');
        this.phone_field = page.locator('input#no_telepon');
        this.email_field = page.locator('input#email');
        this.submit_tlp_btn = page.locator('button[onclick*="submittlp"]');
        this.submit_email_btn = page.locator('button[onclick*=submitemail]');
        this.submit_otp_btn = page.locator('button[onclick*="submit"]');
        this.regis_instruction = page.locator('h4', { hasText: 'Daftar Akun' });
        this.regis_nama_field = page.locator('input#nama');
        this.regis_phone_field = page.locator('input#telp');
        this.regis_email_field = page.locator('input#email');
        this.regis_simpan_btn = page.locator('button:has-text("Daftar")');
    }

    getNamaPenumpang(i) {
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
        await this.page.selectOption('#keberangkatan', { label: value }, { force: true });
    }

    async isiTujuan(value) {
        await this.page.selectOption('#tujuan', { label: value }, { force: true });
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
        await this.pilihjadwal_btn_first.click();
    }

    async pilihJadwalPulang() {
        await this.pilihjadwal_btn_plg_first.click();
    }
    
    async isiDataPenumpang(jml_penumpang, pemesan, penumpang) {
        const penumpang_dewasa = penumpang.PenumpangDewasa;
        await this.nama_pemesan.fill(pemesan.NamaPemesan);
        await this.email_pemesan.fill(pemesan.Email);
        await this.nohp_pemesan.fill(pemesan.NoHP);
        await this.alamat_pemesan.fill(pemesan.Alamat);
        for(let i = 0; i < jml_penumpang; i++){
            await this.getNamaPenumpang(i+1).fill(penumpang_dewasa[`Penumpang_${i+1}`].NamaPenumpang); 
        }
    }

    async cariKursi() {
        await this.carikursi_btn.click();
    }

    async pilihKursi(jml_penumpang) {
        for(let i = 0; i < jml_penumpang; i++){
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async pilihKursiPulang(jml_penumpang) {
        await this.tab_plg.click();
        for(let i = 0; i < jml_penumpang; i++){
            await this.kursi_plg_tersedia.nth(i).click();
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

    async isiDataRegistrasi(value, byTelpOrEmail) {
        await this.regis_nama_field.fill(value.Nama);
        if(byTelpOrEmail === 'byTelp') {
            await this.regis_email_field.fill(value.Email);
        }
        if(byTelpOrEmail === 'byEmail') {
            await this.regis_phone_field.fill(value.NoTelepon);
        }
        await this.page.pause();
        // await this.regis_simpan_btn.click();
    }

}