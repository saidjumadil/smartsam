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

router.on('/').render('pages/home')
router.get('/login', '#controllers/auth_controller.login').as('login')

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
}).prefix('super-admin').as('super_admin')
