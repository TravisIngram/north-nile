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
  pg.connect(dbConnection.dbConnectionString, function(err, client){
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

  pg.connect(dbConnection.dbConnectionString, function(err, client, done){
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
// routes
// app.use('/accountsRouter', accountsRouter);
// app.use('/loginRouter', loginRouter);
app.use('/', indexRouter);
// app.use('/logoutRouter', logoutRouter);
// app.use('/registerRouter', registerRouter);
// app.use('/resourceRouter', resourceRouter);

// server
var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Server listening on port ' + port + '...\nPress Ctrl + c to close connection');
});
