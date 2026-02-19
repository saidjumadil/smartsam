// import type { HttpContext } from '@adonisjs/core/http'

import Jabatan from "#models/jabatan"
import Role from "#models/role"
import Unit from "#models/unit"

export default class JabatansController {
    async index({ view }: any) {
        const jabatans = await Jabatan.query()
            .preload('roleRel', (query) => {
                query.select('id', 'role')
            })
            .preload('unitRel', (query) => {
                query.select('id', 'nama', 'jenis')
            })
            .orderBy('role', 'asc')
        const roles = await Role.query().whereNotIn('id', [3, 4, 5]).orderBy('id', 'asc')
        const units = await Unit.query().orderBy('id', 'asc')
        return view.render('pages/super_admin/jabatan', { jabatans, roles, units })
    }

    async post({ request, response, session }: any) {
        const post = request.all()
        const jabatan = await Jabatan.create({ role: post.role, unit: post.unit })
        if (jabatan) {
            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect().back()
        }
    }

    async put({ request, response, session, params }: any) {
        const post = request.all()
        const jabatan = await Jabatan.query().where('id', params.id).update({ role: post.role, unit: post.unit })
        if (jabatan) {
            session.flash('success', 'Data Berhasil Diubah')
            return response.redirect().back()
        } else {
            session.flash('error', 'Data Gagal Diubah')
            return response.redirect().back()
        }
    }
}