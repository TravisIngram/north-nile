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
      userName: request.body.username,
      password: encryption.encryptPassword(request.body.password),
      emailAddress: request.body.emailAddress,
      contactName:request.body.contactName
    }
    console.log('Creating user with these values:', user);
    var query=client.query('INSERT INTO "Account" ("userName", "password", "emailAddress", "contactName") VALUES ($1, $2, $3, $4)', [user.userName, user.password, user.emailAddress, user.contactName]);
      query.on('error', function(err){
        console.log(err);
      })
      query.on('end', function(){
        response.redirect('/');
        client.end();
      })
  })
})
module.exports=router;
