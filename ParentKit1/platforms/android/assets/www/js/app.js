// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform,storage,$state) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      var user = storage.getObject('User');
        if(Object.getOwnPropertyNames(user).length != 0){
          $state.transitionTo('app.Students');
        }
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

      (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/all.js";
          fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

     Parse.initialize("vvIFEVKHztE3l8CZrECjn09T3j8cjB3y0E3VxCN8",
          "iNswO5XxUaNJtWUMUq1g9g14h600LOE0INwypTml");
      window.fbAsyncInit = function() {
          Parse.FacebookUtils.init({
              appId: '246994372161242', // Facebook App ID
              channelUrl: '',
              cookie: true, // enable cookies to allow Parse to access the session
              xfbml: true  // parse XFBML
          });
      }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('tabs', {
          url: "/student",
          abstract: true,
          templateUrl: "templates/student.html",
          controller: 'StudentCtrl'
    })
    .state('tabs.attendance', {
          url: "/attendance/:studentId",
          views: {
              'attendance-tab': {
                  templateUrl: "templates/attendance.html",
                  controller: 'AttendanceCtrl'
              }
          }
     })
      .state('tabs.behavior', {
          url: "/behavior/:studentId",
          views: {
              'behavior-tab': {
                  templateUrl: "templates/Behavior.html",
                  controller: 'BehaviorCtrl'
              }
          }
      })
    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html",
            controller: 'BrowseCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    })
     .state('app.children', {
          url: "/children",
          views: {
              'menuContent' :{
                  templateUrl: "templates/children.html",
                  controller: 'ChildrenCtrl'
              }
          }
     })
      .state('app.student', {
          url: "/student/:studentId",
          views: {
              'menuContent' :{
                  templateUrl: "templates/student.html",
                  controller: 'StudentCtrl'
              }
          }
      })
      .state('login', {
          url: "/login",


                  templateUrl: "templates/login.html",
                  controller: 'LogInCtrl'


      })
      .state('SignUp', {
          url: "/SignUp",
          templateUrl: "templates/SignUp.html",
           controller: 'SignUpCtrl'
        })
      .state('app.Students', {
          url: "/Students",
          views: {
              'menuContent' :{
                  templateUrl: "templates/children.html",
                  controller: 'Students'
              }
          }
      })
      .state('app.accessCode', {
          url: "/accessCode",
          views: {
              'menuContent' :{
                  templateUrl: "templates/accessCode.html",
                  controller: 'AccessCodeCtrl'
              }
          }
      })
      .state('welcome', {
          url: "/welcome",
          templateUrl: "templates/welcome.html",
          controller: 'AccessCodeCtrl'
      })
      .state('forgotPassword',{
          url: "/forgotPassword",
          templateUrl: "templates/forgotPassword.html",
          controller: 'forgotPasswordCtrl'
        })
      .state('tabs.summary',{
          url: "/summary/:studentId",
          views: {
              'summary-tab': {
                  templateUrl: "templates/summary.html",
                  controller: 'SummaryCtrl'
              }
          }
      })
      .state('tabs.grades',{
          url: "/grades/:studentId",
          views: {
              'grades-tab': {
                  templateUrl: "templates/grades.html",
                  controller: 'GradesCtrl'
              }
          }
      })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});