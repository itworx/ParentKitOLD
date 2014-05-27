angular.module('starter.controllers', [])

//.controller('AppCtrl', function($scope) {
//})
//
//.controller('PlaylistsCtrl', function($scope) {
//  $scope.playlists = [
//    { title: 'Reggae', id: 1 },
//    { title: 'Chill', id: 2 },
//    { title: 'Dubstep', id: 3 },
//    { title: 'Indie', id: 4 },
//    { title: 'Rap', id: 5 },
//    { title: 'Cowbell', id: 6 }
//  ];
//})
//
//.controller('PlaylistCtrl', function($scope, $stateParams) {
//})


    .controller('LogInCtrl', function($scope, $state,$ionicLoading) {

        $scope.logIn = function(user) {
            console.log('Trying to Log-In with ', user.username, user.password);
            $scope.show('signing in..');
            Parse.User.logIn(user.username, user.password, {
                success: function(theUser) {
                    $scope.hide();
                    $state.go('app.Students');
                },
                error: function(user, error) {
                    $scope.hide();
                    alert("Invaild username or password.");
                    console.log(user, error);
                }
            });
        };

        $scope.signup = function(){
            $state.go('app.SignUp');
        };

        $scope.show = function(text) {
            $ionicLoading.show({
                template: text
            });
        };

        $scope.hide = function(){
            $ionicLoading.hide();
        };
    })
