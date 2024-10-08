const $ = id => document.getElementById(id);
const fd = (e,f) => document.getElementById(e).innerHTML = f;
const cg = (e,f) => document.getElementById(e).classList.toggle(f);
const cr = (e,f) => document.getElementById(e).classList.remove(f);
const ca = (e,f) => document.getElementById(e).classList.add(f);
const pages = document.querySelectorAll('section');
const spdBox = ['excelSPDBox', 'hasilSPDBox'];
const rpdBox = ['excelRPDBox', 'hasilRPDBox'];
const sp2Box = ['excelSP2Box', 'hasilSP2Box'];
const gupBox = ['excelGUPBox', 'hasilGUPBox'];
const nonLS = ['UP', 'GUP', 'GUP KKP', 'TUP', 'GTUP NIHIL', 'GUP VALAS', 'GUP NIHIL', 'PENGESAHAN BLU', 'GUP VALAS NIHIL', 'PENGESAHAN HIBAH'];

const jb51 = ['SPM GAJI 13', 'GAJI INDUK', 'GAJI LAINNYA', 'GAJI SUSULAN', 'KEKURANGAN GAJI',
'TUNJANGAN KINERJA BULANAN', 'TUNJANGAN KINERJA SUSULAN', 'KEKURANGAN TUNJANGAN KINERJA', 'SPM THR GAJI', 'SPM THR GAJI PNS/TNI/POLRI', 'SPM THR TUNKIN', 'SPM THR PEJABAT NEGARA', 
'SPM GAJI 13 PNS/TNI/POLRI', 'SPM GAJI 13 PEJABAT NEGARA', 'SPM GAJI 13 TUNKIN', 'SPM THR Gaji PNS/TNI/Polri', 'GAJI PPPK INDUK', 'GAJI SUSULAN PPPK', 'GAJI LAINNYA PPPK', 'KEKURANGAN GAJI PPPK', 'SPM THR PPPK', 'SPM GAJI 13 PPPK'];
const jb52 = ['PENGHASILAN PPNPN SUSULAN', 'PENGHASILAN PPNPN INDUK', 'SPM THR PPNPN', 'SPM GAJI 13 PPNPN']

const click = (id, handler) => $(id).addEventListener('click', handler);
async function xl2qt(od) {
    const ep = (od - 25569) * 86400 * 1000; // Convert to milliseconds
    const mn = new Date(ep).getMonth() + 1; // Get month (1-12)
    if (mn >= 1 && mn <= 3) {return 'Q1';
    } else if (mn >= 4 && mn <= 6) {return 'Q2';
    } else if (mn >= 7 && mn <= 9) {return 'Q3';
    } else {return 'Q4';}
};
async function dt2qt(od) {
    let mn = +(od.slice(3,5));
    if (mn >= 1 && mn <= 3) {return 'Q1';
    } else if (mn >= 4 && mn <= 6) {return 'Q2';
    } else if (mn >= 7 && mn <= 9) {return 'Q3';
    } else if (mn >= 10 && mn <= 12){return 'Q4';}
};
async function jb2ak(jb, i, ur){
    let jb2 = jb.toLowerCase()
    if(jb2 === 'pegawai'){return '51'}
    else if(jb2 === 'barang'){return '52'}
    else if(jb2 === 'modal'){return '53'}
    else{
        console.log('baris ke-'+(i+1)+' tidak sesuai format: '+ jb + '\n'+ ur);
        let ndiv = document.createElement('div');
        ndiv.innerHTML = `
        data baris ke-+${i+1}+' tidak sesuai format uraian baku: <strong>'+ ${jb} +'</strong>
        <br><em>'+ ${ur}+'</em><br><br>`;

        $('hasilSP2err').appendChild(ndiv);
        return ['error', jb]
    }
};
async function xl2ISO(dt) {
    const ep = (dt - 25569) * 86400 * 1000;
    return new Date(ep).toISOString().slice(0, 10);
};
async function swPages(to){
    pages.forEach(page => {ca(page.id, 'hide')});
    cr(to, 'hide');
};
async function sw(e,f){
    e.forEach(i => {ca(i,'hide')});
    cr(f,'hide');
};

const loopers = {
    SPD: spdLooper, RPD: rpdLooper, GUP: gupLooper
};


