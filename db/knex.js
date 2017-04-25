const config = require('../knexfile')

const environment = process.env.NODE_ENV || 	'development'

const pg = require('knex')(config[environment])

module.exports = pg
