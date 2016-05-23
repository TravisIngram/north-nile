// node modules
var express=require('express');
var passport=require('passport');
var session=require('express-session');
var bodyParser=require('body-parser');
var pg=require('pg');
var localStrategy=require('passport-local').Strategy;

//local//


// custom modules
var indexRouter= require('./routes/indexRouter.js');
var loginRouter = require('./routes/loginRouter.js');
var registerRouter = require('./routes/registerRouter.js');
var encryption=require('../modules/encryption');

var app = express();

// database
var dbConnection  = require('./db/dbConnection.js');

dbConnection.dbInit();
// config
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
  // This is where it gets stuck after non-existant user tries to login.
  pg.connect(dbConnection.dbConnectionString, function(err, client){
    var user={};
    var query=client.query("SELECT * FROM \"Account\" where \"userName\" = $1", [username]);
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
      console.log('Account not found.');

      client.end();
      done(null);
    });

    query.on('error', function(err){
      console.log('Error retrieving account:', err);

    })
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

  pg.connect(dbConnection.dbConnectionString, function(err, client, done){
    if(err){
      console.log(err);
    }
    var user={};
    var query=client.query('SELECT * FROM \"Account\" where id=$1', [id]);

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
// routes
// app.use('/accountsRouter', accountsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/', indexRouter);
// DO NOT PUT ANY OTHER ROUTES UNDER indexRouter!!!

// server
var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Server listening on port ' + port + '...\nPress Ctrl + c to close connection');
});
