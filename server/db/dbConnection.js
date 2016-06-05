var async             = require('async');
var pg                = require('pg');
var accountModel      = require('./accountModel.js');
var mediaModel        = require('./mediaModel.js');
var addressModel      = require('./addressModel.js');
var resourceTypeModel = require('./resourceTypeModel.js');
var resourceModel     = require('./resourceModel.js');

module.exports.dbConnectionString = require('../../config').dbConnection;

module.exports.dbInit = function() {
  async.series([
  accountModel.createAccount,
  mediaModel.createAudio,
  mediaModel.createImage,
  // addressModel.createAddress,
  // mediaModel.createVideo,
  // resourceTypeModel.createResourceType,
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
