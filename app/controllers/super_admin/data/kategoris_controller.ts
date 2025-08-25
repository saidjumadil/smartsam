// import type { HttpContext } from '@adonisjs/core/http'

import Kategori from "#models/kategori"

export default class KategorisController {
    async index({ view }: any) {
        const kategoris = await Kategori.query().orderBy('id', 'asc')
        return view.render('pages/super_admin/data/kategoris', { kategoris })
    }

    async post({ request, response, session }: any) {
        const post = request.all()
        const kategori = await Kategori.create({ nama: post.nama })
        if (kategori) {
            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect().back()
        }
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const kategori = await Kategori.query().where('id', params.id).update({ nama: post.nama })
        if (kategori) {
            session.flash('success', 'Data Berhasil Diubah')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Diubah')
            return response.redirect().back()
        }
    }

    async delete({ response, session, params }: any) {
        const kategori = await Kategori.query().where('id', params.id).delete()
        if (kategori) {
            session.flash('success', 'Data Berhasil Dihapus')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Dihapus')
            return response.redirect().back()
        }
    }

}