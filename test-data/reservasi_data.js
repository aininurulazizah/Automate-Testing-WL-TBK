const tanggalPergi = getTanggal(1);

const tanggalPulang = getTanggal(2);

function getTanggal(bulan) {
    const today = new Date();
    const day = today.getDate(); //Ambil tanggal di hari ini
    today.setDate(1); //Set tanggal jadi 1 agar tidak overflow
    today.setMonth(today.getMonth() + bulan); //Set bulan ke bulan setelah berapa 'bulan'
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); //Set tanggal terakhir di bulan tujuan
    today.setDate(Math.min(day,lastDay)); //Membandingkan tanggal hari ini (yang akan dipilih) dengan tanggal terakhir di bulan tujuan (misal tgl sekarang 31, tanggal terakhir di bulan target 28, maka yang dipilih 28)
    return today.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}); //Mengembalikan nilai tanggal tujuan
}

export const testData = {

    Daytrans: {
        Keberangkatan: "Bandung",
        Tujuan: "Jakarta",
        TanggalPergi: tanggalPergi,
        JumlahPenumpang: 2,
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
        TanggalPergi: tanggalPergi,
        TanggalPulang: tanggalPulang,
        JumlahPenumpang: {
            Dewasa: 2,
            Bayi: 0
        },
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Aragon: {
        Keberangkatan: "Bandung",
        Tujuan: "Jakarta",
        TanggalPergi: tanggalPergi,
        JumlahPenumpang : 2,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "qrissp"
    },

    Jackal: {
        Keberangkatan: "DIPATIUKUR 89 SEBRANG UNIKOM",
        Tujuan: "LIPPO CIKARANG",
        TanggalPergi: tanggalPergi,
        TanggalPulang: tanggalPulang,
        JumlahPenumpang: 2,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Btm: {
        Keberangkatan: "PASTEUR (KUNAFE PUSAT OLEH-OLEH )",
        Tujuan: "BTM PANDEGLANG",
        TanggalPergi: tanggalPergi,
        JumlahPenumpang: 2,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS",
        ConnectingReservation: {
            Keberangkatan: "BAYAH",
            Tujuan: "SUCI (HOTEL NINDYA BIODISTRICT )"
        }
    },

    Semeru: {
        Keberangkatan: "BEKASI",
        Tujuan: "AGEN CIKOPO",
        TanggalPergi: tanggalPergi,
        JumlahPenumpang: 2,
        MetodeBayar: "Pembayaran Instan",
        PlatformBayar: "QRIS"
    },

    Pemesan: {
        NamaPemesan: "Pemesan",
        Email: "pemesan@harakirimail.com",
        NoHP: "081234567890",
        Alamat: "Bandung"
    },

    Penumpang: {
        PenumpangDewasa: {
            Penumpang_1: {
                NamaPenumpang: "Penumpang Satu",
                JenisKelamin: "Laki-laki"
            },
            Penumpang_2: {
                NamaPenumpang: "Penumpang Dua",
                JenisKelamin: "Perempuan"
            },
            Penumpang_3: {
                NamaPenumpang: "Penumpang Tiga",
                JenisKelamin: "Perempuan"
            },
            Penumpang_4: {
                NamaPenumpang: "Penumpang Empat",
                JenisKelamin: "Laki-laki"
            },
            Penumpang_5: {
                NamaPenumpang: "Penumpang Lima",
                JenisKelamin: "Laki-laki"
            }
        },
        PenumpangBayi: {
            PenumpangBayi_1: {
                NamaPenumpang: "Penumpang Bayi Satu"
            },
            PenumpangBayi_2: {
                NamaPenumpang: "Penumpang Bayi Dua"
            },
            PenumpangBayi_3: {
                NamaPenumpang: "Penumpang Bayi Tiga"
            }
        }
    }

};