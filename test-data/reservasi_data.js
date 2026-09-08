
function getTanggalBasedBulan(bulan) {
    const today = new Date();
    const day = today.getDate(); //Ambil tanggal di hari ini
    today.setDate(1); //Set tanggal jadi 1 agar tidak overflow
    today.setMonth(today.getMonth() + bulan); //Set bulan ke bulan setelah berapa 'bulan'
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); //Set tanggal terakhir di bulan tujuan
    today.setDate(Math.min(day, lastDay)); //Membandingkan tanggal hari ini (yang akan dipilih) dengan tanggal terakhir di bulan tujuan (misal tgl sekarang 31, tanggal terakhir di bulan target 28, maka yang dipilih 28)
    return today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); //Mengembalikan nilai tanggal tujuan
}

function getTanggalCustom({
    selang_bulan = 1,
    kurang_hari = 0,
    customMonthToIndo = false
}) {
    const d = new Date(getTanggalBasedBulan(selang_bulan));

    d.setDate(d.getDate() - kurang_hari);

    if (customMonthToIndo) {
        const namaBulan = d.toLocaleDateString('id-ID', { month: 'long' });
        return `${namaBulan} ${d.getDate()}, ${d.getFullYear()}`;

    } else {
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}

function getLastDay({
    customMonthToIndo = false
}) {
    const today = new Date();
    const d = new Date(today);

    // Hari terakhir bulan ini
    d.setMonth(d.getMonth() + 1, 0);

    // Kalau hari ini adalah hari terakhir bulan ini,
    // ambil hari terakhir bulan berikutnya
    if (
        today.getDate() === d.getDate() &&
        today.getMonth() === d.getMonth() &&
        today.getFullYear() === d.getFullYear()
    ) {
        d.setDate(1);                // 1 bulan berikutnya
        d.setMonth(d.getMonth() + 2, 0); // hari terakhir bulan berikutnya
    }

    if (customMonthToIndo) {
        const namaBulan = d.toLocaleDateString('id-ID', { month: 'long' });
        return `${namaBulan} ${d.getDate()}, ${d.getFullYear()}`;
    }

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function generateRandomPhoneNumber() {
    const unique = Date.now().toString().slice(-10);
    const phone_num = `08${unique}`;
    return phone_num;
}

function generateRandomEmail() {
    const unique = Date.now().toString().slice(-10);
    const email = `qc${unique}@example.com`;
    return email;
}

export function createPemesan() {
    return {
        NamaPemesan: "Quality Control Tiketux",
        Email: generateRandomEmail(),
        NoHP: generateRandomPhoneNumber(),
        Alamat: "Bandung",
        JenisAntarJemput: "Jemput - Antar",
        AlamatJemput: "Jl. Jemput",
        AlamatAntar: "Jl. Antar"
    };
}

const DEFAULT_PASSENGER = process.env.CI ? 1 : 1;  // Ubah "1" yang kedua jika mau mengubah jumlah penumpang, namun ini hanya berlaku di lokal 

export const testData = {

    Daytrans: {
        Keberangkatan: "Baros",
        Tujuan: "Rest area km 62",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS",
        ConnectingReservation: {
            Keberangkatan: "Alfamart Prambanan",
            Tujuan: "Dipatiukur"
        },
        BiayaLainnya: {
            Potongan: [
                'potongan'
            ],
            Tambahan: [
                'biaya_admin',
                'biaya_asuransi',
                'biaya_cancellation',
                'biaya_missconnecting'
            ]
        }
    },

    Baraya: {
        Keberangkatan: "Buah Batu",
        Tujuan: "Cibubur",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 2,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: {
            Dewasa: DEFAULT_PASSENGER,
            Bayi: 0
        },
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Aragon: {
        Keberangkatan: "Bandung",
        Tujuan: "Jakarta",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "qrissp"
    },

    Jackal: {
        Keberangkatan: "DIPATIUKUR 89 SEBRANG UNIKOM",
        Tujuan: "LIPPO CIKARANG",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 2,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Btm: {
        Keberangkatan: "PASTEUR (KUNAFE PUSAT OLEH-OLEH )",
        Tujuan: "BTM PANDEGLANG",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS",
        ConnectingReservation: {
            Keberangkatan: "JATINANGOR (APARTMENT SKYLAND)",
            Tujuan: "BAYAH"
        }
    },

    Semeru: {
        Keberangkatan: "KALIDERES PERTAMINA",
        Tujuan: "BEKASI",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Joglosemar: {
        Keberangkatan: "Banjarnegara alfamart prigi (virtual point)",
        Tujuan: "Klampok nex kopi (virtual point)",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 2,
            kurang_hari: 7,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS",
        BiayaLainnya: {
            Potongan: [
                'diskon_promo_pas_banget'
            ]
        }
    },

    Kruzz: {
        Keberangkatan: "KRUZZ BANDUNG CIKAPAYANG",
        Tujuan: "KRUZZ SOREANG",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        ConnectingReservation: {
            Keberangkatan: 'KRUZZ PANCORAN',
            Tujuan: 'KRUZZ JATINANGOR'
        },
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Gracias: {
        Keberangkatan: "BALTOS",
        Tujuan: "BEKASI MEGA BEKASI HYPERMALL",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Kpm: {
        Keberangkatan: "BALTOS",
        Tujuan: "PERINTIS",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Wbtrans: {
        Keberangkatan: "BUAH BATU",
        Tujuan: "SUBANG",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Sadya: {
        Keberangkatan: "Bandung",
        Tujuan: "Bandar lampung",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Mstrans: {
        Keberangkatan: "BUAH BATU",
        Tujuan: "BANJARAN",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Raputri: {
        Keberangkatan: "BUAH BATU",
        Tujuan: "CIGANEA",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Mrtrans: {
        Keberangkatan: "Pasteur",
        Tujuan: "KEBON JERUK",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Sunjaya: {
        Keberangkatan: "BALIKPAPAN",
        Tujuan: "SANGATTA",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "OVO"
    },

    Binasarana: {
        Keberangkatan: "BINA SARANA PASTEUR KUNAFE",
        Tujuan: "BINASARANA X BURGERKING SAWANGAN",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Transkita: {
        Keberangkatan: "PASTEUR  KUNAFE SUPERMARKET OLEHOLEH",
        Tujuan: "BALARAJA BARAT",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Cgtrans: {
        Keberangkatan: "CILACAP",
        Tujuan: "SEMARANG",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Ztrans: {
        Keberangkatan: "Tamansari",
        Tujuan: "Alfamart perumnas",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Putraremaja: {
        Keberangkatan: "Agen pr hotel candra kirana jogja",
        Tujuan: "Agen pr lea collection demak",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Banyumili: {
        Keberangkatan: "BALIKPAPAN BANDARA",
        Tujuan: "BONTANG SIMPANG 3 BONTANG",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 2,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Ctu: {
        Keberangkatan: "BAROS/ ALFAMART RAYA",
        Tujuan: "GARUT INDOMARET ALADIN",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Krakaline: {
        Keberangkatan: "BAROS",
        Tujuan: "AREA FATMAWATI",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Pelitamas: {
        Keberangkatan: "TANGKEL SURAMADU BANGKALAN",
        Tujuan: "TERMINAL BUNGURASIH",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Aoshuttle: {
        Keberangkatan: "AEON MALL DELTAMAS",
        Tujuan: "HALTE CITY TOUR MONAS",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 2,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Adibuzz: {
        Keberangkatan: "BEKASI TIMUR",
        Tujuan: "EXIT TOL BOYOLALI",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Marita: {
        Keberangkatan: "PINTU TOL BAROS CIMAHI",
        Tujuan: "INDOMARET MUWARDI 50 CIANJUR",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 2,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Trikusuma: {
        Keberangkatan: "BANJARNEGARA",
        Tujuan: "PURWOKERTO",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS",
        BiayaLainnya: {
            Tambahan: [
                {
                    biaya_antar: 0,
                    biaya_jemput: 0
                }
            ]
        }
    },

    Wisatakomodo: {
        Keberangkatan: "KANTOR UBUNG",
        Tujuan: "T TIRTONADI",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Sariharum: {
        Keberangkatan: "SARI HARUM BANDUNG",
        Tujuan: "BAKAUHENI",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Ats: {
        Keberangkatan: "PONTIANAK",
        Tujuan: "SEKADAU",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 28,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 24,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Ans: {
        Keberangkatan: "LUBUK BASUNG",
        Tujuan: "KOPO",
        TanggalPergi: getLastDay({
            customMonthToIndo: true
        }),
        TanggalPulang: getLastDay({
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "Shopeepay"
    },

    Riyan: {
        Keberangkatan: "TERMINAL KLATEN",
        Tujuan: "BUNTU",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Minanga: {
        Keberangkatan: "POOL BANDAR LAMPUNG",
        Tujuan: "Bulak Kapal",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Harumbsi: {
        Keberangkatan: "KOTA BARU ITERA",
        Tujuan: "BORMA RANCAEKEK",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 14,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Yantigroup: {
        Keberangkatan: "BUNDARAN DUMAI",
        Tujuan: "HALTE PASAR DUPA",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Selamat: {
        Keberangkatan: "BANDUNG - PASTEUR",
        Tujuan: "CIKAMPEK",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Namaste: {
        Keberangkatan: "SATLANTAS POLRES MENGWI",
        Tujuan: "ALFAMART DENCARIK",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Royalkencana: {
        Keberangkatan: "BEKASI TIMUR",
        Tujuan: "GT BOYOLALI",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Sabila: {
        Keberangkatan: "4U RESTO N CAFE UNGARAN",
        Tujuan: "TAPE KETAN MUNTILAN 187",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 0,
            customMonthToIndo: false
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Kupuayu: {
        Keberangkatan: "BANJARNEGARA (TERMINAL KIOS NO. 24 A)",
        Tujuan: "BARANANGSIANG (TERMINAL LOKET DI LANTAI 2)",
        TanggalPergi: getLastDay({
            customMonthToIndo: true
        }),
        TanggalPulang: getLastDay({
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Besttrans: {
        Keberangkatan: "DIPATIUKUR",
        Tujuan: "FATMAWATI",
        TanggalPergi: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 7,
            customMonthToIndo: true
        }),
        TanggalPulang: getTanggalCustom({
            selang_bulan: 1,
            kurang_hari: 1,
            customMonthToIndo: true
        }),
        JumlahPenumpang: DEFAULT_PASSENGER,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Penumpang: {
        PenumpangDewasa: {
            Penumpang_1: {
                NamaPenumpang: "Quality Control Satu",
                JenisKelamin: "Laki-laki"
            },
            Penumpang_2: {
                NamaPenumpang: "Quality Control Dua",
                JenisKelamin: "Perempuan"
            },
            Penumpang_3: {
                NamaPenumpang: "Quality Control Tiga",
                JenisKelamin: "Perempuan"
            },
            Penumpang_4: {
                NamaPenumpang: "Quality Control Empat",
                JenisKelamin: "Laki-laki"
            },
            Penumpang_5: {
                NamaPenumpang: "Quality Control Lima",
                JenisKelamin: "Laki-laki"
            }
        },
        PenumpangBayi: {
            PenumpangBayi_1: {
                NamaPenumpang: "Quality Control Bayi Satu"
            },
            PenumpangBayi_2: {
                NamaPenumpang: "Quality Control Bayi Dua"
            },
            PenumpangBayi_3: {
                NamaPenumpang: "Quality Control Bayi Tiga"
            }
        }
    }

};