angular.module('northApp').factory('ResourceFactory', ['$http', 'Upload', function($http, Upload){
  var savedResources = [];
  var pendingResources = [];
  var approvedResources = [];
  var mapResources = {};
  var userResources = [];
  var images = [];
  var geocodeKey = 'd757d21efc7d5efeb1195e398d031a5e';
  var newImagePaths = {};

  var getUserResources = function(user){
    console.log('trying to log user', user);
    $http.get('/resources/user/' + user.id).then(function(response){
      console.log(response);
      angular.copy(response.data, userResources);
    });
  };

  var saveNewResource = function(resource, user){
    if(resource.latitude){
      $http.post('/resources/new', resource).then(function(response){
        console.log('Save new resource response no geocode:', response);
        getSavedResources();
        getUserResources(user);
      });
    } else {
      $http.get('https://api.opencagedata.com/geocode/v1/json?q=' + resource.address_line1 + '+' + resource.address_line2 + '+' + resource.address_line3 + '+' + resource.city_name + '+' + resource.state + '+' + resource.zip_code + '&key=' + geocodeKey).then(function(response){
        console.log('Geocode response:', response);
        // if(response.data.results[0]){
        //   resource.latitude = response.data.results[0].geometry.lat;
        //   resource.longitude = response.data.results[0].geometry.lng;
        // }
        var mostConfident = {confidence:0};
        if(response.data.results){
          response.data.results.map(function(result){
            if(result.confidence >= mostConfident.confidence){
              mostConfident = result;
            }
          });
          console.log('Geocode results:', mostConfident);
          resource.latitude = mostConfident.geometry.lat;
          resource.longitude = mostConfident.geometry.lng;
        }

        $http.post('/resources/new', resource).then(function(response){
          console.log('Save new resource response:', response);
          getSavedResources();
          getUserResources(user);
        });
      }, function(response){
        console.log('Geocode failed:', response);
        // save marker even on fail?
        $http.post('/resources/new', resource).then(function(response){
          console.log('Save new resource response:', response);
          getSavedResources();
          getUserResources(user);
        });
      });
    }
  };

  var getSavedResources = function(callback){
    $http.get('/resources/all').then(function(response){
      // console.log('Got all saved resources:', savedResources);
      angular.copy(response.data, savedResources);
      // add image paths to an array
      savedResources.map(function(resource){
        resource.images = [];
      if(resource.path1 !== null){resource.images.push(resource.path1)};
      if(resource.path2 !== null){resource.images.push(resource.path2)};
      if(resource.path3 !== null){resource.images.push(resource.path3)};
      if(resource.path4 !== null){resource.images.push(resource.path4)};
      if(resource.path5 !== null){resource.images.push(resource.path5)};
      });
      // savedResources.images = images;
      console.log('Got all saved resources:', savedResources);

      var tempPendingResources = savedResources.filter(function(resource){
        // console.log('Pending?', resource);
        if (resource.is_pending === true){
          // console.log('resource is pending',resource);
          return true;
        }
      });

      var tempApprovedResources = savedResources.filter(function(resource){
        if (resource.is_active === true){
          // console.log('resource is active',resource);
          return true;
        }
      });

      var count = 0;
      tempApprovedResources.map(function(resource){
        resource.lat = Number(resource.latitude); // convert to number and format for Leaflet
        resource.lng = Number(resource.longitude); // convert to number and format for Leaflet

        mapResources['m'+count] = resource;
        count++
      });

      angular.copy(tempPendingResources, pendingResources);
      angular.copy(tempApprovedResources, approvedResources);
      if(callback){
        callback('all'); // run filterMarkers callback if present
      }
    });
  };

  var updateResource = function(resource){
    // needs to be like a post route
    $http.put('/resources/update', resource).then(function(response){
      console.log('Updated resource:', response);
      getSavedResources();
    });
  };

  var removeResource = function(resource){
    var id = resource.id;
    $http.delete('/resources/remove/' + id).then(function(response){
      console.log('Removed resources:', response);
      getSavedResources();
    });
  };

  var removeImage = function(id, place, cb){
    $http.delete('upload/image/remove/' + id + '/' + place).then(function(response){
      console.log('Removed image:', response);

      newImagePaths.paths = response.data;
      cb();
    });
  };

  var updateImage = function(image, id, place, cb){
    console.log('resource factory image:', image);
    Upload.upload({
      url: '/upload/image/single/' + id + '/' + place,
      arrayKey: '',
      data: {file: image}
    }).then(function(response){
      console.log('Success response?', response);
      newImagePaths.paths = response.data.image_paths;
      cb();
    }, function(response){
      console.log('Error response?', response);
    }, function(evt){
      // use for progress bar
      console.log('Event response?', evt);
    });
    // end image upload
  };

  var uploadImage = function(image, cb){
    console.log('resource factory image:', image);
    Upload.upload({
      url: '/upload/image',
      arrayKey: '',
      data: {file: image}
    }).then(function(response){
      console.log('Success response?', response);
      newImagePaths.image_id = response.data.image_id;
      newImagePaths.paths = response.data.image_paths;
      cb();
    }, function(response){
      console.log('Error response?', response);
    }, function(evt){
      // use for progress bar
      console.log('Event response?', evt);
    });
    // end image upload
  };

  var removeAudio = function(id, cb){
    console.log('Removing audio:', id);
    $http.delete('upload/audio/remove/' + id).then(function(response){
      console.log('Removed audio:', response);
      cb();
    });
  };

  var uploadAudio = function(audio, cb){
    console.log('uploading audio');
    Upload.upload({
      url: '/upload/audio/',
      data: {file: audio}
    }).then(function(response){
      console.log('Successfully uploaded audio:', response);
      cb(response.data.audio_id, response.data.audio_reference);
      // nrc.uploadAudioSuccess = true;
    }, function(response){
      console.log('Failed at uploading audio:', response);
    }, function(evt){
      // console.log('evt', evt)
    });
  };

  var updateAudio = function(audio, id, cb){
    Upload.upload({
      url: '/upload/audio/update/' + id,
      data: {file:audio}
    }).then(function(response){
      console.log('Successfully uploaded audio:', response);
      cb(response.data.audio_id, response.data.audio_reference);
    }, function(response){
      console.log('Failed at uploading audio:', response);
    }, function(evt){
      // used for progress
    });
  };


  return {
    saveNewResource: saveNewResource,
    getSavedResources: getSavedResources,
    savedResources: savedResources,
    pendingResources: pendingResources,
    approvedResources: approvedResources,
    updateResource: updateResource,
    mapResources: mapResources,
    getUserResources: getUserResources,
    userResources: userResources,
    removeResource: removeResource,
    removeImage: removeImage,
    uploadImage: uploadImage,
    updateImage: updateImage,
    newImagePaths: newImagePaths,
    removeAudio: removeAudio,
    uploadAudio: uploadAudio,
    updateAudio: updateAudio
  }
}]);
