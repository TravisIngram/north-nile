//user factory//
angular.module('northApp').factory('UserTrackFactory', ['$http', function($http){

  var user={};

  var getUserData=function(){
    console.log('Called service');
    $http.get('/auth').then(function(response){
      console.log('response from getUserData', response);
      user.info=response.data;
    })
  }
  return {
    user: user,
    getUserData: getUserData
  };
}]);
