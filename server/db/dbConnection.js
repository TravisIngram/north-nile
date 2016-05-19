var accountModel      = require('accountModel.js');
var mediaModel        = require('mediaModel.js');
var resourceTypeModel = require('resourceTypeModel.js');
var resourceModel     = require('resourceModel.js');

var dbConnection      = 'postgres://localhost:5432/north_nile';

module.exports.dbConnection = dbConnection;
module.exports.dbInit = function() {
  accountModel.createAccount();
  mediaModel.createAudio();
  mediaModel.createImage();
  mediaModel.createVideo();
  resourceTypeModel.createResourceType();
  resourceModel.createResource();
};

// In server.js we'll require this file, dbConnection.js.

// We'll initialize the database by calling dbConnection.dbInit();