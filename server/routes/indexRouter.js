var router = require('express').Router();
var path = require('path');

// main view:
router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'))
  console.log('indexRouter is loading');
});

// catch-all route : DO NOT PUT ANY ROUTES UNDERNEATH THIS
router.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'))
  console.log('catch-all route loading');
});

module.exports = router;
