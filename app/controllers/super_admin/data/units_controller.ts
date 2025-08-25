// import type { HttpContext } from '@adonisjs/core/http'

import Unit from "#models/unit"

export default class UnitsController {
    async index({ view }: any) {
        const units = await Unit.query().orderBy('id', 'asc')
        return view.render('pages/super_admin/data/units', { units })
    }

    async post({ request, response, session }: any) {
        const post = request.all()
        const unit = await Unit.create({ nama: post.nama, kode: post.kode })
        if (unit) {
            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect().back()
        }
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const unit = await Unit.query().where('id', params.id).update({ nama: post.nama, kode: post.kode })
        if (unit) {
            session.flash('success', 'Data Berhasil Diubah')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Diubah')
            return response.redirect().back()
        }
    }

    async delete({ response, session, params }: any) {
        const unit = await Unit.query().where('id', params.id).delete()
        if (unit) {
            session.flash('success', 'Data Berhasil Dihapus')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Dihapus')
            return response.redirect().back()
        }
    }
}