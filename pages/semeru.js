import { expect } from "@playwright/test";

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
        this.jadwal_card = page.locator('div#users ul > li');

        // User Data
        this.nama_pemesan = page.locator('input#pemesan');
        this.email_pemesan = page.locator('input[name="email"]');
        this.nohp_pemesan = page.locator('input[name="telepon"]');
        this.carikursi_btn = page.locator('button:has-text("Selanjutnya")');

        // Seat Page
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.total_bayar_label_general = page.locator('span#hargatot');
        this.pembayaran_btn = page.locator('button[onclick="kirimdata()"]:has-text("Selanjutnya")');

        // Payment Confirmation Page
        this.detail_bayar_card = page.locator('div#container-price');
        this.check_ketentuan_btn = page.locator('label[for="tandaicheck"]');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit[onclick="return check()"]');

        // Booked Pake
        this.pesanan_dibuat_label = page.locator('p:has-text("Transaksi Sukses !")');
        this.kode_booking_label = page.locator('p:has-text("Kode Booking") + h4');
        this.kode_pembayaran_label = page.locator('p:has-text("Kode Pembayaran") + h4');
        this.total_bayar_label_success_page = page.locator('p:has-text("Total Bayar") + h4');

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

    normalizeRupiah(value) {
        if (!value) return 0;

        return Number(
            value
                .toString()
                .replace(/[^0-9]/g, "") // hapus semua selain angka
        );
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
        const harga_tiket =  await this.jadwal_card.first().locator('p.harga').innerText();
        const jadwal_button = await this.jadwal_card.first().locator('button:has-text("Pilih")');
        await jadwal_button.click();
        return harga_tiket
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

    async validasiHargaTiketKursi(harga_tiket, jml_penumpang) { //Validasi harga tiket yang terpampang di kursi
        const harga_type = harga_tiket.includes(" - ") ? "range" : "fixed";
        let harga_min;
        let harga_max;

        if (harga_type === "range") {
            [harga_min, harga_max] = (harga_tiket.split(" - "));
            harga_min = this.normalizeRupiah(harga_min);
            harga_max = this.normalizeRupiah(harga_max);

            for (let i = 0; i < jml_penumpang; i++) {
                const harga_kursi = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').innerText());
                expect(harga_kursi).toBeGreaterThanOrEqual(harga_min);
                expect(harga_kursi).toBeLessThanOrEqual(harga_max);
            }
            
        }
        
        if (harga_type === "fixed") {
            for (let i = 0; i < jml_penumpang; i++) {
                const harga_kursi = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').innerText());
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
                        const current_harga_tiket = this.normalizeRupiah(await this.kursi_tersedia.nth(i).locator('span').innerText());
                        expected_total_tiket += current_harga_tiket;
                    }
                }   

                const actual_total_tiket_seat_1 = this.normalizeRupiah(await this.page.locator('span.display-price-seat-selected').innerText());
                const actual_total_tiket_seat_2 = this.normalizeRupiah(await this.total_bayar_label_general.innerText());
                expect(actual_total_tiket_seat_1).toBe(expected_total_tiket);
                expect(actual_total_tiket_seat_2).toBe(expected_total_tiket);

                return expected_total_tiket;

                break;

            case("payment-page") :
                const actual_total_tiket_payment_1 = this.normalizeRupiah(await this.detail_bayar_card.locator('p#totalbayar').innerText());
                const actual_total_tiket_payment_2 = this.normalizeRupiah(await this.total_bayar_label_general.innerText());

                const diskon = this.normalizeRupiah(await this.detail_bayar_card.locator('p.totalDiskon').innerText());
                const biaya_layanan = this.normalizeRupiah(await this.detail_bayar_card.locator('p#biayalayanan').innerText());

                expected_total_tiket -= diskon;
                expected_total_tiket += biaya_layanan;

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