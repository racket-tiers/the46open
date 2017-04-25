const pg = require('./knex')

function getRankings() {
  return pg('theOpen').select().from('user_table').orderBy('rating','desc')
}
function addUser(obj) {
  obj.rating = 1200
  console.log(obj);
  return pg('user_table').insert(obj)
}





// function seeIfUserExists() {
//   return pg('user_table').select()
// }
// function storeEmailAndPassword(obj, hashedPassword) {
//   return pg('user_table').insert({
//     email: obj.email,
//     password: obj.password
//   })
// }




module.exports = {
  getRankings,
  addUser
}
