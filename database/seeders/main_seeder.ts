import Jabatan from '#models/jabatan'
import JenisSurat from '#models/jenis_surat'
import Kategori from '#models/kategori'
import Penugasan from '#models/penugasan'
import Role from '#models/role'
import StatusSurat from '#models/status_surat'
import Unit from '#models/unit'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
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
      }
    ])

    // Units
    console.log("Mulai Membuat Data Units")
    const unit = await Unit.createMany(
      [
        { nama: 'Super Admin', kode: 'SA' },
        { nama: "Perpustakaan", kode: "PERPUS" },
        { nama: "Fakultas Ekonomi", kode: "FEKON" },
        { nama: "Fakultas Hukum", kode: "FHUKUM" },
        { nama: "LPPPM & PM", kode: "LPPPM" },
        { nama: "Fakultas Keguruan", kode: "FKG" },
        { nama: "Fakultas Pertanian", kode: "FPERT" },
        { nama: "Laboratorium Bahasa", kode: "LABBHS" },
        { nama: "Laboratorium Dasar", kode: "LABDAS" },
        { nama: "Fakultas Teknik", kode: "FTEK" },
        { nama: "Subbag. TU", kode: "TUSUB" },
        { nama: "LPMPP", kode: "LPMPP" },
        { nama: "SP", kode: "SP" },
        { nama: "UPT TIK", kode: "TIK" }
      ]
    )

    // Status Surat
    console.log("Mulai Membuat Data Status Surat")
    await StatusSurat.createMany([
      { status: "Surat Masuk" },
      { status: "Surat Diterima Admin" },
      { status: "Disposisi Surat" },
      { status: "Surat Diterima Pimpinan" },
      { status: "Surat Disetujui" }
    ])

    // Jenis Surat
    console.log("Mulai Membuat Data Jenis Surat")
    await JenisSurat.createMany([
      { jenis: 'Akreditasi', kode: 'AK' },
      { jenis: 'REKAPITULASI SURAT', kode: 'TU' },
      { jenis: 'Keuangan', kode: 'KU' },
      { jenis: 'Kepegawaian', kode: 'KP' },
      { jenis: 'Rumah Tangga dan BMN', kode: 'RT' },
      { jenis: 'KURIKULUM AKADEMIK', kode: 'KR' },
      { jenis: 'KERJASAMA', kode: 'KS' },
      { jenis: 'HUMAS', kode: 'HM' },
      { jenis: 'PERENCANAAN', kode: 'PR' },
      { jenis: 'KEMAHASISWAAN', kode: 'KM' }
    ])

    // Kategori
    console.log("Mulai Membuat Data Kategori")
    await Kategori.createMany([
      { nama: "Umum" },
      { nama: "Rektorat" },
      { nama: "Fakultas" },
      { nama: "Laboratorium" },
    ])

    //Create Super Admin
    console.log("Mulai Membuat Data Super Admin")
    const jabatan = await Jabatan.create({
      nama: "Super Admin",
      unit: unit[0].id,
      role: 1
    })

    await User.create({
      username: 'superadmin123',
      nama: 'Super Admin',
      email: 'superadmin@smartsam'
    })

    await Penugasan.create({
      jabatan: jabatan.id,
      pejabat: 'superadmin123',
      status: 'aktif'
    })

    console.log("Selesai Membuat Data")
  }
}