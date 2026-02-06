// import Jabatan from '#models/jabatan'
import JenisSurat from '#models/jenis_surat'
import Role from '#models/role'
import StatusSurat from '#models/status_surat'
// import User from '#models/user'
// import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
// import axios from 'axios'

export default class extends BaseSeeder {
  async run() {
    // Roles
    console.log("Mulai Membuat Data Roles")
    await Role.createMany([
      {
        "nama": "Super Admin"
      },
      {
        "nama": "Admin Umum"
      },
      {
        "nama": "Pimpinan"
      },
      {
        "nama": "Admin Surat"
      },
      {
        "nama": "Anggota"
      }
    ])

    // Status Surat
    console.log("Mulai Membuat Data Status Surat")
    await StatusSurat.createMany([
      { status: "Surat Masuk" },
      { status: "Surat Diterima Admin" },
      { status: "Surat Dilanjutkan ke Pimpinan" },
      { status: "Surat Diterima Pimpinan" },
      { status: "Surat Selesai" },
      { status: "Surat Ditolak" },
      { status: "Surat Didisposisi Ke Unit Lain" },
      { status: "Surat Ditindaklanjuti Ke Anggota" },
      { status: "Surat Sedang Diproses" },
    ])

    // Jenis Surat
    console.log("Mulai Membuat Data Jenis Surat")
    await JenisSurat.createMany([
      { jenis: "Penerimaan Mahasiswa", kode: "TM" },
      { jenis: "Kurikulum", kode: "KR" },
      { jenis: "Tenaga Pendidik", kode: "TD" },
      { jenis: "Kemahasiswaan", kode: "KM" },
      { jenis: "Perkuliahan", kode: "PK" },
      { jenis: "Data, Informasi dan Pengembangan Akademik", kode: "DI" },
      { jenis: "Penunjang Akademik", kode: "TA" },
      { jenis: "Penelitian", kode: "PT" },
      { jenis: "Pengabdian Kepada Masyarakat", kode: "PM" },
      { jenis: "Publikasi Jurnal/Buku", kode: "PJ" },
      { jenis: "Wisuda dan Alumni", kode: "WA" },
      { jenis: "Penjaminan Mutu", kode: "JM" },
      { jenis: "Tata Pamong", kode: "TP" },
      { jenis: "Perencanaan", kode: "PR" },
      { jenis: "Hukum", kode: "HK" },
      { jenis: "Organisasi dan Ketatalaksanaan", kode: "OT" },
      { jenis: "Kearsipan", kode: "KA" },
      { jenis: "Ketatausahaan", kode: "TU" },
      { jenis: "Kerumahtanggaan", kode: "RT" },
      { jenis: "Perlengkapan", kode: "LK" },
      { jenis: "Hubungan Masyarakat", kode: "HM" },
      { jenis: "Pendidikan dan Pelatihan", kode: "DL" },
      { jenis: "Teknologi, Informasi dan Komunikasi", kode: "TI" },
      { jenis: "Pengawasan", kode: "PA" },
      { jenis: "Kepegawaian", kode: "KP" },
      { jenis: "Keuangan", kode: "KU" },
    ])

    console.log("Selesai Membuat Data")
  }
}
