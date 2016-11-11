var accountManagement = angular.module('accountManagement', []);

accountManagement.controller("accountManagementController", accountManagementController);
accountManagementController.$inject = ["$scope", "$http"]

function accountManagementController($scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    var user
    name = document.getElementById('usernameHeader').innerHTML;

    $scope.createAccount = function(amount) {
        $http({
            url: url + '/api/create_account/' + amount,
            method: "GET",
        }).then(function(data, status, headers, config) {
            // console.log("success: " + JSON.stringify(data.data));
            $scope.accountNumber = data.data;
        }, function(response) {
            console.log("fail");
        });
    }
    $scope.deleteAccount = function(account_number) {
        $http({
            url: url + '/api/delete_account/' + account_number,
            method: "DELETE",
        }).then(function(data, status, headers, config) {
            console.log("success: " + JSON.stringify(data.data));
            $scope.serverResponse = data.data;
            $("#account_number").val('');   // enmpty input field
        }, function(response) {
            $scope.serverResponse = response;

            console.log("fail");
        });
    }
};
