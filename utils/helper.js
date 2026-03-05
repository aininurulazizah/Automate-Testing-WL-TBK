const fs = require('fs');

export function saveToCsv(siteTag, bookingCode) {

    const file = 'output/booking_code.csv';
    const mitra = siteTag.replace('@', '');
    const tanggal = new Date().toLocaleDateString('id-ID');

    let no = 1;

    if (fs.existsSync(file)) {

        const lines = fs.readFileSync(file, 'utf8')
            .trim()
            .split('\n');

        no = lines.length; // karena baris pertama header
    } 
    else {
        fs.writeFileSync(file, 'No,Tanggal Pesan,Mitra,Kode Booking\n');
    }

    const row = `${no},"${tanggal}",${mitra},${bookingCode}\n`;

    fs.appendFileSync(file, row);

}