
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_table').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_table').insert([
        {
            first_name: "Jules",
            last_name:"Perryman",
            cohort: "g46",
            slack_account: "jules@slack.com",
            phone_number:"730-530-1459",
            is_active: true,
            rating: 1200,
            campus: "Platte",
            avatar_url: "http://www.google.com"
        }

      ]);
    });
};
