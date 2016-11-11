var deposit = angular.module("deposit", []);

deposit.controller("depositController", depositController);
depositController.$inject = ["$window", "$scope", "$http"]

function depositController($window, $scope, $http) {
    var username = document.getElementById('usernameHeader').innerHTML;
    $(document).ready(function() {
        $scope.getAccountInfo();
    });

    $scope.getAccountInfo = function() {
        $http({
            url: url + '/api/get_account_info/' + username,
            method: "GET",
        }).then(function(data) {
            $scope.accounts = data.data;
            $scope.selectedAccount = $scope.accounts[1].account_number;
            $('select').material_select();
            console.log("accounts: " + JSON.stringify($scope.accounts));
            console.log("good");
        }, function(response) {
            console.log("fail");
        });
    };
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    $scope.deposit = function(account_number, amount) {
        console.log(account_number);
        console.log(amount);
        $http({
            url: url + "/api/deposit/",
            method: "POST",
            data: {
                account_number: account_number,
                amount: amount
            }
        }).then(function(data, status, headers, config) {
            console.log("success post");

        }, function(response) {
            console.log("fail");
        });
    };

};
