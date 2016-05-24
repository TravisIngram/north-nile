var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

function createAccount() {
  pg.connect(dbConnection, function(err, client, done) {
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
      });

      query.on('error', function(error) {
        console.log('Error creating Account schema.' + err);
        process.exit(1);
      });
    }
  });
}

module.exports.createAccount = createAccount;
