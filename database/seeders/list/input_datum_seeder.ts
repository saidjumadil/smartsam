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
      { status: "Disposisi Surat ke Pimpinan" },
      { status: "Surat Diterima Pimpinan" },
      { status: "Surat Didisposisi Ke Unit Lain" },
      { status: "Surat Didisposisi untuk ditindaklanjuti" },
      { status: "Surat Sedang Diproses" },
      { status: "Surat Selesai" },
      { status: "Surat Ditolak" },
    ])

    // Jenis Surat
    console.log("Mulai Membuat Data Jenis Surat")
    await JenisSurat.createMany([
      { jenis: "KEMAHASISWAAN", kode: "KM" },
      { jenis: "PERENCANAAN", kode: "PR" },
      { jenis: "HUMAS", kode: "HM" },
      { jenis: "KERJASAMA", kode: "KS" },
      { jenis: "KURIKULUM AKADEMIK", kode: "KR" },
      { jenis: "RUMAH TANGGA DAN BMN", kode: "RT" },
      { jenis: "KEPEGAWAIAN", kode: "KP" },
      { jenis: "KEUANGAN", kode: "KU" },
      { jenis: "REKAPITULASI SURAT", kode: "TU" },
      { jenis: "AKREDITASI", kode: "AK" }
    ])

    console.log("Selesai Membuat Data")
  }
}
