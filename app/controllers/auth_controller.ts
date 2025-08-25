// import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
    async login({ response }: any) {
        return 'login'
        return response.redirect('/login')
    }
}