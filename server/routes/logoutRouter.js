var express=require('express');
var router=express.Router();
var path=require('path');
var session=require('express-session');
var passport=require('passport');
var bodyParser=require('body-parser');
var pg=require('pg');

router.get('/', function(request, response){
  console.log('made it to logout router');
  request.logout();
  response.redirect('/');
})
module.exports=router;
