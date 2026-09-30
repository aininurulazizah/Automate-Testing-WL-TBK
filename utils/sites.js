import { Daytrans } from "../pages/daytrans";
import { Baraya } from "../pages/baraya";
import { Aragon } from "../pages/aragon";
import { Jackal } from "../pages/jackal";
import { Btm } from "../pages/btm";
import { Semeru } from "../pages/semeru"
import { Joglosemar } from "../pages/joglosemar";
import { Kruzz } from "../pages/kruzz";
import { Gracias } from "../pages/gracias";
import { Kpm } from "../pages/kpm";
import { Wbtrans } from "../pages/wbtrans";
import { Sadya } from "../pages/sadya";
import { Mstrans } from "../pages/mstrans";
import { Raputri } from "../pages/raputri";
import { Mrtrans } from "../pages/mrtrans";
import { Sunjaya } from "../pages/sunjaya";
import { Binasarana } from "../pages/binasarana";
import { Transkita } from "../pages/transkita";
import { Cgtrans } from "../pages/cgtrans";
import { Ztrans } from "../pages/ztrans";
import { Putraremaja } from "../pages/putraremaja";
import { Banyumili } from "../pages/banyumili";
import { Ctu } from "../pages/ctu";
import { Krakaline } from "../pages/krakaline";
import { Pelitamas } from "../pages/pelitamas";
import { Aoshuttle } from "../pages/aoshuttle";
import { Adibuzz } from "../pages/adibuzz";
import { Marita } from "../pages/marita";
import { Trikusuma } from "../pages/trikusuma";
import { Wisatakomodo } from "../pages/wisatakomodo";
import { Sariharum } from "../pages/sariharum";
import { Ats } from "../pages/ats";
import { Ans } from "../pages/ans";
import { Riyan } from "../pages/riyan";
import { Minanga } from "../pages/minanga";
import { Harumbsi } from "../pages/harumbsi";
import { Yantigroup } from "../pages/yantigroup";
import { Selamat } from "../pages/selamat";
import { Namaste } from "../pages/namaste";
import { Royalkencana } from "../pages/royalkencana";
import { Sabila } from "../pages/sabila";
import { Kupuayu } from "../pages/kupuayu";
import { Besttrans } from "../pages/besttrans";

import { testData } from "../test-data/reservasi_data";

