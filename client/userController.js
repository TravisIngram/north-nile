angular.module('northApp').controller('UserController', ['UserTrackFactory', '$http', '$mdDialog','ResourceFactory', function(UserTrackFactory, $http, $mdDialog, ResourceFactory){
  console.log('user controller loaded.');
  var uc = this;
  UserTrackFactory.getUserData();
  uc.user = UserTrackFactory.user;
//ability to add new resource //
uc.savedResources=ResourceFactory.savedResources;
uc.getSavedResources=ResourceFactory.getSavedResources;

uc.getSavedResources();
console.log('user controller called getSavedResources');

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
