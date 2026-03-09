export class Semeru {

    constructor(page) {

        // General
        this.page = page;
        
        // Reservation Form
        this.keberangkatan = page.locator('#asal + div');
        this.tujuan = page.locator('#tujuan + div');
        this.tanggal_pergi_field = page.locator('input[name="tglberangkat"]');
        this.next_month_btn = page.locator('span.flatpickr-next-month');
        this.jumlah_penumpang = page.locator('select#jmlpenumpang + div');
        this.cari_tiket_btn = page.locator('button:has-text("Cari")');
        this.pilihjadwal_btn = page.locator('button:has-text("Pilih")');

        // User Data
        this.nama_pemesan = page.locator('input#pemesan');
        this.email_pemesan = page.locator('input[name="email"]');
        this.nohp_pemesan = page.locator('input[name="telepon"]');
        this.carikursi_btn = page.locator('button:has-text("Selanjutnya")');

        // Seat Page
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.pembayaran_btn = page.locator('button[onclick="kirimdata()"]:has-text("Selanjutnya")');

        // Payment Confirmation Page
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit[onclick="return check()"]');

        // Booked Pake
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + h4').innerText();

    }

    getNamaPenumpang(i) {
        return this.page.locator(`input#penumpang${i}`);
    }

    getJenisKelaminPenumpang(i, jenisKelamin) {
        return this.page.locator(`input[name="gender${i}"] + span:has-text("${jenisKelamin}")`);
    }

    getPlatformBayar(platform) {
        return this.page.locator(`img[alt=${platform}]`);
    }

    async isiKeberangkatan(value) {
        await this.keberangkatan.click();
        await this.page.locator(`div.ss-option:has-text("${value}")`).nth(0).click();
    }

    async isiTujuan(value) {
        await this.tujuan.click();
        await this.page.locator(`div.ss-option:has-text("${value}")`).nth(1).click();
    }

    async isiTanggalPergi(value) {
        const tanggal_target = this.page.locator(`[aria-label="${value}"]`);
        await this.tanggal_pergi_field.click();
        while(!(await tanggal_target.isVisible())) {
            await this.next_month_btn.click();
        }
        await tanggal_target.click();
    }

    async isiJumlahPenumpang(value) {
        const selected = await this.page.locator('select#jmlpenumpang + div > div > span:has-text("Orang")').innerText();
        if (selected !== `${value} Orang`) {
            await this.jumlah_penumpang.click();
            await this.page.locator(`select#jmlpenumpang + div > div + div > div + div > div:has-text("${value}")`).click();
            await this.page.locator('body').click();
        }
    }

    async cariTiket() {
        await this.cari_tiket_btn.click();
    }

    async pilihJadwal() {
        await this.pilihjadwal_btn.first().click();
    }

    async isiDataPenumpang(jml_penumpang, pemesan, penumpang) {
        const penumpang_dewasa = penumpang.PenumpangDewasa;
        await this.nama_pemesan.fill(pemesan.NamaPemesan);
        await this.email_pemesan.fill(pemesan.Email);
        await this.nohp_pemesan.fill(pemesan.NoHP);
        for(let i = 0; i < jml_penumpang; i++) {
            await this.getNamaPenumpang(i+1).fill(penumpang_dewasa[`Penumpang_${i+1}`].NamaPenumpang);
            await this.getJenisKelaminPenumpang(i+1, penumpang_dewasa[`Penumpang_${i+1}`].JenisKelamin).click();
        }
    }

    async cariKursi() {
        await this.carikursi_btn.click();
    }

    async pilihKursi(jml_penumpang) {
        for(let i = 0; i < jml_penumpang; i++) {
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async klikBayar() {
        await this.pembayaran_btn.click();
    }

    async pilihMetodePembayaran(metode_bayar, platform_bayar){
        await this.getPlatformBayar(platform_bayar).click()

    }

    async checklistKetentuan() {
        await this.check_ketentuan_btn.click();
    }

    async konfirmasiPembayaran() {
        await this.konfirmasi_pembayaran_btn.click();
    }


}