click('backBtn', () => {
    window.location.href = './';
});
click('modeBtn', () => {
    document.body.classList.toggle('dark');
});
click('spdBtn', () => {swPages('SPDBox')});
click('rpdBtn', () => {swPages('RPDBox')});
click('sp2Btn', () => {swPages('SP2Box')});
click('gupBtn', () => {swPages('GUPBox')});

/* Proses GUP */
click('pilihGUP', () => {sw(gupBox,'pilihGUPBox')});
click('hasilGUP', () => {
    $('hasilGUPerr').innerHTML ='';
    sw(gupBox,'hasilGUPBox');
    uploadFile('uploadGUP','gup');
});
async function gupLooper(data){
    console.log(data); let cnt = 0;
    const kode = data[0]["Nomor Invoice"].split('/')[1];
    const Q152 = []; const Q252 = []; const Q352 = []; const Q452 = [];
    const Q153 = []; const Q253 = []; const Q353 = []; const Q453 = [];
    for (let i = 0; i < data.length; i++) {
        if(data[i]['Jenis SPM'] === 'GUP'){
            let dt = await dt2qt(data[i]["Tanggal SP2D"]);
            let ur = data[i].Deskripsi.toLowerCase();
            if(ur.includes('barang')){
                ak = '52';
            } else if(ur.includes('modal')){
                ak = '53';
            } else {
                console.log('baris ke-'+(i+1)+' tidak sesuai format:\n'+ ur);
                let ndiv = document.createElement('div');
                ndiv.innerHTML = `
                data baris ke-+${i+1}+' tidak sesuai format uraian baku:
                <br><em>'+ ${ur}+'</em><br>`;
                $('hasilGUPerr').appendChild(ndiv);
            };
            let vl = data[i]["Nilai SP2D Ekuivalen"];
            cnt+=1;
            switch (dt+ak) {
                case ('Q152') : Q152.push(vl); break;
                case ('Q153') : Q153.push(vl); break;
    
                case ('Q252') : Q252.push(vl); break;
                case ('Q253') : Q253.push(vl); break;
    
                case ('Q352') : Q352.push(vl); break;
                case ('Q353') : Q353.push(vl); break;
    
                case ('Q452') : Q452.push(vl); break;
                case ('Q453') : Q453.push(vl); break;
            };
        };
    };
    let tQ152 = Q152.reduce((acc, curr) => acc + curr, 0);
    let tQ153 = Q153.reduce((acc, curr) => acc + curr, 0);

    let tQ252 = Q252.reduce((acc, curr) => acc + curr, 0);
    let tQ253 = Q253.reduce((acc, curr) => acc + curr, 0);

    let tQ352 = Q352.reduce((acc, curr) => acc + curr, 0);
    let tQ353 = Q353.reduce((acc, curr) => acc + curr, 0);

    let tQ452 = Q452.reduce((acc, curr) => acc + curr, 0);
    let tQ453 = Q453.reduce((acc, curr) => acc + curr, 0);
   
    fd('hasilGUPttl', 'Hasil '+kode+' ['+cnt+' data GUP]');
    $('tbodyGUP').innerHTML = `
        <tr>
            <td>Q1</td>
            <td>52</td>
            <td>${Q152.length}</td>
            <td>${tQ152}</td>
        </tr>
        <tr>
            <td>Q1</td>
            <td>53</td>
            <td>${Q153.length}</td>
            <td>${tQ153}</td>
        </tr>

        <tr>
            <td>Q2</td>
            <td>52</td>
            <td>${Q252.length}</td>
            <td>${tQ252}</td>
        </tr>
        <tr>
            <td>Q2</td>
            <td>53</td>
            <td>${Q253.length}</td>
            <td>${tQ253}</td>
        </tr>

        <tr>
            <td>Q3</td>
            <td>52</td>
            <td>${Q352.length}</td>
            <td>${tQ352}</td>
        </tr>
        <tr>
            <td>Q3</td>
            <td>53</td>
            <td>${Q353.length}</td>
            <td>${tQ353}</td>
        </tr>

        <tr>
            <td>Q4</td>
            <td>52</td>
            <td>${Q452.length}</td>
            <td>${tQ452}</td>
        </tr>
        <tr>
            <td>Q4</td>
            <td>53</td>
            <td>${Q453.length}</td>
            <td>${tQ453}</td>
        </tr>
    `;

};


