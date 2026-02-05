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
    const role = await Role.createMany([
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

    // Units
    console.log("Mulai Membuat Data Units")
    const dataUnit = [
      { nama: 'Fakultas Hukum', kode: 'FH' },
      { nama: 'Fakultas Ekonomi dan Bisnis', kode: 'FEKB' },
      { nama: 'Fakultas Pertanian', kode: 'FP' },
      { nama: 'Fakultas Keguruan dan Ilmu Pendidikan', kode: 'FKIP' },
      { nama: 'Fakultas Sains dan Teknologi', kode: 'FST' },
      { nama: 'Hukum', kode: 'H' },
      { nama: 'Manajemen', kode: 'MAN' },
      { nama: 'Ekonomi Pembangunan', kode: 'EKONP' },
      { nama: 'Akuntansi', kode: 'AKUNT' },
      { nama: 'Agribisnis', kode: 'AGRI' },
      { nama: 'Agroteknologi', kode: 'AGROTEK' },
      { nama: 'Akuakultur', kode: 'AKUAKULTUR' },
      { nama: 'Pendidikan Sejarah', kode: 'PENDSEJARAH' },
      { nama: 'Pendidikan Pancasila dan Kewarganegaraan', kode: 'PENDPANCASILA' },
      { nama: 'Pendidikan Ilmu Pengetahuan Alam', kode: 'PENDIPA' },
      { nama: 'Pendidikan Biologi', kode: 'PENDBIOLOGI' },
      { nama: 'Pendidikan Bahasa Inggris', kode: 'PENDBAHASAINGGRIS' },
      { nama: 'Pendidikan Bahasa Indonesia', kode: 'PENDBAHASAINDONESIA' },
      { nama: 'Pendidikan Jasmani', kode: 'PENDJASMANI' },
      { nama: 'Pendidikan Geografi', kode: 'PENDGEOGRAFI' },
      { nama: 'Pendidikan Vokasional Seni Kuliner', kode: 'PENDVOKASISENIKULINER' },
      { nama: 'Pendidikan Guru Sekolah Dasar', kode: 'PENDGURUSEKOLAH DASAR' },
      { nama: 'Pendidikan Profesi Guru (PPG)', kode: 'PENDPROFESIGURU' },
      { nama: 'Pendidikan Matematika', kode: 'PENDMATEMATIKA' },
      { nama: 'Pendidikan Fisika', kode: 'PENDFISIKA' },
      { nama: 'Pendidikan Kimia', kode: 'PENDKIMIA' },
      { nama: 'Pendidikan Teknik Sipil', kode: 'PENDTEKNIKSIPIL' },
      { nama: 'Pendidikan Teknik Mesin', kode: 'PENDTEKNIKMESIN' },
      { nama: 'Pendidikan Teknik Industri', kode: 'PENDTEKNIKINDUSTRI' },
      { nama: 'Informatika', kode: 'INF' },
      { nama: 'Matematika', kode: 'MAT' },
      { nama: 'Biologi', kode: 'BIO' },
      { nama: 'Fisika', kode: 'FIS' },
      { nama: 'Kimia', kode: 'KIM' },
      { nama: 'GeoFisika', kode: 'GEOFISIKA' },
      { nama: 'Magister Pendidikan Ilmu Pengetahuan Sosial', kode: 'MAGIPENDIPA' },
      { nama: 'Magister Hukum', kode: 'MAGISTUDI' },
      { nama: 'Biro Akademik, Kemahasiswaan, dan Kerja Sama', kode: 'BAKS' },
      { nama: 'Biro Perencanaan, Keuangan, dan Umum', kode: 'BPKU' },
      { nama: 'LPPM', kode: 'LPPM' },
      { nama: 'LPMPP', kode: 'LPMPP' },
      { nama: 'SATUAN PENGAWASAN', kode: 'SP' },
      { nama: 'UPA TIK', kode: 'TIK' },
      { nama: 'UPA PERPUSTAKAAN', kode: 'UPPER' },
      { nama: 'UPA LABORATORIUM TERPADU', kode: 'ULABTER' },
      { nama: 'UPA BAHASA', kode: 'UBAHASA' },
      { nama: 'UPA PENGEMBANGAN KARIER DAN KEWIRAUSAHAAN', kode: 'UPKARIER' },
    ]
    const unit = await Unit.createMany(dataUnit)

    // Jabatans
    console.log("Mulai Membuat Data Jabatans")
    const pimpinan = unit.map((item) => {
      return {
        nama: 'Kepala ' + item.nama,
        unit: item.id,
        role: role[2].id
      }
    })
    const admin_surat = unit.map((item) => {
      return {
        nama: 'Admin Surat ' + item.nama,
        unit: item.id,
        role: role[3].id
      }
    })
    const anggota = unit.map((item) => {
      return {
        nama: 'Anggota ' + item.nama,
        unit: item.id,
        role: role[4].id
      }
    })
    const penugasan = [...pimpinan, ...admin_surat, ...anggota]
    await Jabatan.createMany(penugasan)

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