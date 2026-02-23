// import type { HttpContext } from '@adonisjs/core/http'

import Partisipan from "#models/partisipan"
import Penugasan from "#models/penugasan"
import Surat from "#models/surat"

export default class ApiController {
    async notifSuratMasuk({ params }: any) {
        const penugasans = await Penugasan.query().select('id', 'pejabat').where('pejabat', params.id)
        const pejabatId = penugasans.map((penugasan: any) => penugasan.id)

        const riwayats = await Surat.query().select('id').whereIn('pejabat_penerima', pejabatId).andWhere('arsipkan', false).andWhereNotIn('status', [5, 6])
        return riwayats.length
    }

    async notifPesanMasuk({ params }: any) {
        const partisipan = await Partisipan.query()
            .select('partisipans.conversation', 'dibacas.pesan')
            .leftJoin('pesans', 'pesans.conversation', '=', 'partisipans.conversation')
            .leftJoin('dibacas', (query) => {
                query.on('pesans.id', '=', 'dibacas.pesan').andOnVal('dibacas.user', params.id)
            })
            .where('partisipans.user', params.id)
        const dibaca = partisipan.reduce((sum, pesan) => sum + (pesan.$extras.pesan === null ? 1 : 0), 0)
        return dibaca
    }
}