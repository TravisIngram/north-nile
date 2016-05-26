var router = require('express').Router();
var pg = require('pg');
var dbConnectionString = require('../db/dbConnection.js').dbConnectionString;

router.post('/new', function(request, response){
  console.log('Saving new resource:', request.body);
  pg.connect(dbConnectionString, function(err, client, done){
    if (err){
      console.log('Error saving new resource', err);
      response.sendStatus(500);
    } else {
      var queryString = 'INSERT INTO "resource" ("name", "location", "description", "website", "social_media", "leadership", "private_phone", "private_email", "hours", "coordinates", "account_id", "resource_type", "audio_id", "image_id", "video_id") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
      var resource = request.body;


      var query = client.query(queryString, [resource.name, resource.location, resource.description, resource.website, resource.social_media, resource.leadership, resource.private_phone, resource.private_email, resource.hours, resource.coordinates, resource.account_id, resource.resource_type, resource.audio_id, resource.image_id, resource.video_id]);

      query.on('error', function(err){
        console.log('Error saving resource to database:', err);
        response.sendStatus(500);
      });

      query.on('end', function(){
        console.log('Saved new resource.');
        done();
        response.sendStatus(200);
      });
    }
  });
});

router.get('/all', function(request, response){
  pg.connect(dbConnectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database to get saved resources:', err);
      response.sendStatus(500);
    } else {
      var resources = [];

      var queryString = 'SELECT * FROM "resource"';

      var query = client.query(queryString);

      query.on('row', function(row){
        resources.push(row);
      });

      query.on('error', function(err){
        console.log('Error getting saved resources:', err);
        client.end();
      });

      query.on('end', function(){
        console.log('Got saved resources:', resources);
        response.send(resources);
        done();
      });
    }
  });
});

router.put('/update', function(request, response){
  var resource = request.body;
  pg.connect(dbConnectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database to update resource:', err);
      response.sendStatus(500);
    } else {
      var queryString = 'UPDATE resource SET (name, location, description, website, social_media, leadership, public_phone, public_email, hours, latitude, longitude, is_active, is_pending, date_created, account_id, resource_type_id, audio_id, image_id, video_id) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)';

      var query = client.query(queryString, [resource.name, resource.location, resource.description, resource.website, resource.social_media, resource.leadership, resource.public_phone, resource.public_email, resource.hours, resource.latitude, resource.longitude, resource.is_active, resource.is_pending, resource.date_created, resource.account_id, resource.resource_type, resource.audio_id, resource.image_id, resource.video_id]);

      query.on('error', function(err){
        console.log('Error updating resource:', err);
        done(err);
      });

      query.on('end', function(){
        console.log('Updated resource successfully.');
        done();
      });
    }
  });
});

module.exports = router;
