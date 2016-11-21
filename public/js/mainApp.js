var mainApp = angular.module('mainApp', []);

mainApp.controller("mainController", mainController);
mainController.$inject = ["$scope", "$http"]

function mainController($scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-85-60-93.compute-1.amazonaws.com";
    var username = document.getElementById('usernameHeader').innerHTML;
    $scope.accounts;
    $scope.transactionHistory;
    $scope.showTable = false;
    $scope.getAccountInfo = function() {
        $http({
            url: url + '/api/get_account_info/' + username,
            method: "GET",
        }).then(function(data, status, headers, config) {
            $scope.accounts = data.data;
            console.log(JSON.stringify($scope.accounts));
        }, function(response) {
            console.log("fail");
        });
    };


    $scope.getAccountInfo();

    $scope.getTransaction = function(account_id) {
        console.log("clicked");
        console.log(account_id);
        $scope.showTable = true;
        $http({
            url: url + "/api/inquire/" + account_id,
            method: "GET"
        }).then(function(data, status, headers, config) {
            $scope.transactionHistory = data.data;
            $scope.count++;
            console.log("success", $scope.transactionHistory);

        }, function() {
            console.log("erfsdfror!");

        });
    };
};
