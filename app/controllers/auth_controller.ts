// import type { HttpContext } from '@adonisjs/core/http'

import User from "#models/user"
import { getSSOClient } from "#services/sso_client_service"

export default class AuthController {
    async login({ response }: any) {

        // return view.render('pages/login')

        const client = await getSSOClient()
        const url = client.authorizationUrl({
            scope: 'openid profile email',
        })
        return response.redirect(url)

    }

    async callback({ request, response, session, auth }: any) {
        const client = await getSSOClient()

        // ambil query parameter code & state
        const params = client.callbackParams(request.request)

        // callback() butuh redirectUri sebagai argumen pertama
        const tokenSet = await client.callback(
            process.env.SSO_CALLBACK_URL || 'http://103.132.124.193/callback',
            params,
            // { exchangeBody: { client_secret: process.env.SSO_CLIENT_SECRET } } // kadang dibutuhkan
        )

        const userInfo: any = await client.userinfo(tokenSet.access_token!)
        // return userInfo

        // Simpan user ke session
        const user = await User.query()
            .where('username', userInfo.preferred_username)
            .preload('penugasans', (query) => {
                query.select('id', 'pejabat', 'status', 'jabatan')
                    .whereIn('status', ['aktif', 'plt'])
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'unit', 'role')
                    })
            })
            .first()

        if (!user) {
            console.log("NIP atau Password salah")
            session.flash('notif', { tipe: 'danger', msg: 'NPM atau Password salah' })
            return response.redirect().back()
        }

        session.put('user', user)
        await auth.use('web').login(user)
        return response.redirect().toRoute('super_admin.dashboard')
    }

    async login_post({ request, response, auth, session }: any) {
        const post = request.all()
        console.log(post)
        const user = await User.query()
            .where('username', post.username)
            .preload('penugasans', (query) => {
                query.select('id', 'pejabat', 'status', 'jabatan')
                    .whereIn('status', ['aktif', 'plt'])
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'unit', 'role')
                    })
            })
            .first()

        if (!user) {
            console.log("NIP atau Password salah")
            session.flash('notif', { tipe: 'danger', msg: 'NPM atau Password salah' })
            return response.redirect().back()
        }

        session.put('user', user)
        await auth.use('web').login(user)
        return response.redirect().toRoute('super_admin.dashboard')
    }

    public async logout({ auth, response }: any) {
        await auth.use('web').logout()
        return response.redirect().toRoute('login')
    }
}