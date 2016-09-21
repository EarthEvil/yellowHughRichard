var mainApp = angular.module('mainApp', []);

mainApp.controller("mainController", mainController);
mainController.$injec = ["$scope", "$http"]

function mainController($scope, $http) {
    $scope.textAjax = function() {
        $http({
            url: "http://localhost:3000/customer/" + 1,
            method: "GET"
                // data: data
        }).then(function(data, status, headers, config) {
            $scope.customers = data.data;
            console.log("success", $scope.customer);

        }, function(response) {
            console.log("fail");

            // $scope.customers = data;
        });
    };
  
};