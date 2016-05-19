var express=require('express');
var passport=require('passport');
var session=require('express-session');
var bodyParser=require('body-parser');
var pg=require('pg');
var localStrategy=require('passport-local').Strategy;

//local//
var accountsRouter=require('../server/routes/accountsRouter');
var indexRouter=require('../server/routes/indexRouter');
var loginRouter=require('../server/routes/loginRouter');
var logoutRouter=require('../server/routes/logoutRouter');
var registerRouter=require('../server/routes/registerRouter');
var resourceRouter=require('../server/routes/resourceRegister');
var encryption=require('./encryption');
var dbConnection='postgres://localhost:5432/North_Nile';
var accountModel=require('../server/db/accountModel');
var medialModel=require('../server/db/medialModel');
var resourceModel=require('../server/db/resourceModel');
var resourceTypeModel=require('../server/db/resourceTypeModel');

accountModel.initializeUserDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));
//express session
app.use(session({
  secret: 'teal walls',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 600000, secure: false}
}));
//initializing passport//
app.use(passport.initialize());
app.use(passport.session());
//passport happening here///
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
},
function(request, username, password, done){
  console.log('CHECKING PASSWORD');
  pg.connect(dbConnection, function(err, client){
    var user={};
    var query=client.query("SELECT * FROM Account where userName = $1", [userName]);
    if(err){
      console.log(err);
    }

    query.on('row', function(row){
      console.log('user ob', row);
      user=row;
      console.log(password, user.password, 'password');
      if(encryption.comparePassword(password, user.password)){
        console.log('a user has been found');
        done(err, user);
      }else{
        console.log('no matches found');
        done(null, false);
      }
    });
    query.on('end', function(){
      client.end();
      //response.send(results);
    });
    if(err){
      console.log(err);
    }
  });
}));
//authenticate users///
passport.serializeUser(function(user, done){
  console.log('hit serializeUser', user);
  done(null, user.id);
});
passport.deserializeUser(function(id, passportDone){
  console.log('hit deserializeUser');

  pg.connect(accountModel.dbConnection, function(err, client, done){
    if(err){
      console.log(err);
    }
    var user={};
    var query=client.query('SELECT * FROM Account where id=$1', [id]);

    query.on('row', function(row){
      user=row;
      passportDone(null, user);
    })
    query.on('end', function(){
      client.end();
    });
    if(err){
      console.log(err);
    }
  })
})
