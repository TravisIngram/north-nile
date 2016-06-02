var pg            = require('pg');
var dbConnection  = 'postgres://localhost:5432/north_nile';

if (process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  console.log('environment var');
  dbConnection = process.env.DATABASE_URL;
}

function createAudio(callback) {
  pg.connect(dbConnection, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "audio" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "audio_reference" varchar(150) NOT NULL)');

      query.on('end', function() {
        console.log('Successfully created Audio schema.');
        done();
        callback(null);
      });

      query.on('error', function(err) {
        console.log('Error creating Audio schema.' + err);
        callback(err);
        process.exit(1);
      });
    }
  });
}

function createImage(callback) {
  pg.connect(dbConnection, function(err, client, done) {
    if(err) {
      console.log('Error connecting to DB.' + err);
      process.exit(1);
    } else {
      var query = client.query('CREATE TABLE IF NOT EXISTS "image" (' +
        ' "id" serial PRIMARY KEY,' +
        ' "path1" varchar(150) NOT NULL,' +
        ' "path2" varchar(150),' +
        ' "path3" varchar(150),' +
        ' "path4" varchar(150),' +
        ' "path5" varchar(150))');

      query.on('end', function() {
        console.log('Successfully created Image schema.');
        callback(null);
        done();
      });

      query.on('error', function(err) {
        console.log('Error creating Image schema.' + err);
        callback(err);
        process.exit(1);
      });
    }
  });
}

// function createVideo(callback) {
//   pg.connect(dbConnection, function(err, client, done) {
//     if(err) {
//       console.log('Error connecting to DB.' + err);
//       process.exit(1);
//     } else {
//       var query = client.query('CREATE TABLE IF NOT EXISTS "video" (' +
//         ' "id" serial PRIMARY KEY,' +
//         ' "video_reference" varchar(150) NOT NULL)');
//
//       query.on('end', function() {
//         console.log('Successfully created Video schema.');
//         done();
//         callback(null);
//       });
//
//       query.on('error', function(err) {
//         console.log('Error creating Video schema.' + err);
//         callback(err);
//         process.exit(1);
//       });
//     }
//   });
// }

module.exports.createAudio = createAudio;
module.exports.createImage = createImage;
// module.exports.createVideo = createVideo;
