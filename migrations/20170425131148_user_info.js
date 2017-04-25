
exports.up = function (knex, Promise) {
  return knex.schema.createTable('user_info', function (table) {
    table.increments()
    table.integer('user_id').references('user_table.id')
    table.text('email').notNull
    table.text('password').notNull

  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('user_info')
}
