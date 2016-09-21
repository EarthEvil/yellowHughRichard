var mainApp = angular.module('mainApp', []);

mainApp.controller("mainController", mainController);
mainController.$injec = ["$scope", "$http"]

function mainController($scope, $http) {
    $scope.addCustomer = function() {
        $http({
            url: "http://localhost:3000/customer/" + 1,
            method: "POST"
                // data: data
        }).then(function(data, status, headers, config) {
            console.log("success");

        }, function(response) {
            console.log("fail");

            // $scope.customers = data;
        });
    };
    $scope.postRequest = function() {
        $http({
            url: "http://localhost:3000/",
            method: "POST"
        }).then(function(data, status, headers, config) {
            console.log(data);
            console.log("connected");

        }, function(response) {
            console.log("fucked");
        });
    };

};
