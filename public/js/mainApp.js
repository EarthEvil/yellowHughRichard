var mainApp = angular.module('mainApp', []);

mainApp.controller("mainController", mainController);
mainController.$injec = ["$scope", "$http"]

function mainController($scope, $http) {
    $scope.addCustomer = function(name, age, address) {
        $http({
            url: "http://localhost:3000/addCustomer/",
            method: "POST",
            data: {
                name: name,
                age: age,
                address: address
            }
        }).then(function(data, status, headers, config) {
            console.log("success");

        }, function(response) {
            console.log("fail");

            // $scope.customers = data;
        });
    };
    $scope.postRequest = function() {
        $http({
            url: "http://localhost:3000/addCustomer",
            method: "POST",
            data: { customer_id: '1' }
        }).then(function(data, status, headers, config) {
            console.log(data);
            console.log("connected");

        }, function(response) {
            console.log("fucked");
        });
    };

};
