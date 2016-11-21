var addAccountApp = angular.module('addAccountApp', []);

addAccountApp.controller("addAccountController", addAccountController);
addAccountController.$inject = ["$scope", "$http"]

function addAccountController($scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-85-60-93.compute-1.amazonaws.com";
    var username = document.getElementById('usernameHeader').innerHTML;
    $scope.createAccount = function(amount) {
        $http({
            url: url + '/api/create_account/' + amount,
            method: "GET",
        }).then(function(data, status, headers, config) {
            console.log("success: " + JSON.stringify(data.data));

            $scope.accountNumber = data.data;
        }, function(response) {
            console.log("fail");
        });
    }
};
