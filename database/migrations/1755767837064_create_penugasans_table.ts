import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'penugasans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('jabatan').unsigned().references('jabatans.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('pejabat').unsigned().references('users.username').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('status', 20).notNullable().defaultTo('aktif')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}