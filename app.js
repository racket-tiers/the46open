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
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use(cookieSession({
  name: 'session',
  keys: [key],
  maxAge: 24 * 60 * 60 * 1000
}))

// GENERATES THE LEADERBOAD ON THE MAIN PAGE
app.get('/', (req, res) => {
<<<<<<< HEAD
=======
    // API CALL HERE
    // let url= 'http://quotes.stormconsultancy.co.uk/random.json'
>>>>>>> 5bff287b7a424295216203aea1d77a26258dd9c0

  linkQuery.getRankings()
        .then(data => {
          res.render('index', {
            data
          })
        })
})

app.get('/createAccount', (req, res) => {
  res.render('createAccount')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/about/:id', (req, res) => {
  res.render('about')
})

app.get('/rules', (req, res) => {
  res.render('rules')
})

app.get('/rules/:id', (req, res) => {
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
    res.render('account', {data: data, currentId: req.params.id})
  })
})

// DELETE ACCOUNT, FROM ACCOUNT SETTINGS PAGE
app.delete('/remove/:id', (req, res) => {
  pg('user_table')
        .where({
          id: req.params.id
        })
        .del()
        .then((id) => {
          res.redirect('/')
        })
})

// Find Available Users

// UPDATE ACCOUNT, FROM ACCOUNT SETTINGS PAGE
app.put('/update/:id', (req, res) => {
  pg('user_table')
        .update(req.body)
        .where({
          id: req.params.id
        })
        .returning('id')
        .then((id) => {
          res.redirect('/profile/' + id)
        })
})

// Log new match results
app.get('/logmatch/:id', (req, res) => {
  linkQuery.seeIfUserExists().where({
    id: req.params.id
  })
  linkQuery.getAllUsers()
        .then(function (data) {
          res.render('logmatch', {data: data, currentId: req.params.id})
        })
})

// storing match results
app.post('/storematch', (req, res) => {
  pg('match')
        .insert(req.body)
        .returning('id')
        .then((id) => {
          res.redirect('/')
        })
})

// CREATING HISTORY FOR USERs
app.get('/history/:id', (req, res) => {
  pg.from('user_table')
    .innerJoin('match', 'user_table.id', 'match.user_1')
    .select().where('user_1', req.params.id).orWhere('user_2', req.params.id)
    .then(function (data) {
      const pushOppArray = []
      for (let i = 0; i < data.length; i++) {
        pushOppArray.push(pg('user_table').select('first_name').where('user_table.id', data[i].user_2).first())
      }
      Promise.all(pushOppArray).then(values => {
        for (var i = 0; i < values.length; i++) {
          data[i].oppName = values[i].first_name
        }
        // console.log(data)
        res.render('history', {data: data, currentId: req.params.id})
      })
    })
})

// Isololating old rating - work in progress)

// var rateObj1 = pg('user_table').select('rating').where('user_table.id', req.body.user_1).first().then(function(r1) {
//     console.log(r1)
// })
// var rateObj2 = pg('user_table').select('rating').where('user_table.id', req.body.user_2).first().then(function(r2){
//     console.log(r2)
// })

//
// var rate1 = rateObj1.rating
//
// var score1 = req.body.user1_points
// var score2 = req.body.user2_points

// console.log(score1);
// console.log(score2);

// /////////END Isololating

// console.log(rate1);

app.listen(port, function () {
  console.log('Listening on local host ' + port)
})
