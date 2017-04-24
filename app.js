const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000

app.use('/', express.static('public'));
app.set('view engine', 'hbs')

app.get('/',(req,res)=>{
  res.render('index')
})

app.listen(port, function(){
  console.log("Listening on local host " + port);
})
