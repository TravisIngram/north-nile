var express=require('express');
var router=express.Router();
var path=require('path');
var session=require('express-session');
var passport=require('passport');
var bodyParser=require('body-parser');
var pg=require('pg');

//route below will only be accessible once a user is logged in; ie tells users they are logged in
router.get('/', function(request, response, next){
  console.log('requested session information for:', request.user);
  response.send(request.user);
});

module.exports = router;
