angular.module('northApp').controller('UserController', ['UserTrackFactory', '$http', '$mdDialog','ResourceFactory', function(UserTrackFactory, $http, $mdDialog, ResourceFactory){
  console.log('user controller loaded.');
  var uc = this;
  uc.user = {};
  var promise = UserTrackFactory.getUserData();
  promise.then(function(response){
    console.log(response.data);
    uc.user.info = response.data;
    uc.getUserResources(uc.user);
  });
  // uc.user = UserTrackFactory.user;
//ability to add new resource //
uc.userResources=ResourceFactory.userResources;
uc.getUserResources = ResourceFactory.getUserResources;


console.log('user controller called getUserResources');

uc.addNewResource = function(){
  console.log('uc.user:', uc.user);
  uc.newResourceOptions = {
    templateUrl: '/views/new-resource-user.html',
    clickOutsideToClose: true,
    controller: 'UserNewResourceController',
    controllerAs: 'unrc',
    locals: {
      isAdmin: uc.user.info.is_admin
    }
  };
  // console.log('mdDialog', $mdDialog.show(uc.newResourceOptions));
  $mdDialog.show(uc.newResourceOptions);
  console.log('finished addnewResource function');
};


}]);

angular.module('northApp').controller('UserNewResourceController', ['isAdmin', '$mdDialog', 'ResourceFactory', function(isAdmin,$mdDialog, ResourceFactory){
  console.log('UserNewResourceController has loaded', isAdmin);
  var unrc=this;
  unrc.isAdmin = isAdmin;
  unrc.newResource = {is_active:false};

  unrc.saveNewResource = function(resource){
    resource.is_pending = true;
    resource.date_created = new Date();
    ResourceFactory.saveNewResource(resource);
    $mdDialog.hide();
  };
  unrc.cancelNewResource = function(){
    $mdDialog.hide();
  };

}]);
