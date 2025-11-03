import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Pesan from './pesan.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class LampiranPesan extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare pesan: number

  @column()
  declare file: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Pesan, {
    foreignKey: 'pesan',
  })
  declare pesanRel: BelongsTo<typeof Pesan>
}