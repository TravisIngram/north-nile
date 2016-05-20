var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

function createAccount() {
  pg.connect(dbConnection, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "Account" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "userName" varchar(25) NOT NULL UNIQUE,' +
        ' "password" varchar(75) NOT NULL,' +
        ' "emailAddress" varchar(50) NOT NULL,' +
        ' "contactName" varchar(50) NOT NULL,'+
        ' "isAdmin" boolean);');

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
