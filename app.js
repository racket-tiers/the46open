const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const port = process.env.PORT || 3000
const pg = require('./db/knex')
const cookieSession = require('cookie-session')
const key = process.env.COOKIE_KEY || 'asdfasdf'
const linkQuery = require('./db/user_info')
const methodOverride = require('method-override')

app.use('/', express.static('public'))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use(cookieSession({
  name: 'session',
  keys: [key],
  maxAge: 24 * 60 * 60 * 1000
}))

// GENERATES THE LEADERBOAD ON THE MAIN PAGE
app.get('/', (req, res) => {
  linkQuery.getRankings()
        .then(data => {
          res.render('index', {data})
        })
})

app.get('/createAccount', (req, res) => {
  res.render('createAccount')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/rules', (req, res) => {
  res.render('rules')
})

// create profile
app.post('/profilecreate', (req, res) => {
  console.log('anything')
  linkQuery.seeIfUserExists().where({
    email: req.body.email
  }).first()
  .then(function (user) {
    if (user) {
      console.log(user)
// TODO TURN THIS INTO AN ALERT OF SOME KIND
      console.log('you already have an account')
      res.render('createAccount')
    } else {
      bcrypt.hash(req.body.password, 10).then(function (hash) {
        req.body.password = hash
        console.log(req.body)
// TODO STORE ALL FROM DATA
        linkQuery.storeEmailAndPassword(req.body)
        .then(function () {
// TODO REDIRECT TO CURRENT USERS PROFILE USING COOKIE TO ACCESS DATA
          res.render('profile')
        })
      })
    }
  })
})

// LOG IN TO ACCOUNT
app.post('/profile', (req, res) => {
  linkQuery.seeIfUserExists().where({
    email: req.body.email
  }).first()
  .then(function (user) {
    if (user) {
      console.log('found one')
      console.log(req.body.password)
      console.log(user.password)
      bcrypt.compare(req.body.password, user.password).then(function (data) {
        if (data) {
          // NEEDS COOKIE
          req.session.id = req.body.id
          res.redirect('profile', {data})
        } else {
          res.send('incorrect password')
        }
      })
    } else {
      res.send('invalid login')
    }
  })
})

// UPDATE ACCOUNT
app.get('/account', (req, res) => {
  // ====ENTER COOKIE STUFF HERE
  pg('user_table').select().where('id', 400).then((data) => {
    res.render('account', {data})
  })
})

// DELETE ACCOUNT
app.delete('/remove', (req, res) => {
  pg('user_table')
  .where('id', 400)
  .del()
  .then(() => {
    res.redirect('/')
  })
})

app.listen(port, function () {
  console.log('Listening on local host ' + port)
})
