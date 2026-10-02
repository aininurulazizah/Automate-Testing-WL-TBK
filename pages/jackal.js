import { expect } from "@playwright/test";

export class Jackal{
    constructor(page){

        // General
        this.page = page;
        this.toggle_bahasa = page.locator('button#dropdown-toggle-mobile-5 > div');
        this.list_bahasa = page.locator('button#dropdown-toggle-mobile-5 + div')
        this.keberangkatan = page.locator('#keberangkatan + div');
        
        // Reservation Form
        this.tujuan = page.locator('#tujuan');
        this.tanggal_pergi = page.locator('input[type="text"][readonly]');
        this.pp_checkbox =  page.locator('div.transition-all').first();
        this.tanggal_pulang = page.locator('input.tgl_pulang[readonly]');
        this.next_month_btn = page.locator('.flatpickr-next-month');
        this.next_month_btn2 = page.locator('.flatpickr-next-month').nth(1);
        this.jumlah_penumpang = page.locator('span:has-text("Number of Passengers") + div');
        this.cari_btn = page.locator('button:has-text("Search for Tickets")');
        this.jadwal_card = page.locator('ul.list.list-jadwal > li.list-jadwal-li');
        this.jadwal_card_plg = page.locator('div#pulang ul.list.list-jadwal > li.list-jadwal-li');

        // User Data
        this.nama_pemesan = page.locator('#pemesan');
        this.email_pemesan = page.locator('#email');
        this.nohp_pemesan = page.locator('#nohp');
        this.alamat_pemesan = page.locator('#alamat');
        this.carikursi_btn = page.locator('button:has-text("Next")');

        // Seat Page
        this.kursi_tersedia = page.locator('div.seat-blank');
        this.tab_plg = page.locator('a:has-text("Return")');
        this.kursi_plg_tersedia = page.locator('div.seat-blank[onclick*="books_pp"]');
        this.pembayaran_btn = page.locator('button:has-text("Next")');

        // Payment Confirmation Page
        this.detail_bayar_card = page.locator('table.tbl-harga');
        this.check_ketentuan_btn = page.locator('label[for="ketentuan"]');
        this.check_insurance = page.locator('#check_asuransi');
        this.total_insurance_label = page.locator('#insurance-total');
        this.konfirmasi_pembayaran_btn = page.locator('button#submit:has-text("Confirm Reservation")');
        this.konfirmasi_pembayaran_btn_modal = page.locator('.modal-footer button:has-text("Yes, Continue")');

        // Booked Page
        this.pesanan_dibuat_label = page.locator('h5:has-text("Transaction Successful")');
        this.kode_booking_label = page.locator('p:has-text("Booking Code") + h4');
        this.kode_pembayaran_label = page.locator('p:has-text("Payment Code") + h4');
        this.total_bayar_label_success_page = page.locator('p:has-text("Total Payment") + h2');

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

    normalizeRupiah(value) {
        if (!value) return 0;

        return Number(
            value
                .toString()
                .replace(/[^0-9]/g, "") // hapus semua selain angka
        );
    }

    async closePopup(value) {
        await this.page.waitForTimeout(1000);

        while (await value.isVisible()) {
            await value.click(); 
            await this.page.waitForTimeout(1000);
        }
    }

    async cekBahasa() {
        const id = await this.toggle_bahasa.locator('span:has-text("ID")').count();

        if (id > 0) {   //Jika elemen bahasa "ID" 0
            await this.toggle_bahasa.click();
            await this.list_bahasa.locator('a[data-lang="en"]').click();
        }
    }

    async isiKeberangkatan(value) {
        // await this.cekBahasa();
        await this.page.selectOption('#keberangkatan', { label: value }, { force: true });
    }

    async isiTujuan(value) {
        await this.page.selectOption('#tujuan', { label: value }, { force: true });
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
        await this.pp_checkbox.click();
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
        const selected = await this.page.locator('.ss-single-selected span.placeholder:has-text("Person")').innerText();
        if (selected !== `${value} Person`) {
            await this.jumlah_penumpang.click();
            await this.page.locator(`.ss-option:has-text("${value} Person")`).click();
            await this.keberangkatan.click(); // klik field keberangkatan (elemen terjauh dari tombol cari) untuk menutup dropdown setelah pilih opsi
        }
    }

    async cariTiket() {
        await this.cari_btn.click();
    }

    async pilihJadwal() {
        const harga_tiket = await this.jadwal_card.first().locator('h4.harga.pcapital > p').innerText();
        const jadwal_button = await this.jadwal_card.first().locator('button:has-text("Select")');
        await jadwal_button.click();
        return harga_tiket;
    }

    async pilihJadwalPulang() {
        const harga_tiket = await this.jadwal_card_plg.first().locator('h4.harga.pcapital > p').innerText();
        const jadwal_button = await this.jadwal_card_plg.first().locator('button:has-text("Select")');
        await jadwal_button.click();
        return harga_tiket;
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
        await this.page.waitForTimeout(1000);

        for(let i = 0; i < jml_penumpang; i++){
            await this.kursi_tersedia.nth(i).click();
        }
    }

    async pilihKursiPulang(jml_penumpang) {
        await this.tab_plg.click();
        await this.page.waitForTimeout(1000);
        
        for(let i = 0; i < jml_penumpang; i++){
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

                if (await this.validasiHargaTiketKursi(harga_tiket, jml_penumpang, list_kursi_tersedia)) {
                    for (let i = 0; i < jml_penumpang; i++) {
                        let current_harga_tiket;

                        if (await list_kursi_tersedia.nth(i).locator('p').filter({ hasText : /Sale|Promo/i }).count() > 0) {
                            current_harga_tiket = this.normalizeRupiah(await list_kursi_tersedia.nth(i).locator('span').nth(2).innerText());
                        } else {
                            current_harga_tiket = this.normalizeRupiah(await list_kursi_tersedia.nth(i).locator('span').nth(1).innerText());
                        }

                        expected_total_tiket += current_harga_tiket;
                    }
                }   

                const actual_total_tiket_seat = this.normalizeRupiah(await this.page.locator('h4.display-price-seat-selected').innerText());
                expect(actual_total_tiket_seat).toBe(expected_total_tiket);

                return expected_total_tiket;

                break;

            case("payment-page") :
                const actual_total_tiket_payment = this.normalizeRupiah(await this.detail_bayar_card.locator('td:has-text("Total Bayar") + td').innerText());

                const asuransiChecked = await this.isAsuransiChecked(await this.check_insurance);

                if (asuransiChecked) {
                    expected_total_tiket += this.normalizeRupiah(await this.total_insurance_label.innerText());
                }

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

    async isAsuransiChecked(element) {
        return await element.isChecked();
    }

    async klikBayar() {
        await this.pembayaran_btn.click();
    }

    async pilihMetodePembayaran(metode_bayar, platform_bayar){
        await this.page.waitForTimeout(1000);
        await this.getPlatformBayar(platform_bayar).click();
    }

    async checklistKetentuan() {
        await this.check_ketentuan_btn.click();
    }

    async konfirmasiPembayaran() {
        await this.page.waitForTimeout(500);
        await this.konfirmasi_pembayaran_btn.click();
        await this.page.waitForTimeout(500);
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