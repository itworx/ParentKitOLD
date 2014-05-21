angular.module('starter.controllers', ['ionic'])
    .service('AtendanceTypes',function(){
        var types = [];
        this.getAttendanceTypes = function () {
            return types;
        }
        this.addType = function (type) {
            var found = false;
            for(i in types){
                if(types[i].objectId == type.id){
                    found = true;
                }
            }
            if(!found){
               types.push(type);
            }
        }
        this.setTypes = function(attendanceTypes){
            types = attendanceTypes;
        }
        this.getType = function (typeId) {
            for(i in types){
                if(types[i].objectId == typeId){
                  return types[i];
                }
            }
        }
    })


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

.controller('AttendanceCtrl', function ($scope,$stateParams,AtendanceTypes){

        //Get Attendance Types

        var attendanceType =  Parse.Object.extend("Attendancetype");
        var attendanceTypeQuery = new Parse.Query(attendanceType);
        console.log('type Id     + ' + object.type.objectId);
        attendanceTypeQuery.equalTo("objectId",object.type.objectId);
        attendanceTypeQuery .find({
            success: function (attendanceTypesResults) {
                alert(attendanceTypesResults.length);
                alert(attendanceTypesResults);
                console.log('types   ' + attendanceTypesResults);
            },
            error:function(error){
                alert("Error: " + error.code + " " + error.message);
            }
        });

        //Get Attendance For Student

        var attendance = Parse.Object.extend("Attendance");
        var attendanceQuery = new Parse.Query(attendance);

        var student = Parse.Object.extend("Student");
        var studentQuery = new Parse.Query(student);

        studentQuery.equalTo("objectId",$stateParams.studentId);

        attendanceQuery.matchesQuery("student", studentQuery);
        attendanceQuery.find({
            success: function(attendancesResults) {
                console.log(attendancesResults);
                $scope.attendances = [];
                for (var i = 0; i < attendancesResults.length; i++) {
                    var object = attendancesResults[i];
                    $scope.attendances.push(object.toJSON());
                    object = $scope.attendances[i];
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });


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
        query.equalTo()
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


.controller('StudentCtrl', function ($scope,$stateParams){
        $scope.studentId =  $stateParams.studentId;
        alert('this is student id :' + $scope.studentId);
})

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

.controller('SignUpCtrl', function($scope, $state,  $ionicLoading) {

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
               alert('please enter username.');
           }
           else if($scope.user.password.length == 0){
               alert('please enter password.');
           }
           else if($scope.user.confirmPassword.length == 0){
               alert('please confirm password.');
           }
           else if ($scope.user.confirmPassword != $scope.user.password){
               alert("These passwords don't match. Try again?");
           }
           else if ($scope.user.mail.length == 0){
               alert("please enter your mail.");
           }
           else if (!validateEmail($scope.user.mail)){
               alert("email formatting not valid.");
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
                       alert('sign up success');
                       $state.go('app.login');
                   },
                   error: function(user, error) {
                       // Show the error message somewhere and let the user try again.
                       $scope.hide();
                       alert('sign up failed')
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

.controller('Students', function($scope, $state,  $ionicLoading) {
        alert('students');

        $scope.showHUD = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function(){
            $ionicLoading.hide();
        };

        var Student = Parse.Object.extend("Student");
        var query = new Parse.Query(Student);
//        query.equalTo(accessCode, "");
        $scope.showHUD('loading..');
        query.find({
            success: function(results) {

                $scope.children=[];

                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    $scope.children.push(object.toJSON());
                }

                // Do something with the returned Parse.Object values
                console.log(results);
                $scope.hideHUD();

            },
            error: function(error) {
                $scope.hideHUD();
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });