import Role from '#models/role';
import env from '#start/env';
import app from '@adonisjs/core/services/app';
import edge from 'edge.js';
import axios from 'axios';

edge.global('appUrl', (path: any) => {
    const APP_URL = env.get('APP_URL')
    return path ? `${APP_URL}/${path}` : APP_URL
})

edge.global('path', (path: any) => {
    const url = app.tmpPath(path)
    return url
})

const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const hari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

edge.global('bulans', {
    0: 'Januari',
    1: 'Februari',
    2: 'Maret',
    3: 'April',
    4: 'Mei',
    5: 'Juni',
    6: 'Juli',
    7: 'Agustus',
    8: 'Sebtember',
    9: 'Oktober',
    10: 'November',
    11: 'Desember',
})

edge.global('bulan_array', [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'Sebtember', 'Oktober', 'November', 'Desember'
])

edge.global('tipe_kegiatan', [
    'Dinas Luar', 'Forkopimda', 'Reses', 'Kunjuan Konstituen', 'Kunjungan Tokoh', 'Advokasi Warga', 'Rapat Dewan', 'Sosper - Sosialisasi Perda', 'TOP', 'Kegiatan Lainnya'
])

edge.global('date', (tanggal: any) => {
    return `${tanggal.getDate()} ${bulan[tanggal.getMonth()]} ${tanggal.getFullYear()}`
})

edge.global('tanggal', (tanggal: any) => {
    const date = ('0' + tanggal.getDate()).slice(-2)
    const month = ('0' + (tanggal.getMonth() + 1)).slice(-2)
    const year = tanggal.getFullYear()
    return `${year}-${month}-${date}`
})

edge.global('time', (tanggal: any) => {
    const hour = ('0' + tanggal.getHours()).slice(-2)
    const minute = ('0' + (tanggal.getMinutes())).slice(-2)
    return `${hour}:${minute}`
})

edge.global('hari', (index: any) => { return hari[index] })

edge.global('listRole', async () => {
    const roles = await Role.query()
    return roles
})

edge.global('truncateString', (string: any, length: any) => {
    if (string)
        return string.length > length ? string.substring(0, length) + '...' : string
    else
        return ''
})

edge.global('tipeStatus', (tipe: any) => {
    switch (tipe) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 7:
        case 8:
        case 9:
            tipe = 'primary'
            break
        case 5:
            tipe = 'success'
            break
        case 6:
            tipe = 'destructive'
            break
    }
    return tipe
})

edge.global('notifSuratMasuk', async (id: any) => {
    // console.log(id, `${env.get('APP_URL')}/api/notif-surat-masuk/${id}`)
    const jumlah = await axios.get(`${env.get('APP_URL')}/api/notif-surat-masuk/${id}`)
    return jumlah.data
})


