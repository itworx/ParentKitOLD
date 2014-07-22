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
        this.addStudent = function(student){
            students.push(student);
        };
        this.getCurrentStudent = function(){
          return currentStudent;
        };
        this.setCurrentStudent = function(student){
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
                    color: record.type.color,
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
                        var lessonObject= LessonService.getLesson(attendanceObject.lesson.objectId);
                        if(!lessonObject){
                            error = true;
                            break;
                        }
                        record.lesson = lessonObject;
                        $scope.records.push(record);
                        $scope.AddItemInAttendanceChartsData(record);
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
         $scope.showHUD('loading..');

         query.find({
                success: function(results) {
                    $scope.children = [];
                    var childrenObjects = [];
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i].toJSON();
                        if (object.isDeleted == false) {
                            $scope.children.push(object);
                            childrenObjects.push(results[i]);
                        }
                     }
                    var count = 0;
                    for (var i = 0; i < $scope.children.length; i++){
                        var classroomsRelation = childrenObjects[i].relation("classrooms");
                        var classQuery = classroomsRelation.query();
                        classQuery.find({
                            success: function(classes) {
                                  var studentClasses = [];
                                  for (var j = 0; j < classes.length; j++) {
                                      var classObject = classes[j].toJSON();
                                      studentClasses.push(classObject);
                                  }
//                                alert(count);
//                                alert($scope.children[count]);
                                $scope.children[count].classrooms = studentClasses;
                                count++;
                                },
                                error: function(error) {
                                    $scope.hideHUD();
                                    alert("Error: " + error.code + " " + error.message);
                                }
                            });

                    }
                        console.log(results);
                        $scope.children.sort(compareChildren)
                        studentsService.setStudents($scope.children);
                        $scope.$apply();
                        $scope.hideHUD();
                },
                error: function(error) {
                    $scope.hideHUD();
                    alert("Error: " + error.code + " " + error.message);
                }
            });

        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };

        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };

        $scope.goToChildren = function(index){
            studentsService.setCurrentStudent($scope.children[index]);
            $state.go('tabs.summary',{"studentId":studentsService.getCurrentStudent().objectId})
        };

        function compareChildren(a,b) {

                var first1lower = a.firstName.toLowerCase();
                var first2lower = b.firstName.toLowerCase();

                var last1lower = a.lastName.toLowerCase();
                var last2lower = b.lastName.toLowerCase();

            if(first1lower > first2lower)
                return 1;
            if(first2lower > first1lower)
                return -1
            if(last1lower > last2lower)
                return 1;
            if(last2lower > last1lower)
                return -1

            var aFirst = a.firstName.charAt(0);
            if(a.firstName.charAt(0) > b.firstName.charAt(0))
                return 1;
            if(b.firstName.charAt(0) > a.firstName.charAt(0))
                return -1;
            if(a.lastName.charAt(0) > b.lastName.charAt(0))
                return 1;
            if(b.lastName.charAt(0) > a.lastName.charAt(0))
                return -1;
            return 0;
        }
    })

.controller('BehaviorCtrl', function ($scope,$stateParams,BehaviorTypesService,$state,$ionicLoading,studentsService){

        $scope.pageTitle = studentsService.getCurrentStudent().firstName;
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

    behaviorQuery .matchesQuery("student", studentQuery);
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

.controller('GradesCtrl',function($scope,studentsService,$state){
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
;