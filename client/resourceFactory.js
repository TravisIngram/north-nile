angular.module('northApp').factory('ResourceFactory', ['$http', function($http){
  var savedResources = {};


  var saveNewResource = function(resource){
    $http.post('/resource/new', resource).then(function(response){
      console.log('Save new resource response:', response);
    });
  };

  var getSavedResources = function(){
    $http.get('/resource/all').then(function(response){
      console.log('Got all saved resources:', response.body);
      savedResources = response.data;
    });
  };

  var updateResource = function(resource){
    $http.put('/resource/update/' + resource.id).then(function(response){
      console.log('Updated resource:', response);
    });
  };

  return {
    saveNewResource: saveNewResource,
    getSavedResources: getSavedResources,
    savedResources: savedResources
  }
}]);
