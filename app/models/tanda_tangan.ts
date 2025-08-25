import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import Penugasan from './penugasan.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Surat from './surat.js'
import { v4 as uuidv4 } from 'uuid'

export default class TandaTangan extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare surat: string

  @column()
  declare penugasan: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Penugasan, {
    foreignKey: 'penugasan',
  })
  declare penugasanRel: BelongsTo<typeof Penugasan>

  @belongsTo(() => Surat, {
    foreignKey: 'surat',
  })
  declare suratRel: BelongsTo<typeof Surat>

  @beforeSave()
  public static async assignUuid(tandaTangan: TandaTangan) {
    tandaTangan.id = uuidv4()
  }
}