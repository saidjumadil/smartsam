// import type { HttpContext } from '@adonisjs/core/http'

import Jabatan from "#models/jabatan"
import JenisSurat from "#models/jenis_surat"
import Lampiran from "#models/lampiran"
import Penugasan from "#models/penugasan"
import Surat from "#models/surat"
import TrackSurat from "#models/track_surat"
import Unit from "#models/unit"
import app from "@adonisjs/core/services/app"

export default class SuratKeluarsController {

    async index({ view, session }: any) {
        const user = session.get('user')
        const penugasans = await Penugasan.query().select('id', 'pejabat').where('pejabat', user.username)
        const pejabatId = penugasans.map((penugasan: any) => penugasan.id)

        const surats = await Surat.query()
            // .whereIn('status', handleStatusSurat[user.penugasans[0].jabatanRel.role])
            .andWhere('arsipkan', false)
            .andWhereIn('pejabat_pengirim', pejabatId)
            .preload('pengirimRel', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    })
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'unit')
                            .preload('unitRel', (query) => {
                                query.select('id', 'nama')
                            })
                    })
            })
            .preload('penerimaRel', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    })
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'unit')
                            .preload('unitRel', (query) => {
                                query.select('id', 'nama')
                            })
                    })
            })
            .preload('jenisSuratRel', (query) => {
                query.select('id', 'jenis')
            })
            .preload('statusSuratRel', (query) => {
                query.select('id', 'status')
            })
            .orderBy('created_at', 'desc')

        const jenis_surats = await JenisSurat.query().orderBy('id', 'asc')
        // const units = await Unit.query().whereNot('id', user.penugasans[0].jabatanRel.unit).andWhereNot('jenis', 'Subbagian').orderBy('id', 'asc')
        const units = await Unit.query()
            .whereNot('id', user.penugasans[0].jabatanRel.unit)
            .andWhere('jenis', '!=', 'Subbagian')
            .preload('jabatans', (query) => {
                query.select('id', 'unit', 'role').where('role', 3)
                    .preload('penugasans', (query) => {
                        query.select('jabatan', 'pejabat').where('status', 'aktif')
                            .preload('pejabatRel', (query) => {
                                query.select('username', 'nama')
                            })
                    })
            })
            .orderBy('id', 'asc')

        return view.render('pages/surat/surat_keluars', { surats, jenis_surats, units })
    }

    async post({ request, response, session }: any) {
        const post = request.all()
        const user = session.get('user')
        const pejabat = await Jabatan.query().select('id', 'unit', 'role')
            .where('unit', post.unit).andWhere('role', post.pimpinan == 'on' ? 3 : 4)
            .preload('penugasans', (query) => {
                query.select('id', 'pejabat', 'status', 'jabatan')
                    .whereIn('status', ['aktif', 'plt'])
            })
            .preload('unitRel', (query) => {
                query.select('id', 'nama')
            })
            .first()
        console.log(pejabat)

        const file = request.file('file')

        if (pejabat?.penugasans.length == 0 || pejabat == null) {
            // console.log('Pejabat tidak tersedia')
            const pejabat = post.pimpinan == 'on' ? 'Pimpinan Belum Terdaftar, Silahkan Hubungi Admin' : 'Admin Surat Belum ditentukan, Silahkan mengirim langsung ke Pimpinan Unit Atau Hubungi Unit Tersebut'
            session.flash('alert', { type: 'destructive', msg: pejabat })
            return response.redirect().back()
        }

        const fileName = post.nomor_surat + '.' + file.extname
        const add = await Surat.create({
            nomor_surat: post.nomor_surat,
            jenis_surat: post.jenis_surat,
            perihal: post.perihal,
            pejabat_penerima: pejabat?.penugasans[0].id,
            pejabat_pengirim: user.penugasans[0].id,
            tanggal_surat: post.tanggal_surat,
            asal_surat: post.asal_surat,
            status: post.pimpinan == 'on' ? 3 : 1,
            file: fileName
        })

        await file.move(app.tmpPath(`uploads/surat/${add.id}`), {
            name: fileName,
            overwrite: true,
        })
        add.file = fileName

        await TrackSurat.create({
            surat: add.id,
            status: 1,
            catatan: "Surat Dikirimkan ke Unit " + pejabat?.unitRel.nama,
            kepada: pejabat?.penugasans[0].id,
            dari: user.penugasans[0].id
        })

        if (post.pimpinan == 'on') {
            await TrackSurat.create({
                surat: add.id,
                status: 3,
                catatan: "Surat dikirimkan langsung ke pimpinan unit tanpa melalui admin surat ",
                kepada: pejabat?.penugasans[0].id,
                dari: user.penugasans[0].id
            })
        }

        if (add) {
            const lampirans = request.files('lampiran')
            // return lampirans
            if (lampirans.length > 0) {
                for (const index in lampirans) {
                    const fileName = 'Lampiran_' + '_' + (parseInt(index) + 1) + '_' + post.nomor_surat + '_' + lampirans[index].clientName
                    await lampirans[index].move(app.tmpPath(`uploads/surat/${add.id}`), {
                        name: fileName,
                        overwrite: true
                    })
                    await Lampiran.create({
                        surat: add.id,
                        source: fileName,
                        tipe: lampirans[index].type
                    })
                }
            }

            session.flash('alert', { type: 'success', msg: 'Data Berhasil Ditambahkan' })
            return response.redirect().toRoute('surat.surat_keluar.detail', { id: add.id })
        } else {
            session.flash('alert', { type: 'destructive', msg: 'Data Gagal Ditambahkan' })
            return response.redirect().back()
        }
    }

    async detail({ view, params }: any) {
        const surat = await Surat.query().where('id', params.id)
            .preload('pengirimRel', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    })
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'nama', 'unit')
                            .preload('unitRel', (query) => {
                                query.select('id', 'nama')
                            })
                    })
            })
            .preload('jenisSuratRel', (query) => {
                query.select('id', 'jenis')
            })
            .preload('statusSuratRel', (query) => {
                query.select('id', 'status')
            })
            .preload('lampirans', (query) => {
                query.select('*')
            })
            .first()

        const track_surats = await TrackSurat.query().select('kepada', 'dari', 'status', 'catatan', 'created_at')
            .preload('kepadaRel', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    })
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'nama', 'unit')
                            .preload('unitRel', (query) => {
                                query.select('id', 'nama')
                            })

                    })
            })
            .preload('dariRel', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    })
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'nama', 'unit')
                            .preload('unitRel', (query) => {
                                query.select('id', 'nama')
                            })
                    })
            })
            .preload('statusSuratRel', (query) => {
                query.select('id', 'status')
            })
            .where('surat', params.id).orderBy('created_at', 'asc')

        const catatan = track_surats
            .filter((item: any) => [1, 5, 6, 7, 8].includes(item.status))
            .map((item: any) => item)

        return view.render('pages/surat/surat_keluars_detail', { surat, track_surats, catatan })
    }
}