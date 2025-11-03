import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Conversation from './conversation.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Partisipan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare conversation: string

  @column()
  declare user: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Conversation, {
    foreignKey: 'conversation',
  })
  declare conversationRel: BelongsTo<typeof Conversation>

  @belongsTo(() => User, {
    foreignKey: 'user',
  })
  declare userRel: BelongsTo<typeof User>
}