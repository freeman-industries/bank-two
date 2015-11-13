require('dotenv').load();

var express = require("express");
var url = require('url');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var expressLess = require('express-less');
var gravatar = require('gravatar');

var db_config = {
  host     : process.env.DB_HOST,
  database : process.env.DB_DB,
  multipleStatements : true,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
};

var getUserData = function(user, callback){
  var connection = mysql.createConnection(db_config);
  connection.connect();

  connection.query('SELECT email FROM `users` WHERE name=' + connection.escape(user) + ';', function(err, rows, fields) {
    if (err) throw err;
    if (rows.length < 1) return;

    var email = rows[0].email;

    var obj = {
      user: user,
      image: gravatar.url(email, {s: 120}, true)
    }

    callback(obj);

    connection.end();
  });
};

var getLinks = function(user, callback){
  var connection = mysql.createConnection(db_config);
  connection.connect();

  var query;

  if(user !== null){
    query = 'SELECT time, title, url FROM `links` WHERE user=(SELECT id FROM users WHERE name=' + connection.escape(user) + ');'
  } else {
    query = 'SELECT links.title, links.url, links.time, users.name, users.email FROM `links` LEFT JOIN `users` ON links.user = users.id ORDER BY links.id'
  }

  connection.query(query, function(err, rows, fields) {
    if (err) throw err;

    rows.forEach(function(row){
      row.image = gravatar.url(row.email, {s: 120}, true);
      delete row.email
    });

    callback(rows);

    connection.end();
  });
}

var storeLink = function(title, url, user){
  console.log(title, url, user);

  var connection = mysql.createConnection(db_config);
  connection.connect();

  var user_query = "INSERT INTO `links` (`time`, `title`, `url`, `user`) VALUES (UNIX_TIMESTAMP(), " + connection.escape(title) + ", " + connection.escape(url) + ", (SELECT id FROM users WHERE name=" + connection.escape(user) + "))";

  console.log(user_query);

  connection.query(user_query, function(err, rows, fields) {
    if (err) throw err;
    if (rows.length < 1) return;

    console.log("successfully stored link " + url + " by " + user);

    connection.end();
  });

}

var app = express(); //starts up your app

app.use('/assets', express.static('public/assets'));
app.use('/assets/css', expressLess(path.join(__dirname, '../public/assets/css'), {debug: true}));

app.use(bodyParser());

app.get("/", function(req, res){
  res.sendFile('home.html', { root: path.join(__dirname, '../public') });
});

app.get("/user", function(req, res){
  getUserData(req.query.user, function(rows){
    if(rows){
      res.send(JSON.stringify(rows))
    } else {
      res.send(null);
    }
  });
});

app.get("/user/*", function(req,res){
  res.sendFile('user.html', { root: path.join(__dirname, '../public') });
});

app.get("/global", function(req,res){

  getLinks(null, function(rows){

    if(rows){
      res.send(JSON.stringify(rows))
    } else {
      res.send(null);
    }

    res.end();

  });
});

app.get("/links", function(req,res){

  getLinks(req.query.user, function(rows){

    if(rows){
      res.send(JSON.stringify(rows))
    } else {
      res.send(null);
    }

    res.end();

  });
});

app.post("/links", function(req,res){

  var response_obj = {
    url: req.body.link,
    time: Math.floor(Date.now() / 1000)
  };

  res.send(JSON.stringify(response_obj)).end()

  storeLink(req.body.title, req.body.link, req.body.user);

});

var port = process.env.PORT !== undefined ? process.env.PORT : null;

if(!port){
  console.log("ERROR: No port specified. Not gonna run.");
  return;
}

console.log("Attempting to listen on port " + port + "...");

app.listen(port);
