
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('match').del()
    .then(function () {
      // Inserts seed entries
      return knex('match').insert([
        {
          user_1: 100,
          user_2: 200,
          winner: 100,
          user1_points: 21,
          user2_points: 0,
          date: 'Jan 2, 2017',
          user1_endorsed: false,
          user2_endorsed: false
        },
        {
          user_1: 100,
          user_2: 300,
          winner: 300,
          user1_points: 0,
          user2_points: 21,
          date: 'Jan 6, 2017',
          user1_endorsed: false,
          user2_endorsed: false
        },
        {
          user_1: 400,
          user_2: 200,
          winner: 400,
          user1_points: 21,
          user2_points: 0,
          date: 'Jan 3, 2017',
          user1_endorsed: false,
          user2_endorsed: false
        }
      ])
    })
}
