angular.module('northApp').controller('HomeController', ['UserTrackFactory','$http', '$mdDialog', '$location', function(UserTrackFactory, $http, $mdDialog, $location){

  var hc = this;

  var promise = UserTrackFactory.getUserData();
  promise.then(function(response){
    hc.user = response.data;
  });

  hc.routeUser = function() {
    if (hc.user.is_admin == true) {
      $location.path('/admin');
    } else {
      $location.path('/user');
    }
  }

  var alert;
  hc.loginInfo = {};
  hc.registerInfo = {};
  hc.alertMessage = '';
  hc.headerExpanded = true;

  // registration form validation
  hc.passwordMismatch = function(){
    if(hc.registerInfo.password !== hc.registerInfo.confirm_password){
      return true;
    }
  };

  hc.passwordMismatchError = function(){
    if (hc.passwordMismatch() && hc.registerFormInputs.confirm_password.$dirty){
      return true;
    }
  };

  // :::: ng-show Functions :::: //

  // loginShow():
  hc.loginShow = function() {
    hc.loginForm = true;
    hc.registerForm = false;
    hc.headerExpanded = false;
    hc.headerCondensed = true;
  };

  // registerShow():
  hc.registerShow = function() {
    console.log('hit registerShow');
    hc.registerForm = true;
    hc.loginForm = false;
  };

  // headerExpandedShow();
  hc.headerExpandedShow = function() {
    hc.headerExpanded = true;
    hc.headerCondensed = false;
    hc.loginForm = false;
    hc.registerForm = false;
  };

  // :::: Login User, redirect based on success/failure ::::

  hc.loginUser = function() {
    $http.post('/login', hc.loginInfo).then(function(response){
      if (response.status == 200) {
        console.log('successful login', response.data.is_admin);
        if (response.data.is_admin === true) {
          console.log('admin is true');
          hc.loginInfo = {};
          // hc.adminDashboard=true;
          // hc.userDashboard=false;
          $location.url('/admin');
          hc.registerForm = false;
          hc.loginForm = false;
        } else {
          console.log('admin is not true');
          hc.loginInfo = {};
          // hc.userDashboard=true;
          // hc.adminDashboard=false;
          $location.url('/user');
          hc.registerForm=false;
          hc.loginForm=false;
        }
      }
    }, function(response){
      console.log('unsuccessful login');
      // Alert user to incorrect username/password ::::
      function showAlert() {
        alert = $mdDialog.alert({
          title: 'Attention',
          textContent: 'Incorrect username and/or password. Please enter information again.',
          ok: 'Close'
        });
        $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
      }
      showAlert();
      hc.loginInfo = {};

    });
  };

  // :::: Register User ::::

  hc.registerUser = function() {
    $http.post('/register', hc.registerInfo).then(function(response){
      if (response.status == 200) {
        $location.path('/user');
        console.log('successful registration');
        // Function below will prompt login. Would be nice to automatically login user?
        // function showAlert() {
        //   alert = $mdDialog.alert({
        //     title: 'Congratulations!',
        //     textContent: 'Registration successful.',
        //     ok: 'Close'
        //   });
        //   $mdDialog
        //   .show( alert )
        //   .finally(function() {
        //     alert = undefined;
        //   });
        // }
        // showAlert();
        hc.registerInfo={};
        hc.registerForm=false;
        hc.loginForm=true;

      }
    }, function(response){
      console.log('unsuccessful registration');
      function showAlert() {
        if(hc.registerInfo.username === undefined){
          hc.alertMessage = 'Username field cannot be blank';
        } else {
          hc.alertMessage = 'Username already exists, please choose another.';
        }

        alert = $mdDialog.alert({
          title: 'Attention',
          textContent: hc.alertMessage,
          ok: 'Close'
        });
        $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
      }
      showAlert();
      hc.registerInfo.username = undefined;
    });
  };

  console.log('Home controller loaded.');
}]);
