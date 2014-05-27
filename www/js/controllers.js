angular.module('starter.controllers', ['ionic'])
    .service('AtendanceTypes',function(){
        var types = [];
        var attendanceType =  Parse.Object.extend("Attendancetype");
        var attendanceTypeQuery = new Parse.Query(attendanceType);
        attendanceTypeQuery .find({
            success: function (attendanceTypesResults) {
                for(i in attendanceTypesResults){
                    types.push(attendanceTypesResults[i].toJSON());
                    console.log(types[i].objectId +'         title:    ' +  types[i].title);
                }
            },
            error:function(error){
                alert("Error: " + error.code + " " + error.message);
            }
        });

        this.getAttendanceTypes = function () {
            return types;
        }
        this.getType = function (typeId) {
            for(i in types){
                if(types[i].objectId == typeId){
                  return types[i];
                }
            }
        }
    })
    .service('BehaviorTypesService',function(){

        console.log('this is behavior types service');
        var behaviortypes = [];
        var behaviorType =  Parse.Object.extend("Behaviortype");
        var behaviorTypesQuery = new Parse.Query(behaviorType );
        behaviorTypesQuery.find({
            success: function (behaviorTypesResults) {
                for(i in behaviorTypesResults){
                    behaviortypes.push(behaviorTypesResults[i].toJSON());
                    console.log('types length ' + behaviortypes.length);
                }
            },
            error:function(error){
                alert("Error: " + error.code + " " + error.message);
            }
        });

        this.getBehaviorTypes = function () {
            return behaviortypes;
        }
        this.getBehaviorType = function (typeId) {
            for(i in behaviortypes){
                if(behaviortypes[i].objectId == typeId){
                    return behaviortypes[i];
                }
            }
        }
    })
    .service('LessonService',function(){
        this.getLesson = function(lessonId){
            //alert('during call');
            console.log('LessonService : ' + lessonId);

            var lessonObject =  Parse.Object.extend("Lesson");
            var lessonQuery = new Parse.Query(lessonObject);
            lessonQuery.equalTo('objectId',lessonId);
            return lessonQuery.find();
        }
    })
    .service('studentsService',function(){
        var students = [];
        var currentStudent;
        this.addStudent = function(student){
            students.push(student);
        };
        this.getCurrentStudent = function(){
          return currentStudent;
        };
        this.setCurrentStudent = function(student){
            console.log('this is set current studnet fn');
            console.log('this is studnet   ' +  student);
            currentStudent = student;
            console.log('this is current studnet   ' +  currentStudent);
        };
        this.setStudents = function (studentsArr) {
            console.log('this is set students fn');
            students = studentsArr;
            console.log('this is student array Parameters in service   ' + studentsArr);
            console.log('this is student array in service   ' + students);
        }
        this.getStudents = function () {
            return students;
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

.controller('AttendanceCtrl', function ($scope,$stateParams,AtendanceTypes,LessonService,$ionicNavBarDelegate,$state,$ionicLoading){

        $scope.showHUD = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function(){
            $ionicLoading.hide();
        };
        $scope.records = [];
        var attendance = Parse.Object.extend("Attendance");
        var attendanceQuery = new Parse.Query(attendance);

        var student = Parse.Object.extend("Student");
        var studentQuery = new Parse.Query(student);
        studentQuery.equalTo("objectId",$stateParams.studentId);
        $scope.showHUD('loading...');
        attendanceQuery.matchesQuery("student", studentQuery);
        attendanceQuery.find({
            success: function(attendancesResults) {
                for (var i = 0; i < attendancesResults.length; i++) {
                    var attendanceObject = attendancesResults[i].toJSON();
                    console.log('This is my log');
                    console.log(attendanceObject);
                    console.log(attendanceObject.lesson);
                    console.log(attendanceObject.lesson.objectId);
                    var promise = LessonService.getLesson(attendanceObject.lesson.objectId);
                    promise.done(function (lessons) {
                        var lessonObject = lessons[0].toJSON();
                        lessonObject.lessonStartDate = new Date (lessonObject.lessonStartDate.iso);
                         var record = {
                                attendance :'',
                                type :'',
                                lesson:''
                           };
                            record.attendance = attendanceObject;
                            record.lesson = lessonObject;
                            record.type = AtendanceTypes.getType(attendanceObject.type.objectId);
                            $scope.records.push(record);
                            $scope.$apply();
                        })
                        .fail(function(error) {
                            alert("Error: " + error.code + " " + error.message);
                        });
                }
                $scope.hideHUD();
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });

        $scope.getPreviousTitle = function() {
            console.log('previous title    :'  + $ionicNavBarDelegate.getPreviousTitle());
            return $ionicNavBarDelegate.getPreviousTitle();
        };
        $scope.goBack =function(){
            $state.go('app.Students');
        }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {

})

.controller('ChildrenCtrl', function ($scope, $ionicLoading,$state,studentsService){
        $scope.PressHandler = function(studentId){
            $state.go();
        };
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

.controller('StudentCtrl', function ($scope,$stateParams,$state,studentsService){
        $scope.studentId =  $stateParams.studentId;
        $scope.goToAttendance = function(){
            console.log('this is go to attendacne fn');
            console.log('state parameters ' + $stateParams.studentId);
            console.log('Scope Student Id' + $scope.studentId);
            console.log('scope  ' + $scope);
            $state.go('tabs.attendance',{"studentId":studentsService.getCurrentStudent().objectId});
        };
        $scope.goToBehavior= function(){
            console.log('this is go to behavior fn');
            $state.go('tabs.behavior',{"studentId":studentsService.getCurrentStudent().objectId});
        };
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
                       $state.go('login');
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

.controller('Students', function($scope, $state,  $ionicLoading , studentsService) {

        $scope.showHUD = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function(){
            $ionicLoading.hide();
        };
        if(studentsService.getStudents().length == 0){
            var Student = Parse.Object.extend("Student");
            var query = new Parse.Query(Student);
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
                    studentsService.setStudents($scope.children);
                    $scope.hideHUD();

                },
                error: function(error) {
                    $scope.hideHUD();
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        else{
            $scope.children = studentsService.getStudents();
        }
        $scope.goToChildren = function(index){
            studentsService.setCurrentStudent($scope.children[index]);
            $state.go('tabs.attendance',{"studentId":studentsService.getCurrentStudent().objectId})
        };

    })

.controller('BehaviorCtrl', function ($scope,$stateParams,BehaviorTypesService,$state,$ionicLoading){

        $scope.showHUD = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function(){
            $ionicLoading.hide();
        };

    $scope.behaviorRecords = [];
     $scope.showHUD('loading..');
    var behavior = Parse.Object.extend("Behavior");
    var behaviorQuery = new Parse.Query(behavior);

    var student = Parse.Object.extend("Student");
    var studentQuery = new Parse.Query(student);
    studentQuery.equalTo("objectId",$stateParams.studentId);

    behaviorQuery .matchesQuery("student", studentQuery);
    behaviorQuery .find({
        success: function(behaviorResults) {
            for (var i = 0; i < behaviorResults.length; i++) {
                var behaviorObject = behaviorResults[i].toJSON();
                behaviorObject.behaviorDate= new Date (behaviorObject.behaviorDate.iso);
                var behaviorTypeObject = BehaviorTypesService.getBehaviorType(behaviorObject.behaviorType.objectId);
                behaviorTypeObject.isPositive = (behaviorTypeObject.isPositive == 0) ? 'Positive' :'Negative';
                var behaviorRecord = {
                    behavior:'',
                    behaviorType :''
                };
                behaviorRecord .behavior = behaviorObject;
                behaviorRecord .behaviorType = behaviorTypeObject;
                $scope.behaviorRecords.push(behaviorRecord);
                $scope.$apply();
                $scope.hideHUD();
                console.log('behavior date   ' + behaviorRecord.behavior.behaviorDate.toDateString());
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
        $scope.goBack =function(){
            $state.go('app.Students');
        }
})
.controller('BrowseCtrl', function ($scope,$stateParams,BehaviorTypesService,$state,$ionicLoading){
        var ctx = document.getElementById("myChart").getContext("2d");

        var data = [
            {
                value: 30,
                color:"#F7464A",
            },
            {
                value : 80,
                color : "#E2EAE9",
            }
        ];

        var options= {
            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : "#fff",

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //The percentage of the chart that we cut out of the middle.
            percentageInnerCutout : 50,

            //Boolean - Whether we should animate the chart
            animation : true,

            //Number - Amount of animation steps
            animationSteps : 100,

            scaleShowLabels : false,

            //String - Animation easing effect
            animationEasing : "easeOutBounce",

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : true,

            //Function - Will fire on animation completion.
            onAnimationComplete : null,

            scaleLabelPaddingX: 35,
            scaleFontFamily : "'Arial'",
            scaleFontSize : 12,
            scaleFontStyle : "normal",
            scaleFontColor : "#666",
            scaleLabel : "<%=value%>"
        };
        new Chart(ctx).Pie(data,options);
    });

