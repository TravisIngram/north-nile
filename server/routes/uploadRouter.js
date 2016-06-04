var router = require('express').Router();
var multer = require('multer');
var pg = require('pg');
var fs = require('fs');
var dbConnectionString = require('../db/dbConnection.js').dbConnectionString;

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './server/public/assets/img/uploads');
  },
  filename: function(req, file, cb){
    console.log('upload file:', file);
    var fileName = file.originalname.split('.')[0];
    var datetimestamp = Date.now();
    cb(null, fileName + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({
  storage: storage
}).array('file');

router.post('/audio/update/:id', function(request, response){
  var id = request.params.id;
  upload(request, response, function(err){
    if(err){
      response.json({error_code:1, err_desc:err});
      return;
    }

    pg.connect(dbConnectionString, function(err, client, done){
      if(err){
        console.log('Error connecting to database to update audio path:', err);
        response.sendStatus(500);
      } else {
        console.log('request.files', request.files);
        var filePath = request.files[0].path.substring(14);

        var queryString = 'UPDATE audio SET audio_reference = (\'' + filePath + '\') WHERE id = ' + id + ' RETURNING id, audio_reference';

        var query = client.query(queryString, function(err, result){
          if (err){
            console.log('Error returning audio id:', err);
          } else {
            audio_id = result.rows[0].id;
            audio_reference = result.rows[0].audio_reference;
          }
        });

        query.on('error', function(err){
          console.log('Error updating audio path:', err);
          done();
        });

        query.on('end', function(){
          console.log('Updated audio path.');
          done();
          response.send({audio_id: audio_id, audio_reference: audio_reference});
        });
      }
    });

  });
});

router.post('/audio', function(request, response){
  upload(request, response, function(err){
    if(err){
      response.json({error_code:1, err_desc:err});
      return;
    }
    // console.log('uploading audio request:', request.files);
    pg.connect(dbConnectionString, function(err, client, done){
      if(err){
        console.log('Error connecting to database to save audio path:', err);
        response.sendStatus(500);
      } else {
        var audio_id;
        var audio_reference;
        console.log('Uploading audio files:', request.files);
        var filePath = request.files[0].path.substring(14);

        var queryString = 'INSERT INTO audio (audio_reference) VALUES ($1) RETURNING id, audio_reference';

        console.log('audio queryString:', queryString, filePath);

        var query = client.query(queryString, [filePath], function(err, result){
          if (err){
            console.log('Error returning audio id:', err);
          } else {
            audio_id = result.rows[0].id;
            audio_reference = result.rows[0].audio_reference;
          }
        });

        query.on('error', function(err){
          console.log('Error saving audio paths:', err);
          client.end();
        });

        query.on('end', function(){
          console.log('Saved audio path successfully.');
          response.send({audio_id: audio_id, audio_reference: audio_reference});
        });
      }
    });
  });
});

// var upload_single = multer({
//   storage: storage
// }).single('file');

// update images
router.post('/image/single/:id/:place', function(request, response){
  var id = request.params.id;
  var place = request.params.place;
  upload(request, response, function(err){
    if(err){
      response.json({error_code:1, err_desc:err});
      return;
    }

    console.log('Single image:', request.files);
    pg.connect(dbConnectionString, function(err, client, done){
      if(err){
        console.log('Error connecting to database to save single image:', err);
        response.sendStatus(500);
      } else {
        var filePath = request.files[0].path.substring(14);
        var image_paths;

        var queryString = 'UPDATE image SET (path' + place + ') = (\'' + filePath + '\') WHERE id = ' + id + ' RETURNING "path1", "path2", "path3", "path4", "path5"';

        console.log('queryString:', queryString);

        var query = client.query(queryString, function(err, results){
          if(err){
            console.log('Error returning image paths single image:', err);
          } else {
            console.log('Returned image paths.');
            image_paths = results.rows[0];
          }
        });

        query.on('error', function(err){
          console.log('Error saving image path single image:', err);
          client.end();
        });

        query.on('end', function(){
          console.log('Saved single image successfully.');
          done();
          response.send({image_paths:image_paths});
        });
      }
    });

  });
});

router.post('/image', function(request, response){
  var filePaths = [];
  upload(request, response, function(err){
    // console.log('upload files:', request);
    if(err){
      response.json({error_code:1, err_desc:err});
      return;
    }
    //response.json({error_code:0, err_desc:null});

    // insert file paths to database, insert image key to resource row
    request.files.map(function(file){
      var filePath = file.path.substring(14); // remove server/public/ from the file path
      filePaths.push(filePath); // add file paths to array
    });

    pg.connect(dbConnectionString, function(err, client, done){
      if (err){
        console.log('Error connecting to database to save image paths.', err);
        response.sendStatus(500);
      } else {
        var image_id;
        var image_paths;
        // var queryString = 'INSERT INTO "image" (path1, path2, path3, path4, path5) VALUES ($1, $2, $3, $4, $5) RETURNING id;';

        // build query string based on number of inputs
        var queryBase = 'INSERT INTO "image" (path1';
        var queryEnd = ') VALUES ($1';
        for(var i = 2; i < filePaths.length+1; i++){
          queryBase += ', path' + i;
          queryEnd += ', $' + i;
        }
        queryEnd += ') RETURNING id, path1, path2, path3, path4, path5;';
        queryString = queryBase + queryEnd;
        // console.log('queryString:', queryString);

        var query = client.query(queryString, filePaths, function(err, result){
          if(err){
            console.log('Error returning image id:', err);
          } else {
            // console.log('Image return result:', result);
            image_id = result.rows[0].id;
            image_paths = {path1: result.rows[0].path1, path2: result.rows[0].path2, path3: result.rows[0].path3, path4: result.rows[0].path4, path5: result.rows[0].path5};
          }
        });

        query.on('error', function(err){
          console.log('Error saving image paths:', err);
          client.end();
        });

        query.on('end', function(){
          console.log('Saved image paths.', image_paths);
          done();
          response.send({image_id:image_id, image_paths:image_paths});
        });
      }
    });
  });
});

router.delete('/audio/remove/:id', function(request, response){
  var id = request.params.id;

  pg.connect(dbConnectionString, function(err, client, done){
    if(err){
      console.log('Error connecting to database to remove audio file:', err);
      response.sendStatus(500);
    } else {
      var returnedRow;
      var queryString = 'SELECT audio_reference FROM audio WHERE id = ' + id;

      var query = client.query(queryString);

      query.on('error', function(err){
        console.log('Error getting audio reference to remove file:', err);
        done();
      });

      query.on('row', function(row){
        returnedRow = row;
      });

      query.on('end', function(){
        for (cell in returnedRow){
          if(cell !== 'id'){
            var fullPath = 'server/public/' + returnedRow[cell];
            console.log('fullPath:', fullPath);
            // check if file exists, if so, remove it
            fs.lstat(fullPath, function(err, stat){
              if(!err){
                fs.unlinkSync(fullPath);
              }
            });
          }
        }
        var audio_reference;
        var queryString = 'UPDATE audio SET audio_reference = \'\' WHERE id = ' + id + ' RETURNING "audio_reference"';

        var query = client.query(queryString, function(err, result){
          if(err){
            console.log('Error returning while setting audio path to null:', err);
            client.end();
          } else {
            audio_reference = result.rows[0].audio_reference;
          }
        });

        query.on('error', function(err){
          console.log('Error setting audio to null:', err);
          client.end();
        });

        query.on('end', function(){
          console.log('Set audio file path to null.');
          done();
          response.send(audio_reference);
        });
      });
    }
  });
});


router.delete('/image/remove/:id/:place', function(request, response){
  console.log('Removing image:', request.params);
  var place = request.params.place;
  var id = request.params.id;
  var image_paths;
  pg.connect(dbConnectionString, function(err, client, done){
    if(err){
      console.log('Error connecting to database to remove image:', err);
      response.sendStatus(500);
    } else {
      var returnedRow = {};
      var queryString = 'SELECT path' + place + ' FROM image WHERE id = ' + id;

      var query = client.query(queryString);

      query.on('error', function(err){
        console.log('Error getting file paths to remove images:', err);
        done();
      });

      query.on('row', function(row){
        console.log('rows to remove:', row);
        returnedRow = row;
      });

      query.on('end', function(){
        // rows.map(function(filePath){
        //   fs.unlinkSync('server/public/' + filePath);
        // });
        for (cell in returnedRow){
          if(cell !== 'id'){
            var fullPath = 'server/public/' + returnedRow[cell];
            console.log('fullPath:', fullPath);
            // check if file exists, if so, remove it
            fs.lstat(fullPath, function(err, stat){
              if(!err){
                fs.unlinkSync(fullPath);
              }
            });
          }
        }
        console.log('Removed image files, setting paths to null.');
        // set file path to null
        var queryString = 'UPDATE "image" SET (path' + place + ') = (\'\') WHERE id = ' + id + 'RETURNING "path1", "path2", "path3", "path4", "path5"';

        var query = client.query(queryString, function(err, result){
          if(err){
            console.log('Error returning image id:', err);
          } else {
            console.log('Image return result:', result);
            image_paths = result.rows[0];
          }
        });

        query.on('error', function(err){
          console.log('Error removing image:', err);
          client.end();
        });

        query.on('end', function(){
          response.send(image_paths);
          done();
        });
      });
    }
  });
});

module.exports = router;
