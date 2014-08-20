angular.module('starter.controllers', ['angles','angularCharts'])
    .service('AttendanceTypesService',function(){
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
                    var behaviorTypeObject = behaviorTypesResults[i].toJSON();
                    behaviorTypeObject.isPositive = (behaviorTypeObject.isPositive == 1) ? 'Positive' :'Negative';
                    if(behaviorTypeObject.isDeleted == false){
                        behaviortypes.push(behaviorTypeObject);
                    }
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
        console.log('this is lesson serive ');
        var lessons = [];
        var lesson =  Parse.Object.extend("Lesson");
        var lessonsQuery = new Parse.Query(lesson);
        lessonsQuery .find({
            success: function (lessonsResults) {
                console.log('lesson serivce success');
                for(i in lessonsResults){
                    var lessonObject = lessonsResults[i].toJSON();
                    lessonObject.lessonStartDate = new Date (lessonObject.lessonStartDate.iso);
                    lessonObject.lessonStartTime= new Date (lessonObject.lessonStartTime.iso);
                    lessonObject.lessonEndTime= new Date (lessonObject.lessonEndTime.iso);
                    console.log('lesson Object ID :' + lessonObject.objectId);
                    if(lessonObject.isDeleted == false){
                        lessons.push(lessonObject);
                    }
                }
            },
            error:function(error){
                alert("Error: " + error.code + " " + error.message);
            }
        });
        this.getLesson = function(lessonId){
            for(i in lessons){
                if(lessons[i].objectId == lessonId){
                    return lessons[i];
                }
            }
        }
    })
    .service('studentsService',function(){
        var students = [];
        var currentStudent;
        var selectedClassroomId;
        this.addStudent = function(student){
            students.push(student);
        };
        this.setSelectedClassroomId = function(classroomId){
            selectedClassroomId = classroomId;
        };

        this.getSelectedClassroomId = function () {
            return selectedClassroomId;
        }
        this.setCurrentStudent = function(student,studentObject){
            console.log('this is set current student fn');
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
        this.getCurrentStudent = function(){
            return currentStudent;
        };

    })
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

.controller('AppCtrl', function($scope,storage) {
    $scope.logOut = function(){
       window.localStorage.clear();
    }   
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

.controller('AttendanceCtrl', function ($scope,LessonService,$stateParams,AttendanceTypesService,$ionicNavBarDelegate,$state,$ionicLoading,studentsService,$ionicPopup){

        $scope.pageTitle = studentsService.getCurrentStudent().firstName;
        var selectedClassroomId = studentsService.getSelectedClassroomId();

        //Attendance Chart
        $scope.tmpChartData = [];
        $scope.AddItemInAttendanceChartsData = function(record){
            var found = false;
            for(var i = 0; i < $scope.tmpChartData.length; i++) {
                var item = $scope.tmpChartData [i];
                if(item.title == record.type.title){
                    item.value +=1;
                    found = true;
                    break;
                }
            }
            if(!found){
                var addedItem = {
                    value : 1,
                    color: "#"+record.type.color,
                    title : record.type.title
                }
                $scope.tmpChartData.push(addedItem);
            }
        };
        var myChartOptions  =  {
            inGraphDataShow : true,
            datasetFill : false,
            scaleTickSizeRight : 0,
            scaleTickSizeLeft : 0,
            scaleTickSizeBottom :0,
            scaleTickSizeTop : 0,
            scaleFontSize : 20,
            canvasBorders : false,
            canvasBordersWidth :1,
            canvasBordersColor : "black",
            graphTitle : "Attendance",
            graphTitleFontFamily : "'Arial'",
            graphTitleFontSize : 24,
            graphTitleFontStyle : "bold",
            graphTitleFontColor : "#666",
            graphSubTitleFontFamily : "'Arial'",
            graphSubTitleFontSize : 18,
            graphSubTitleFontStyle : "normal",
            graphSubTitleFontColor : "#666",
            inGraphDataTmpl: "<%=roundToWithThousands(config,v2,2)%>",
            inGraphDataFontColor: "#666",
            legend : true,
            legendFontFamily : "'Arial'",
            legendFontSize : 9,
            legendFontStyle : "normal",
            legendFontColor : "#666",
            legendBlockSize : 50,
            legendBorders : true,
            legendBordersWidth : 1,
            legendBordersColors : "#666",
            annotateDisplay : false,
            spaceTop : 0,
            spaceBottom : 0,
            spaceLeft : 0,
            spaceRight : 0,
            logarithmic: true,
            animationSteps : 50,
            rotateLabels : "smart",
            xAxisSpaceOver : 0,
            xAxisSpaceUnder : 0,
            xAxisLabelSpaceAfter : 0,
            xAxisLabelSpaceBefore : 0,
            legendBordersSpaceBefore : 0,
            legendBordersSpaceAfter : 0,
            footNoteSpaceBefore : 0,
            footNoteSpaceAfter : 0,
            startAngle : 0,
            dynamicDisplay : false
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// Hud
        $scope.showHUD = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function(){
            $ionicLoading.hide();
        };

        $scope.showAlert = function(title,content) {
            $ionicPopup.alert({
                title: title,
                content: content
            });
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        var lessons = [];

        var classroom = Parse.Object.extend("Classroom");
        var classroomQuery = new Parse.Query(classroom);
        classroomQuery.equalTo("objectId",selectedClassroomId);
        classroomQuery .find({
            success: function (classrooms) {
                if(classrooms.length>0){
                    var classroom = classrooms[0];
                    var lessonsRelation = classroom.relation("lessons");
                    lessonsRelation.query().find({
                        success: function(lessonsObjects) {
                            for (var i = 0; i < lessonsObjects.length; i++) {
                                var lesson =  lessonsObjects[i].toJSON();
                                lesson.lessonStartDate = new Date (lesson.lessonStartDate.iso);
                                lesson.lessonStartTime= new Date (lesson.lessonStartTime.iso);
                                lesson.lessonEndTime= new Date (lesson.lessonEndTime.iso);
                                lessons.push(lesson);
                               }
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
                                    var error = false;
                                    for (var i = 0; i < attendancesResults.length; i++) {
                                        var attendanceObject = attendancesResults[i].toJSON();
                                        if(attendanceObject.isDeleted == false){
                                            var record = {
                                                attendance :'',
                                                type :'',
                                                lesson:''
                                            };
                                            record.attendance = attendanceObject;
                                            record.type = AttendanceTypesService.getType(attendanceObject.type.objectId);
                                            var found;
                                            var currentLesson ;
                                            for (var k = 0; k < lessons.length; k++) {
                                                var lesson = lessons[k];
                                                if(lesson.objectId == attendanceObject.lesson.objectId){
                                                     found = true;
                                                     currentLesson = lesson;
                                                     break;
                                                }
                                            }
                                            if(found) {

                                                record.lesson = currentLesson;
                                                $scope.records.push(record);
                                                $scope.AddItemInAttendanceChartsData(record);
                                            }
                                        }
                                    }
                                    if(error){
                                        $scope.hideHUD();
                                        $scope.showAlert('Error','Error in retrieving data...');
                                        $scope.records = [];
                                        $scope.myChartData = [];
                                    }
                                    else{
                                        $scope.records.sort(function(a,b){
                                            if((b.lesson.lessonStartDate - a.lesson.lessonStartDate) == 0){
                                                return b.lesson.lessonStartTime - a.lesson.lessonStartTime;
                                            }
                                            return new Date(b.lesson.lessonStartDate) - new Date(a.lesson.lessonStartDate);
                                        });
                                        var ChartData = $scope.tmpChartData;
                                        $scope.$apply();
                                        for(var j = 0; j < $scope.records.length; j++){
                                            var object =  $scope.records[j];
                                            var element = document.getElementById(j);
                                            var objectColor = '#' + object.type.color;
                                            element.style.backgroundColor = objectColor;
                                        }
                                    }
                                    new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(ChartData,myChartOptions);
                                    $scope.hideHUD();
                                },
                                error: function(error) {
                                    alert("Error: " + error.code + " " + error.message);
                                }
                            });

                        }
                    });
                }
            },
            error:function(error){
                alert("Error: " + error.code + " " + error.message);
            }
        });


        $scope.goBack =function(){
            $state.go('app.Students');
        }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $scope.data = {
            data : [{
                x : "Jack",
                y: [100,210, 384],
                tooltip:"this is tooltip"
            },
                {
                    x : "John",
                    y: [300, 289, 456]
                },
                {
                    x : "Stacy",
                    y: [351, 170, 255]
                },
                {
                    x : "Luke",
                    y: [54, 341, 879]
                }]
        };

        $scope.chartType = 'bar';


        $scope.config = {
            labels: false,
            title : "Products",
            legend : {
                display: true,
                position:'right'
            },
            click : function(d) {
                console.log('clicked');
            },
            mouseover : function(d) {
                console.log('mouseover');
            },
            mouseout : function(d) {
                console.log('mouseout');
            },
            innerRadius: 0,
            lineLegend: 'lineEnd'
        }
    })

.controller('PlaylistCtrl', function($scope, $stateParams) {

})

//.controller('ChildrenCtrl', function ($scope, $ionicLoading,$state,studentsService){
//        $scope.PressHandler = function(studentId){
//            $state.go();
//        };
//        $scope.show = function() {
//            $ionicLoading.show({
//                template: 'Loading...'
//            });
//        };
//        $scope.hide = function(){
//            $ionicLoading.hide();
//        };
//
//        var Student = Parse.Object.extend("Student");
//        var query = new Parse.Query(Student);
//        query.equalTo()
//        $scope.show();
//        query.find({
//            success: function(results) {
//
//                $scope.children=[];
//
//                for (var i = 0; i < results.length; i++) {
//                    var object = results[i];
//                    $scope.children.push(object.toJSON());
//                }
//               // Do something with the returned Parse.Object values
//                console.log(results);
//                $scope.hide();
//
//            },
//            error: function(error) {
//                $scope.hide();
//                alert("Error: " + error.code + " " + error.message);
//            }
//        });
//})

.controller('StudentCtrl', function ($scope,$stateParams,$state,studentsService){
        $scope.studentId =  studentsService.getCurrentStudent().objectId;
       $scope.goToAttendance = function(){
            console.log('this is go to attendacne fn');
            console.log('state parameters ' + $stateParams.studentId);
            console.log('Scope Student Id' + studentsService.getCurrentStudent().objectId);
            console.log('scope  ' + $scope);
            $state.go('tabs.attendance',{"studentId":studentsService.getCurrentStudent().objectId});
        };
        $scope.goToBehavior= function(){
            console.log('this is go to behavior fn');
            $state.go('tabs.behavior',{"studentId":studentsService.getCurrentStudent().objectId});
        };
})

.controller('LogInCtrl', function($scope, $state,$ionicLoading,$ionicPopup,storage,OpenFB) {
//        window.localStorage.clear();
//        alert('this is localstorage' + JSON.stringify(window.localStorage));
//        console.log('this is login ctrl');
//        storage.removeObject('User');
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

        $scope.show = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hide = function(){
            $ionicLoading.hide();
        };
        $scope.showAlert = function(title,content) {
            $ionicPopup.alert({
                title: title,
                content: content
            });
        }
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
//                            alert("access " +  accessToken);
                            var Expire_date = new Date(1970,0,1);
                            Expire_date.setSeconds(expires_in_seconds);
//                            alert("Expires_In " +  Expire_date);
                            var facebookAuthData = {
                                "id": user.id + "",
                                "access_token": accessToken,
                                "expiration_date" :Expire_date.toISOString()
                            }
//                            alert(facebookAuthData)
                            Parse.FacebookUtils.logIn(facebookAuthData, {
                                success: function(user) {
                                    $scope.hide();
//                                   alert('yeees');
                                    if (!user.existed()) {
                                            $state.go('welcome');
//                                        var welcomeMessage = 'Welcome ' + $scope.user.username;
//                                        $scope.show(welcomeMessage);
//                                        setTimeout(function (){
//
//                                            $scope.hide();
//                                        }, 2000);
                                    } else {
                                        $state.go('app.Students');
                                    }
                                },
                                error: function(user, error) {
//                                    $scope.hide();
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

.controller('Students', function($scope, $state,  $ionicLoading , studentsService,BehaviorTypesService,LessonService,AttendanceTypesService) {
        $scope.studentIndex =-1;
        $scope.showHUD = function (text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function () {
            $ionicLoading.hide();
        };

        var Student = Parse.Object.extend("Student");
        var query = new Parse.Query(Student);
        $scope.showHUD('loading..');

        query.find({
            success: function (results) {
                $scope.children = [];
                $scope.childrenObjects = [];
                for (var i = 0; i < results.length; i++) {
                    var object = results[i].toJSON();
                    var rawObject = results[i];
                    if (object.isDeleted == false) {
                        $scope.children.push(object);
                        $scope.childrenObjects.push(rawObject);
                    }
                }
                console.log(results);
                $scope.children.sort(compareChildren)
                $scope.childrenObjects.sort(compareChildrenObjects);
                studentsService.setStudents($scope.children);
                $scope.$apply();
                $scope.hideHUD();
            },
            error: function (error) {
                $scope.hideHUD();
                alert("Error: " + error.code + " " + error.message);
            }
        });

        $scope.toggleGroup = function (group, index) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {

                $scope.showHUD('loading..');
                $scope.studentIndex = index;
                var classroomsRelation = $scope.childrenObjects[index].relation("classrooms");
                var classQuery = classroomsRelation.query();
                classQuery.find({
                    success: function (classes) {
                        var studentClasses = [];
                        for (var j = 0; j < classes.length; j++) {
                            var classObject = classes[j];
                            studentClasses.push(classObject);
                        }
                        $scope.children[index].classrooms = studentClasses;
                        studentsService.setStudents($scope.children);
                        $scope.$apply();
                        $scope.hideHUD();
                    },
                    error: function (error) {
                        $scope.hideHUD();
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
                $scope.shownGroup = group;
            }
        };

        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };

        $scope.goToChildren = function (index) {
            studentsService.setCurrentStudent($scope.children[$scope.studentIndex]);
            studentsService.setSelectedClassroomId($scope.children[$scope.studentIndex].classrooms[index].id);
            console.log("classroom:",$scope.children[$scope.studentIndex].classrooms[index].id);
            $state.go('tabs.summary',{"studentId":studentsService.getCurrentStudent().objectId})
        };

        function compareChildren(a, b) {

            var first1lower = a.firstName.toLowerCase();
            var first2lower = b.firstName.toLowerCase();

            var last1lower = a.lastName.toLowerCase();
            var last2lower = b.lastName.toLowerCase();

            if (first1lower > first2lower)
                return 1;
            if (first2lower > first1lower)
                return -1
            if (last1lower > last2lower)
                return 1;
            if (last2lower > last1lower)
                return -1

            var aFirst = a.firstName.charAt(0);
            if (a.firstName.charAt(0) > b.firstName.charAt(0))
                return 1;
            if (b.firstName.charAt(0) > a.firstName.charAt(0))
                return -1;
            if (a.lastName.charAt(0) > b.lastName.charAt(0))
                return 1;
            if (b.lastName.charAt(0) > a.lastName.charAt(0))
                return -1;
            return 0;
        }

        function compareChildrenObjects(a, b) {

            var first1lower = a.attributes.firstName.toLowerCase();
            var first2lower = b.attributes.firstName.toLowerCase();

            var last1lower = a.attributes.lastName.toLowerCase();
            var last2lower = b.attributes.lastName.toLowerCase();

            if (first1lower > first2lower)
                return 1;
            if (first2lower > first1lower)
                return -1
            if (last1lower > last2lower)
                return 1;
            if (last2lower > last1lower)
                return -1

            var aFirst = a.attributes.firstName.charAt(0);
            if (a.attributes.firstName.charAt(0) > b.attributes.firstName.charAt(0))
                return 1;
            if (b.attributes.firstName.charAt(0) > a.attributes.firstName.charAt(0))
                return -1;
            if (a.attributes.lastName.charAt(0) > b.attributes.lastName.charAt(0))
                return 1;
            if (b.attributes.lastName.charAt(0) > a.attributes.lastName.charAt(0))
                return -1;
            return 0;

        }
    })

.controller('BehaviorCtrl', function ($scope,$stateParams,BehaviorTypesService,$state,$ionicLoading,studentsService){

        $scope.pageTitle = studentsService.getCurrentStudent().firstName;
        var selectedClassroomId = studentsService.getSelectedClassroomId();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Behavior Chart
        $scope.myChartData = [];
//        var ctx = document.getElementById("myChart").getContext("2d");
        $scope.AddItemInBehaviorChartsData = function(record){
            var found = false;
            var title = record.behaviorType.isPositive;
            var color= record.behaviorType.isPositive  == 'Positive' ? '#00FF00':'#FF0000';
            for(var i = 0; i < $scope.myChartData .length; i++) {
                var item = $scope.myChartData [i];
                if(item.title == title){
                    item.value +=1;
                    found = true;
                    break;
                }
            }
            if(!found){
                var addedItem = {
                    value : 1,
                    color: color,
                    title : title
                }
                $scope.myChartData.push(addedItem);
                console.log('this is length of chart data :   ' + $scope.myChartData.length);
            }
        };
        $scope.myChartOptions = {
            inGraphDataShow: true,
            datasetFill: false,
            scaleTickSizeRight: 0,
            scaleTickSizeLeft: 0,
            scaleTickSizeBottom: 0,
            scaleTickSizeTop: 0,
            scaleFontSize: 20,
            canvasBorders: false,
            canvasBordersWidth: 1,
            canvasBordersColor: "black",
            graphTitle: "Behavior",
            graphTitleFontFamily: "'Arial'",
            graphTitleFontSize: 24,
            graphTitleFontStyle: "bold",
            graphTitleFontColor: "#666",
//            graphSubTitle : '',
//            graphSubTitleFontFamily : "'Arial'",
//            graphSubTitleFontSize : 18,
//            graphSubTitleFontStyle : "normal",
//            graphSubTitleFontColor : "#666",
//            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ roundToWithThousands(config,v2,2) + ' (' + roundToWithThousands(config,v6,1) + ' %)'%>",
            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+' = ')+ roundToWithThousands(config,v2,2)%>",
            inGraphDataFontColor: "#666",
            legend: false,
            legendFontFamily: "'Arial'",
            legendFontSize: 9,
            legendFontStyle: "normal",
            legendFontColor: "#666",
            legendBlockSize: 50,
            legendBorders: true,
            legendBordersWidth: 1,
            legendBordersColors: "#666",
            annotateDisplay: false,
            spaceTop: 0,
            spaceBottom: 0,
            spaceLeft: 0,
            spaceRight: 0,
            logarithmic: true,
            animationSteps: 50,
            rotateLabels: "bottom",
            xAxisSpaceOver: 0,
            xAxisSpaceUnder: 0,
            xAxisLabelSpaceAfter: 0,
            xAxisLabelSpaceBefore: 0,
            legendBordersSpaceBefore: 0,
            legendBordersSpaceAfter: 0,
            footNoteSpaceBefore: 0,
            footNoteSpaceAfter: 0,
            startAngle: 180,
            dynamicDisplay: false
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //Loading
        $scope.showHUD = function(text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function(){
            $ionicLoading.hide();
        };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.behaviorRecords = [];
     $scope.showHUD('loading..');
    var behavior = Parse.Object.extend("Behavior");
    var behaviorQuery = new Parse.Query(behavior);

    var student = Parse.Object.extend("Student");
    var studentQuery = new Parse.Query(student);
    studentQuery.equalTo("objectId",$stateParams.studentId);

    var classroom = Parse.Object.extend("Classroom");
    var classroomQuery = new Parse.Query(classroom);
    classroomQuery.equalTo("objectId",selectedClassroomId);

    behaviorQuery .matchesQuery("student", studentQuery);
    behaviorQuery .matchesQuery("classroom", classroomQuery);

    behaviorQuery .find({
        success: function(behaviorResults) {
            for (var i = 0; i < behaviorResults.length; i++) {
                var behaviorObject = behaviorResults[i].toJSON();
                if(behaviorObject.isDeleted == false){
                    behaviorObject.behaviorDate= new Date (behaviorObject.behaviorDate.iso);
                    var behaviorTypeObject = BehaviorTypesService.getBehaviorType(behaviorObject.behaviorType.objectId);
                    var behaviorRecord = {
                        behavior:'',
                        behaviorType :''
                    };
                    behaviorRecord .behavior = behaviorObject;
                    behaviorRecord .behaviorType = behaviorTypeObject;
                    $scope.behaviorRecords.push(behaviorRecord);
                    $scope.$apply();
                    console.log('behavior date   ' + behaviorRecord.behavior.behaviorDate.toDateString());
                    $scope.AddItemInBehaviorChartsData(behaviorRecord);
                }
            }
                $scope.behaviorRecords.sort(function(a,b){
                    return b.behavior.behaviorDate - a.behavior.behaviorDate;
                });
//         var x =  new Chart(ctx).Doughnut(chartItems,options);
            $scope.hideHUD();
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

        $scope.myChartData = [
            {
                value: 30,
                color:"#F7464A",
                title : 'class a'
            },
            {
                value : 50,
                color : "#E2EAE9",
                title : 'class a'
            },
            {
                value : 100,
                color : "#D4CCC5",
                title : 'class a'
            },
            {
                value : 40,
                color : "#949FB1",
                title : 'class a'

            },
            {
                value : 120,
                color : "#4D5360",
                title : 'class a'

            }
        ];
        $scope.myChartOptions =  {
                inGraphDataShow : true,
                datasetFill : false,
                scaleTickSizeRight : 0,
                scaleTickSizeLeft : 0,
                scaleTickSizeBottom :0,
                scaleTickSizeTop : 0,
                scaleFontSize : 20,
                canvasBorders : false,
                canvasBordersWidth :1,
                canvasBordersColor : "black",
                graphTitle : "Attendance",
                graphTitleFontFamily : "'Arial'",
                graphTitleFontSize : 24,
                graphTitleFontStyle : "bold",
                graphTitleFontColor : "#666",
                graphSubTitle : false,
                graphSubTitleFontFamily : "'Arial'",
                graphSubTitleFontSize : 18,
                graphSubTitleFontStyle : "normal",
                graphSubTitleFontColor : "#666",
//            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ roundToWithThousands(config,v2,2) + ' (' + roundToWithThousands(config,v6,1) + ' %)'%>",
                inGraphDataTmpl: "<%=(v1 == ''? '' : v1+'= ')+ roundToWithThousands(config,v2,2)%>",
//            footNote : "Footnote for the graph",
//            footNoteFontFamily : "'Arial'",
//            footNoteFontSize : 8,
//            footNoteFontStyle : "bold",
//            footNoteFontColor : "#666",
                legend : false,
                legendFontFamily : "'Arial'",
                legendFontSize : 12,
                legendFontStyle : "normal",
                legendFontColor : "#666",
                legendBlockSize : 20,
                legendBorders : false,
                legendBordersWidth : 1,
                legendBordersColors : "#666",
                annotateDisplay : false,
                spaceTop : 0,
                spaceBottom : 0,
                spaceLeft : 0,
                spaceRight : 0,
                logarithmic: false,
//            rotateLabels : "smart",
                xAxisSpaceOver : 0,
                xAxisSpaceUnder : 0,
                xAxisLabelSpaceAfter : 0,
                xAxisLabelSpaceBefore : 0,
                legendBordersSpaceBefore : 0,
                legendBordersSpaceAfter : 0,
                footNoteSpaceBefore : 0,
                footNoteSpaceAfter : 0,
                startAngle : 0,
                dynamicDisplay : false,
                scaleLabelPaddingX: 35,
                scaleFontFamily : "'Arial'",
                scaleFontSize : 12,
                scaleFontStyle : "normal",
                scaleFontColor : "#666",
                scaleLabel : "<%=value%>"
        };
    })

.controller('AccessCodeCtrl', function($scope,$state,$ionicPopup,$ionicLoading) {

        $scope.addAccessCode = function (code){
            $scope.show('Loading...');
            Parse.Cloud.run('useAccessCode', { accessCode: code }, {
                success: function(result) {
                    // ratings should be 4.5
                    console.log(result);
                    console.log(JSON.stringify(result));
                    console.log("successful results");
                    $scope.hide();
                    $scope.show('Added successfully');
                    $state.go('app.Students');
                },
                error: function(error) {
                    $scope.hide();
                    $scope.showAlert('Error','Invalid access code');
                }
            });
        };



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

.controller('SummaryCtrl',function($scope,studentsService,$state){
        $scope.pageTitle = studentsService.getCurrentStudent().firstName;
        $scope.goBack =function(){
            $state.go('app.Students');
        };

        $scope.data = {
            series: ['Sales', 'Income', 'Expense', 'Laptops', 'Keyboards'],
            data : [{
                x : "Sales",
                y: [100,500, 0],
                tooltip:"this is tooltip"
            },
                {
                    x : "Not Sales",
                    y: [300, 100, 100]
                },
                {
                    x : "Tax",
                    y: [351]
                },
                {
                    x : "Not Tax",
                    y: [54, 0, 879]
                }]
        };
$scope.chartType = 'bar';

$scope.config = {
    labels: false,
    title : "Not Products",
    legend : {
        display:true,
        position:'left'
    },
    innerRadius: 0
};

    })

.controller('GradesCtrl',function($scope,studentsService,$state,$stateParams,$ionicLoading,$ionicScrollDelegate){

        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        $scope.showHUD = function (text) {
            $ionicLoading.show({
                template: text
            });
        };
        $scope.hideHUD = function () {
            $ionicLoading.hide();
        };

        $scope.showHUD('loading..');

        $scope.pageTitle = studentsService.getCurrentStudent().firstName;
        var selectedClassroomId = studentsService.getSelectedClassroomId();
        var studentId =  studentsService.getCurrentStudent().objectId;

        $scope.goBack =function(){
            $state.go('app.Students');
        };
        $scope.data = [];

        var myChartOptions  =  {
            inGraphDataShow : true,
            datasetFill : false,
            scaleTickSizeRight : 0,
            scaleTickSizeLeft : 0,
            scaleTickSizeBottom :0,
            scaleTickSizeTop : 0,
            scaleFontSize : 20,
            canvasBorders : false,
            canvasBordersWidth :1,
            canvasBordersColor : "black",
            graphTitle : "Grades",
            graphTitleFontFamily : "'Arial'",
            graphTitleFontSize : 24,
            graphTitleFontStyle : "bold",
            graphTitleFontColor : "#666",
            graphSubTitleFontFamily : "'Arial'",
            graphSubTitleFontSize : 24,
            graphSubTitleFontStyle : "normal",
            graphSubTitleFontColor : "#666",
            inGraphDataTmpl: "<%=roundToWithThousands(config,v2,2)%>",
            inGraphDataFontColor: "#666",
            legend : true,
            legendFontFamily : "'Arial'",
            legendFontSize : 14,
            legendFontStyle : "normal",
            legendFontColor : "#666",
            legendBlockSize : 50,
            legendBorders : true,
            legendBordersWidth : 1,
            legendBordersColors : "#666",
            annotateDisplay : false,
            spaceTop : 0,
            spaceBottom : 0,
            spaceLeft : 0,
            spaceRight : 0,
            logarithmic: true,
            animationSteps : 50,
            rotateLabels : "smart",
            xAxisSpaceOver : 0,
            xAxisSpaceUnder : 0,
            xAxisLabelSpaceAfter : 0,
            xAxisLabelSpaceBefore : 0,
            legendBordersSpaceBefore : 0,
            legendBordersSpaceAfter : 0,
            footNoteSpaceBefore : 0,
            footNoteSpaceAfter : 0,
            startAngle : 0,
            dynamicDisplay : false
        }
        $scope.children = [];
        $scope.categories = [];
        var mainChartData = [];
        var categories = [];
        var gradeCategory = Parse.Object.extend("Gradecategory");
        var gradeCategoryQuery = new Parse.Query(gradeCategory);

        var classroom = Parse.Object.extend("Classroom");
        var classroomQuery = new Parse.Query(classroom);
        var count = 0;
        var totalCategoriesCount = 0;
        classroomQuery.equalTo("objectId",selectedClassroomId);

        gradeCategoryQuery .matchesQuery("classroom", classroomQuery);

        gradeCategoryQuery .find({
            success: function(gradeCategoryResults) {
                totalItemsCount = gradeCategoryResults.length;
                for (var i = 0; i < gradeCategoryResults.length; i++) {
                    gradeCategoryResults[i].gradableItems = [];
                    categories.push(gradeCategoryResults[i]);
                    var gradableItemRelation = gradeCategoryResults[i].relation("gradableItems");
                    gradableItemRelation.query().find({
                        success: function (gradableItems) {
                            var gradesCount = 0;
                            if(gradableItems.length<=0)count++;
                            for (var j = 0; j < gradableItems.length; j++) {
                                var grade = Parse.Object.extend("Grade");
                                var gradeQuery = new Parse.Query(grade);

                                var gradableItemParse = Parse.Object.extend("Gradableitem");
                                var gradableItemQuery = new Parse.Query(gradableItemParse);

                                gradableItemQuery.equalTo("objectId", gradableItems[j].id);

                                var student = Parse.Object.extend("Student");
                                var studentQuery = new Parse.Query(student);
                                var gradesCount = 0;
                                studentQuery.equalTo("objectId", studentId);

                                gradeQuery.matchesQuery("student", studentQuery);
                                gradeQuery.matchesQuery("gradableItem", gradableItemQuery);
                                gradeQuery.find({
                                    success: function (grades) {
                                        gradesCount++;
                                        for (var z = 0; z < gradableItems.length; z++) {
                                            for (var k = 0; k < grades.length; k++) {
                                                var tempGradableItem = gradableItems[z].toJSON();
                                                var tempgrade = grades[k].toJSON();
                                                if (tempGradableItem.objectId == tempgrade.gradableItem.objectId) {
                                                    gradableItems[z].grade = grades[k];
                                                }
                                            }
                                        }
                                        if(gradesCount >= gradableItems.length)
                                        {
                                            count++;
                                            for (var g = 0; g < categories.length && gradableItems.length>0; g++) {
                                                var tempGradableItem = gradableItems[0].toJSON();
                                                var tempGradeCategory = categories[g].toJSON();
                                                if (tempGradableItem.gradeCategory.objectId == tempGradeCategory.objectId) {
                                                    categories[g].gradableItems = gradableItems;
                                                    var chartItems = {
                                                        value: tempGradeCategory.percent,
                                                        color: getRandomColor(),
                                                        title: tempGradeCategory.title
                                                    };
                                                    var dataGridItem = {
                                                        id: tempGradeCategory.sortKey,
                                                        category: tempGradeCategory.title,
                                                        weight: tempGradeCategory.percent,
                                                        grade: "*"
                                                    };
                                                    $scope.data.push(dataGridItem);
                                                    mainChartData.push(chartItems);
                                                    $scope.categories.push(categories[g]);
                                                    $scope.children.push(tempGradeCategory.title);
                                                    break
                                                }
                                            }
                                            if(count >= gradeCategoryResults.length ) {
                                                new Chart(document.getElementById("mainCanvas").getContext("2d")).Pie(mainChartData, myChartOptions);
                                                $scope.hideHUD();
                                            }
                                        }
                                    }
                                });
                            }
                        },
                        error: function(error) {
                            count++;
                            $scope.hideHUD();
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });

                }
            },
            error: function(error) {
                $scope.hideHUD();
                alert("Error: " + error.code + " " + error.message);
            }
        });

            // calculating the summary
            $scope.sum = {
                category: 0, weight: 0, grade: 0
            };

            for (var idx = 0; idx < $scope.data.length-1; idx++) {
                for (var key in $scope.sum) {
                    $scope.sum[key] += $scope.data[idx][key];
                }
            }
            $scope.sum.markup = ($scope.sum.valorLiquido / $scope.sum.custo - 1) * 100;
            $scope.sum.ticketMedio = $scope.sum.valorLiquido / $scope.sum.vendas;
            $scope.sum.quantidadeMedia = $scope.sum.quantidade / $scope.sum.vendas;
            $scope.sum.precoMedio = $scope.sum.valorLiquido / $scope.sum.quantidade;

            // table sorting
            $scope.predicate = 'id';
            $scope.desc = false;



            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.sort = function(key) {
                if ($scope.predicate == key)
                    $scope.desc = !$scope.desc;
                else
                    $scope.predicate = key;
            }

            var adjusting = false;

            $scope.scrollMirror = function(from, to) {
                if (adjusting) {
                    adjusting = false;
                } else {
                    // Mirroring zoom level
                    var zoomFrom = $ionicScrollDelegate.$getByHandle(from).getScrollView().getValues().zoom;
                    var zoomTo = $ionicScrollDelegate.$getByHandle(to).getScrollView().getValues().zoom;

                    if (zoomFrom != zoomTo) {
                        $ionicScrollDelegate.$getByHandle(to).getScrollView().zoomTo(zoomFrom);
                    }

                    // Mirroring left position
                    $ionicScrollDelegate.$getByHandle(to).scrollTo($ionicScrollDelegate.$getByHandle(from).getScrollPosition().left,
                        $ionicScrollDelegate.$getByHandle(to).getScrollPosition().top);

                    adjusting = true;
                }
            };

        $scope.toggleGroup = function (group, index) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.currentCategory = $scope.categories[index];
                $scope.gradableItemsData = [];
                for(var i=0;i< $scope.currentCategory.gradableItems.length; i++) {
                    var tempGradableItem = $scope.currentCategory.gradableItems[i];
                    var dataGridItem = {
                        id: i,
                        title: tempGradableItem.attributes.title,
                        grade: tempGradableItem.grade.attributes.gradeValue + " / " +tempGradableItem.attributes.maximumGrade,
                        weight: tempGradableItem.attributes.weight
                    };
                    $scope.gradableItemsData.push(dataGridItem);
                }
                var data = {
                    labels: ["Assignments", "Exam 1", "Exam 2", "Exam 3", "Midterm", "Final"],
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: [65, 59, 80, 81, 56, 55]
                        },
                        {
                            label: "My Second dataset",
                            fillColor: "rgba(151,187,205,0.5)",
                            strokeColor: "rgba(151,187,205,0.8)",
                            highlightFill: "rgba(151,187,205,0.75)",
                            highlightStroke: "rgba(151,187,205,1)",
                            data: [28, 48, 40, 19, 86,90]
                        }
                    ]
                };
                var chartOptions = {
                    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                    scaleBeginAtZero : true,
                    //Boolean - Whether grid lines are shown across the chart
                    scaleShowGridLines : true,
                    graphTitle : "Grades",
                    //String - Colour of the grid lines
                    scaleGridLineColor : "rgba(0,0,0,.05)",
                    //Number - Width of the grid lines
                    scaleGridLineWidth : 1,
                    //Boolean - If there is a stroke on each bar
                    barShowStroke : true,
                    //Number - Pixel width of the bar stroke
                    barStrokeWidth : 2,
                    //Number - Spacing between each of the X value sets
                    barValueSpacing : 5,
                    //Number - Spacing between data sets within X values
                    barDatasetSpacing : 1,
                    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
                }



                var mainChartData = [
                    {
                        value: 10,
                        color:"#F7464A",
                        title : 'Exam 1'
                    },
                    {
                        value : 20,
                        color : "#E2EAE9",
                        title : 'Exam 2'
                    },
                    {
                        value : 30,
                        color : "#D4CCC5",
                        title : 'Exam 3'
                    },
                    {
                        value : 20,
                        color : "#949FB1",
                        title : 'Midterm'

                    },
                    {
                        value : 20,
                        color : "#4D5360",
                        title : 'Final'

                    }
                ];

                var myChartOptions  =  {
                    inGraphDataShow : true,
                    datasetFill : false,
                    scaleTickSizeRight : 0,
                    scaleTickSizeLeft : 0,
                    scaleTickSizeBottom :0,
                    scaleTickSizeTop : 0,
                    scaleFontSize : 20,
                    canvasBorders : false,
                    canvasBordersWidth :1,
                    canvasBordersColor : "black",
                    graphTitle : "Gradable item weights",
                    graphTitleFontFamily : "'Arial'",
                    graphTitleFontSize : 24,
                    graphTitleFontStyle : "bold",
                    graphTitleFontColor : "#666",
                    graphSubTitleFontFamily : "'Arial'",
                    graphSubTitleFontSize : 18,
                    graphSubTitleFontStyle : "normal",
                    graphSubTitleFontColor : "#666",
                    inGraphDataTmpl: "<%=roundToWithThousands(config,v2,2)%>",
                    inGraphDataFontColor: "#666",
                    legend : true,
                    legendFontFamily : "'Arial'",
                    legendFontSize : 9,
                    legendFontStyle : "normal",
                    legendFontColor : "#666",
                    legendBlockSize : 50,
                    legendBorders : true,
                    legendBordersWidth : 1,
                    legendBordersColors : "#666",
                    annotateDisplay : false,
                    spaceTop : 0,
                    spaceBottom : 0,
                    spaceLeft : 0,
                    spaceRight : 0,
                    logarithmic: true,
                    animationSteps : 50,
                    rotateLabels : "smart",
                    xAxisSpaceOver : 0,
                    xAxisSpaceUnder : 0,
                    xAxisLabelSpaceAfter : 0,
                    xAxisLabelSpaceBefore : 0,
                    legendBordersSpaceBefore : 0,
                    legendBordersSpaceAfter : 0,
                    footNoteSpaceBefore : 0,
                    footNoteSpaceAfter : 0,
                    startAngle : 0,
                    dynamicDisplay : false
                }
                new Chart(document.getElementById("itemPieCanvas").getContext("2d")).Pie(mainChartData,myChartOptions);
                new Chart(document.getElementById("itemBarCanvas").getContext("2d")).Bar(data,chartOptions);
                $scope.shownGroup = group;
            }
        };

        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
})
;