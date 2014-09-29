angular.module('starter.controllers', ['angles','angularCharts'])
//###################################################### Services ################################################################//
    .service('storage',function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            removeObject : function(key) {
                return $window.localStorage.removeItem(key);
            }
        }
    })


//###################################################### Controllers ################################################################//
               //#######################################  LoginCtrl  ########################################//
    .controller('LogInCtrl', function($scope, $state,$ionicLoading,$ionicPopup,storage,OpenFB) {
        $scope.user = {
            username : '',
            password : ''
        };
        $scope.logIn = function(user) {
            $scope.show('signing in..');
            Parse.User.logIn(user.username, user.password, {
                success: function(theUser) {
//                    alert('this is localstorage' + JSON.stringify(window.localStorage));
                    $scope.hide();
                    $state.go('app.Students');
                },
                error: function(user, error) {
                    $scope.hide();
                    $scope.showAlert('Error',error.message);
                    console.log(user, error);
                }
            });
        };

        $scope.signupUser = function(){
            $state.go('SignUp');
        };

        $scope.facebookLogin = function () {
            OpenFB.login('email','read_stream,publish_stream')
                .then(
                function() {
                    //Success in login

                    OpenFB.get('/me')
                        .success(function (user) {
                            $scope.show('Logging with facebook...');
                            var accessToken = OpenFB.getAccessToken();
                            var expires_in_seconds =  OpenFB.getExpires_in();
                            var Expire_date = new Date(1970,0,1);
                            Expire_date.setSeconds(expires_in_seconds);
                            var facebookAuthData = {
                                "id": user.id + "",
                                "access_token": accessToken,
                                "expiration_date" :Expire_date.toISOString()
                            }
                            Parse.FacebookUtils.logIn(facebookAuthData, {
                                success: function(user) {
                                    $scope.hide();
                                    if (!user.existed()) {
                                        $state.go('welcome');
                                   } else {
                                        $state.go('app.Students');
                                    }
                                },
                                error: function(user, error) {
                                    alert('no');
                                    $scope.showAlert("Error","Failed to login with facebook.");
                                }
                            });
                        })
                        .error(function (data) {
                            alert(data.error.message);
                        })
                },
                function(){
                    //failed in login
                    $scope.showAlert("Error","Failed to login with facebook.");
                }
            );
        }

    })
              //#######################################  SignupCtrl  ########################################//
    .controller('SignUpCtrl', function($scope, $state,  $ionicLoading,$ionicPopup) {

        $scope.showAlert = function(title,content) {
            $ionicPopup.alert({
                title: title,
                content: content
            });
        }

        $scope.user = {
            username : '',
            password : '',
            confirmPassword : '',
            mail : '',
            accessCode : ''
        };
        $scope.signup = function() {
            //Validate inputs
            if($scope.user.username.length == 0){
                $scope.showAlert('Error','please enter username');
            }
            else if($scope.user.password.length == 0){
                $scope.showAlert('Error','please enter password');
            }
            else if($scope.user.confirmPassword.length == 0){
                $scope.showAlert('Error','please confirm password.');
            }
            else if ($scope.user.confirmPassword != $scope.user.password){
                $scope.showAlert('Error',"These passwords don't match. Try again?");

            }
            else if ($scope.user.mail.length == 0){
                $scope.showAlert('Error',"please enter your mail.");
            }
            else if (!validateEmail($scope.user.mail)){
                $scope.showAlert('Error',"email formatting not valid.");
            }
            else if($scope.user.password.length < 4){
                $scope.showAlert('',"Password should be more than 4 characters.");
            }
            else{
                //sign up
                var parseUser = new Parse.User();
                parseUser.set("username", $scope.user.username);
                parseUser.set("password", $scope.user.password);
                parseUser.set("email", $scope.user.mail);
                //        user.set("email", $scope.user.accessCode);
                $scope.show('signing up...');
                parseUser.signUp(null, {
                    success: function(parseUser) {
                        $scope.hide();
                        var welcomeMessage = 'Welcome ' + $scope.user.username;
                        $scope.show(welcomeMessage);
                        setTimeout(function (){
                            $state.go('welcome');
                            $scope.hide();
                        }, 2000);
                    },
                    error: function(user, error) {
                        // Show the error message somewhere and let the user try again.
                        $scope.hide();
                        $scope.showAlert('Error',error.message);
                    }
                });
            }
        }

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        $scope.show = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };
    })
             //#######################################  ForgotPassword ########################################//
    .controller('forgotPasswordCtrl', function ($scope,$state,$ionicPopup,$ionicLoading) {

        $scope.send = function (mail) {
            if(!validateEmail(mail)){
                $scope.showAlert('Error','please enter correct mail.');
            }
            else{
                $scope.show('Loading...');
                Parse.User.requestPasswordReset(mail, {
                    success: function() {
                        $scope.hide();
                        $scope.show('mail was sent to you.');
                        setTimeout(function (){
                            $scope.hide();
                            $state.go('login');
                        }, 2000);
                    },
                    error: function(error) {
                        $scope.hide();
                        $scope.showAlert('Error',error.message);
                    }
                });
            }
        };
        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        $scope.showAlert = function(title,content) {
            $ionicPopup.alert({
                title: title,
                content: content
            });
        }
        $scope.show = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };
    })