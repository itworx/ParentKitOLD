// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('openfb', [])

    .factory('OpenFB', function ($rootScope, $q, $window, $http) {

        var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth',

        // By default we store fbtoken in sessionStorage. This can be overriden in init()
            tokenStore = window.sessionStorage,

            //"http://coenraets.org/apps/sociogram/oauthcallback.html?#access_token=CAAGnQVmIP3kBADTnBNDFP8XRJDPLAVmC5jkwYAtTCaT3JTY9SCjqClsBr8ImriwBQYB8PUn0MmZBU9Lgq6RXEeTRoydRYtITVayeWjs6ZAnOH4K1ZCE60s4PFvQVXI0b0ZBE3ZB9tcRJwdbVilXZCkt1g9JAI7k60frE03DVbJerXQ1rb1Xi6zMSG9sJ9S34ZCPMVJMfaZCFVQZDZD&expires_in=6176"

            fbAppId,
            oauthRedirectURL,

        // Because the OAuth login spans multiple processes, we need to keep the success/error handlers as variables
        // inside the module instead of keeping them local within the login function.
            deferredLogin,

        // Indicates if the app is running inside Cordova
            runningInCordova,

        // Used in the exit event handler to identify if the login has already been processed elsewhere (in the oauthCallback function)
            loginProcessed;

        document.addEventListener("deviceready", function () {
            runningInCordova = true;
        }, false);

        /**
         * Initialize the OpenFB module. You must use this function and initialize the module with an appId before you can
         * use any other function.
         * @param appId - The id of the Facebook app
         * @param redirectURL - The OAuth redirect URL. Optional. If not provided, we use sensible defaults.
         * @param store - The store used to save the Facebook token. Optional. If not provided, we use sessionStorage.
         */
        function init(appId, redirectURL, store) {
            fbAppId = appId;
            if (redirectURL) oauthRedirectURL = redirectURL;
            if (store) tokenStore = store;
        }

        /**
         * Login to Facebook using OAuth. If running in a Browser, the OAuth workflow happens in a a popup window.
         * If running in Cordova container, it happens using the In-App Browser. Don't forget to install the In-App Browser
         * plugin in your Cordova project: cordova plugins add org.apache.cordova.inappbrowser.
         * @param fbScope - The set of Facebook permissions requested
         */
        function login(fbScope) {

            if (!fbAppId) {
                return error({error: 'Facebook App Id not set.'});
            }

            var loginWindow;

            fbScope = fbScope || '';

            deferredLogin = $q.defer();

            loginProcessed = false;

            logout();

            // Check if an explicit oauthRedirectURL has been provided in init(). If not, infer the appropriate value
            if (!oauthRedirectURL) {
                if (runningInCordova) {
                    oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';
                } else {
                    // Trying to calculate oauthRedirectURL based on the current URL.
                    var index = document.location.href.indexOf('index.html');
                    if (index > 0) {
                        oauthRedirectURL = document.location.href.substring(0, index) + 'oauthcallback.html';
                    } else {
                        return alert("Can't reliably infer the OAuth redirect URI. Please specify it explicitly in openFB.init()");
                    }
                }
            }

            loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + fbAppId + '&redirect_uri=' + oauthRedirectURL +
                '&response_type=token&display=popup&scope=' + fbScope, '_blank', 'location=no');

            // If the app is running in Cordova, listen to URL changes in the InAppBrowser until we get a URL with an access_token or an error
            if (runningInCordova) {
                loginWindow.addEventListener('loadstart', function (event) {
                    var url = event.url;
                    if (url.indexOf("access_token=") > 0 || url.indexOf("error=") > 0) {
                        loginWindow.close();
                        oauthCallback(url);
                    }
                });

                loginWindow.addEventListener('exit', function () {
                    // Handle the situation where the user closes the login window manually before completing the login process
                    deferredLogin.reject({error: 'user_cancelled', error_description: 'User cancelled login process', error_reason: "user_cancelled"});
                });
            }
            // Note: if the app is running in the browser the loginWindow dialog will call back by invoking the
            // oauthCallback() function. See oauthcallback.html for details.

            return deferredLogin.promise;

        }

        /**
         * Called either by oauthcallback.html (when the app is running the browser) or by the loginWindow loadstart event
         * handler defined in the login() function (when the app is running in the Cordova/PhoneGap container).
         * @param url - The oautchRedictURL called by Facebook with the access_token in the querystring at the ned of the
         * OAuth workflow.
         */
        function oauthCallback(url) {
            // Parse the OAuth data received from Facebook
            var queryString,
                obj;

            loginProcessed = true;
            if (url.indexOf("access_token=") > 0) {
                queryString = url.substr(url.indexOf('#') + 1);
                obj = parseQueryString(queryString);
                tokenStore['fbtoken'] = obj['access_token'];
                tokenStore['expires_in'] = obj['expires_in'];
                deferredLogin.resolve();
            } else if (url.indexOf("error=") > 0) {
                queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
                obj = parseQueryString(queryString);
                deferredLogin.reject(obj);
            } else {
                deferredLogin.reject();
            }
        }

        /**
         * Application-level logout: we simply discard the token.
         */
        function logout() {
            tokenStore['fbtoken'] = undefined;
        }

        /**
         * Helper function to de-authorize the app
         * @param success
         * @param error
         * @returns {*}
         */
        function revokePermissions() {
            return api({method: 'DELETE', path: '/me/permissions'})
                .success(function () {
                    console.log('Permissions revoked');
                });
        }

        /**
         * Lets you make any Facebook Graph API request.
         * @param obj - Request configuration object. Can include:
         *  method:  HTTP method: GET, POST, etc. Optional - Default is 'GET'
         *  path:    path in the Facebook graph: /me, /me.friends, etc. - Required
         *  params:  queryString parameters as a map - Optional
         */
        function api(obj) {

            var method = obj.method || 'GET',
                params = obj.params || {};

            params['access_token'] = tokenStore['fbtoken'];

            return $http({method: method, url: 'https://graph.facebook.com' + obj.path, params: params})
                .error(function(data, status, headers, config) {
                    if (data.error && data.error.type === 'OAuthException') {
                        $rootScope.$emit('OAuthException');
                    }
                });
        }

        /**
         * Helper function for a POST call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
       function post(path, params) {
            return api({method: 'POST', path: path, params: params});
        }

        /**
         * Helper function for a GET call into the Graph API
         * @param path
         * @param params
         * @returns {*}
         */
        function get(path, params) {
            return api({method: 'GET', path: path, params: params});
        }

        function getAccessToken() {
            return tokenStore['fbtoken'];
        }
        function getExpires_in() {
            return tokenStore['expires_in'];
        }

        function parseQueryString(queryString) {
            var qs = decodeURIComponent(queryString),
                obj = {},
                params = qs.split('&');
            params.forEach(function (param) {
                var splitter = param.split('=');
                obj[splitter[0]] = splitter[1];
            });
            return obj;
        }

        return {
            init: init,
            login: login,
            logout: logout,
            revokePermissions: revokePermissions,
            api: api,
            post: post,
            get: get,
            oauthCallback: oauthCallback,
            getAccessToken:getAccessToken,
            getExpires_in:getExpires_in
        }

    });

