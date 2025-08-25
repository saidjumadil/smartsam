import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import Surat from './surat.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'

export default class Publish extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare surat: string

  @column()
  declare ketegori: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Surat, {
    foreignKey: 'surat',
  })
  declare surats: HasMany<typeof Surat>

  @beforeSave()
  public static async assingUuid(publish: Publish) {
    publish.id = uuidv4()
  }
}