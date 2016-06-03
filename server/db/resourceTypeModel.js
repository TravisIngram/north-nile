var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  console.log('environment var');
  dbConnection = process.env.DATABASE_URL;
}

function createResourceType(callback) {
  // pg.connect(dbConnection, function(err, client, done) {
  //   if(err) {
  //     console.log('Error connecting to DB.' + err);
  //     process.exit(1);
  //   } else {
  //     var query = client.query('CREATE TABLE IF NOT EXISTS "resource_type" (' +
  //       ' "id" serial PRIMARY KEY,' +
  //       ' "urban_garden" varchar(150) NOT NULL,' +
  //       ' "culinary_arts" varchar(150) NOT NULL,' +
  //       ' "horticulture" varchar(150) NOT NULL,' +
  //       ' "distribution" varchar(150) NOT NULL)');

  //     query.on('end', function() {
  //       console.log('Successfully created resourceType schema.');
  //       done();
  //       callback(null);
  //     });

  //     query.on('error', function(err) {
  //       console.log('Error creating resourceType schema.' + err);
  //       callback(err);
  //       process.exit(1);
  //     });
  //   }
  // });
}

module.exports.createResourceType = createResourceType;
