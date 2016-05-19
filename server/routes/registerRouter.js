var express=require('express');
var router=express.Router();
var passport=require('node-bourbon');
var path=require('path');
var pg=require('pg');
var connectionString='postgres://localhost:5432/North_Nile':
var encryption=require("../../modules/encryption");

router.get('/', function(request, response, next){
  response.sendFile(path.join(__dirname, '../public/views/home.html'));
});

router.post('/', function(request, response, next){
  console.log(request.body);
  pg.connect(connectionString, function(err, client){

    var user={
      userName: request.body.userName,
      password: encryption.encryptPassword(request.body.password),
      emailAddress: request.body.emailAddress,
      contactName:request.body.contactName
    }
    console.log('Creating user with these values:', user);
    var query=client.query('INSERT INTO Account (userName, password, emailAddress, contactName) VALUES ($1, $2, $3, $4)', [user.userName, user.password, user.emailAddress, user.contactName]);
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
