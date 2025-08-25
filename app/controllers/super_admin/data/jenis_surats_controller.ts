// import type { HttpContext } from '@adonisjs/core/http'

import JenisSurat from "#models/jenis_surat"

export default class JenisSuratsController {
    async index({ view }: any) {
        const jenis_surats = await JenisSurat.query().orderBy('id', 'asc')
        return view.render('pages/super_admin/data/jenis_surats', { jenis_surats })
    }

    async post({ request, response, session }: any) {
        const post = request.all()
        const jenis_surat = await JenisSurat.create({ jenis: post.jenis, kode: post.kode })
        if (jenis_surat) {
            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect().back()
        }
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const jenis_surat = await JenisSurat.query().where('id', params.id).update({ jenis: post.jenis, kode: post.kode })
        if (jenis_surat) {
            session.flash('success', 'Data Berhasil Diubah')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Diubah')
            return response.redirect().back()
        }
    }

    async delete({ response, session, params }: any) {
        const jenis_surat = await JenisSurat.query().where('id', params.id).delete()
        if (jenis_surat) {
            session.flash('success', 'Data Berhasil Dihapus')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Dihapus')
            return response.redirect().back()
        }
    }
}