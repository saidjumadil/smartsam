import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Surat from './surat.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Lampiran extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare surat: string

  @column()
  declare source: string

  @column()
  declare tipe: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Surat, {
    foreignKey: 'surat',
  })
  declare suratRel: BelongsTo<typeof Surat>
}