// import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
    async index({ view }: any) {
        return view.render('pages/super_admin/dashboard')
    }
}