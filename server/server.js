// node modules
var express       = require('express');

// custom modules
var indexRouter   = require('./routes/indexRouter.js');

var app           = express();

// database
// var dbConnection  = require('./db/dbConnection.js');

//dbConnection.dbInit();

// config
app.use(express.static('server/public'));

// routes
app.use('/', indexRouter);

// server
var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Listening on port', port + '.\n' + 'Press CTRL + C to close connection.');
});
