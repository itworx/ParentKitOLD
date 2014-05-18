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

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('ChildrenCtrl', function ($scope){

        var Student = Parse.Object.extend("Student");
        var query = new Parse.Query(Student);
        query.find({
            success: function(results) {
                alert("Successfully retrieved " + results.length + " students.");
                // Do something with the returned Parse.Object values
                console.log(results);
                $scope.children = results;
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
})
.controller('StudentCtrl', function ($scope){

});