
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('match').del()
    .then(function () {
      // Inserts seed entries
      return knex('match').insert([
        {
          user_1: 1,
          user_2: 2,
          winner: 1,
          user1_points: 21,
          user2_points: 0,
          date: 'Jan 2, 2017',
          user1_endorsed: false,
          user2_endorsed: false
        },
        {
          user_1: 1,
          user_2: 3,
          winner: 2,
          user1_points: 0,
          user2_points: 21,
          date: 'Jan 6, 2017',
          user1_endorsed: false,
          user2_endorsed: false
        },
        {
          user_1: 4,
          user_2: 2,
          winner: 4,
          user1_points: 21,
          user2_points: 0,
          date: 'Jan 3, 2017',
          user1_endorsed: false,
          user2_endorsed: false
        }
      ])
    })
}