export const sites = [
    {
        tag: '@adibuzz',  
        enabled: true,
        urls: {
            production: 'https://www.adi-buzz.com/',
            staging: 'https://dev.web.adibuzz.asmat.app/'
        },
        locator: Adibuzz, 
        data: testData.Adibuzz, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@ans',  
        enabled: true,
        urls: {
            production: 'https://www.bus-ans.com/',
            staging: 'https://dev.web.ans.asmat.app/'
        },
        locator: Ans, 
        data: testData.Ans, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@aoshuttle',  
        enabled: true,
        urls: {
            production: 'https://web.aotransportbus.com/',
            staging: 'https://dev.web.aoshuttle.asmat.app/'
        },
        locator: Aoshuttle, 
        data: testData.Aoshuttle, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@aragon',  
        enabled: true,
        urls: {
            production: 'https://www.aragontrans.com/',
            staging: 'https://dev.web.aragon.asmat.app/'
        },
        locator: Aragon, 
        data: testData.Aragon, 
        roundTrip: false, 
        connectingRes: false
    },
    {
        tag: '@ats',  
        enabled: true,
        urls: {
            production: 'https://www.bus-ats.id/',
            staging: 'https://dev.web.ats.asmat.app/'
        },
        locator: Ats, 
        data: testData.Ats, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@banyumili',  
        enabled: true,
        urls: {
            production: 'https://www.banyumilitravel.id/',
            staging: 'https://dev.web.banyumili.asmat.app/'
        },
        locator: Banyumili, 
        data: testData.Banyumili, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@baraya',  
        enabled: true,
        urls: {
            production: 'https://www.baraya-travel.com/',
            staging: 'https://dev.web.baraya.asmat.app/'
        },
        locator: Baraya, 
        data: testData.Baraya, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@besttrans',  
        enabled: true,
        urls: {
            production: 'https://www.besttrans.co.id/',
            staging: 'https://dev.web.besttrans.asmat.app/'
        },
        locator: Besttrans, 
        data: testData.Besttrans, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@binasarana',
        enabled: true, 
        urls: {
            production: 'https://www.booking.binasarana.co.id/',
            staging: 'https://dev.web.binasarana.asmat.app/'
        },
        locator: Binasarana, 
        data: testData.Binasarana, 
        roundTrip: false, 
        connectingRes: false
    },
    {  
        tag: '@btm',  
        enabled: true,
        urls: {
            production: 'https://www.btmshuttle.id/',
            staging: 'https://dev.web.btm.asmat.app/'
        },
        locator: Btm, 
        data: testData.Btm, 
        roundTrip: false, 
        connectingRes: true
    },
    {
        tag: '@cgtrans', 
        enabled: true,
        urls: {
            production: 'https://www.cgtrans.co.id/',
            staging: 'https://dev.web.cgtrans.asmat.app/'
        },
        locator: Cgtrans, 
        data: testData.Cgtrans, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@ctu',  
        enabled: true,
        urls: {
            production: 'https://www.ctu-shuttle.com/',
            staging: 'https://dev.web.ctu.asmat.app/'
        },
        locator: Ctu, 
        data: testData.Ctu, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@daytrans', 
        enabled: true,
        urls: {
            production: 'https://www.daytrans.co.id/',
            staging: 'https://dev.web.daytrans.asmat.app/'
        },
        locator: Daytrans, 
        data: testData.Daytrans, 
        roundTrip: false, 
        connectingRes: true
    },
    {
        tag: '@gracias', 
        enabled: true,
        urls: {
            production: 'https://www.graciasshuttle.co.id/',
            staging: 'https://dev.web.gracias.asmat.app/'
        },
        locator: Gracias, 
        data: testData.Gracias, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@harumbsi', 
        enabled: true, 
        urls: {
            production: 'https://www.harumbsi.com/',
            staging: 'https://dev.web.harumbsi.asmat.app/'
        },
        locator: Harumbsi, 
        data: testData.Harumbsi, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@jackal',  
        enabled: true,
        urls: {
            production: 'https://www.jackalholidays.com/',
            staging: 'https://dev.web.jackal.asmat.app/'
        },
        locator: Jackal, 
        data: testData.Jackal, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@joglosemar', 
        enabled: true,
        urls: {
            production: 'https://www.joglosemarbus.com/',
            staging: 'https://dev.web.joglosemar.asmat.app/'
        },
        locator: Joglosemar, 
        data: testData.Joglosemar, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@kpm', 
        enabled: true,
        urls: {
            production: 'https://www.kpmtrans.id/',
            staging: 'https://dev.web.kpmtrans.asmat.app/'
        },
        locator: Kpm, 
        data: testData.Kpm, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@krakaline',  
        enabled: true,
        urls: {
            production: 'https://www.krakaline.com/',
            staging: 'https://dev.web.krakaline.asmat.app/'
        },
        locator: Krakaline, 
        data: testData.Krakaline, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@kruzz',  
        enabled: true,
        urls: {
            production: 'https://www.kruzz.id/',
            staging: 'https://dev.web.kruzz.asmat.app/'
        },
        locator: Kruzz, 
        data: testData.Kruzz, 
        roundTrip: true, 
        connectingRes: true
    },
    {
        tag: '@kupuayu',
        enabled: true,  
        urls: {
            production: 'https://www.kupuayutrans.com/',
            staging: 'https://dev.web.kka.asmat.app/'
        },
        locator: Kupuayu, 
        data: testData.Kupuayu, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@marita',  
        enabled: false,
        urls: {
            production: 'https://www.maritatrans.com/',
            staging: 'https://dev.web.marita.asmat.app/'
        },
        locator: Marita, 
        data: testData.Marita, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@minanga',  
        enabled: true,
        urls: {
            production: 'https://www.minangaexpress.id/',
            staging: 'https://dev.web.minanga.asmat.app/'
        },
        locator: Minanga, 
        data: testData.Minanga, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@mrtrans', 
        enabled: true,
        urls: {
            production: 'https://www.mrtrans.co.id/',
            staging: 'https://dev.web.mrtrans.asmat.app/'
        },
        locator: Mrtrans, 
        data: testData.Mrtrans, 
        roundTrip: false, 
        connectingRes: false
    },
    {
        tag: '@mstrans',  
        enabled: true,
        urls: {
            production: 'https://www.mstrans.id/',
            staging: 'https://dev.web.mstrans.asmat.app/'
        },
        locator: Mstrans, 
        data: testData.Mstrans, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@namaste',  
        enabled: true,
        urls: {
            production: 'https://www.namasteshuttle.com/',
            staging: 'https://dev.web.namaste.asmat.app/'
        },
        locator: Namaste, 
        data: testData.Namaste, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@pelitamas',  
        enabled: true,
        urls: {
            production: 'https://www.pelitamas.id/',
            staging: 'https://dev.web.pelitamas.asmat.app/'
        },
        locator: Pelitamas, 
        data: testData.Pelitamas, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@putraremaja',
        enabled: true, 
        urls: {
            production: 'https://shuttle.putraremaja.co.id/',
            staging: 'https://dev.web.putraremaja.asmat.app/'
        },
        locator: Putraremaja, 
        data: testData.Putraremaja, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@raputri', 
        enabled: true,
        urls: {
            production: 'https://www.raputri.com/',
            staging: 'https://dev.web.raputri.asmat.app/'
        },
        locator: Raputri, 
        data: testData.Raputri, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@riyan',  
        enabled: true,
        urls: {
            production: 'https://www.riyantransport.com/',
            staging: 'https://dev.web.riyantrans.asmat.app/'
        },
        locator: Riyan, 
        data: testData.Riyan, 
        roundTrip: true, 
        connectingRes: false //Round-trip true tapi belum ditemukan rute-nya
    }, 
    {
        tag: '@royalkencana',
        enabled: true,  
        urls: {
            production: 'https://www.royalkencanabus.id/',
            staging: 'https://dev.web.royalkencana.asmat.app/'
        },
        locator: Royalkencana, 
        data: testData.Royalkencana, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@sabila',  
        enabled: true,
        urls: {
            production: 'https://booking.sabilashuttle.co.id/',
            staging: 'https://dev.web.sabila.asmat.app/'
        },
        locator: Sabila, 
        data: testData.Sabila, 
        roundTrip: false, 
        connectingRes: false // Round trip true tapi belum ditemukan rute tersedia
    }, 
    {
        tag: '@sadya', 
        enabled: true,
        urls: {
            production: 'https://booking.sadyatrans.com/',
            staging: 'https://dev.web.sadyatrans.asmat.app/'
        },
        locator: Sadya, 
        data: testData.Sadya, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@sariharum', 
        enabled: true,
        urls: {
            production: 'https://www.sariharum.com/',
            staging: 'https://dev.web.sariharum.asmat.app/'
        },
        locator: Sariharum, 
        data: testData.Sariharum, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@selamat',  
        enabled: true,
        urls: {
            production: 'https://www.selamattrans.co.id/reservasi',
            staging: 'https://dev.web.selamat.asmat.app/'
        },
        locator: Selamat, 
        data: testData.Selamat, 
        roundTrip: false, 
        connectingRes: false
    },
    {
        tag: '@semeru',  
        enabled: true,
        urls: {
            production: 'https://www.semerutrans.com/',
            staging: 'https://dev.web.semeru.asmat.app/'
        },
        locator: Semeru, 
        data: testData.Semeru, 
        roundTrip: false, 
        connectingRes: false
    },
    {
        tag: '@sunjaya',  
        enabled: true,
        urls: {
            production: 'https://www.sunjayaabadi.com/',
            staging: 'https://dev.web.sunjaya.asmat.app/'
        },
        locator: Sunjaya, 
        data: testData.Sunjaya, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@transkita', 
        enabled: true,
        urls: {
            production: 'https://www.transkitashuttle.co.id/',
            staging: 'https://dev.web.transkita.asmat.app/'
        },
        locator: Transkita, 
        data: testData.Transkita, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@trikusuma', 
        enabled: true, 
        urls: {
            production: 'https://www.trikusuma.com/',
            staging: 'https://dev.web.trikusuma.asmat.app/'
        },
        locator: Trikusuma, 
        data: testData.Trikusuma, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@wbtrans',  
        enabled: true,
        urls: {
            production: 'https://www.wbtrans.id/',
            staging: 'https://dev.web.wbtrans.asmat.app/'
        },
        locator: Wbtrans, 
        data: testData.Wbtrans, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@wisatakomodo', 
        enabled: true, 
        urls: {
            production: 'https://www.buswisatakomodo.com/',
            staging: 'https://dev.web.wiskom.asmat.app/'
        },
        locator: Wisatakomodo, 
        data: testData.Wisatakomodo, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@yantigroup',
        enabled: true,  
        urls: {
            production: 'https://www.yantigroup.com/',
            staging: 'https://dev.web.yantigroup.asmat.app/'
        },
        locator: Yantigroup, 
        data: testData.Yantigroup, 
        roundTrip: true, 
        connectingRes: false
    },
    {
        tag: '@ztrans', 
        enabled: true,
        urls: {
            production: 'https://www.ztrans.id/',
            staging: 'https://dev.web.ztrans.asmat.app/'
        },
        locator: Ztrans, 
        data: testData.Ztrans, 
        roundTrip: true, 
        connectingRes: false
    }
]