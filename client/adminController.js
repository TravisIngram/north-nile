angular.module('northApp').controller('AdminController', ['AccountFactory', 'UserTrackFactory', '$http', '$mdDialog', 'ResourceFactory', function(AccountFactory, UserTrackFactory, $http,$mdDialog, ResourceFactory){
  var ac = this;
<<<<<<< HEAD

=======
>>>>>>> 2341762db8f9256bc21548ac9f8a0a202bf15fb2
  var promise = UserTrackFactory.getUserData();
  promise.then(function(response){
    ac.user = response.data;
  });
<<<<<<< HEAD

  // dummy data
  ac.dummyText1 = 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.';
  // ac.storedResources = [
  //   {
  //     lat: 44.996121,
  //     lng: -93.295845,
  //     title: 'Mr. Books Bruschetta Machine',
  //     type: 'one',
  //     visible: false,
  //     username: 'Bruschetta4Lyfe',
  //     dateCreated: 'Jan 26th, 2016',
  //     pending: true
  //   },
  //   {
  //     lat: 44.998995,
  //     lng: -93.291068,
  //     title: 'Ms. Kitchens Oblique Reference Parlor',
  //     type: 'two',
  //     visible: false,
  //     username: 'kitchen86',
  //     dateCreated: 'Dec 4th, 2016',
  //     pending: true
  //   },
  //    {
  //       lat: 44.999143,
  //       lng: -93.297133,
  //       title: 'Mr. Bones Bruschetta Machine',
  //       type: 'one',
  //       visible: false,
  //       username: 'Bruschetta4Lyfe',
  //       dateCreated: 'May 3rd, 2016',
  //       pending: false
  //   },
  //   {
  //     lat: 45.002572,
  //     lng: -93.289515,
  //     title: 'Ms. Burbakers Oblique Reference Parlor',
  //     type: 'two',
  //     visible: false,
  //     username: 'brubaker_conglomerate',
  //     dateCreated: 'Apr 6th, 2016',
  //     pending: true
  // }];
=======
>>>>>>> 2341762db8f9256bc21548ac9f8a0a202bf15fb2

  ac.savedResources = ResourceFactory.savedResources;
  ac.getSavedResources = ResourceFactory.getSavedResources;
  ac.pendingResources = ResourceFactory.pendingResources;
  ac.approvedResources = ResourceFactory.approvedResources;

  ac.savedAccounts = AccountFactory.savedAccounts;
  ac.getSavedAccounts = AccountFactory.getSavedAccounts;

  ac.selectedModerationResources = [];
  ac.selectedModerationResource = {};

  // approve resources en masse
  ac.approveResources = function(){
    console.log('approving resources.');
    ac.selectedModerationResources.map(function(resource){
      resource.is_pending = false;
      resource.is_active = true;
      ResourceFactory.updateResource(resource);
    });
  };

  // edit dialogs
  ac.editResource = function(resource){
    console.log('editresource:', resource);
    ac.editPendingOptions = {
      templateUrl: '/views/edit-pending.html',
      clickOutsideToClose: true,
      controller: 'EditPendingController',
      controllerAs:'epc',
      resolve:{
        selectedResource: function(){
          return resource;
        }
      }
    }
     $mdDialog.show(ac.editPendingOptions);
  };

  // add new resource
  ac.addNewResource = function(){
    ac.newResourceOptions = {
      templateUrl: '/views/new-resource.html',
      clickOutsideToClose: true,
      controller: 'NewResourceController',
      controllerAs: 'nrc'
    }
    $mdDialog.show(ac.newResourceOptions);
  };

  // manage accounts
  ac.showAccounts = function(){
    ac.showAccountTable = true;
  };

  ac.editAccount = function(account){
    ac.editAccountOptions = {
      templateUrl: '/views/edit-account.html',
      clickOutsideToClose: true,
      controller: 'EditAccountController',
      controllerAs: 'eac',
      resolve:{
        selectedAccount: function(){
          return account;
        }
      }
    };
    $mdDialog.show(ac.editAccountOptions);
  };

  ac.addAccount = function(){
    console.log('adding account');
    ac.addAccountOptions = {
      templateUrl: '/views/add-account.html',
      clickOutsideToClose: true,
      controller: 'NewAccountController',
      controllerAs: 'nac'
    };
    $mdDialog.show(ac.addAccountOptions);
  };

  // load tables on page load
  ac.getSavedResources();
  ac.getSavedAccounts();
  console.log('admin controller loaded!');
}]);

