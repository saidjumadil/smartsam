// import type { HttpContext } from '@adonisjs/core/http'

import Partisipan from "#models/partisipan"
import Penugasan from "#models/penugasan"
import Surat from "#models/surat"
import TrackSurat from "#models/track_surat"
import app from "@adonisjs/core/services/app"

export default class ApiController {
    async notifSuratMasuk({ params }: any) {
        const penugasans = await Penugasan.query().select('id', 'pejabat').where('pejabat', params.id).firstOrFail()

        const riwayats = await Surat.query().select('id').where('pejabat_penerima', penugasans?.id).andWhere('arsipkan', false).andWhereNotIn('status', [5, 6])
        console.log(riwayats.length)
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

    async getSurat({ params, session, response }: any) {
        const user = session.get('user')
        console.log(user)
        const surats: any = TrackSurat.query().select('surat', 'dari', 'kepada')
            .where('dari', user.penugasans[0].id)
            .orWhere('kepada', user.penugasans[0].id)
            .andWhere('id', params.id)
            .preload('suratRel', (query) => {
                query.select('file')
            })
            .first()

        if (surats) {
            return response.redirect(app.tmpPath(`uploads/surat/${surats.surat}/${surats.suratRel.file}`))
        } else {
            return "Anda Tidak Memiliki Akses Surat Ini"
        }
    }
}