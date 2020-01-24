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

    app.controller('amaCtrl', ['$scope', '$log',
      function($scope, $log) {
        var vm = this;

        vm.localUser = {userId: 'student', avatar: '', userName: 'Student'};
        vm.amaUser = {userId: 'AMA', avatar: '', userName: 'AMA Bot'};


        vm.sendMessage = function(message) {
          console.log('Sending Request to BotAPI');
      };


        vm.messages = [{id: '1', text: 'Welcome!', userid: 'AMA', date: '1455120273886'}]

        $scope.$on('simple-chat-message-posted', function() {
          console.log('onMessagePosted');
        });

      }
    ]);
  
  }());