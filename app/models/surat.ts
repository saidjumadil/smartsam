import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import Lampiran from './lampiran.js'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import TrackSurat from './track_surat.js'
import TandaTangan from './tanda_tangan.js'
import Penugasan from './penugasan.js'
import StatusSurat from './status_surat.js'
import Publish from './publish.js'
import { v4 as uuidv4 } from 'uuid'
import JenisSurat from './jenis_surat.js'

export default class Surat extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare nomor_surat: string

  @column()
  declare jenis_surat: number

  @column()
  declare pejabat_pengirim: number

  @column()
  declare pejabat_penerima: number

  @column()
  declare perihal: string

  @column()
  declare tanggal_surat: DateTime

  @column()
  declare status: number

  @column()
  declare file: string

  @column()
  declare langsung_pimpinan: boolean

  @column()
  declare arsipkan: boolean

  @column()
  declare asal_surat: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Lampiran, {
    foreignKey: 'surat',
  })
  declare lampirans: HasMany<typeof Lampiran>

  @hasMany(() => TrackSurat, {
    foreignKey: 'surat',
  })
  declare trackSurats: HasMany<typeof TrackSurat>

  @hasOne(() => TandaTangan, {
    foreignKey: 'surat',
  })
  declare tandaTangan: HasOne<typeof TandaTangan>

  @hasOne(() => Publish, {
    foreignKey: 'surat',
  })
  declare publish: HasOne<typeof Publish>

  @belongsTo(() => Penugasan, {
    foreignKey: 'pejabat_pengirim',
  })
  declare pengirimRel: BelongsTo<typeof Penugasan>

  @belongsTo(() => Penugasan, {
    foreignKey: 'pejabat_penerima',
  })
  declare penerimaRel: BelongsTo<typeof Penugasan>

  @belongsTo(() => StatusSurat, {
    foreignKey: 'status',
  })
  declare statusSuratRel: BelongsTo<typeof StatusSurat>

  @belongsTo(() => JenisSurat, {
    foreignKey: 'jenis_surat',
  })
  declare jenisSuratRel: BelongsTo<typeof JenisSurat>

  @beforeCreate()
  public static async assignUuid(surat: Surat) {
    surat.id = uuidv4()
  }
}