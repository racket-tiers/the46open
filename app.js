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
const hbs = require('hbs')
const path = require('path')

hbs.registerPartials(path.join(__dirname, 'views', 'partials'))

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

// SECURE ROUTES
const securedRoutes = ['/profile', '/account', '/remove', '/update', '/logmatch', '/storematch', '/history']
app.use((req, res, next) => {
  if (securedRoutes.includes(req.url)) {
    if (!isLoggedIn(req)) {
      res.redirect('/')
      return
    }
  }
  next()
})

const isLoggedIn = (req) => {
  if (!req.session || !req.session.id) {
    return false
  } else {
    return true
  }
}

// GENERATES THE LEADERBOAD ON THE MAIN PAGE
app.get('/', (req, res) => {
  linkQuery.getRankings()
        .then(data => {
          console.log(req.sesssion)
          res.render('index', {data, active: isLoggedIn(req)})
        })
})

app.get('/createAccount', (req, res) => {
  res.render('createAccount', {active: isLoggedIn(req)})
})

app.get('/about', (req, res) => {
  res.render('about', {active: isLoggedIn(req)})
})

app.get('/rules', (req, res) => {
  res.render('rules', {active: isLoggedIn(req)})
})

app.get('/profile', (req, res) => {
  linkQuery.seeIfUserExists().where({
    id: req.session.id
  }).first().then(function (data) {
    res.render('profile', {data, active: isLoggedIn(req)})
  })
})

// create profile
app.post('/profilecreate', (req, res) => {
  linkQuery.seeIfUserExists().where({
    email: req.body.email
  }).first()
        .then(function (user) {
          if (user) {
            res.redirect('/')
          } else {
            bcrypt.hash(req.body.password, 10)
                    .then(function (hash) {
                      req.body.password = hash
                      linkQuery.storeEmailAndPassword(req.body).then(function () {
                        linkQuery.seeIfUserExists().where({
                          email: req.body.email
                        }).first().then(function (user) {
                          res.redirect('/')
                        })
                      })
                    })
          }
        })
})

// LOG IN TO ACCOUNT
app.post('/login', (req, res) => {
  linkQuery.seeIfUserExists().where({
    email: req.body.email
  }).first()
        .then(function (user) {
          if (user) {
            bcrypt.compare(req.body.password, user.password).then(function (data) {
              if (data) {
                req.session.id = user.id
                res.redirect('/profile')
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
app.get('/account', (req, res) => {
  linkQuery.seeIfUserExists().where({
    id: req.session.id
  }).first().then(function (data) {
    res.render('account', {data: data, currentId: req.session.id, active: isLoggedIn(req)})
  })
})

// DELETE ACCOUNT, FROM ACCOUNT SETTINGS PAGE
app.delete('/remove', (req, res) => {
  pg('user_table')
        .where({
          id: req.session.id
        })
        .del()
        .then((id) => {
          res.redirect('/')
        })
})

// UPDATE ACCOUNT, FROM ACCOUNT SETTINGS PAGE
app.put('/update', (req, res) => {
  pg('user_table')
        .update(req.body)
        .where({
          id: req.session.id
        })
        .then(() => {
          res.redirect('/profile')
        })
})

// Log new match results
app.get('/logmatch', (req, res) => {
  linkQuery.seeIfUserExists().where({
    id: req.session.id
  })
  linkQuery.getAllUsers()
        .then(function (data) {
          let currentUserName = ''
          let i = -1
          for (i = 0; i < data.length; i++) {
            const person = data[i]
            if (person.id === req.session.id) {
              currentUserName = `Current User: ${person.first_name} ${person.last_name}`
              // ES 6 feature for concat. same as :
              // currentUserName = person.first_name + ' ' + person.last_name
              break
            }
          }
          data.splice(i, 1)
          // removes index i, current user, from data
          res.render('logmatch', {data: data, currentId: req.session.id, currentUser: currentUserName, active: isLoggedIn(req)})
        })
})

// storing match results
app.post('/storematch', (req, res) => {
  linkQuery.updateRatings(req.body)
  pg('match')
        .insert(req.body)
        .then(() => {
          res.redirect('/profile')
        })
})

// CREATING HISTORY FOR USERs
app.get('/history', (req, res) => {
  pg.from('user_table')
    .innerJoin('match', 'user_table.id', 'match.user_1')
    .select().where('user_1', req.session.id).orWhere('user_2', req.session.id)
    .then(function (data) {
      const pushOppArray = []
      for (let i = 0; i < data.length; i++) {
        pushOppArray.push(pg('user_table').select('first_name').where('user_table.id', data[i].user_2).first())
      }
      Promise.all(pushOppArray).then(values => {
        for (var i = 0; i < values.length; i++) {
          data[i].oppName = values[i].first_name
        }
        res.render('history', {data: data, currentId: req.session.id, active: isLoggedIn(req)})
      })
    })
})

  // ADD LOGOUT
app.get('/logout', (req, res) => {
  req.session = null
  res.redirect('/')
})

app.listen(port, function () {
  console.log('Listening on local host ' + port)
})
