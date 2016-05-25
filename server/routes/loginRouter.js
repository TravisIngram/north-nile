var express=require('express');
var router=express.Router();
var path=require('path');
var session=require('express-session');
var passport=require('passport');
var bodyParser=require('body-parser');
var pg=require('pg');

router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '../public/views/home.html'));
});
router.post('/', passport.authenticate('local'), function(request, response){
  var authenticatedUser = {
    username: request.user.username,
    is_admin: request.user.is_admin
  };

  response.send(authenticatedUser);
});

//route below will only be accessible once a user is logged in; ie tells users they are logged in
router.get('/auth', function(request, response){
  console.log('requested sesion information for:', request.user);
  response.send(request.user);
});

module.exports=router;
