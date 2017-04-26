
exports.seed = function (knex, Promise) {
  return knex('match').del()
    .then(function () {
      return knex('user_table').del()
    })
}
