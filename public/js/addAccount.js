var addAccountApp = angular.module('addAccountApp', []);

addAccountApp.controller("addAccountController", addAccountController);
addAccountController.$inject = ["$scope", "$http"]

function addAccountController($scope, $http) {
    var url = ACCOUNT_SEVER_ADDRESS;
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
