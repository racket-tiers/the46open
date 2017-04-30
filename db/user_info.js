const pg = require('./knex')

function getRankings () {
  return pg('theOpen').select().from('user_table').orderBy('rating', 'desc')
}

function addUser (obj) {
  obj.rating = 1200
  // console.log(obj);
  return pg('user_table').insert(obj)
}

function seeIfUserExists () {
  return pg('user_table').select()
}

function getAllUsers () {
  return pg('user_table').select('id', 'first_name', 'last_name')
}

function storeEmailAndPassword (obj) {
  // console.log('got it!');
  // console.log(obj);
  return pg('user_table').insert({
    first_name: obj.first_name,
    last_name: obj.last_name,
    email: obj.email,
    password: obj.password,
    cohort: obj.cohort,
    slack_account: obj.slack_account,
    phone_number: obj.phone_number,
    rating: obj.rating,
    campus: obj.campus,
    avatar_url: obj.avatar_url,
    description: obj.description,
    is_ranked: obj.is_ranked

  })
}

function computeNewRatings (matchResults, originalRatings) {
  if (+matchResults.user1_points > +matchResults.user2_points) {
    matchResults.winner = matchResults.user_1
  } else {
    matchResults.winner = matchResults.user_2
  }
  for (let i = 0; i < originalRatings.length; i++) {
    // ENTER THE JACKSON DONOVAN RATING SYSTEM HERE ***
    if (originalRatings[i].id === +matchResults.winner) {
      originalRatings[i].rating += 10
    } else {
      originalRatings[i].rating -= 10
    }
  }
  return originalRatings
}

// UPDATES RATINGS BASED ON MATCH RESULTS. RUNS WHEN MATCH IS STORED
function updateRatings (body) {
  pg('user_table').select('id', 'rating').where('id', body.user_1).orWhere('id', body.user_2)
  .then((originalRatings) => {
    const newRatings = computeNewRatings(body, originalRatings)
    Promise.all([
      pg('user_table').update({rating: newRatings[0].rating}).where({id: newRatings[0].id}),
      pg('user_table').update({rating: newRatings[1].rating}).where({id: newRatings[1].id})
    ]).then(() => {
    })
  })
}

module.exports = {
  getRankings,
  addUser,
  seeIfUserExists,
  storeEmailAndPassword,
  getAllUsers,
  updateRatings

}
