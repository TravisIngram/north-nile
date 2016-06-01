//user factory//
angular.module('northApp').factory('UserTrackFactory', ['$http', '$rootScope', '$location', function($http, $rootScope, $location){

  var user={};

  var getUserData=function(){
    console.log('Called service');
    return $http.get('/auth');
  };

  return {
    user: user,
    getUserData: getUserData
  };
}]);

angular.module('northApp').run(['$rootScope', '$location', 'UserTrackFactory', function($rootScope, $location, UserTrackFactory){
  // enumerate routes that don't need authentication
  var routesThatDontRequireAuth = ['/'];

  // check if current location matches route
  var routeClean = function (route) {
    return _.find(routesThatDontRequireAuth,
      function (noAuthRoute) {
        // console.log('startsWith:', route, noAuthRoute);
        // console.log('startsWith true:', route.startsWith(noAuthRoute));
        // if(route.startsWith(noAuthRoute)){
        //   return false;
        // }
        if(route === '/map'){
          return true;
        } else if (route === '/'){
          return true;
        } else if (route === '/user'){
          return false;
        } else if (route === '/admin'){
          return false;
        }
      });
  };

  // add interceptor
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    var user = {};
    var promise = UserTrackFactory.getUserData();

    promise.then(function(response){
      // console.log('$location.url()', $location.url());
      user.info = response.data;
      // if route requires auth and user is not logged in
      if (!routeClean($location.url()) && user.info == ''){
        // console.log('user not logged in');
        $location.path('/');
      } else if (($location.url() === '/admin') && !user.info.is_admin) {
        console.log('user trying to access admin');
        if (user.info === ''){
          $location.path('/');
        } else {
          $location.path('/user');
        }
      } else {
        // console.log('user logged in');
      }
    });
  });
}]);