// Global function called back by the OAuth login dialog
function oauthCallback(url) {
    var injector = angular.element(document.getElementById('main')).injector();
    injector.invoke(function (OpenFB) {
        OpenFB.oauthCallback(url);
    });
}

angular.module('starter', ['ionic', 'starter.controllers','openfb'])

.run(function($ionicPlatform,storage,$state,OpenFB) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      OpenFB.init('246994372161242','https://www.facebook.com/connect/login_success.html');
//      var user = storage.getObject('User');
//        if(Object.getOwnPropertyNames(user).length != 0){
//          $state.transitionTo('app.Students');
//        }
//      else{
//            alert('localStorage empty');
//        }
    var keyIndex = -1;
    for(var i=0 ; i < window.localStorage.length;i++){
        var currentUserKey = "currentUser";

          if(window.localStorage.key(i).indexOf(currentUserKey) > -1){
              keyIndex = i;
            break;
          }
      }
    if(keyIndex >= 0){
        var user = window.localStorage.getItem(window.localStorage.key(keyIndex));

//      alert('1 :' +user);
//      alert('2 :' +user1);
//      alert('3 :' +user2);

        if(user) {
            user = JSON.parse(user);
            if (Object.getOwnPropertyNames(user).length != 0) {
//              alert('localStorage 2 has vale');
                $state.transitionTo('app.Students');
            }
        }

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

     Parse.initialize("2cjtLvANwrqhS94xOc9k4AKENGH8kjOpLNfov7cQ",
          "dbRbXdWO8BjwzxjkJC2FFBAULyt2nGk5PNILlIJc");
      window.fbAsyncInit = function() {
          Parse.FacebookUtils.init({
              appId: '246994372161242', // Facebook App ID
              channelUrl: 'https://www.facebook.com/connect/success.html',
              cookie: true, // enable cookies to allow Parse to access the session
              xfbml: true
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