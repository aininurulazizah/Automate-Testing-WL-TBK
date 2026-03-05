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
        this.cari_btn = page.locator('.btn-search');
        this.carijadwal_btn_first = page.locator('.btn-list-jadwal').first();
        this.pilihjadwal_btn_first = page.locator('button:has-text("Beli")').first();

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

        // Booked Pgae
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + div > p').innerText();

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
    }

    getNamaPenumpang(i) { // Untuk mendapatkan object data penumpang dari data test
        return this.page.locator(`#penumpang${i}`);
    }

    getPenumpangTerdaftar(i, n) { // Untuk mendapatkan data penumpang setelah isi data untuk memilih kursi
        return this.page.locator(`[data-passenger-index="${i}"]`).nth(n);
    }

    getJumlahPindahArmada() {
        return this.page.locator(`[data-passenger-index="1"]`).count();
    }

    getJumlahKursi() {
        return this.kursi_tersedia.count();
    }

    getMetodeBayar(metode) { // Untuk mendapatkan metode pembayaran sesuai data test
        return this.page.locator(`#container-payment p:has-text("${metode}")`);
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
        await this.cari_btn.click();
    }

    async pilihJadwal(){
        await this.carijadwal_btn_first.click();
        await this.pilihjadwal_btn_first.click();
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
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async pilihKursiConnRes(jml_penumpang, n) {
        for (let i = 0; i < jml_penumpang; i++) {
          await this.getPenumpangTerdaftar(i+1, n).click(); // Dapatkan/klik penumpang terdaftar untuk pilih kursi
          await this.kursi_tersedia.nth(this.total_kursi_perarmada+i).click(); // Pilih kursi 
        }
        const kursiSaatIni = await this.kursi_tersedia.count(); // Hitung banyak kursi saat ini untuk membantu pemilihan kursi di armada selanjutnya
        this.total_kursi_perarmada = kursiSaatIni;
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
