import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Pesan from './pesan.js'
import Partisipan from './partisipan.js'


export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare pembuat: string

  @column()
  declare perihal: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'pembuat'
  })
  declare pembuatRel: BelongsTo<typeof User>

  @hasMany(() => Pesan, {
    foreignKey: 'conversation',
  })
  declare pesans: HasMany<typeof Pesan>

  @hasMany(() => Partisipan, {
    foreignKey: 'conversation',
  })
  declare partisipans: HasMany<typeof Partisipan>

  @beforeCreate()
  public static async assingUuid(conversation: Conversation) {
    conversation.id = uuidv4()
  }
}