// import type { HttpContext } from '@adonisjs/core/http'

import Jabatan from "#models/jabatan"
import Role from "#models/role"

export default class RolesController {
    async index({ view, params }: any) {
        const role = await Role.findOrFail(params.id)
        const jabatans = await Jabatan.query()
            .preload('penugasans', (query) => {
                query.select('id', 'pejabat', 'status')
                    .where('status', 'aktif')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    })
            })
            .preload('unitRel', (query) => {
                query.select('nama', 'jenis')
            })
            .where('role', params.id)
        // console.log(jabatans[0].penugasans[0].pejabatRel.username)
        return view.render('pages/super_admin/roles', { role, jabatans })
    }
}