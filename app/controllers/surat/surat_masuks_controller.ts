// import type { HttpContext } from '@adonisjs/core/http'

import Jabatan from "#models/jabatan"
import JenisSurat from "#models/jenis_surat"
import Penugasan from "#models/penugasan"
import Surat from "#models/surat"
import TrackSurat from "#models/track_surat"
import Unit from "#models/unit"
import UnitTreeService from "#services/UnitTreeService"

export default class SuratMasuksController {
    async index({ view, session }: any) {
        const user = session.get('user')

        const penugasans = await Penugasan.query().select('id', 'pejabat').where('pejabat', user.username)
        const pejabatId = penugasans.map((penugasan: any) => penugasan.id)

        const riwayats = await TrackSurat.query().distinct('surat')
            .whereIn('kepada', pejabatId).andWhereNotIn('status', [5, 6])

        const suratsId = riwayats.map((surat: any) => surat.surat)

        const surats = await Surat.query()
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
        const units = await Unit.query().whereNot('id', user.penugasans[0].jabatanRel.unit).orderBy('id', 'asc')
        return view.render('pages/surat/surat_masuks', { surats, jenis_surats, units })
    }

    async detail({ view, session, params }: any) {
        const user = session.get('user')
        const status_surat = await Surat.query().select('id', 'status').where('id', params.id).first()
        let status
        switch (user.penugasans[0].jabatanRel.role) {
            case 4:
                if (status_surat?.status == 8) {
                    status = 9;
                } else {
                    status = 2;
                }
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

        //Pasti update kalau status surat lebih rendah
        const updateSurat = await Surat.query().where('id', params.id).andWhere('status', '<=', status).andWhereNotIn('status', [5, 6]).update({ status: status }).first()

        const surat: any = await Surat.query().where('id', params.id)
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

        if (![5, 6].includes(surat?.status)) {
            await TrackSurat.updateOrCreate({
                surat: params.id,
                status: status,
            }, {
                status: status,
                dari: user.penugasans[0].id,
                kepada: user.penugasans[0].id,
                catatan: `Surat Masuk diterima oleh ${user.penugasans[0].jabatanRel.nama} : ${user.nama}`
            })
        }

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

        const unit_lain = await Unit.query()
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
        const tree = await UnitTreeService.getTree(user.penugasans[0].jabatanRel.unit)
        const unit_bawahan = await Unit.query().whereIn('id', tree).andWhereNot('id', user.penugasans[0].jabatanRel.unit).orderBy('id', 'asc')

        const units = unit_lain.concat(unit_bawahan)
        console.log(unit_bawahan)

        const anggotas = await Jabatan.query()
            .preload('penugasans', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    }).where('status', 'aktif')
            }).whereIn('jabatans.unit', tree).andWhereIn('jabatans.role', [4, 5])

        return view.render('pages/surat/surat_masuks_detail', { surat, track_surats, updateSurat, status, units, anggotas })
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const user = session.get('user')
        if (post.status == 3) {
            post.pimpinan = 'on'
        }
        const pimpinan = await Jabatan.query().select('id', 'unit', 'role')
            .where('unit', post.status == 7 ? post.unit : user.penugasans[0].jabatanRel.unit).andWhere('role', post.pimpinan == 'on' ? 3 : 4)
            .preload('penugasans', (query) => {
                query.select('id', 'jabatan')
                    .whereIn('status', ['aktif', 'plt'])
            })
            .preload('unitRel', (query) => {
                query.select('id', 'nama')
            }).first()
        console.log(post, pimpinan)
        switch (post.status) {
            case '7': //Surat didisposisikan ke Unit lain
                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: pimpinan?.penugasans[0].id,
                    catatan: "Surat dipindahkan ke unit " + pimpinan?.unitRel.nama + " dengan catatan \"" + post.pesan || post.catatan || "-" + "\""
                })
                await TrackSurat.create({
                    surat: params.id,
                    status: 1,
                    dari: user.penugasans[0].id,
                    kepada: pimpinan?.penugasans[0].id,
                    catatan: "Surat telah dialihkan ke unit " + pimpinan?.unitRel.nama
                })

                await Surat.query().where('id', params.id).update({ status: 1, pejabat_penerima: pimpinan?.penugasans[0].id })

                if (post.pimpinan != "on") {
                    session.flash('alert', { type: 'success', msg: 'Surat Berhasil Dipindahkan' })
                    return response.redirect().toRoute('surat.surat_masuk.index')
                } else post.status = 3
            case '3': //Disposisi
                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: pimpinan?.penugasans[0].id,
                    catatan: post.pesan || post.catatan
                })

                await Surat.query().where('id', params.id).update({ status: post.status, pejabat_penerima: pimpinan?.penugasans[0].id })

                session.flash('alert', { type: 'success', msg: 'Surat Berhasil Disposisi' })
                return response.redirect().toRoute('surat.surat_masuk.index')
            case '8': //Surat didisposisi ke anggota
                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: post.anggota,
                    catatan: post.pesan || post.catatan
                })

                await Surat.query().where('id', params.id).update({ status: post.status, pejabat_penerima: post.anggota })

                session.flash('alert', { type: 'success', msg: 'Surat Berhasil Dilanjutkan Ke Anggota' })
                return response.redirect().toRoute('surat.surat_masuk.index')
            case '5':
            case '6': //Surat Ditolak dan Surat di terima
                const surat = await Surat.query().where('id', params.id).select('pejabat_pengirim').first()

                await TrackSurat.create({
                    surat: params.id,
                    status: post.status,
                    dari: user.penugasans[0].id,
                    kepada: surat?.pejabat_pengirim,
                    catatan: post.pesan || post.catatan
                })
                await Surat.query().where('id', params.id).update({ status: post.status, pejabat_penerima: surat?.pejabat_pengirim })

                session.flash('alert', { type: 'success', msg: 'Surat Berhasil ' + (post.status == 5 ? 'Ditolak' : 'Diterima') })
                return response.redirect().toRoute('surat.surat_masuk.index')
        }
    }

    async arsip({ response, session, params }: any) {
        const user = session.get('user')
        const surat = await Surat.query().where('id', params.id).update({ arsipkan: true })
        await TrackSurat.create({
            surat: params.id,
            status: 10,
            dari: user.penugasans[0].id,
            kepada: user.penugasans[0].id,
            catatan: `Surat diarsipkan oleh ${user.penugasans[0].jabatanRel.nama} : ${user.nama}`
        })
        if (surat) {
            session.flash('alert', { type: 'success', msg: 'Surat Berhasil Diarsipkan' })
            return response.redirect().toRoute('surat.surat_masuk.index')
        } else {
            session.flash('alert', { type: 'danger', msg: 'Gagal Mengarsipkan Surat' })
            return response.redirect().back()
        }
    }
}