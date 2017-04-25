const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const port = process.env.PORT || 3000

const linkQuery = require('./db/user-info')

app.use('/', express.static('public'))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    linkQuery.getAll()
        .then(data => {
            res.render('index', {
                data
            })
        })
})

app.get('/createAccount', (req, res) => {
    res.render('createAccount')
})

app.listen(port, function() {
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
