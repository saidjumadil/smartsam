import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import Surat from './surat.js'
import { v4 as uuidv4 } from 'uuid'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Lampiran extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

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

  @beforeCreate()
  public static async assignUuid(lampiran: Lampiran) {
    lampiran.id = uuidv4()
  }
}