import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'track_surats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('surat').unsigned().references('surats.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('dari').unsigned().references('penugasans.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('kepada').unsigned().references('penugasans.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.text('catatan').nullable()
      table.integer('status').unsigned().references('status_surats.id').onDelete('CASCADE').onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}