var async             = require('async');
var accountModel      = require('./accountModel.js');
var mediaModel        = require('./mediaModel.js');
var resourceTypeModel = require('./resourceTypeModel.js');
var resourceModel     = require('./resourceModel.js');

var dbConnectionString = 'postgres://localhost:5432/north_nile';

module.exports.dbConnectionString = dbConnectionString;

module.exports.dbInit = function() {
  async.series([
  accountModel.createAccount,
  mediaModel.createAudio,
  mediaModel.createImage,
  mediaModel.createVideo,
  resourceTypeModel.createResourceType,
  resourceModel.createResource
  ],
  function(err) {
    if(err) {
      console.log('Error creating tables.', err);
    } else {
      console.log('Tables created successfully.');
    }
  });
};

/*
module.exports.dbInit = function() {
  accountModel.createAccount();
  mediaModel.createAudio();
  mediaModel.createImage();
  mediaModel.createVideo();
  resourceTypeModel.createResourceType();
  resourceModel.createResource();
};
*/
