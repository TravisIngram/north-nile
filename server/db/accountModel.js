var pg            = require('pg');
var dbConnection  = require('./dbConnection');

function createAccount(callback) {
  pg.connect(dbConnection.dbConnectionString, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "account" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "username" varchar(25) NOT NULL UNIQUE,' +
        ' "password" varchar(75) NOT NULL,' +
        ' "email_address" varchar(100) NOT NULL,' +
        ' "contact_name" varchar(100) NOT NULL,'+
        ' "is_admin" boolean);');

      query.on('end', function() {
        console.log('Successfully created Account schema.');
        done();
        callback(null);
      });

      query.on('error', function(err) {
        console.log('Error creating Account schema.' + err);
        callback(err);
        process.exit(1);
      });
    }
  });
}

module.exports.createAccount = createAccount;
