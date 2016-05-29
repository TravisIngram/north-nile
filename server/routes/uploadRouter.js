var router = require('express').Router();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './server/public/assets/img/uploads');
  },
  filename: function(req, file, cb){
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({
  storage: storage
}).array('file');


router.post('/image', function(request, response){
  console.log('upload:', upload);
  upload(request, response, function(err){
    if(err){
      response.json({error_code:1, err_desc:err});
      return;
    }
    response.json({error_code:0, err_desc:null});
  });
});

module.exports = router;
