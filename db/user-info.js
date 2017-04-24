const pg = require('./knex')



function getAll() {
	return pg('theOpen').select().from('user_table').orderBy('rating', 'desc')
}



// function deletePost(id){
// 	return pg('post').del().where('id', id)
// }


module.exports = {
	getAll,

}
