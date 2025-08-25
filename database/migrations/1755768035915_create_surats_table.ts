import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'surats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().unique().primary()
      table.string('nomor_surat').notNullable().unique()
      table.integer('jenis_surat').unsigned().references('jenis_surats.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('pejabat_pengirim').unsigned().references('penugasans.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('pejabat_penerima').unsigned().references('penugasans.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.date('tanggal_surat').notNullable()
      table.integer('status').unsigned().references('status_surats.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.boolean('arsipkan').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}