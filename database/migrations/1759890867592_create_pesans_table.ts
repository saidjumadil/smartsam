import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pesans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('conversation').unsigned().references('conversations.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.uuid('pengirim').unsigned().references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('isi')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}