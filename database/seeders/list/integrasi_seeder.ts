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
    // Variable Unit Super Admin dan admin umum
    const unitAdmin: any = {}

    const units = await axios.get(`${this.api}/api/external/unit-kerja/flat`, {
      headers: this.header
    })

    for (const item of units.data.data) {
      console.log("Memproses unit", item.nama_unit)
      const addUnit = await Unit.updateOrCreate({ id_pusat: item.id_unit }, {
        id_pusat: item.id_unit,
        nama: item.nama_unit,
        jenis: item.jenis_unit,
        id_induk: item.id_unit_induk
      })

      switch (item.id_unit) {
        case '19':
          unitAdmin["superAdmin"] = addUnit.id
          break;
        case '15':
          unitAdmin["adminUmum"] = addUnit.id
          break;
        default:
          break;
      }

    }

    console.log("Item Unit", unitAdmin)

    //JABATAN
    // const unit_pejabat: any = {
    //   1: 1,
    //   11: 2,
    //   115: 19,
    //   116: 20,
    //   117: 21,
    //   118: 22,
    //   119: 65,
    //   12: 3,
    //   120: 69,
    //   121: 66,
    //   15: 16,
    //   18: 25,
    //   181: 73,
    //   19: 89,
    //   2: 59,
    //   20: 90,
    //   22: 32,
    //   220: 17,
    //   221: 23,
    //   222: 56,
    //   227: 80,
    //   228: 81,
    //   229: 82,
    //   230: 69,
    //   231: 65,
    //   232: 66,
    //   233: 67,
    //   234: 68,
    //   240: 78,
    //   241: 76,
    //   242: 77,
    //   243: 43,
    //   244: 79,
    //   245: 70,
    //   246: 71,
    //   249: 83,
    //   250: 84,
    //   251: 72,
    //   252: 73,
    //   253: 74,
    //   257: 49,
    //   259: 109,
    //   260: 110,
    //   3: 60,
    //   31: 28,
    //   32: 106,
    //   33: 107,
    //   34: 108,
    //   35: 55,
    //   37: 54,
    //   39: 50,
    //   4: 61,
    //   41: 51,
    //   43: 55,
    //   44: 54,
    //   45: 51,
    //   46: 51,
    //   47: 64,
    //   49: 24,
    //   5: 1,
    //   50: 102,
    //   51: 103,
    //   52: 104,
    //   53: 85,
    //   55: 31,
    //   57: 87,
    //   59: 30,
    //   60: 31,
    //   61: 29,
    //   62: 27,
    //   69: 92,
    //   70: 93,
    //   71: 26,
    //   72: 97,
    //   73: 99,
    //   74: 100,
    //   75: 94,
    //   76: 32,
    //   77: 44,
    //   78: 45,
    //   79: 46,
    //   80: 42,
    //   81: 35,
    //   82: 34,
    //   83: 38,
    //   84: 33,
    //   85: 41,
    //   86: 36,
    //   87: 40,
    //   88: 39,
    //   89: 37,
    //   90: 53,
    //   91: 47,
    //   92: 48,
    //   93: 52,
    //   27: 4,
    //   206: 5,
    //   200: 6,
    //   209: 7,
    //   212: 8,
    //   210: 9,
    //   213: 10,
    //   214: 11,
    //   182: 12,
    //   183: 13,
    //   211: 15,
    //   999: 10,
    //   16: 16,
    //   8: 18,
    //   9: 18,
    //   998: 19,
    //   188: 24,
    //   190: 24,
    //   189: 24,
    //   184: 25,
    //   185: 25,
    //   186: 25,
    //   258: 25,
    //   197: 26,
    //   198: 26,
    //   204: 26,
    //   187: 27,
    //   191: 27,
    //   192: 27,
    //   203: 28,
    //   202: 28,
    //   201: 28,
    //   56: 31,
    //   40: 50,
    //   42: 51,
    //   38: 54,
    //   36: 55,
    //   48: 64,
    //   236: 65,
    //   165: 66,
    //   237: 66,
    //   238: 67,
    //   239: 68,
    //   164: 69,
    //   235: 69,
    //   122: 69,
    //   247: 70,
    //   248: 71,
    //   254: 72,
    //   255: 73,
    //   256: 74,
    //   54: 85,
    //   58: 87,
    // }

    // const pimpinan = [
    //   1,
    //   11,
    //   115,
    //   116,
    //   117,
    //   118,
    //   119,
    //   12,
    //   120,
    //   121,
    //   15,
    //   18,
    //   181,
    //   182,
    //   183,
    //   19,
    //   2,
    //   20,
    //   200,
    //   206,
    //   209,
    //   210,
    //   211,
    //   212,
    //   213,
    //   214,
    //   22,
    //   220,
    //   221,
    //   222,
    //   227,
    //   228,
    //   229,
    //   230,
    //   231,
    //   232,
    //   233,
    //   234,
    //   240,
    //   241,
    //   242,
    //   243,
    //   244,
    //   245,
    //   246,
    //   249,
    //   250,
    //   251,
    //   252,
    //   253,
    //   257,
    //   259,
    //   260,
    //   27,
    //   3,
    //   31,
    //   32,
    //   33,
    //   34,
    //   35,
    //   37,
    //   39,
    //   4,
    //   41,
    //   43,
    //   44,
    //   45,
    //   46,
    //   47,
    //   49,
    //   5,
    //   50,
    //   51,
    //   52,
    //   53,
    //   55,
    //   57,
    //   59,
    //   60,
    //   61,
    //   62,
    //   69,
    //   70,
    //   71,
    //   72,
    //   73,
    //   74,
    //   75,
    //   76,
    //   77,
    //   78,
    //   79,
    //   8,
    //   80,
    //   81,
    //   82,
    //   83,
    //   84,
    //   85,
    //   86,
    //   87,
    //   88,
    //   89,
    //   90,
    //   91,
    //   92,
    //   93,
    // ]

    console.log("Membuat data jabatan")
    const jabatans = await axios.get(`${this.api}/api/external/jabatan`, {
      headers: this.header
    })


    for (const item of jabatans.data.data[2].children) {
      // let penugasan: any = null
      // if (unit_pejabat[item.id]) { //Cek apakah jabatan ada unitnya
      //   const units = await Unit.findBy('id_pusat', unit_pejabat[item.id])
      //   penugasan = units?.id
      // }
      console.log("Memproses jabatan", item.text)
      await Jabatan.updateOrCreate({ id_pusat: item.id }, {
        id_pusat: item.id,
        nama: item.text,
        // role: pimpinan.includes(parseInt(item.id)) ? 3 : 5,
        // unit: penugasan
      })
    }

    const unit = await Unit.all()

    for (const item of unit) {
      // console.log("Memproses jabatan", item.nama)
      await Jabatan.updateOrCreate({ nama: `Admin Surat ${item.nama}`, unit: item.id }, {
        nama: `Admin Surat ${item.nama}`,
        role: 4,
        unit: item.id
      })

      await Jabatan.updateOrCreate({ nama: `Anggota ${item.nama}`, unit: item.id }, {
        nama: `Anggota ${item.nama}`,
        role: 5,
        unit: item.id
      })
    }

    // Tambah Jabatan Super admin dan admin
    await Jabatan.updateOrCreate({ id_pusat: 998 }, {
      id_pusat: 998,
      nama: 'Super Admin E-Surat',
      role: 1,
      unit: unitAdmin["superAdmin"]
    })
    await Jabatan.updateOrCreate({ id_pusat: 999 }, {
      id_pusat: 999,
      nama: 'Admin Umum E-Surat',
      role: 2,
      unit: unitAdmin["adminUmum"]
    })

    // USERS
    console.log("Membuat data user")
    const users = await axios.get(`${this.api}/api/external/pegawai`, {
      headers: this.header
    })

    let index = 0
    for (const item of users.data.data) { //Langsung tambah user
      // console.log("Memproses user", item.nama_lengkap)
      index++
      let user: any
      try {
        user = await User.updateOrCreate({ id_pusat: item.id_pegawai }, {
          id_pusat: item.id_pegawai,
          nama: item.nama_lengkap,
          username: item.nip != null ? item.nip : item.ni_pppk,
          email: item.email_kampus,
        })
        switch (user.username) {
          case '199305202025211067':
            item.id_jabatan = 999
            break;
          case '199809062025061005':
            item.id_jabatan = 998
            break;
        }
      } catch (error) {
        // console.log("Error user", item)
        // console.log(error)
        // break
      }


      const jabatan = item.id_jabatan == null ? false : await Jabatan.findBy('id_pusat', item.id_jabatan)


      if (item.id_jabatan != null && jabatan) { //jika ada jabatan struktural, langsung direlasikan
        try {
          // console.log("Memproses pejabat", item.nama_lengkap)
          // console.log(user.username, jabatan?.id, item.id_jabatan)
          await Penugasan.query().where('jabatan', jabatan?.id).where('pejabat', '!=', user.username).update({
            status: "tidak aktif"
          })

          await Penugasan.updateOrCreate({ pejabat: user.username, jabatan: jabatan?.id }, {
            pejabat: user.username,
            jabatan: jabatan?.id || '',
            status: "aktif"
          })

          await Penugasan.query().where('pejabat', user.username).where('jabatan', '!=', jabatan?.id).update({
            status: "tidak aktif"
          })

        } catch (error) {
          // console.log("Error pejabat", item, jabatan)
          // console.log(error)
          // break
        }
      }
      else if (item.tipe_pegawai == "Tendik" && !jabatan && item.id_unit != null) {

        const unit: any = await Unit.query().preload('jabatans', (query) => {
          query.select('id').where('role', 5).orWhere('role', 4).orderBy('role', 'desc')
        })
          .where('id_pusat', item.id_unit)

        const jabatan_ids = unit[0].jabatans.map((jabatan: any) => jabatan.id)
        const check: any = await Penugasan.query().where('pejabat', user.username).andWhere('status', 'aktif').first()
        const jabatan_anggota: any = await Jabatan.query().where('unit', unit[0].id).andWhereILike('nama', 'Anggota %').first()
        const jabatan_admin: any = await Jabatan.query().where('unit', unit[0].id).andWhereILike('nama', 'Admin Surat %').first()

        try {
          if (check) {
            if (!jabatan_ids.includes(check.jabatan)) { //Check ada penugasan, tapi bukan di unit yang sama
              check.status = "tidak aktif"
              await check.save()
              await Penugasan.updateOrCreate({ pejabat: user.username, jabatan: jabatan_anggota.id }, {
                pejabat: user.username,
                jabatan: jabatan_anggota.id,
                status: "aktif"
              })
            } else if (![jabatan_anggota.id, jabatan_admin.id].includes(check.jabatan)) {
              check.status = "tidak aktif"
              await check.save()
              await Penugasan.updateOrCreate({ pejabat: user.username, jabatan: jabatan_anggota.id }, {
                pejabat: user.username,
                jabatan: jabatan_anggota.id,
                status: "aktif"
              })
            }
          }
          else {
            await Penugasan.updateOrCreate({ pejabat: user.username, jabatan: jabatan_anggota.id }, {
              pejabat: user.username,
              jabatan: jabatan_anggota.id,
              status: "aktif"
            })
          }

        } catch (error) {
          // console.log(unit)
          // console.log(error)
          // break
        }
      }
    }
  }
}