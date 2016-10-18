var balanceInquire = angular.module("balanceInquire", []);

balanceInquire.controller("balanceInquireController", balanceInquireController);
balanceInquireController.$inject = ["$window", "$scope", "$http"]

function balanceInquireController($window, $scope, $http) {
    var url = "http://localhost:3000";
    // var url = "http://ec2-54-86-74-235.compute-1.amazonaws.com/deposit";
    var error = function() {
        console.log("error!");
    }
    $scope.test = function() {
        var start = new Date().getTime();
        for (var i = 1000 - 1; i >= 0; i--) {
            $scope.inquire();
        }
        var end = new Date().getTime();
        var time = end - start;
        alert('Execution time: ' + time);
    };
    $scope.getBalance = function(accountID) {
        console.log("acc: " + accountID);
        $http({
            url: url + "/api/balanceinqure/" + accountID,
            method: "GET"
                // data: data
        }).then(function(data, status, headers, config) {
            $scope.accountDetail = data.data[0];
            if ($scope.accountDetail) {
                $scope.isEmptyResultSet =false;
            } else {
                $scope.isEmptyResultSet =true;
                console.log("empty shit!");

            }
        }, function() {
            console.log("error!");

        });
    };

}