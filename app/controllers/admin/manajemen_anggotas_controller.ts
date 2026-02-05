// import type { HttpContext } from '@adonisjs/core/http'

import Penugasan from "#models/penugasan"
import Unit from "#models/unit"
import User from "#models/user"

export default class ManajemenAnggotasController {
    async index({ view, session, response }: any) {
        const user = session.get('user')
        console.log(user.penugasans[0].jabatanRel)
        if (user.penugasans[0].jabatanRel.role == 1) {
            const units = await Unit.query().orderBy('id', 'asc')
            return view.render('pages/admin/manajemen_anggotas', { units })
        } else {
            return response.redirect().toRoute('admin.manajemenAnggota.detail', { id: user.penugasans[0].jabatanRel.unit })
        }
    }

    async detail({ view, params }: any) {
        const unit: any = await Unit.query()
            .select('id', 'nama')
            .preload('jabatans', (query) => {
                query.select('id', 'nama', 'role', 'unit')
                    .preload('penugasans', (query) => {
                        query.select('id', 'pejabat', 'jabatan', 'status').whereIn('status', ['aktif', 'plt'])
                            .preload('pejabatRel', (query) => {
                                query.select('username', 'nama')
                            })
                    })
            })
            .where('id', params.id).first()
        const jabatan: any = {}
        unit.jabatans.forEach((item: any) => {
            jabatan[item.role] = item.id
        })
        console.log(unit.jabatans[0].penugasans)

        const anggota = await Penugasan.query()
            .preload('pejabatRel', (query) => {
                query.select('username', 'nama')
            })
            .where('jabatan', jabatan[5])
            .where('status', '!=', 'tidak aktif')

        const users = await User.all()
        return view.render('pages/admin/manajemen_anggota_detail', { unit, jabatan, users, anggota })
    }

    //Hapus Anggota
    async hapus({ response, session, params }: any) {
        const penugasans = await Penugasan.query()
            .where('id', params.penugasan)
            .update({ status: 'tidak aktif' })

        if (penugasans) {
            session.flash('success', 'Data Berhasil Dihapus')
        } else {
            session.flash('error', 'Data Gagal Dihapus')
        }
        return response.redirect().back()
    }

    //Tambah Anggota
    async post({ request, response, session, params }: any) {
        const post = request.all()
        const cekPenugasan = await Penugasan.query()
            .preload('jabatanRel', (query) => {
                query.select('id', 'nama')
            })
            .where('pejabat', post.pejabat).andWhereIn('status', ['aktif', 'plt']).first()

        if (cekPenugasan) {
            session.flash('alert', { type: 'destructive', msg: `Data Gagal Ditambahkan, Pejabat sedang bertugas sebagai ${cekPenugasan.jabatanRel.nama}` })
            return response.redirect().back()
        }

        const penugasan = await Penugasan.create({
            pejabat: post.pejabat,
            jabatan: params.jabatan,
            status: 'aktif'
        })

        if (penugasan) {
            session.flash('alert', { type: 'success', msg: 'Data Berhasil Ditambahkan' })
            return response.redirect().back()
        } else {
            session.flash('alert', { type: 'destructive', msg: 'Data Gagal Ditambahkan' })
            return response.redirect().back()
        }
    }

    async gantiPimpinan({ response, request, session, params }: any) {
        const post = request.all()
        const updatePenugasanLama = await Penugasan.query()
            .where('jabatan', params.jabatan)
            .update({ status: 'tidak aktif' })

        const updatePenugasanBaru = await Penugasan.create({
            pejabat: post.pejabat,
            jabatan: params.jabatan,
            status: post.status
        })

        if (updatePenugasanLama && updatePenugasanBaru) {
            session.flash('alert', { type: 'success', msg: 'Data Berhasil Diubah' })
        } else {
            session.flash('alert', { type: 'destructive', msg: 'Data Gagal Diubah' })
        }
        return response.redirect().back()
    }

    async gantiAdmin({ response, request, session, params }: any) {
        const post = request.all()

        const penugasanLama: any = await Penugasan.query()
            .where('jabatan', params.jabatan).andWhere('status', '!=', 'tidak aktif').first()
        const penugasanBaru: any = await Penugasan.query()
            .where('pejabat', post.pejabat).andWhere('status', '!=', 'tidak aktif').first()

        if (penugasanLama) {
            const pejabatLama = penugasanLama?.pejabat
            penugasanLama.status = 'tidak aktif'
            await penugasanLama.save()

            await Penugasan.create({
                pejabat: pejabatLama,
                jabatan: post.jabatanAnggota,
                status: "aktif"
            })
        }
        penugasanBaru.status = 'tidak aktif'

        await penugasanBaru.save()

        const updatePenugasanBaru = await Penugasan.create({
            pejabat: post.pejabat,
            jabatan: params.jabatan,
            status: "aktif"
        })

        if (updatePenugasanBaru) {
            session.flash('alert', { type: 'success', msg: 'Data Berhasil Diubah' })
        } else {
            session.flash('alert', { type: 'destructive', msg: 'Data Gagal Diubah' })
        }
        return response.redirect().back()
    }
}