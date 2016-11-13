var debit = angular.module("debit", []);

debit.controller("debitController", debitController);
debitController.$inject = ["$window", "$scope", "$http"]

function debitController($window, $scope, $http) {
    var debitForm = document.getElementById('debitForm');
    var username = document.getElementById('usernameHeader').innerHTML;
    $(document).ready(function() {
        $scope.getAccountInfo();
    });
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
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
        }, function(response) {});
    };

    $scope.debit = function(selectedAccount, amount) {
        console.log("amount:" + amount);
        console.log(selectedAccount);
        $http({
            url: url + "/api/debit/",
            method: "POST",
            data: {
                account_number: $scope.selectedAccount,
                amount: amount
            }
        }).then(function(data, status, headers, config) {
            $scope.serverResponse = data.data;

        }, function(response) {
            $scope.serverResponse = response;
        });
        debitForm.reset();

    };

};
