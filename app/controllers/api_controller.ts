// import type { HttpContext } from '@adonisjs/core/http'

import Penugasan from "#models/penugasan"
import Surat from "#models/surat"

export default class ApiController {
    async notifSuratMasuk({ params }: any) {
        const penugasan = await Penugasan.query()
            .preload('jabatanRel', (query) => {
                query.select('id', 'role')
            }).where('id', params.id).first()
        // console.log(penugasan?.jabatanRel.role)
        const jumlahSuratMasuk = await Surat.query().where('status', penugasan?.jabatanRel.role == 4 ? 1 : 3).andWhere('pejabat_penerima', params.id).count('*').first()
        return jumlahSuratMasuk?.$extras.count
    }
}