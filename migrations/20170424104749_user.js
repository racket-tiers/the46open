
exports.up = function (knex, Promise) {
  return knex.schema.createTable('user_table', function (table) {
    table.increments()
    table.text('first_name').notNull
    table.text('last_name').notNull
    table.text('cohort')
    table.text('slack_account')
    table.text('phone_number')
    table.boolean('is_active')
    table.integer('rating')
    table.text('campus')
    table.text('avatar_url')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('user_table')
}
