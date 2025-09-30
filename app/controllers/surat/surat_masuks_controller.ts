// import type { HttpContext } from '@adonisjs/core/http'

import Jabatan from "#models/jabatan"
import JenisSurat from "#models/jenis_surat"
import Surat from "#models/surat"
import TrackSurat from "#models/track_surat"
import Unit from "#models/unit"

export default class SuratMasuksController {
    async index({ view, session }: any) {
        const user = session.get('user')
        const handleStatusSurat: any = {
            1: [1, 2, 3, 4, 5, 6, 7],
            2: [1, 2, 3, 4, 5, 6, 7],
            3: [3, 4, 5, 6, 9],
            4: [1, 2, 5, 6, 7],
            5: [5, 6, 8, 9]
        }

        const suratUnits = await Surat.query().select('surats.id')
            .join('penugasans', 'surats.pejabat_penerima', '=', 'penugasans.id')
            .join('jabatans', 'penugasans.jabatan', '=', 'jabatans.id')
            .where('jabatans.unit', user.penugasans[0].jabatanRel.unit)

        const suratsId = suratUnits.map((surat) => surat.id)

        const surats = await Surat.query()
            .whereIn('status', handleStatusSurat[user.penugasans[0].jabatanRel.role])
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
        return view.render('pages/surat/surat_masuks', { surats, jenis_surats, units })
    }

    async detail({ view, session, params }: any) {
        const user = session.get('user')
        let status
        switch (user.penugasans[0].jabatanRel.role) {
            case 4:
                status = 2;
                break;
            case 3:
                status = 4;
                break;
            case 5:
                status = 9;
                break;
            default:
                status = 2;
                break;
        }

        // Update Status
        await TrackSurat.updateOrCreate({
            surat: params.id,
            status: status,
        }, {
            status: status,
            dari: user.penugasans[0].id,
            kepada: user.penugasans[0].id,
            catatan: `Surat Masuk diterima oleh ${user.nama}`
        })

        //Pasti update kalau status surat lebih rendah
        const updateSurat = await Surat.query().where('id', params.id).andWhere('status', '<=', status).update({ status: status }).first()

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

        const units = await Unit.query().whereNot('id', user.penugasans[0].jabatanRel.unit).orderBy('id', 'asc')
        const anggotas = await Jabatan.query()
            .preload('penugasans', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    }).where('status', 'aktif')
            }).where('jabatans.unit', user.penugasans[0].jabatanRel.unit).andWhere('jabatans.role', 5).first()

        return view.render('pages/surat/surat_masuks_detail', { surat, track_surats, updateSurat, status, units, anggotas })
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const user = session.get('user')
        const pimpinan = await Jabatan.query().select('id', 'unit', 'role')
            .where('unit', post.status == 7 ? post.unit : user.penugasans[0].jabatanRel.unit).andWhere('role', post.pimpinan == 'on' ? 3 : 4)
            .preload('penugasans', (query) => {
                query.select('id', 'jabatan')
                    .whereIn('status', ['aktif', 'plt'])
            })
            .preload('unitRel', (query) => {
                query.select('id', 'nama')
            }).first()
        console.log(pimpinan?.serialize())
        switch (post.status) {
            case '7': //Surat didisposisikan ke Unit lain
                console.log("Surat didisposisikan ke Unit lain", post.status)
                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: pimpinan?.penugasans[0].id,
                    catatan: "Surat dipindahkan ke unit " + pimpinan?.unitRel.nama + " dengan catatan \"" + post.catatan + "\""
                })
                await Surat.query().where('id', params.id).update({ status: post.status, pejabat_penerima: pimpinan?.penugasans[0].id })

                if (post.pimpinan != "on") {
                    session.flash('success', 'Data Berhasil Diubah')
                    return response.redirect().toRoute('surat.surat_masuk.index')
                } else post.status = 3
            case '3': //Disposisi
                console.log("Disposisi", post.status)
                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: pimpinan?.penugasans[0].id,
                    catatan: post.catatan
                })

                await Surat.query().where('id', params.id).update({ status: post.status })

                session.flash('success', 'Data Berhasil Diubah')
                return response.redirect().toRoute('surat.surat_masuk.index')
            case '8': //Surat didisposisi ke anggota
                console.log("Disposisi", post.status)
                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: post.anggota,
                    catatan: post.catatan
                })

                await Surat.query().where('id', params.id).update({ status: post.status })

                session.flash('success', 'Data Berhasil Diubah')
                return response.redirect().toRoute('surat.surat_masuk.index')
            case '5':
            case '6': //Surat Ditolak dan Surat di terima
                const surat = await Surat.query().where('id', params.id).select('pejabat_pengirim').first()

                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: surat?.pejabat_pengirim,
                    catatan: post.catatan
                })
                await Surat.query().where('id', params.id).update({ status: post.status })

                session.flash('success', 'Data Berhasil Diubah')
                return response.redirect().toRoute('surat.surat_masuk.index')
        }
    }
}