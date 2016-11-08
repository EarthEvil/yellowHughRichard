var debit = angular.module("debit", []);

debit.controller("debitController", debitController);
debitController.$inject = ["$window", "$scope", "$http"]

function debitController($window, $scope, $http) {
    var username = document.getElementById('usernameHeader').innerHTML;
    $(document).ready(function() {
        $scope.getAccountInfo();
    });

    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    $scope.postError = false;
    $scope.successPost = false;
    // $scope.accounts;
    $scope.chosenAccount = [{
        account_number: ""
    }];
    // $scope.accounts = [{ account_number: "adfs" }, { account_number: "xys" }];
    // console.log(JSON.stringify($scope.accounts));
    // $scope.names = ["Emil", "Tobias", "Linus"];

    $scope.getAccountInfo = function() {

        $http({
            url: url + '/api/get_account_info/' + username,
            method: "GET",
        }).then(function(data, status, headers, config) {
            $scope.accounts = data.data;
            console.log(JSON.stringify($scope.accounts))
            $('select').material_select();
            console.log("good");
            $scope.repeats = [{ item: "item1" }];
        }, function(response) {
            console.log("fail");
        });
    };


    $scope.debit = function(account_id, amount) {
        console.log($scope.amount);
        console.log($scope.accountID);
        $http({
            url: url + "/api/debit/",
            method: "POST",
            data: {
                account_id: account_id,
                amount: amount
            }
        }).then(function(data, status, headers, config) {
            $scope.postError = false;
            $scope.successPost = true;
            console.log("success post");

        }, function(response) {

            $scope.postError = true;
            $scope.successPost = false;
            console.log("fail: " + JSON.stringify(response));
        });
    };

};
