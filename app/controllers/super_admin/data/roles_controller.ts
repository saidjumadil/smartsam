// import type { HttpContext } from '@adonisjs/core/http'

import Role from "#models/role"

export default class RolesController {
    async index({ view }: any) {
        const roles = await Role.query().orderBy('id', 'asc')
        return view.render('pages/super_admin/data/roles', { roles })
    }

    async post({ request, response, session }: any) {
        const post = request.all()
        const role = await Role.create({ nama: post.nama })
        if (role) {
            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect().back()
        }
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const role = await Role.query().where('id', params.id).update({ nama: post.nama })
        if (role) {
            session.flash('success', 'Data Berhasil Diubah')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Diubah')
            return response.redirect().back()
        }
    }

    async delete({ response, session, params }: any) {
        const role = await Role.query().where('id', params.id).delete()
        if (role) {
            session.flash('success', 'Data Berhasil Dihapus')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Dihapus')
            return response.redirect().back()
        }
    }
}