/* Proses SP2D */
click('pilihSP2', () => {sw(sp2Box,'pilihSP2Box')});
click('hasilSP2', () => {
    $('hasilSP2err').innerHTML ='';
    sw(sp2Box,'hasilSP2Box');
    uploadFile('uploadSP2','sp2');
});
async function sp2Looper(data){
    console.log(data); let cnt = 0;

    const kode = data[0]["Nomor Invoice"].split('/')[1];
    const Q151 = []; const Q251 = []; const Q351 = []; const Q451 = [];
    const Q152 = []; const Q252 = []; const Q352 = []; const Q452 = [];
    const Q153 = []; const Q253 = []; const Q353 = []; const Q453 = [];

    for (let i = 0; i < data.length; i++) {
        if(!nonLS.includes(data[i]['Jenis SPM'])){
            let dt = await dt2qt(data[i]["Tanggal SP2D"]);
            let jn = data[i]['Jenis SPM'].toUpperCase();
            let ub0 = data[i].Deskripsi;
            let ub1 = ub0.replace(/\s\s+/g, ' ');
            let ub2 = ub1.split(' ')[2];
            let ubc = ub2.replace(/[^a-zA-Z]/g, '');
            let ubl = ub0.toLowerCase();
            if(jb51.includes(jn)){
                ak = '51';
            } else if(jb52.includes(jn)){
                ak = '52';
            } else if(ubl.includes('barang')){
                ak = '52';
            } else if(ubl.includes('modal')){
                ak = '53';
            } else {
                ak = await jb2ak(ubc, i, ub0);
            };
            let vl = data[i]["Nilai SP2D Ekuivalen"];
            cnt+=1;
            switch (dt+ak) {
                case ('Q151') : Q151.push(vl); break;
                case ('Q152') : Q152.push(vl); break;
                case ('Q153') : Q153.push(vl); break;
    
                case ('Q251') : Q251.push(vl); break;
                case ('Q252') : Q252.push(vl); break;
                case ('Q253') : Q253.push(vl); break;
    
                case ('Q351') : Q351.push(vl); break;
                case ('Q352') : Q352.push(vl); break;
                case ('Q353') : Q353.push(vl); break;
    
                case ('Q451') : Q451.push(vl); break;
                case ('Q452') : Q452.push(vl); break;
                case ('Q453') : Q453.push(vl); break;
            };
        };
    };
    let tQ151 = Q151.reduce((acc, curr) => acc + curr, 0);
    let tQ152 = Q152.reduce((acc, curr) => acc + curr, 0);
    let tQ153 = Q153.reduce((acc, curr) => acc + curr, 0);

    let tQ251 = Q251.reduce((acc, curr) => acc + curr, 0);
    let tQ252 = Q252.reduce((acc, curr) => acc + curr, 0);
    let tQ253 = Q253.reduce((acc, curr) => acc + curr, 0);

    let tQ351 = Q351.reduce((acc, curr) => acc + curr, 0);
    let tQ352 = Q352.reduce((acc, curr) => acc + curr, 0);
    let tQ353 = Q353.reduce((acc, curr) => acc + curr, 0);

    let tQ451 = Q451.reduce((acc, curr) => acc + curr, 0);
    let tQ452 = Q452.reduce((acc, curr) => acc + curr, 0);
    let tQ453 = Q453.reduce((acc, curr) => acc + curr, 0);
   
    fd('hasilSP2ttl', 'Hasil '+kode+' ['+cnt+' data LS]');
    $('tbodySP2').innerHTML = `
        <tr>
            <td>Q1</td>
            <td>51</td>
            <td>${Q151.length}</td>
            <td>${tQ151}</td>
        </tr>
        <tr>
            <td>Q1</td>
            <td>52</td>
            <td>${Q152.length}</td>
            <td>${tQ152}</td>
        </tr>
        <tr>
            <td>Q1</td>
            <td>53</td>
            <td>${Q153.length}</td>
            <td>${tQ153}</td>
        </tr>

        <tr>
            <td>Q2</td>
            <td>51</td>
            <td>${Q251.length}</td>
            <td>${tQ251}</td>
        </tr>
        <tr>
            <td>Q2</td>
            <td>52</td>
            <td>${Q252.length}</td>
            <td>${tQ252}</td>
        </tr>
        <tr>
            <td>Q2</td>
            <td>53</td>
            <td>${Q253.length}</td>
            <td>${tQ253}</td>
        </tr>

        <tr>
            <td>Q3</td>
            <td>51</td>
            <td>${Q351.length}</td>
            <td>${tQ351}</td>
        </tr>
        <tr>
            <td>Q3</td>
            <td>52</td>
            <td>${Q352.length}</td>
            <td>${tQ352}</td>
        </tr>
        <tr>
            <td>Q3</td>
            <td>53</td>
            <td>${Q353.length}</td>
            <td>${tQ353}</td>
        </tr>

        <tr>
            <td>Q4</td>
            <td>51</td>
            <td>${Q451.length}</td>
            <td>${tQ451}</td>
        </tr>
        <tr>
            <td>Q4</td>
            <td>52</td>
            <td>${Q452.length}</td>
            <td>${tQ452}</td>
        </tr>
        <tr>
            <td>Q4</td>
            <td>53</td>
            <td>${Q453.length}</td>
            <td>${tQ453}</td>
        </tr>
    `;

};

