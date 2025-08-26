// import type { HttpContext } from '@adonisjs/core/http'

import StatusSurat from "#models/status_surat"
import Surat from "#models/surat"

export default class DashboardController {
    async index({ view }: any) {
        const status_surat = await StatusSurat.query().select('id', 'status')
            .preload('surats', (query) => {
                query.select('id')
            })
        const suratStatus = status_surat.map((surat) => {
            return {
                status: surat.status,
                jumlah: surat.surats.length,
            }
        })
        return view.render('pages/super_admin/dashboard', { suratStatus })
    }
}