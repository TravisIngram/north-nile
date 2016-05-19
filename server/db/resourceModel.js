var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

function createResource() {
  pg.connect(dbConnection, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "Resource" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "name" varchar(50) NOT NULL,' +
        ' "location" varchar(50) NOT NULL,' +
        ' "description" text NOT NULL,' +
        ' "website" varchar(50) NOT NULL,' +
        ' "socialMedia" varchar(50) NOT NULL,' +
        ' "leadership" varchar(50) NOT NULL,' +
        ' "privatePhone" varchar(50) NOT NULL,' +
        ' "privateEmail" varchar(50) NOT NULL,' +
        ' "hours" text NOT NULL,' +
        ' "coordinates" numeric NOT NULL,' +
        ' "account_id" int REFERENCES "Account(id)",' +
        ' "resourceType_id" int REFERENCES "resourceType"(id),' +
        ' "audio_id" int REFERENCES "Audio"(id),' +
        ' "image_id" int REFERENCES "Image"(id),' +
        ' "video_id" int REFERENCES "Video"(id))');

      query.on('end', function() {
        console.log('Successfully created Resource schema.');
        done();
      });

      query.on('error', function(error) {
        console.log('Error creating Resource schema.' + err);
        process.exit(1);
      });
    }
  });
}

module.exports.createResource = createResource;
