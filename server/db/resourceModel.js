var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

function createResource(callback) {
  pg.connect(dbConnection, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "resource" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "name" varchar(150) NOT NULL,' +
        ' "location" varchar(150) NOT NULL,' +
        ' "description" text,' +
        ' "website" varchar(150),' +
        ' "social_media" varchar(150),' +
        ' "leadership" varchar(150),' +
        ' "private_phone" varchar(50),' +
        ' "private_email" varchar(150),' +
        ' "hours" text,' +
        ' "coordinates" numeric,' +
        ' "is_active" boolean,' +
        ' "is_pending" boolean,' +
        ' "date_created" timestamp,' +
        ' "account_id" int REFERENCES "account"(id),' +
        ' "resource_type_id" int REFERENCES "resource_type"(id),' +
        ' "audio_id" int REFERENCES "audio"(id),' +
        ' "image_id" int REFERENCES "image"(id),' +
        ' "video_id" int REFERENCES "video"(id))');

      query.on('end', function() {
        console.log('Successfully created Resource schema.');
        done();
        callback(null);
      });

      query.on('error', function(err) {
        console.log('Error creating Resource schema.' + err);
        callback(err);
        process.exit(1);
      });
    }
  });
}

module.exports.createResource = createResource;
