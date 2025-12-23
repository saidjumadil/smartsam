import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Unit from './unit.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role from './role.js'
import Penugasan from './penugasan.js'
import { v4 as uuidv4 } from 'uuid'


export default class Jabatan extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare id_pusat: number

  @column()
  declare nama: string

  @column()
  declare unit: string

  @column()
  declare role: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Unit, {
    foreignKey: 'unit',
  })
  declare unitRel: BelongsTo<typeof Unit>

  @belongsTo(() => Role, {
    foreignKey: 'role',
  })
  declare roleRel: BelongsTo<typeof Role>

  @hasMany(() => Penugasan, {
    foreignKey: 'jabatan',
  })
  declare penugasans: HasMany<typeof Penugasan>

  @beforeCreate()
  public static async assingUuid(jabatan: Jabatan) {
    jabatan.id = uuidv4()
  }
}