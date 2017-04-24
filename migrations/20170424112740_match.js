
exports.up = function (knex, Promise) {
  return knex.schema.createTable('match', function (table) {
    table.increments()
    table.integer('user_1').references('user_table.id'),
    table.integer('user_2').references('user_table.id'),
    table.integer('winner').references('user_table.id'),
    table.integer('user1_points'),
    table.integer('user2_points'),
    table.date('date'),
    table.boolean('user1_endorsed'),
    table.boolean('user2_endorsed')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('match')
}