/* Proses RPD */
click('pilihRPD', () => {sw(rpdBox,'pilihRPDBox')});
click('hasilRPD', () => {
    sw(rpdBox,'hasilRPDBox');
    uploadFile('uploadRPD','rpd');
});
async function rpdLooper(data){
    console.log('rpdLooper')
    console.log(data);
    const kode = data[0]["Kode Satker"];
    const trpd = $('tahunRPD').value;
    console.log(trpd);

    if(trpd === 't2021'){
        q1r = data[0].Rencana +data[1].Rencana +data[2].Rencana;
        q2r = data[3].Rencana +data[4].Rencana +data[5].Rencana;
        q3r = data[6].Rencana +data[7].Rencana +data[8].Rencana;
        q4r = data[9].Rencana +data[10].Rencana +data[11].Rencana;

        q1p = data[0].Realisasi +data[1].Realisasi +data[2].Realisasi;
        q2p = data[3].Realisasi +data[4].Realisasi +data[5].Realisasi;
        q3p = data[6].Realisasi +data[7].Realisasi +data[8].Realisasi;
        q4p = data[9].Realisasi +data[10].Realisasi +data[11].Realisasi;

        q1d = q1r-q1p; q2d = q2r-q2p; q3d = q3r-q3p; q4d = q4r-q4p;
        fd('hasilRPDttl', 'RPD '+kode+' tahun '+ trpd.slice(1,5));
        $('tbodyRPD').innerHTML = `
        <tr>
            <td>Q1</td>
            <td>${q1r}</td>
            <td>${q1p}</td>
            <td>${q1d}</td>
        </tr>
        <tr>
            <td>Q2</td>
            <td>${q2r}</td>
            <td>${q2p}</td>
            <td>${q2d}</td>
        </tr>
        <tr>
            <td>Q3</td>
            <td>${q3r}</td>
            <td>${q3p}</td>
            <td>${q3d}</td>
        </tr>
        <tr>
            <td>Q4</td>
            <td>${q4r}</td>
            <td>${q4p}</td>
            <td>${q4d}</td>
        </tr>
        `;
    };
    if(trpd === 't2022' || trpd === 't2023'){
        /* rencana */
        q151r = data[0].r51 +data[1].r51 +data[2].r51;
        q251r = data[3].r51 +data[4].r51 +data[5].r51;
        q351r = data[6].r51 +data[7].r51 +data[8].r51;
        q451r = data[9].r51 +data[10].r51 +data[11].r51;

        q152r = data[0].r52 +data[1].r52 +data[2].r52;
        q252r = data[3].r52 +data[4].r52 +data[5].r52;
        q352r = data[6].r52 +data[7].r52 +data[8].r52;
        q452r = data[9].r52 +data[10].r52 +data[11].r52;

        q153r = data[0].r53 +data[1].r53 +data[2].r53;
        q253r = data[3].r53 +data[4].r53 +data[5].r53;
        q353r = data[6].r53 +data[7].r53 +data[8].r53;
        q453r = data[9].r53 +data[10].r53 +data[11].r53;

        /* penyerapan */
        q151p = data[0].p51 +data[1].p51 +data[2].p51;
        q251p = data[3].p51 +data[4].p51 +data[5].p51;
        q351p = data[6].p51 +data[7].p51 +data[8].p51;
        q451p = data[9].p51 +data[10].p51 +data[11].p51;

        q152p = data[0].p52 +data[1].p52 +data[2].p52;
        q252p = data[3].p52 +data[4].p52 +data[5].p52;
        q352p = data[6].p52 +data[7].p52 +data[8].p52;
        q452p = data[9].p52 +data[10].p52 +data[11].p52;

        q153p = data[0].p53 +data[1].p53 +data[2].p53;
        q253p = data[3].p53 +data[4].p53 +data[5].p53;
        q353p = data[6].p53 +data[7].p53 +data[8].p53;
        q453p = data[9].p53 +data[10].p53 +data[11].p53;

        q151d = q151r-q151p; q251d = q251r-q251p; q351d = q351r-q351p; q451d = q451r-q451p;
        q152d = q152r-q152p; q252d = q252r-q252p; q352d = q352r-q352p; q452d = q452r-q452p;
        q153d = q153r-q153p; q253d = q253r-q253p; q353d = q353r-q353p; q453d = q453r-q453p;

        fd('hasilRPDttl', 'RPD '+kode+' tahun '+ trpd.slice(1,5));
        $('tbodyRPD').innerHTML = `
        <tr>
            <td>Q1</td>
            <td>51</td>
            <td>${q151r}</td>
            <td>${q151p}</td>
            <td>${q151d}</td>
        </tr>
        <tr>
            <td>Q1</td>
            <td>52</td>
            <td>${q152r}</td>
            <td>${q152p}</td>
            <td>${q152d}</td>
        </tr>
        <tr>
            <td>Q1</td>
            <td>53</td>
            <td>${q153r}</td>
            <td>${q153p}</td>
            <td>${q153d}</td>
        </tr>

        <tr>
            <td>Q2</td>
            <td>51</td>
            <td>${q251r}</td>
            <td>${q251p}</td>
            <td>${q251d}</td>
        </tr>
        <tr>
            <td>Q2</td>
            <td>52</td>
            <td>${q252r}</td>
            <td>${q252p}</td>
            <td>${q252d}</td>
        </tr>
        <tr>
            <td>Q2</td>
            <td>53</td>
            <td>${q253r}</td>
            <td>${q253p}</td>
            <td>${q253d}</td>
        </tr>

        <tr>
            <td>Q3</td>
            <td>51</td>
            <td>${q351r}</td>
            <td>${q351p}</td>
            <td>${q351d}</td>
        </tr>
        <tr>
            <td>Q3</td>
            <td>52</td>
            <td>${q352r}</td>
            <td>${q352p}</td>
            <td>${q352d}</td>
        </tr>
        <tr>
            <td>Q3</td>
            <td>53</td>
            <td>${q353r}</td>
            <td>${q353p}</td>
            <td>${q353d}</td>
        </tr>

        <tr>
            <td>Q4</td>
            <td>51</td>
            <td>${q451r}</td>
            <td>${q451p}</td>
            <td>${q451d}</td>
        </tr>
        <tr>
            <td>Q4</td>
            <td>52</td>
            <td>${q452r}</td>
            <td>${q452p}</td>
            <td>${q452d}</td>
        </tr>
        <tr>
            <td>Q4</td>
            <td>53</td>
            <td>${q453r}</td>
            <td>${q453p}</td>
            <td>${q453d}</td>
        </tr>
        `;
    };

};





