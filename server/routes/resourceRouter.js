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
      var queryString = 'INSERT INTO "resource" (name, description, website, twitter, facebook, instagram, snapchat, address_line1, address_line2, address_line3, city_name, state, zip_code, leadership, public_phone, public_email, hours, latitude, longitude, is_active, is_pending, date_created, account_id, resource_type, audio_id, image_id, video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)';
      var resource = request.body;


      var query = client.query(queryString, [resource.name, resource.description, resource.website, resource.twitter, resource.facebook, resource.instagram, resource.snapchat, resource.address_line1, resource.address_line2, resource.address_line3, resource.city_name, resource.state, resource.zip_code, resource.leadership, resource.public_phone, resource.public_email, resource.hours, resource.latitude, resource.longitude, resource.is_active, resource.is_pending, resource.date_created, resource.account_id, resource.resource_type, resource.audio_id, resource.image_id, resource.video]);

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

      // var queryString = 'SELECT * FROM "resource" INNER JOIN "account" ON resource.account_id = account.id';


      var queryString = 'SELECT "resource".id, "name", "resource_type", "date_created", "account_id", "is_active", "is_pending", "username", "website", "twitter", "facebook", "instagram", "snapchat", "address_line1", "address_line2", "address_line3", "city_name", "state", "zip_code", "leadership", "latitude", "longitude", "description", "public_phone", "public_email", "hours", "video", "image".path1, "image".path2, "image".path3, "image".path4, "image".path5, "audio".audio_reference FROM "resource" LEFT OUTER JOIN "image" ON image.id = resource.image_id INNER JOIN "account" ON account.id = resource.account_id LEFT OUTER JOIN "audio" ON audio.id = resource.audio_id';

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

router.get('/user/:id', function(request, response){
  var userId=request.params.id;
  pg.connect(dbConnectionString, function(err, client, done){
    if(err){
      console.log('error connecting to database to get user resources', err);
      response.sendStatus(500);
    }else{
      var resources = [];
      var queryString = "SELECT * FROM resource WHERE account_id = $1";

      var query = client.query(queryString, [userId]);

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
      var queryString = 'UPDATE resource SET (name, description, website, twitter, facebook, instagram, snapchat, address_line1, address_line2, address_line3, city_name, state, zip_code, leadership, public_phone, public_email, hours, latitude, longitude, is_active, is_pending, date_created, account_id, resource_type, audio_id, image_id, video, address_id) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) WHERE id = ' + resource.id;

      var query = client.query(queryString, [resource.name, resource.description, resource.website, resource.twitter, resource.facebook, resource.instagram, resource.snapchat, resource.address_line1, resource.address_line2, resource.address_line3, resource.city_name, resource.state, resource.zip_code, resource.leadership, resource.public_phone, resource.public_email, resource.hours, resource.latitude, resource.longitude, resource.is_active, resource.is_pending, resource.date_created, resource.account_id, resource.resource_type, resource.audio_id, resource.image_id, resource.video]);

      query.on('error', function(err){
        console.log('Error updating resource:', err);
        done(err);
      });

      query.on('end', function(){
        console.log('Updated resource successfully.');
        done();
        response.sendStatus(200);
      });
    }
  });
});

router.delete('/remove/:id', function(request, response){
  var resourceId = request.params.id;
  pg.connect(dbConnectionString, function(err, client, done){
    if (err){
      console.log('Error connecting to database to remove resources:', err);
      response.sendStatus(500);
    } else {
      var queryString = 'DELETE FROM resource WHERE id = ' + resourceId;

      var query = client.query(queryString);

      query.on('error', function(err){
        console.log('Error removing resource:', err);
        client.end();
      });

      query.on('end', function(){
        console.log('Removed resource successfully.');
        done();
        response.sendStatus(200);
      });
    }
  });
});

module.exports = router;
