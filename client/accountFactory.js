angular.module('northApp').factory('AccountFactory', ['$http', function($http){
  var savedAccounts = [];

  var getSavedAccounts = function(){
    $http.get('/accounts/all').then(function(response){
      console.log('Got saved accounts:', response.data);
      angular.copy(response.data, savedAccounts);
    });
  };

  var updateAccount = function(account){
    $http.put('/accounts/update', account).then(function(response){
      console.log('Updated account');
      getSavedAccounts();
    });
  };

  return {
    getSavedAccounts: getSavedAccounts,
    savedAccounts: savedAccounts,
    updateAccount: updateAccount
  }
}]);
