/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import './hook.js'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { getSSOClient } from '#services/sso_client_service'

// router.on('/').render('pages/landing').as('landing')
router.on('/').redirect('login').as('landing')
router.get('/login-alt', '#controllers/auth_controller.login_alt').as('login_alt')
router.get('/login', '#controllers/auth_controller.login').as('login')
router.get('/callback', '#controllers/auth_controller.callback').as('callback')
router.get('/test-sso', async () => {
    const client = await getSSOClient()
    return client.metadata // akan tampil client config
})
router.post('/login', '#controllers/auth_controller.login_post').as('login_post')
router.get('/logout', '#controllers/auth_controller.logout').as('logout')

router.group(() => {
    //Admin
    router.group(() => {
        router.get('/dashboard', '#controllers/super_admin/dashboard_controller.index').as('dashboard')
        router.get('/users', '#controllers/super_admin/users_controller.index').as('users')
        router.get('/roles/:id', '#controllers/super_admin/roles_controller.index').as('roles')
        router.group(() => {
            router.group(() => {
                router.get('/', '#controllers/super_admin/data/roles_controller.index').as('index')
                router.post('/', '#controllers/super_admin/data/roles_controller.post').as('post')
                router.post('/put/:id', '#controllers/super_admin/data/roles_controller.put').as('put')
                router.post('/delete/:id', '#controllers/super_admin/data/roles_controller.delete').as('delete')
            }).prefix('role').as('role')
            router.group(() => {
                router.get('/', '#controllers/super_admin/data/units_controller.index').as('index')
                router.post('/', '#controllers/super_admin/data/units_controller.post').as('post')
                router.post('/put/:id', '#controllers/super_admin/data/units_controller.put').as('put')
                router.post('/delete/:id', '#controllers/super_admin/data/units_controller.delete').as('delete')
            }).prefix('unit').as('unit')
            router.group(() => {
                router.get('/', '#controllers/super_admin/data/kategoris_controller.index').as('index')
                router.post('/', '#controllers/super_admin/data/kategoris_controller.post').as('post')
                router.post('/put/:id', '#controllers/super_admin/data/kategoris_controller.put').as('put')
                router.post('/delete/:id', '#controllers/super_admin/data/kategoris_controller.delete').as('delete')
            }).prefix('kategori').as('kategori')
            router.group(() => {
                router.get('/', '#controllers/super_admin/data/jenis_surats_controller.index').as('index')
                router.post('/', '#controllers/super_admin/data/jenis_surats_controller.post').as('post')
                router.post('/put/:id', '#controllers/super_admin/data/jenis_surats_controller.put').as('put')
                router.post('/delete/:id', '#controllers/super_admin/data/jenis_surats_controller.delete').as('delete')
            }).prefix('jenis-surat').as('jenis_surat')
            router.group(() => {
                router.get('/', '#controllers/super_admin/data/status_surats_controller.index').as('index')
                router.post('/', '#controllers/super_admin/data/status_surats_controller.post').as('post')
                router.post('/put/:id', '#controllers/super_admin/data/status_surats_controller.put').as('put')
                router.post('/delete/:id', '#controllers/super_admin/data/status_surats_controller.delete').as('delete')
            }).prefix('status-surat').as('status_surat')
        }).prefix('data').as('data')
    }).prefix('admin').as('super_admin')

    //Admin
    router.group(() => {
        router.get('/manajemen-anggota', '#controllers/admin/manajemen_anggotas_controller.index').as('manajemenAnggota')
        router.get('/manajemen-anggota/:id', '#controllers/admin/manajemen_anggotas_controller.detail').as('manajemenAnggota.detail')
        router.post('/manajemen-anggota/tambah/:jabatan', '#controllers/admin/manajemen_anggotas_controller.post').as('manajemenAnggota.post')
        router.post('/manajemen-anggota/ganti-pimpinan/:jabatan', '#controllers/admin/manajemen_anggotas_controller.gantiPimpinan').as('manajemenAnggota.gantiPimpinan')
        router.post('/manajemen-anggota/ganti-admin/:jabatan', '#controllers/admin/manajemen_anggotas_controller.gantiAdmin').as('manajemenAnggota.gantiAdmin')
        router.post('/manajemen-anggota/hapus/:penugasan', '#controllers/admin/manajemen_anggotas_controller.hapus').as('manajemenAnggota.hapus')
    }).prefix('admin').as('admin')

    //Surat
    router.group(() => {
        router.group(() => {
            router.get('/', '#controllers/surat/surat_masuks_controller.index').as('index')
            router.get('/:id', '#controllers/surat/surat_masuks_controller.detail').as('detail')
            router.post('/:id', '#controllers/surat/surat_masuks_controller.put').as('put')
        }).prefix('surat-masuk').as('surat_masuk')

        router.group(() => {
            router.get('/', '#controllers/surat/surat_keluars_controller.index').as('index')
            router.post('/', '#controllers/surat/surat_keluars_controller.post').as('post')
            router.get('/:id', '#controllers/surat/surat_keluars_controller.detail').as('detail')
        }).prefix('surat-keluar').as('surat_keluar')
    }).prefix('surat').as('surat')

    router.group(() => {
        router.get('/', '#controllers/pesans_controller.index').as('index')
        router.post('/', '#controllers/pesans_controller.post').as('post')
        router.get('/:id', '#controllers/pesans_controller.conversation').as('conversation')
        router.post('/:id', '#controllers/pesans_controller.balas').as('balas')
    }).prefix('pesan').as('pesan')

}).use(middleware.auth())
router.get('/api/notif-surat-masuk/:id', '#controllers/api_controller.notifSuratMasuk').as('notifSuratMasuk')
