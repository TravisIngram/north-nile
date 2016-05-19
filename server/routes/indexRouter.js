var router = require('express').Router();
var path = require('path');

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'))
  console.log('indexRouter is loading');
});

router.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'))
  console.log('catch-all route loading');
});

module.exports = router;
