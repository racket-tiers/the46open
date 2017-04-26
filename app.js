const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const port = process.env.PORT || 3000
const pg = require('./db/knex')
const methodOverride = require('method-override')

const linkQuery = require('./db/user_info')

app.use('/', express.static('public'))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())
app.use(methodOverride('_method'))

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

app.get('/profile', (req, res) => {
  // TODO ADD MIDDLEWHERE TO DIRECT TO CURRENT USER
  pg('user_table').select().where('id', 400).then((data) => {
    res.render('profile', {data})
  })
})

app.post('/profilecreate', (req, res) => {
  linkQuery.addUser(req.body).then(() => {
    res.redirect('/profile')
  })
})

// LOG IN TO ACCOUNT
app.post('/profile', (req, res) => {
  pg('user_table').select().where('email', req.body.email).andWhere('password', req.body.password).then((data) => {
    res.render('profile', {data})
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
app.delete('/remove?', (req, res) => {
  pg('user_table')
  .where('id', 400)
  .del()
})

app.listen(port, function () {
  console.log('Listening on local host ' + port)
})

// app.post('/createAccount', function(req, res, next) {
//     queries.findUserIfExists().where({
//             email: req.body.email
//         }).first()
//         .then(function(user) {
//                 if (user) {
//                     res.send(user)
//                 } else {
//                     bcrypt.genSalt(8, function(err, salt) {
//                         console.log(salt);
//                         bcrypt.hash(req.body.password, sal, function(err, hash) {
//                             console.log(hash);
//                             hashedPassword = hash
//                             porcess.exit()
//                         })
//                         }).then(function() {
//                             queries.userTable(req.body, hashedPassword)
//                                 .then(function() {
//                                     res.send("new user!")
//                                 })
//                             .catch(function(err){
//                                 console.log(err);
//                             })
//                     })
//
//                 }
//
//
//             }
//         })
