angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('AttendanceCtrl', function ($scope){
alert("Att!");
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('ChildrenCtrl', function ($scope, $ionicLoading){
        $scope.show = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };

        var Student = Parse.Object.extend("Student");
        var query = new Parse.Query(Student);

        $scope.show();

        query.find({
            success: function(results) {

                $scope.children=[];

                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    $scope.children.push(object.toJSON());
                }

                // Do something with the returned Parse.Object values
                console.log(results);
                $scope.hide();

            },
            error: function(error) {
                $scope.hide();
                alert("Error: " + error.code + " " + error.message);
            }
        });
})
.controller('StudentCtrl', function ($scope){

})
.controller('LogInCtrl', function($scope, $state) {

        $scope.logIn = function(user) {
            console.log('Trying to Log-In with ', user.username, user.password);

            Parse.User.logIn(user.username, user.password, {
                success: function(theUser) {
                    $state.go('app.children');
                    // Do stuff after successful login.
                },
                error: function(user, error) {
                    console.log(user, error);
//                    $state.go('app.children');
                    // The login failed. Check error to see why.
                }
            });

        };
    });