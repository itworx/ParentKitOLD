angular.module('starter.controllers', ['angles'])
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
                    var behaviorTypeObject = behaviorTypesResults[i].toJSON();
                    behaviorTypeObject.isPositive = (behaviorTypeObject.isPositive == 0) ? 'Positive' :'Negative';
                    behaviortypes.push(behaviorTypeObject);
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
                    lessons.push(lessonObject);
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

.controller('AttendanceCtrl', function ($scope,$stateParams,AtendanceTypes,LessonService,$ionicNavBarDelegate,$state,$ionicLoading,studentsService){

        $scope.pageTitle = studentsService.getCurrentStudent().firstName;

        //Attendance Chart
        $scope.myChartData = [];
//        var ctx = document.getElementById("myChart").getContext("2d");
        $scope.AddItemInAttendanceChartsData = function(record){
            var found = false;
            for(var i = 0; i < $scope.myChartData .length; i++) {
                var item = $scope.myChartData [i];
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
                $scope.myChartData .push(addedItem);
            }
        };
        $scope.myChartOptions =  {
            inGraphDataShow : true,
            datasetFill : true,
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
//            graphSubTitle : '',
//            graphSubTitleFontFamily : "'Arial'",
//            graphSubTitleFontSize : 18,
//            graphSubTitleFontStyle : "normal",
//            graphSubTitleFontColor : "#666",
//            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ roundToWithThousands(config,v2,2) + ' (' + roundToWithThousands(config,v6,1) + ' %)'%>",
            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+' = ')+ roundToWithThousands(config,v2,2)%>",
            inGraphDataFontColor: "#666",
            legend : false,
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
                for (var i = 0; i < attendancesResults.length; i++) {
                    var attendanceObject = attendancesResults[i].toJSON();
                    var record = {
                        attendance :'',
                        type :'',
                        lesson:''
                    };
                    record.attendance = attendanceObject;
                    record.type = AtendanceTypes.getType(attendanceObject.type.objectId);
                    var lessonObject= LessonService.getLesson(attendanceObject.lesson.objectId);
                    record.lesson = lessonObject;
                    $scope.records.push(record);
                    $scope.$apply();
                    $scope.AddItemInAttendanceChartsData(record);
                }
                for(var j = 0; j < $scope.records.length; j++){
                    var object =  $scope.records[j];
                    var element = document.getElementById(j);
                    var objectColor = '#' + object.type.color;
                    element.style.backgroundColor = objectColor;
                   }
//                new Chart(ctx).Doughnut(chartItems,options);
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
                       $state.go('welcome');
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
        $scope.goToChildren = function(index){
            studentsService.setCurrentStudent($scope.children[index]);
            $state.go('tabs.behavior',{"studentId":studentsService.getCurrentStudent().objectId})
        };
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

        $scope.myChartOptions =  {
            inGraphDataShow : true,
            datasetFill : true,
            scaleTickSizeRight : 0,
            scaleTickSizeLeft : 0,
            scaleTickSizeBottom :0,
            scaleTickSizeTop : 0,
            scaleFontSize : 20,
            canvasBorders : false,
            canvasBordersWidth :1,
            canvasBordersColor : "black",
            graphTitle : "Behavior",
            graphTitleFontFamily : "'Arial'",
            graphTitleFontSize : 24,
            graphTitleFontStyle : "bold",
            graphTitleFontColor : "#666",
//            graphSubTitle : '',
//            graphSubTitleFontFamily : "'Arial'",
//            graphSubTitleFontSize : 18,
//            graphSubTitleFontStyle : "normal",
//            graphSubTitleFontColor : "#666",
//            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+':')+ roundToWithThousands(config,v2,2) + ' (' + roundToWithThousands(config,v6,1) + ' %)'%>",
            inGraphDataTmpl: "<%=(v1 == ''? '' : v1+' = ')+ roundToWithThousands(config,v2,2)%>",
            inGraphDataFontColor: "#666",
            legend : false,
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
//            graphSubTitle : "Graph Sub Title",
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
                legend : true,
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
        new Chart(ctx).Pie(data,options);
    })

.controller('AccessCodeCtrl', function($scope,$state) {

        $scope.addAccessCode = function (code){

            Parse.Cloud.run('useAccessCode', { accessCode: code }, {
                success: function(result) {
                    // ratings should be 4.5
                    console.log(result);
                    console.log(JSON.stringify(result));
                    console.log("successful results");
                    $state.go('app.Students');
                },
                error: function(error) {
                    console.error("Not successful" + error);
                }
            });
        };
})
    .controller('forgotPasswordCtrl', function ($scope,$state) {

        $scope.send = function (mail) {
            if(!validateEmail(mail)){
                alert('please enter correct mail.');
            }
            else{
                Parse.User.requestPasswordReset(mail, {
                    success: function() {
                        alert('mail was sent to you.');
                        $state.go('login');
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
        };
        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    })
;