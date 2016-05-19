var router = require('express').Router();

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/home.html'))
  console.log('indexRouter is loading');
});

module.exports = router;
