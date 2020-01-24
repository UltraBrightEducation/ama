(function () {
    'use strict';
    var app = angular.module('FinalProjectApp', ['angular-simple-chat']);

    app.controller('mainController', ['$scope', '$log',
      function($scope, $log) {
        $scope.text = "hh";
        $scope.getResults = function() {
          $log.log("test");
        };
      }
    ]);

    app.controller('amaCtrl', ['$scope', '$log', '$http', 
      function($scope, $log, $http) {
        var vm = this;


        vm.localUser = {userId: 'student', avatar: '', userName: 'Student'};
        vm.amaUser = {userId: 'AMA', avatar: '', userName: 'AMA Bot'};

        vm.sendMessage = function(message) {
          console.log('Sending Request to BotAPI:', message.text);
          vm.callAMA(message.text);
      };

        vm.messages = [{id: '1', text: "Welcome! I'm the AMA Bot!", userid: 'AMA', date: Math.floor(Date.now())}]

        $scope.$on('simple-chat-message-posted', function() {
          console.log('onMessagePosted');
        });

        vm.callAMA = function(message) {
          // make the call
          $http({
            method: 'POST',
            url: '/api/nlp',
            data: { action: 'predict', text: message }
          }).then(function (response) {
            vm.createAmaResponseMessage(response.data.ama_response)
          }, function (error) {
            console.log(error);
          });
          // after response
        }

        vm.createAmaResponseMessage = function(message) {
          message = {id: new Date().valueOf(), userid: vm.amaUser.userId, text: message, date: Math.floor(Date.now())};
          vm.messages.push(message);
        }
      }
    ]);
  }());