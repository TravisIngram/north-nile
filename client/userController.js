angular.module('northApp').controller('UserController', ['UserTrackFactory', '$http', function(UserTrackFactory, $http){
  var uc = this;
  console.log('user controller loaded.');

  UserTrackFactory.getUserData();

  uc.user = UserTrackFactory.user;


}]);
