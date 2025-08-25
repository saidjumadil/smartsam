import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import Jabatan from './jabatan.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'

export default class Unit extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nama: string

  @column()
  declare kode: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Jabatan, {
    foreignKey: 'unit',
  })
  declare jabatans: HasMany<typeof Jabatan>

  @beforeCreate()
  public static async assignUuid(unit: Unit) {
    unit.id = uuidv4()
  }
}