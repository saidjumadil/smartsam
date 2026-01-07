import Jabatan from '#models/jabatan'
import Penugasan from '#models/penugasan'
import Unit from '#models/unit'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import axios from 'axios'

export default class extends BaseSeeder {
  private api = "https://sdm.unsam.ac.id"
  private header = {
    'x-api-key': process.env.API_KEY
  }
  async run() {
    // Write your database queries inside the run method
    console.log("Mulai Membuat Data Integrasi")
    // UNITS
    console.log("Membuat Data Unit")
    const units = await axios.get(`${this.api}/api/external/unit-kerja/flat`, {
      headers: this.header
    })

    for (const item of units.data.data) {
      console.log("Memproses unit", item.nama_unit)
      await Unit.updateOrCreate({ id_pusat: item.id_unit }, {
        id_pusat: item.id_unit,
        nama: item.nama_unit,
        jenis: item.jenis_unit,
        id_induk: item.id_unit_induk
      })
    }

    //JABATAN
    const unit_pejabat: any = {
      1: 1,
      11: 2,
      12: 3,
      27: 4,
      206: 5,
      200: 6,
      209: 7,
      212: 8,
      210: 9,
      213: 10,
      214: 11,
      182: 12,
      183: 13,
      211: 15,
      15: 16,
      220: 17,
      115: 19,
      116: 20,
      117: 21,
      118: 22,
      221: 23,
      49: 24,
      18: 25,
      71: 26,
      62: 27,
      31: 28,
      61: 29,
      59: 30,
      60: 31,
      76: 32,
      84: 33,
      82: 34,
      81: 35,
      86: 36,
      89: 37,
      83: 38,
      88: 39,
      87: 40,
      85: 41,
      80: 42,
      77: 44,
      78: 45,
      79: 46,
      91: 47,
      92: 48,
      45: 51,
      93: 52,
      90: 53,
      44: 54,
      43: 55,
      222: 56,
    }

    const pimpinan = [
      1,
      11,
      12,
      15,
      220,
      115,
      116,
      117,
      118,
      221,
      49,
      18,
      71,
      62,
      31,
      61,
      59,
      60,
      76,
      84,
      82,
      81,
      86,
      89,
      83,
      88,
      87,
      85,
      80,
      77,
      78,
      79,
      91,
      92,
      45,
      93,
      90,
      44,
      43,
      222,
      2,
      3,
      4
    ]
    console.log("Membuat data jabatan")
    const jabatans = await axios.get(`${this.api}/api/external/jabatan`, {
      headers: this.header
    })


    for (const item of jabatans.data.data[2].children) {
      let penugasan: any = null
      if (unit_pejabat[item.id]) { //Cek apakah jabatan ada unitnya
        const units = await Unit.findBy('id_pusat', unit_pejabat[item.id])
        penugasan = units?.id
      }
      console.log("Memproses jabatan", item.text)
      await Jabatan.updateOrCreate({ id_pusat: item.id }, {
        id_pusat: item.id,
        nama: item.text,
        role: pimpinan.includes(parseInt(item.id)) ? 3 : 5,
        unit: penugasan
      })
    }

    const unit = await Unit.all()

    for (const item of unit) {
      // console.log("Memproses jabatan", item.nama)
      await Jabatan.updateOrCreate({ nama: `Admin Surat ${item.nama}` }, {
        nama: `Admin Surat ${item.nama}`,
        role: 4,
        unit: item.id
      })

      await Jabatan.updateOrCreate({ nama: `Anggota ${item.nama}` }, {
        nama: `Anggota ${item.nama}`,
        role: 5,
        unit: item.id
      })
    }

    // USERS
    console.log("Membuat data user")
    const users = await axios.get(`${this.api}/api/external/pegawai`, {
      headers: this.header
    })

    for (const item of users.data.data) { //Langsung tambah user
      // console.log("Memproses user", item.nama_lengkap)
      const user = await User.updateOrCreate({ id_pusat: item.id_pegawai }, {
        id_pusat: item.id_pegawai,
        nama: item.nama_lengkap,
        username: item.nip != null ? item.nip : item.ni_pppk,
        email: item.email_kampus,
      })

      if (item.id_jabatan != null) { //jika ada jabatan, langsung direlasikan
        try {
          const jabatan = await Jabatan.findBy('id_pusat', item.id_jabatan)
          // console.log("Memproses pejabat", item.nama_lengkap)
          // console.log(user.username, jabatan?.id, item.id_jabatan)
          await Penugasan.updateOrCreate({ pejabat: user.username, jabatan: jabatan?.id }, {
            pejabat: user.username,
            jabatan: jabatan?.id || '',
            status: "aktif"
          })

        } catch (error) {
          console.log(error)
        }
      }
      else if (item.tipe_pegawai == "Tendik" && item.id_jabatan == null && item.id_unit != null) {
        try {
          // console.log("Memproses tendik", item.nama_lengkap)
          const unit: any = await Unit.query().preload('jabatans', (query) => {
            query.select('id').where('role', 5)
          })
            .where('id_pusat', item.id_unit)
            .first()

          const check = await Penugasan.findBy('pejabat', user.username)
          if (check && check?.jabatan != unit.jabatans[0].id) {
            check.status = "Tidak Aktif"
            await check.save()
          }

          await Penugasan.updateOrCreate({ pejabat: user.username, jabatan: unit.jabatans[0].id }, {
            pejabat: user.username,
            jabatan: unit.jabatans[0].id,
            status: "aktif"
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}