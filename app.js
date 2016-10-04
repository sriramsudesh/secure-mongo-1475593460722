
var express = require('express');
var cfenv = require('cfenv');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;



// set the view engine to ejs
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');

//use bodyParser 
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

var db;
var localstring = 'mongodb://cap-sg-prd-2.integration.ibmcloud.com:16206';
//var localstring = 'mongodb://localhost:27017/quotes';


MongoClient.connect(localstring, function(err, database) {
  if (err) return console.log(err);
  db = database;
	  // get the app environment from Cloud Foundry
 
});


app.get('/', function(req, res) {
  db.collection('quotes').find().toArray( function(err, result) {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', function(req, res) {
  db.collection('quotes').save(req.body, function(err, result)  {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})



var appEnv = cfenv.getAppEnv();
   // start server on the specified port and binding host
   app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
      console.log("server starting on " + appEnv.url);
   });
