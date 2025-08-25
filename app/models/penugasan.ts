import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Jabatan from './jabatan.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Surat from './surat.js'

export default class Penugasan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare jabatan: string

  @column()
  declare pejabat: string

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'pejabat',
    localKey: 'username'
  })
  declare pejabatRel: BelongsTo<typeof User>

  @belongsTo(() => Jabatan, {
    foreignKey: 'jabatan',
  })
  declare jabatanRel: BelongsTo<typeof Jabatan>

  @hasMany(() => Surat, {
    foreignKey: 'pejabat_pengirim',
  })
  declare pengirims: HasMany<typeof Surat>

  @hasMany(() => Surat, {
    foreignKey: 'pejabat_penerima',
  })
  declare penerimas: HasMany<typeof Surat>
}