var accountManagement = angular.module('accountManagement', []);

accountManagement.controller("accountManagementController", accountManagementController);
accountManagementController.$inject = ["$scope", "$http"]

function accountManagementController($scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    var username = document.getElementById('usernameHeader').innerHTML;
    $scope.enmpty = false;
    // $scope.serverResponse;
    $(document).ready(function() {
        $scope.getAccountInfo();
    });
    $scope.getAccountInfo = function() {
        $http({
            url: url + '/api/get_account_info/' + username,
            method: "GET",
        }).then(function(data) {
            $scope.accounts = data.data;
            if ($scope.accounts[0] !== undefined) {
                $scope.selectedAccount = $scope.accounts[0].account_number;
            } else {
                $scope.enmpty = true;
            }
            $('select').material_select();
            // console.log("accounts: " + JSON.stringify($scope.accounts));
        }, function(response) {});
    };

    $scope.createAccount = function(amount) {
        $http({
            url: url + '/api/create_account/' + amount,
            method: "GET",
        }).then(function(data, status, headers, config) {
            $scope.createResponse = data.data;
            setTimeout(function() {
                window.location.reload();
            }, 3000);
        }, function(response) {
            $scope.createResponse = response;
            console.log("res: " + $scope.createResponse);
        });
    }
    $scope.deleteAccount = function(account_number) {
        $http({
            url: url + '/api/delete_account/' + account_number,
            method: "DELETE",
        }).then(function(data, status, headers, config) {
            $scope.deleteResponse = data.data;
            setTimeout(function() {
                window.location.reload();
            }, 3000);
        }, function(response) {
            $scope.deleteResponse = response;
        });
    }
};