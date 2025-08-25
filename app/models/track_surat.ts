import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Surat from './surat.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Penugasan from './penugasan.js'
import StatusSurat from './status_surat.js'

export default class TrackSurat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare surat: string

  @column()
  declare dari: number

  @column()
  declare kepada: number

  @column()
  declare catatan: string

  @column()
  declare status: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Surat, {
    foreignKey: 'surat',
  })
  declare suratRel: BelongsTo<typeof Surat>

  @belongsTo(() => Penugasan, {
    foreignKey: 'dari',
  })
  declare dariRel: BelongsTo<typeof Penugasan>

  @belongsTo(() => Penugasan, {
    foreignKey: 'kepada',
  })
  declare kepadaRel: BelongsTo<typeof Penugasan>

  @belongsTo(() => StatusSurat, {
    foreignKey: 'status',
  })
  declare statusRel: BelongsTo<typeof StatusSurat>
}