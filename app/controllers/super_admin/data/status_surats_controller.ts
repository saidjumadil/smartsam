// import type { HttpContext } from '@adonisjs/core/http'

import StatusSurat from "#models/status_surat"

export default class StatusSuratsController {
    async index({ view }: any) {
        const status_surats = await StatusSurat.query().orderBy('id', 'asc')
        return view.render('pages/super_admin/data/status_surats', { status_surats })
    }

    async post({ request, response, session }: any) {
        const post = request.all()
        const status_surat = await StatusSurat.create({ status: post.status })
        if (status_surat) {
            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect().back()
        }
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const status_surat = await StatusSurat.query().where('id', params.id).update({ status: post.status })
        if (status_surat) {
            session.flash('success', 'Data Berhasil Diubah')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Diubah')
            return response.redirect().back()
        }
    }

    async delete({ response, session, params }: any) {
        const status_surat = await StatusSurat.query().where('id', params.id).delete()
        if (status_surat) {
            session.flash('success', 'Data Berhasil Dihapus')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Dihapus')
            return response.redirect().back()
        }
    }
}