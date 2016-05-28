var router = require('express').Router();
var pg = require('pg');
var dbConnectionString = require('../db/dbConnection.js').dbConnectionString;

router.get('/all', function(request, response){
  pg.connect(dbConnectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database to get all accountst:', err);
      response.sendStatus(500);
    } else {
      var accounts = [];

      var queryString = 'SELECT * FROM account;';

      var query = client.query(queryString);

      query.on('row', function(row){
        accounts.push(row);
      });

      query.on('error', function(err){
        console.log('Error retreiving accounts:', err);
        client.end();
      });

      query.on('end', function(){
        response.send(accounts);
        done();
      });
    }
  });
});

router.put('/update', function(request, response){
  var account = request.body;
  pg.connect(dbConnectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database to update account:', err);
      response.sendStatus(500);
    } else {
      var queryString = 'UPDATE account SET (username, email_address, contact_name, is_admin) = ($1, $2, $3, $4) WHERE id = ' + account.id;

      var query = client.query(queryString, [account.username, account.email_address, account.contact_name, account.is_admin]);

      query.on('error', function(err){
        console.log('Error updating account:', err);
        client.end();
        response.sendStatus(500);
      });

      query.on('end', function(){
        console.log('Updated account.');
        done();
        response.sendStatus(200);
      });
    }
  });
});

module.exports = router;
