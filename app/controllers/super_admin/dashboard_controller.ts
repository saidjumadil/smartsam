// import type { HttpContext } from '@adonisjs/core/http'

import StatusSurat from "#models/status_surat"
import Surat from "#models/surat"
import TrackSurat from "#models/track_surat"

export default class DashboardController {
    async index({ view, session }: any) {
        const user = session.get('user')
        // console.log(user)
        const status_surat = await StatusSurat.query().select('id', 'status')
            .preload('surats', (query) => {
                query.select('id').where('pejabat_pengirim', user.penugasans[0].id)
            })
            .whereIn('id', [1, 2, 3, 4, 5, 6]).orderBy('id')
        const suratStatus = status_surat.map((surat) => {
            return {
                status: surat.status,
                jumlah: surat.surats.length,
            }
        })
        const surats = await Surat.query().where('pejabat_pengirim', user.penugasans[0].id)
        const suratIds = surats.map((surat) => surat.id)
        const track_surats = await TrackSurat.query()
            .preload('statusSuratRel', (query) => {
                query.select('id', 'status')
            })
            .preload('suratRel', (query) => {
                query.select('id', 'nomor_surat', 'pejabat_penerima', 'jenis_surat')
                    .preload('penerimaRel', (query) => {
                        query.select('jabatan', 'pejabat')
                            .preload('pejabatRel', (query) => {
                                query.select('nama')
                            })
                    })
                    .preload('jenisSuratRel', (query) => {
                        query.select('id', 'jenis')
                    })
            })
            .whereIn('surat', suratIds).orderBy('created_at', 'desc').limit(5)

        const tindak = await Surat.query()
            .where('arsipkan', false)
            .andWhere('pejabat_penerima', user.penugasans[0].id)
            .preload('penerimaRel', (query) => {
                query.select('id', 'jabatan', 'pejabat')
                    .preload('pejabatRel', (query) => {
                        query.select('username', 'nama')
                    })
                    .preload('jabatanRel', (query) => {
                        query.select('id', 'unit')
                            .preload('unitRel', (query) => {
                                query.select('id', 'nama')
                            })
                    })
            })
            .preload('jenisSuratRel', (query) => {
                query.select('id', 'jenis')
            })
            .orderBy('created_at', 'desc')
            .limit(5)

        return view.render('pages/super_admin/dashboard', { suratStatus, track_surats, tindak })
    }
}