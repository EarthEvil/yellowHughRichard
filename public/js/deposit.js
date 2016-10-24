var deposit = angular.module("deposit", []);

deposit.controller("depositController", depositController);
depositController.$inject = ["$window", "$scope", "$http"]

function depositController($window, $scope, $http) {
     // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    $scope.deposit = function(account_id, amount) {
        console.log($scope.amount);
        console.log($scope.accountID);
        $http({
            url: url + "/api/deposit/",
            method: "POST",
            data: {
                account_id: account_id,
                amount: amount
            }
        }).then(function(data, status, headers, config) {
            console.log("success post");

        }, function(response) {
            console.log("fail");
        });
    };

};