/* Proses SPD */
click('pilihSPD', () => {sw(spdBox,'pilihSPDBox')});
click('hasilSPD', () => {
    sw(spdBox,'hasilSPDBox');
    uploadFile('uploadSPD','spd');
});
async function spdLooper(data){
    console.log(data)
    const kode = data[0].Satker; let cnt = 0;
    const Q151 = []; const Q251 = []; const Q351 = []; const Q451 = [];
    const Q152 = []; const Q252 = []; const Q352 = []; const Q452 = [];
    const Q153 = []; const Q253 = []; const Q353 = []; const Q453 = [];
    
    for (let i = 0; i < data.length; i++) {
        const dv = data[i]["Tgl Renkas"];
        if (dv !== "Tgl Renkas" && data[0].Satker === kode) {
            const dt = await xl2qt(dv);
            const ak = data[i]["Jenis Belanja"];
            const vl = data[i]["Nilai Bruto"];
            cnt+=1;

        switch (dt+ak) {
            case ('Q151') : Q151.push(vl); break;
            case ('Q152') : Q152.push(vl); break;
            case ('Q153') : Q153.push(vl); break;

            case ('Q251') : Q251.push(vl); break;
            case ('Q252') : Q252.push(vl); break;
            case ('Q253') : Q253.push(vl); break;

            case ('Q351') : Q351.push(vl); break;
            case ('Q352') : Q352.push(vl); break;
            case ('Q353') : Q353.push(vl); break;

            case ('Q451') : Q451.push(vl); break;
            case ('Q452') : Q452.push(vl); break;
            case ('Q453') : Q453.push(vl); break;
        };
        };
    };
    const tQ151 = Q151.reduce((acc, curr) => acc + curr, 0);
    const tQ152 = Q152.reduce((acc, curr) => acc + curr, 0);
    const tQ153 = Q153.reduce((acc, curr) => acc + curr, 0);

    const tQ251 = Q251.reduce((acc, curr) => acc + curr, 0);
    const tQ252 = Q252.reduce((acc, curr) => acc + curr, 0);
    const tQ253 = Q253.reduce((acc, curr) => acc + curr, 0);

    const tQ351 = Q351.reduce((acc, curr) => acc + curr, 0);
    const tQ352 = Q352.reduce((acc, curr) => acc + curr, 0);
    const tQ353 = Q353.reduce((acc, curr) => acc + curr, 0);

    const tQ451 = Q451.reduce((acc, curr) => acc + curr, 0);
    const tQ452 = Q452.reduce((acc, curr) => acc + curr, 0);
    const tQ453 = Q453.reduce((acc, curr) => acc + curr, 0);

    fd('hasilSPDttl', 'Hasil '+kode+' ['+cnt+' data]');
    $('tbodySPD').innerHTML = `
<tr> <td>Q1 51</td> <td>${Q151.length}</td> <td>${tQ151}</td> </tr>
<tr> <td>Q2 51</td> <td>${Q251.length}</td> <td>${tQ251}</td> </tr>
<tr> <td>Q3 51</td> <td>${Q351.length}</td> <td>${tQ351}</td> </tr>
<tr> <td>Q4 51</td> <td>${Q451.length}</td> <td>${tQ451}</td> </tr>
<tr><td class='black'  colspan='3'></td></tr

<tr> <td>Q1 52</td> <td>${Q152.length}</td> <td>${tQ152}</td> </tr>
<tr> <td>Q1 53</td> <td>${Q153.length}</td> <td>${tQ153}</td> </tr>
<tr> <td>Q2 52</td> <td>${Q252.length}</td> <td>${tQ252}</td> </tr>
<tr> <td>Q2 53</td> <td>${Q253.length}</td> <td>${tQ253}</td> </tr>
<tr> <td>Q3 52</td> <td>${Q352.length}</td> <td>${tQ352}</td> </tr>
<tr> <td>Q3 53</td> <td>${Q353.length}</td> <td>${tQ353}</td> </tr>
<tr> <td>Q4 52</td> <td>${Q452.length}</td> <td>${tQ452}</td> </tr>
<tr> <td>Q4 53</td> <td>${Q453.length}</td> <td>${tQ453}</td> </tr>`;
};



/* General Functions */
function uploadFile(fr,to) {
    const file = document.getElementById(fr).files[0];
    if (!file) return alert("Pilih file yang sesuai...");

    const ext = file.name.split('.').pop().toUpperCase();
    if (['XLS', 'XLSX'].includes(ext)) {
        xl2Json(file, to);
    } else {
        alert("Please select a valid excel file.");
    }
};

function xl2Json(file, to) {
    const reader = new FileReader();
    reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Create a JSON object to hold data from each worksheet
        const result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result['data'] = roa;
            }
        });
        console.log(result);
        if(to === 'spd'){spdLooper(result.data)}
        if(to === 'rpd'){rpdLooper(result.data)}
        if(to === 'sp2'){sp2Looper(result.data)}
        if(to === 'gup'){gupLooper(result.data)}
    };
    reader.readAsArrayBuffer(file);
}


