
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_info').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_info').insert([
        {
          user_id: 1,
          email: "jules.perryman@gmail.com",
          password: "password",
      },
        {
          user_id: 2,
          email: "michelle@gmail.com",
          password: "elephants",
      }
      
      ])
    })
}
