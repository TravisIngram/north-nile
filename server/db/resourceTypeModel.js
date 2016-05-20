var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

function createResourceType() {
  pg.connect(dbConnection, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "resourceType" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "urbanGarden" varchar(50) NOT NULL,' +
        ' "culinaryArts" varchar(50) NOT NULL,' +
        ' "horticulture" varchar(50) NOT NULL,' +
        ' "distribution" varchar(50) NOT NULL)');

      query.on('end', function() {
        console.log('Successfully created resourceType schema.');
        done();
      });

      query.on('error', function(error) {
        console.log('Error creating resourceType schema.' + err);
        process.exit(1);
      });
    }
  });
}

module.exports.createResourceType = createResourceType;