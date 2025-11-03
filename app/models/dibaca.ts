import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Pesan from './pesan.js'

export default class Dibaca extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pesan: number

  @column()
  declare user: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user',
  })
  declare userRel: BelongsTo<typeof User>

  @belongsTo(() => Pesan, {
    foreignKey: 'pesan',
  })
  declare pesanRel: BelongsTo<typeof Pesan>
}