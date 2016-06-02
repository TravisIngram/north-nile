var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

function createAddress(callback) {
  pg.connect(dbConnection, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "address" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "address_line1" varchar(150) NOT NULL,' +
        ' "address_line2" varchar(150),' +
        ' "address_line3" varchar(150),' +
        ' "city_name" varchar(100) NOT NULL,' +
        ' "state" char(2) NOT NULL,' +
        ' "zip_code" varchar(16) NOT NULL)');

      query.on('end', function() {
        console.log('Successfully created Address schema.');
        done();
        callback(null);
      });

      query.on('error', function(err) {
        console.log('Error creating Address schema.' + err);
        callback(err);
        process.exit(1);
      });
    }
  });
}

module.exports.createAddress = createAddress;
