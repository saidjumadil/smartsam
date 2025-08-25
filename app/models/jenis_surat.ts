import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Surat from './surat.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class JenisSurat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare jenis: string

  @column()
  declare kode: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Surat, {
    foreignKey: 'jenis_surat',
  })
  declare surats: HasMany<typeof Surat>
}