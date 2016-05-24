var express=require('express');
var router=express.Router();
// var passport=require('node-bourbon');
var path=require('path');
var pg=require('pg');
var encryption=require("../../modules/encryption");
var dbConnectionString = require('../db/dbConnection.js').dbConnectionString;

router.get('/', function(request, response, next){
  response.sendFile(path.join(__dirname, '../public/views/home.html'));
});

router.post('/', function(request, response, next){
  console.log(request.body);
  pg.connect(dbConnectionString, function(err, client){
    if (err){
      console.log('error connecting to db - registerRouter', err);
    }

    var user={
      username: request.body.username,
      password: encryption.encryptPassword(request.body.password),
      email_address: request.body.email_address,
      contact_name: request.body.contact_name
    };
    console.log('Creating user with these values:', user);
    var query=client.query('INSERT INTO "account" ("username", "password", "email_address", "contact_name") VALUES ($1, $2, $3, $4)', [user.username, user.password, user.email_address, user.contact_name]);
      query.on('error', function(err){
        console.log(err);
        response.sendStatus(401);
      });
      query.on('end', function(){
        response.redirect('/');
        client.end();
      });
  });
});

module.exports=router;
