import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Jabatan from './jabatan.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'

export default class Unit extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare id_pusat: number

  @column()
  declare id_induk: number

  @column()
  declare nama: string

  @column()
  declare jenis: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Jabatan, {
    foreignKey: 'unit',
  })
  declare jabatans: HasMany<typeof Jabatan>

  @belongsTo(() => Unit, {
    foreignKey: 'id_induk',
  })
  declare unitRel: BelongsTo<typeof Unit>

  @hasMany(() => Unit, {
    foreignKey: 'id_induk',
    localKey: 'id_pusat',
  })
  declare units: HasMany<typeof Unit>

  @beforeCreate()
  public static async assignUuid(unit: Unit) {
    unit.id = uuidv4()
  }
}