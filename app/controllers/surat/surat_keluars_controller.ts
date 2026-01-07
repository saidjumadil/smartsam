// import type { HttpContext } from '@adonisjs/core/http'

import Jabatan from "#models/jabatan"
import JenisSurat from "#models/jenis_surat"
import Lampiran from "#models/lampiran"
import Surat from "#models/surat"
import TrackSurat from "#models/track_surat"
import Unit from "#models/unit"
import app from "@adonisjs/core/services/app"

export default class SuratKeluarsController {

    async index({ view, session }: any) {
        const user = session.get('user')

        const suratUnits = await Surat.query().select('surats.id')
            .join('penugasans', 'surats.pejabat_pengirim', '=', 'penugasans.id')
            .join('jabatans', 'penugasans.jabatan', '=', 'jabatans.id')
            .where('jabatans.unit', user.penugasans[0].jabatanRel.unit)

        const suratsId = suratUnits.map((surat) => surat.id)

        const surats = await Surat.query()
            // .whereIn('status', handleStatusSurat[user.penugasans[0].jabatanRel.role])
            .andWhere('arsipkan', false)
            .andWhereIn('surats.id', suratsId)
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
            .preload('jenisSuratRel', (query) => {
                query.select('id', 'jenis')
            })
            .preload('statusSuratRel', (query) => {
                query.select('id', 'status')
            })
            .orderBy('created_at', 'desc')

        const jenis_surats = await JenisSurat.query().orderBy('id', 'asc')
        const units = await Unit.query().whereNot('id', user.penugasans[0].jabatanRel.unit).orderBy('id', 'asc')
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

        const file = request.file('file')

        if (pejabat?.penugasans.length == 0) {
            session.flash('error', 'Data pejabat tidak ditemukan')
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
            catatan: post.catatan,
            kepada: pejabat?.penugasans[0].id,
            dari: user.penugasans[0].id
        })

        if (post.pimpinan == 'on') {
            await TrackSurat.create({
                surat: add.id,
                status: 3,
                catatan: "Surat dikirimkan langsung ke pimpinan unit tanpa melalui admin surat dengan catatan : \"" + post.catatan + "\"",
                kepada: pejabat?.penugasans[0].id,
                dari: user.penugasans[0].id
            })
        }

        if (add) {
            const lampirans = request.files('lampiran')
            if (lampirans.length > 0) {
                for (const lampiran of lampirans) {
                    console.log(lampiran)
                    const fileName = 'Lampiran_' + post.nomor_surat + '.' + lampiran.extname
                    await lampiran.move(app.tmpPath(`uploads/surat/${add.id}`), {
                        name: fileName,
                        overwrite: true
                    })
                    await Lampiran.create({
                        surat: add.id,
                        source: fileName,
                        tipe: lampiran.type
                    })
                }
            }

            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect().toRoute('surat.surat_keluar.detail', { id: add.id })
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
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

        const track_surats = await TrackSurat.query().select('kepada', 'status', 'catatan', 'created_at')
            .preload('kepadaRel', (query) => {
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
            .preload('statusSuratRel', (query) => {
                query.select('id', 'status')
            })
            .where('surat', params.id).orderBy('created_at', 'asc')

        return view.render('pages/surat/surat_keluars_detail', { surat, track_surats })
    }
}