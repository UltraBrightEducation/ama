(function () {
    'use strict';
    var app = angular.module('FinalProjectApp', ['angular-simple-chat','angularAudioRecorder']);

    app.controller('mainController', ['$scope', '$log',
      function($scope, $log) {
        $scope.text = "hh";
        $scope.getResults = function() {
          $log.log("test");
        };
      }
    ]);

    app.controller('audioController', ['$rootScope', '$scope', '$timeout', '$http', function ($rootScope, $scope, $timeout, $http) {
      var vm = this;

      $scope.audio = {};
      console.log("Loaded", vm.audio);
      $scope.timeLimit = 10;
      vm.sendAudioForSTT = function(audiofile) {
        if (!audiofile) return;
        $rootScope.$broadcast('audioCaptured', {});

        var config = { headers: { 'Content-Type': undefined } };

        $http.post('/api/stt', audiofile, config)
          .then(function (response) {
            var data = response.data;
            var status = response.status;
            var statusText = response.statusText;
            var headers = response.headers;
            var config = response.config;
            $rootScope.$broadcast('audioCaptured', {response});
            console.log("Success", response);
            return response; 
        }).catch(function (errorResponse) {
            console.log("Error", errorResponse.status);
            throw errorResponse;
        });
      }

      $scope.$watch('audio', function(newVal, oldVal) {
        if (newVal instanceof Blob) vm.sendAudioForSTT(newVal);
      });

    }]).config(function (recorderServiceProvider) {
    recorderServiceProvider
      .forceSwf(false)
      .withMp3Conversion(false);
    });

    app.controller('amaCtrl', ['$scope', '$log', '$http', 
      function($scope, $log, $http) {
        var vm = this;
        vm.loading = false;
        vm.localUser = {userId: 'student', avatar: '/static/assets/Man_Avatar.gif', userName: 'Student'};
        vm.amaUser = {userId: 'AMA', avatar: '/static/assets/robot_avatar.png', userName: 'AMA Bot'};

        vm.sendMessage = function(message) {
          console.log('Sending Request to BotAPI:', message.text);
          vm.callAMA(message.text);
        };

        vm.messages = [{id: '1', avatar: vm.amaUser.avatar, text: "Welcome! I'm the AMA Bot!", userid: 'AMA', date: Math.floor(Date.now())}]

        $scope.$on('simple-chat-message-posted', function() {
          console.log('onMessagePosted');
        });

        vm.callAMA = function(message) {
          // make the call
          vm.loading = true;
          $http({
            method: 'POST',
            url: '/api/nlp',
            data: { action: 'predict', text: message }
          }).then(function (response) {
            vm.createAmaResponseMessage(response.data.ama_response);
            vm.loading = !vm.loading;
          }, function (error) {
            console.log(error);
          });
          // after response
        }

        vm.createAmaResponseMessage = function(message) {
          message = {id: new Date().valueOf(), userid: vm.amaUser.userId, avatar: vm.amaUser.avatar, text: message, date: Math.floor(Date.now())};
          vm.messages.push(message);
        }

        $scope.$on('audioCaptured', function(a, b) {
          if (!b.response) {
              vm.loading = !vm.loading;
              return;
          }
          vm.messages.push({id: new Date().valueOf(), avatar: vm.amaUser.avatar, text: b.response.data.message, userid: 'AMA', date: Math.floor(Date.now())});
          vm.loading = !vm.loading;
        })
      }
    ]);
  }());