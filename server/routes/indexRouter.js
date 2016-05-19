var router = require('express').Router();

router.get('/', function(req, res){
  res.send('Index route working.');
});

module.exports = router;
