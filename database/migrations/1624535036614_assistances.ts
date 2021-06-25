import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Assistances extends BaseSchema {
  protected tableName = 'assistances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('ip').notNullable()
      table.string('user_device_id').notNullable()
      table.integer('year').notNullable()
      table.integer('month').notNullable()
      table.integer('day').notNullable()
      table.time('time').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
