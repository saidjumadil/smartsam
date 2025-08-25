// import type { HttpContext } from '@adonisjs/core/http'

import User from "#models/user"

export default class UsersController {
    async index({ view }: any) {
        const users = await User.all()
        return view.render('pages/super_admin/users', { users })
    }
}