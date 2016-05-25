angular.module('northApp').controller('AdminController', ['$http', '$mdDialog', function($http,$mdDialog){
  var ac = this;

  // dummy data
  ac.dummyText1 = 'Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.';
  ac.storedResources = [
    {
      lat: 44.996121,
      lng: -93.295845,
      title: 'Mr. Books Bruschetta Machine',
      type: 'one',
      visible: false,
      username: 'Bruschetta4Lyfe',
      dateCreated: 'Jan 26th, 2016',
      pending: true
    },
    {
      lat: 44.998995,
      lng: -93.291068,
      title: 'Ms. Kitchens Oblique Reference Parlor',
      type: 'two',
      visible: false,
      username: 'kitchen86',
      dateCreated: 'Dec 4th, 2016',
      pending: true
    },
     {
        lat: 44.999143,
        lng: -93.297133,
        title: 'Mr. Bones Bruschetta Machine',
        type: 'one',
        visible: false,
        username: 'Bruschetta4Lyfe',
        dateCreated: 'May 3rd, 2016',
        pending: false
    },
    {
      lat: 45.002572,
      lng: -93.289515,
      title: 'Ms. Burbakers Oblique Reference Parlor',
      type: 'two',
      visible: false,
      username: 'brubaker_conglomerate',
      dateCreated: 'Apr 6th, 2016',
      pending: true
  }];

  // generate arrays for tables
  ac.filterApprovedResources = function(){
    ac.approvedResources = ac.storedResources.filter(function(resource){
      if(!resource.pending){
        return true;
      }
    });
  };

  ac.filterPendingResources = function(){
    ac.moderationQueue = ac.storedResources.filter(function(resource){
      if(resource.pending){
        return true;
      }
    });
  };

  ac.selectedModerationResources = [];
  ac.selectedModerationResource = {};
  ac.approvedResources = [];
  ac.moderationQueue = [];

  // approve resources en masse
  ac.approveResources = function(){
    console.log('approving resources.');
    ac.selectedModerationResources.map(function(resource){
      resource.pending = false;
    });
    ac.filterApprovedResources();
    ac.filterPendingResources();
  };


  // edit dialogs

  // needs to be updated for modal
  ac.editResource = function(resource){
    // event.stopPropagation();
    ac.selectedResource = resource;
    console.log('ac.selectedResource:', ac.selectedResource);
    ac.editPendingOptions = {
      templateUrl: '/views/edit-pending.html',
      clickOutsideToClose: true,
      controller: 'AdminController',
      controllerAs:'ac',
      scope: ac
    };
    ac.editPending = $mdDialog.show(ac.editPendingOptions);
  };

  ac.cancelEditPending = function(){
    console.log('ac.selectedResource:', ac.selectedResource);
    $mdDialog.hide(ac.editPending);
  };

  ac.saveEditPending = function(){
    // add save logic here -> probably need to post to server/database
    $mdDialog.hide(ac.editPending);
  };


  ac.filterApprovedResources();
  ac.filterPendingResources();
  console.log('admin controller loaded!');
}]);
