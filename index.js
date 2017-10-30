'use strict'
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const ShoeApiRoutes = require("./shoe_Api");
const Models = require('./models');

const models = Models(process.env.MONGO_DB_URL || "mongodb://localhost/shoe_Api")

const shoeApiRoutes = ShoeApiRoutes(models);

const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', '"Origin, X-Requested-With, Content-Type, Accept"');
  next();
})

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'))


app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use(session({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 60000 * 30
  }
}));
app.use(flash());

app.get('/', function(req, res) {
  res.redirect('index')
})
app.get("/api/shoes", shoeApiRoutes.allShoes);
app.post("/api/shoes", shoeApiRoutes.addShoes);
app.post("/api/shoes/sold/:id", shoeApiRoutes.soldStock);
app.get("/api/shoes/brand/:brandname", shoeApiRoutes.brandname);
app.get("/api/shoes/size/:size", shoeApiRoutes.size);
// app.get("/api/shoes/color/:color", shoeApiRoutes.color);
app.get("/api/shoes/brand/:brandname/size/:size", shoeApiRoutes.brandAndSize);

var port = process.env.PORT || 6001;
app.listen(port, function() {
  console.log('Web app started on port : ' + port);

});
