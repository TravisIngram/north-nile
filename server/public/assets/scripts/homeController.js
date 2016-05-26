angular.module("northApp").controller("HomeController",["UserTrackFactory","$http","$mdDialog","$location",function(a,b,c,d){var e,f=this;f.loginInfo={},f.registerInfo={},f.alertMessage="",f.passwordMismatch=function(){return f.registerInfo.password!==f.registerInfo.confirm_password?!0:void 0},f.passwordMismatchError=function(){return f.passwordMismatch()&&f.registerFormInputs.confirm_password.$dirty?!0:void 0},f.loginShow=function(){f.loginForm=!0,f.registerForm=!1},f.registerShow=function(){console.log("hit registerShow"),f.registerForm=!0,f.loginForm=!1},f.loginUser=function(){b.post("/login",f.loginInfo).then(function(a){200==a.status&&(console.log("successful login",a.data.is_admin),a.data.is_admin===!0?(console.log("admin is true"),f.loginInfo={},f.adminDashboard=!0,f.userDashboard=!1,f.registerForm=!1,f.loginForm=!1):(console.log("admin is not true"),f.loginInfo={},f.userDashboard=!0,f.adminDashboard=!1,f.registerForm=!1,f.loginForm=!1))},function(a){function b(){e=c.alert({title:"Attention",textContent:"Incorrect username and/or password. Please enter information again.",ok:"Close"}),c.show(e)["finally"](function(){e=void 0})}console.log("unsuccessful login"),b(),f.loginInfo={}})},f.registerUser=function(){b.post("/register",f.registerInfo).then(function(a){function b(){e=c.alert({title:"Congratulations!",textContent:"Registration successful, please log in.",ok:"Close"}),c.show(e)["finally"](function(){e=void 0})}200==a.status&&(console.log("successful registration"),b(),f.registerInfo={},f.registerForm=!1,f.loginForm=!0)},function(a){function b(){void 0===f.registerInfo.username?f.alertMessage="Username field cannot be blank":f.alertMessage="Username already exists, please choose another.",e=c.alert({title:"Attention",textContent:f.alertMessage,ok:"Close"}),c.show(e)["finally"](function(){e=void 0})}console.log("unsuccessful registration"),b(),f.registerInfo.username=void 0})},console.log("hc.registerFormInputs:",f.registerFormInputs),console.log("Home controller loaded.")}]);
