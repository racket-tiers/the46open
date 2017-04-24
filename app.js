const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

const linkQuery = require('./db/user-info')

app.use('/', express.static('public'))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  linkQuery.getAll()
	.then(data => {
  res.render('index', {data})
})
})

app.listen(port, function () {
  console.log('Listening on local host ' + port)
})
