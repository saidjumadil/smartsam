import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Conversation from './conversation.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import LampiranPesan from './lampiran_pesan.js'
import Dibaca from './dibaca.js'

export default class Pesan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare conversation: string

  @column()
  declare pengirim: string

  @column()
  declare isi: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Conversation, {
    foreignKey: 'conversation',
  })
  declare conversationRel: BelongsTo<typeof Conversation>

  @belongsTo(() => User, {
    foreignKey: 'pengirim',
  })
  declare pengirimRel: BelongsTo<typeof User>

  @hasMany(() => LampiranPesan, {
    foreignKey: 'pesan',
  })
  declare lampiranPesans: HasMany<typeof LampiranPesan>

  @hasMany(() => Dibaca, {
    foreignKey: 'pesan',
  })
  declare dibacas: HasMany<typeof Dibaca>
}