angular.module('northApp').controller('UserController', ['Upload','UserTrackFactory', '$http', '$mdDialog','ResourceFactory', function(Upload,UserTrackFactory, $http, $mdDialog, ResourceFactory){
  console.log('user controller loaded.');
  var uc = this;
  uc.user = {};
  var promise = UserTrackFactory.getUserData();
  promise.then(function(response){
    console.log(response.data);
    uc.user = response.data;
    uc.getUserResources(uc.user);
  });
  // uc.user = UserTrackFactory.user;
  //ability to add new resource //
  uc.userResources=ResourceFactory.userResources;
  uc.editUserResource = ResourceFactory.editUserResource;
  uc.getUserResources = ResourceFactory.getUserResources;
  uc.approvedResources = ResourceFactory.approvedResources;


  console.log('user controller called getUserResources');

  uc.addNewResource = function(){
    console.log('uc.user:', uc.user);
    uc.newResourceOptions = {
      templateUrl: '/views/new-resource-user.html',
      clickOutsideToClose: true,
      controller: 'UserNewResourceController',
      controllerAs: 'unrc',
      locals: {
        isAdmin: uc.user.is_admin
      }
    };
    // console.log('mdDialog', $mdDialog.show(uc.newResourceOptions));
    $mdDialog.show(uc.newResourceOptions);
    console.log('finished addnewResource function');
  };

  // edit dialogs
  uc.editUserResource = function(resource){
    console.log('editUserResource:', resource);
    uc.editPendingOptions = {
      templateUrl: '/views/edit-resource.html',
      clickOutsideToClose: true,
      controller: 'EditResourceController',
      controllerAs:'erc',
      resolve:{
        userResource: function(){
          return resource;
        }
      }
    };
    $mdDialog.show(uc.editPendingOptions);
  };


}]);

angular.module('northApp').controller('UserNewResourceController', ['UserTrackFactory','isAdmin', '$mdDialog', 'ResourceFactory', function(UserTrackFactory, isAdmin,$mdDialog, ResourceFactory){
  console.log('UserNewResourceController has loaded', isAdmin);
  var unrc=this;
  unrc.isAdmin = isAdmin;
  unrc.newResource = {is_active:false};

  var promise = UserTrackFactory.getUserData();
  promise.then(function(response){
    unrc.user = response.data;
    console.log('user user:', unrc.user);
  });

  unrc.uploadAudio = function(audio, resource){
    console.log('uploading audio');
    Upload.upload({
      url: '/upload/audio',
      data: {file: audio.file}
    }).then(function(response){
      console.log('Successfully uploaded audio:', response);
      resource.audio_id = response.data.audio_id;
      unrc.uploadAudioSuccess = true;
    }, function(response){
      console.log('Failed at uploading audio:', response);
    }, function(evt){
      // console.log('evt', evt)
    });
  };

  unrc.uploadImage = function(image, resource){
    Upload.upload({
      url: '/upload/image',
      arrayKey: '',
      data: {file: image.file}
    }).then(function(response){
      console.log('Success response?', response);
      // save rest of resource
      resource.image_id = response.data.image_id;
      unrc.uploadImageSuccess = true;

    }, function(response){
      console.log('Error response?', response);
    }, function(evt){
      // use for progress bar
      console.log('Event response?', evt);
    });
    // end image upload
  };

  unrc.saveNewResource = function(resource){
    resource.is_pending = true;
    resource.account_id = unrc.user.id;
    resource.date_created = new Date();
    ResourceFactory.saveNewResource(resource, unrc.user);
    $mdDialog.hide();
  };
  unrc.cancelNewResource = function(){
    $mdDialog.hide();
  };
}]);
// edit modal for user's resources//
angular.module('northApp').controller('EditResourceController', ['userResource', '$mdDialog', 'ResourceFactory', function(userResource,  $mdDialog, ResourceFactory){
  var erc = this;
  erc.userResource = userResource;

  erc.cancelEditPending = function(){
    console.log('uc.userResource:', userResource);
    $mdDialog.hide();
    erc.userResource = {};
  };

  erc.saveEdit = function(){
    erc.userResource.is_pending = !erc.userResource.is_active;
    console.log('erc.userResource:', erc.userResource);
    ResourceFactory.updateResource(erc.userResource);
    erc.user = {};
    $mdDialog.hide();
  };

  erc.confirmRemoveResource = function(){
    erc.showConfirmRemove = true;
  };

  erc.cancelRemoveResource = function(){
    erc.showConfirmRemove = false;
  };

  erc.removeResource = function(resource){
    ResourceFactory.removeResource(resource);
    erc.showConfirmRemove = false;
    $mdDialog.hide();
  };

  console.log('Edit Resource Controller loaded.', userResource);
}]);
