// import type { HttpContext } from '@adonisjs/core/http'

import Conversation from "#models/conversation"
import Dibaca from "#models/dibaca"
import Jabatan from "#models/jabatan"
import LampiranPesan from "#models/lampiran_pesan"
import Partisipan from "#models/partisipan"
import Pesan from "#models/pesan"
import app from "@adonisjs/core/services/app"

export default class PesansController {
    async index({ view, session }: any) {
        const user = session.get('user')
        const partisipans = await Partisipan.query()
            .preload('conversationRel', (query) => {
                query.select('id', 'pembuat', 'perihal')
                    .preload('pembuatRel', (query) => {
                        query.select('username', 'nama')
                    })
                    .preload('pesans', (query) => {
                        query.select('id')
                            .preload('dibacas', (query) => {
                                query.select('id').where('user', user.id)
                            })
                    })
            })
            .where('user', user.id)
            .orderBy('createdAt', 'asc')
        const conversations = partisipans.map((partisipan) => {
            return {
                id: partisipan.conversationRel.id,
                pembuat: {
                    username: partisipan.conversationRel.pembuatRel.username,
                    nama: partisipan.conversationRel.pembuatRel.nama
                },
                perihal: partisipan.conversationRel.perihal,
                pesans: partisipan.conversationRel.pesans.reduce((sum, pesan) => sum + (pesan.dibacas.length === 0 ? 1 : 0), 0)
            }
        })
        const pejabat = await Jabatan.query().select('id', 'role')
            .preload('penugasans', (query) => {
                query.select('id', 'pejabat', 'status').whereIn('status', ['aktif', 'plt'])
                    .preload('pejabatRel', (query) => {
                        query.select('id', 'username', 'nama')
                    })
            })
            .where('role', 3)
        return view.render('pages/pesan/list', { conversations, pejabat })
    }

    async post({ request, response, session }: any) {
        const user = session.get('user')
        const post = request.all()
        // return post

        const conversation = await Conversation.create({ pembuat: user.id, perihal: post.perihal })

        if (conversation) {
            const pesan = await Pesan.create({ conversation: conversation.id, pengirim: user.id, isi: post.isi })
            if (pesan) {
                const lampirans = request.files('lampiran', {
                    size: '10mb',
                    extnames: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx', 'ppt', 'pptx']
                })
                if (lampirans.length > 0) {
                    for (const lampiran of lampirans) {
                        if (!lampiran.isValid) {
                            session.flash('alert', { type: 'destructive', message: 'File tidak sesuai dengan format yang diizinkan. Silahkan cek file yang anda upload.' })
                        }
                        const fileName = `${crypto.randomUUID()}.${lampiran.clientName}`
                        await lampiran.move(app.tmpPath(`uploads/pesan/conversation/${conversation.id}/pesan/${pesan.id}`), {
                            name: fileName,
                            overwrite: true
                        })
                        await LampiranPesan.create({
                            pesan: pesan.id,
                            file: fileName,
                        })
                    }
                }
            }
            post.user = [user.id, ...post.user]
            const list_partisipan = post.user.map((peserta: any) => {
                return { conversation: conversation.id, user: peserta }
            })
            const partisipan = await Partisipan.createMany(list_partisipan)

            if (partisipan && pesan) {
                session.flash('success', 'Data Berhasil Ditambahkan')
                return response.redirect('back')
            }
            else {
                session.flash('error', 'Data Gagal Ditambahkan')
                return response.redirect('back')
            }
        } else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect('back')
        }
    }

    async conversation({ view, session, params }: any) {
        const conversation: any = await Conversation.query()
            .select('id', 'perihal', 'pembuat')
            .preload('pembuatRel', (query) => {
                query.select('username', 'nama')
            })
            .preload('pesans', (query) => {
                query.select('id', 'conversation')
            })
            .where('id', params.id).first()

        conversation.pesans.forEach(async (pesan: any) => {
            await Dibaca.firstOrCreate({ pesan: pesan.id, user: session.get('user').id })
        })

        const pesans = await Pesan.query()
            .preload('pengirimRel', (query) => {
                query.select('username', 'nama')
            })
            .preload('lampiranPesans', (query) => {
                query.select('id', 'file')
            })
            .preload('dibacas', (query) => {
                query.select('id', 'user', 'created_at')
                    .preload('userRel', (query) => {
                        query.select('username', 'nama')
                    })
            })
            .where('conversation', params.id)

        // return pesans
        return view.render('pages/pesan/conversation', { pesans, conversation })
    }

    async balas({ request, response, session, params }: any) {
        const user = session.get('user')
        const post = request.all()
        const pesan = await Pesan.create({ conversation: params.id, pengirim: user.id, isi: post.isi })
        if (pesan) {
            const lampirans = request.files('lampiran')
            if (lampirans.length > 0) {
                for (const lampiran of lampirans) {
                    console.log(lampiran)
                    await lampiran.move(app.tmpPath(`uploads/pesan/conversation/${params.id}/pesan/${pesan.id}`), {
                        overwrite: true
                    })
                    await LampiranPesan.create({
                        pesan: pesan.id,
                        file: lampiran.clientName,
                    })
                }
            }
            session.flash('success', 'Data Berhasil Ditambahkan')
            return response.redirect('back')
        }
        else {
            session.flash('error', 'Data Gagal Ditambahkan')
            return response.redirect('back')
        }
    }
}