// new account controller
angular.module('northApp').controller('NewAccountController', ['$mdDialog', 'AccountFactory', '$http', function($mdDialog, AccountFactory, $http){
  var nac = this;
  nac.registerInfo = {};

  // registration form password confirmation checking
  nac.passwordMismatch = function(){
    if(nac.registerInfo.password !== nac.registerInfo.confirm_password){
      return true;
    }
  };

  nac.passwordMismatchError = function(){
    if (nac.passwordMismatch() && nac.registerFormInputs.confirm_password.$dirty){
      return true;
    }
  };

  nac.cancelNewAccount = function(){
    $mdDialog.hide();
  };

  nac.registerUser = function() {
    $http.post('/register', nac.registerInfo).then(function(response){
      if (response.status == 200) {
        console.log('successful registration');
        // Function below will prompt login. Would be nice to automatically login user?
        function showAlert() {
          alert = $mdDialog.alert({
            title: 'Congratulations!',
            textContent: 'Registration successful.',
            ok: 'Close'
          });
          $mdDialog
            .show( alert )
            .finally(function() {
              alert = undefined;
            });
        }
        showAlert();
        AccountFactory.getSavedAccounts();
      }
    }, function(response){
      console.log('unsuccessful registration');
      function showAlert() {
        if(nac.registerInfo.username === undefined){
          nac.alertMessage = 'Username field cannot be blank';
        } else {
          nac.alertMessage = 'Username already exists, please choose another.';
        }

        alert = $mdDialog.alert({
          title: 'Attention',
          textContent: nac.alertMessage,
          ok: 'Close'
        });
        $mdDialog
          .show( alert )
          .finally(function() {
            alert = undefined;
          });
      }
      showAlert();
      nac.registerInfo.username = undefined;
    });
  };

  console.log('New Account Controller loaded.');
}]);

// edit accounts controller
angular.module('northApp').controller('EditAccountController', ['selectedAccount', '$mdDialog', 'AccountFactory', function(selectedAccount, $mdDialog, AccountFactory){
  var eac = this;

  eac.selectedAccount = selectedAccount;

  eac.cancelEditAccount = function(){
    $mdDialog.hide();
    eac.selectedAccount = {};
  };

  eac.saveEditAccount = function(){
    AccountFactory.updateAccount(eac.selectedAccount);
    $mdDialog.hide();
  };


  console.log('edit account controller loaded');
}]);


// edit pending modal controller
angular.module('northApp').controller('EditPendingController', ['selectedResource', '$mdDialog', 'ResourceFactory', function(selectedResource,  $mdDialog, ResourceFactory){
  var epc = this;

  epc.selectedResource = selectedResource;

  epc.cancelEditPending = function(){
    console.log('ac.selectedResource:', selectedResource);
    $mdDialog.hide();
    epc.selectedResource = {};
  };

  epc.saveEditPending = function(){
    epc.selectedResource.is_pending = !epc.selectedResource.is_active; // make pending value false based on approve value
    console.log('epc.selectedResource:', epc.selectedResource);
    ResourceFactory.updateResource(epc.selectedResource);
    epc.selectedResource = {};
    $mdDialog.hide();
  };

  epc.confirmRemoveResource = function(){
    epc.showConfirmRemove = true;
  };

  epc.cancelRemoveResource = function(){
    epc.showConfirmRemove = false;
  };

  epc.removeResource = function(resource){
    ResourceFactory.removeResource(resource);
    epc.showConfirmRemove = false;
    $mdDialog.hide();
  };

  console.log('Edit Pending Controller loaded.', selectedResource);
}]);


// add new resource modal controller
angular.module('northApp').controller('NewResourceController', ['$http',  '$mdDialog', 'ResourceFactory', 'UserTrackFactory', function($http, $mdDialog, ResourceFactory, UserTrackFactory){
  var nrc = this;

  nrc.newResource = {is_active:true};
  nrc.user = {};
  var promise = UserTrackFactory.getUserData();
  promise.then(function(response){
    nrc.user = response.data;
  });

  nrc.cancelNewResource = function(){
    $mdDialog.hide();
  };

  nrc.saveNewResource = function(resource){
    resource.account_id = nrc.user.id;
    resource.is_pending = !resource.is_active;
    resource.date_created = new Date();
    ResourceFactory.saveNewResource(resource);
    $mdDialog.hide();
  };

  console.log('New Resource Controller loaded.');
}]);
