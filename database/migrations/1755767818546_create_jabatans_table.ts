import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jabatans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').notNullable().unique().primary()
      table.string('nama', 100).unique()
      table.uuid('unit').unsigned().references('units.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('role').unsigned().references('roles.id').onDelete('CASCADE').onUpdate('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}