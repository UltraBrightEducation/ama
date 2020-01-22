(function () {
    'use strict';
  
    angular.module('FinalProjectApp', [])
  
    .controller('mainController', ['$scope', '$log',
      function($scope, $log) {
        $scope.getResults = function() {
          $log.log("test");
        };
      }
    ]);
  
  }());