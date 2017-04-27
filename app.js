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

app.get('/profile/:id', (req, res) => {
  linkQuery.seeIfUserExists().where({
    id: req.params.id
  }).first().then(function (data) {
    res.render('profile', data)
  })
})

// create profile
app.post('/profilecreate', (req, res) => {
  linkQuery.seeIfUserExists().where({
    email: req.body.email
  }).first()
  .then(function (user) {
    if (user) {
      console.log('you already have an account')
      res.render('createAccount')
    } else {
      bcrypt.hash(req.body.password, 10)
      .then(function (hash) {
        req.body.password = hash
        linkQuery.storeEmailAndPassword(req.body).then(function () {
          linkQuery.seeIfUserExists().where({
            email: req.body.email
          }).first().then(function (user) {
            res.redirect('/profile/' + user.id)
          })
        })
      }
  )
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
      bcrypt.compare(req.body.password, user.password).then(function (data) {
        if (data) {
          req.session.id = user.id
          res.redirect('/profile/' + user.id)
        } else {
          res.send('incorrect password')
        }
      })
    } else {
      res.send('invalid login')
    }
  })
})

// LOAD ACCOUNT SETTINGS
app.get('/account/:id', (req, res) => {
  linkQuery.seeIfUserExists().where({
    id: req.params.id
  }).first().then(function (data) {
    res.render('account', data)
  })
})

// DELETE ACCOUNT, FROM ACCOUNT SETTINGS PAGE
app.delete('/remove/:id', (req, res) => {
  pg('user_table')
  .where({id: req.params.id})
  .del()
  .then((id) => {
    console.log('user was deleted')
    res.redirect('/')
  })
})


//Find Available Users



// UPDATE ACCOUNT, FROM ACCOUNT SETTINGS PAGE
app.put('/update/:id', (req, res) => {
  pg('user_table')
  .update(req.body)
  .where({id: req.params.id})
  .returning('id')
    .then((id) => {
      res.redirect('/profile/' + id)
    })
})

// return pg('link').where('id', obj['id']).update('votes', +obj['votes'] + 1)

app.listen(port, function () {
  console.log('Listening on local host ' + port)
})
