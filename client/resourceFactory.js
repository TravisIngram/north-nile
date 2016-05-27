angular.module('northApp').factory('ResourceFactory', ['$http', function($http){
  var savedResources = [];
  var pendingResources = [];
  var approvedResources = [];
  var mapResources = {};


  var saveNewResource = function(resource){
    $http.post('/resources/new', resource).then(function(response){
      console.log('Save new resource response:', response);
      getSavedResources();
    });
  };

  var getSavedResources = function(callback){
    $http.get('/resources/all').then(function(response){
      console.log('Got all saved resources:', response.data);
      angular.copy(response.data, savedResources);

      var tempPendingResources = savedResources.filter(function(resource){
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
      callback('all'); // run filterMarkers callback
    });
  };

  var updateResource = function(resource){
    // needs to be like a post route
    $http.put('/resources/update', resource).then(function(response){
      console.log('Updated resource:', response);
      getSavedResources();
    });
  };

  return {
    saveNewResource: saveNewResource,
    getSavedResources: getSavedResources,
    savedResources: savedResources,
    pendingResources: pendingResources,
    approvedResources: approvedResources,
    updateResource: updateResource,
    mapResources: mapResources
  }
}]);
