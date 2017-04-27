const pg = require('./knex')

function getRankings() {
  return pg('theOpen').select().from('user_table').orderBy('rating','desc')
}

function addUser(obj) {
  obj.rating = 1200
  // console.log(obj);
  return pg('user_table').insert(obj)
}





function seeIfUserExists() {
  return pg('user_table').select()
}

function getAllUsers() {
  return pg('user_table').select('id' , 'first_name' , 'last_name');
}

function storeEmailAndPassword(obj) {
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

function oldRank(){
    return pg('user_table').select('rating').from('user_table').where('id', id);

}



module.exports = {
  getRankings,
  addUser,
  seeIfUserExists,
  storeEmailAndPassword,
  getAllUsers,

}
