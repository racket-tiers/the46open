
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_table').del()
    .then(function () {
      // Inserts seed entries
      return knex('user_table').insert([
        {
          id: 1,
          first_name: 'Jules',
          last_name: 'Perryman',
          cohort: 'g46',
          slack_account: 'jules@slack.com',
          phone_number: '730-530-1459',
          is_active: true,
          rating: 1200,
          campus: 'Platte',
          avatar_url: 'http://www.google.com'
        },
        {
          id: 2,
          first_name: 'Michelle',
          last_name: 'Bergquist',
          cohort: 'g46',
          slack_account: 'michelle@slack.com',
          phone_number: '303-123-4567',
          is_active: true,
          rating: 1100,
          campus: 'Platte',
          avatar_url: 'http://www.yahoo.com'
        },
        {
          id: 3,
          first_name: 'Jackson',
          last_name: 'Donvan',
          cohort: 'g46',
          slack_account: 'jackson@slack.com',
          phone_number: '303-888-8888',
          is_active: true,
          rating: 1000,
          campus: 'Platte',
          avatar_url: 'http://www.cnn.com'
        },
        {
          id: 4,
          first_name: 'James',
          last_name: 'Schultz',
          cohort: 'g46',
          slack_account: 'james@slack.com',
          phone_number: '303-111-1111',
          is_active: true,
          rating: 900,
          campus: 'Platte',
          avatar_url: 'http://www.youtube.com'
        }

      ])
    })
}
