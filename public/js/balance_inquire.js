var balanceInquire = angular.module("balanceInquire", []);

balanceInquire.controller("balanceInquireController", balanceInquireController);
balanceInquireController.$inject = ["$window", "$scope", "$http"]

function balanceInquireController($window, $scope, $http) {
    // $scope.accountID = 0;
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
            url: "http://localhost:3000/balanceinqure/" + accountID,
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
// inquire.controller("inquireController", function($window, $scope, $http) {
//     $scope.showTable = false;
//     var error = function() {
//         console.log("error!");
//     }


//     $scope.inquire = function() {

//         $scope.showTable = true;
//         $http({
//             url: "http://localhost:3000/inquire/" + 1,
//             method: "GET"
//                 // data: data
//         }).then(function(data, status, headers, config) {
//             $scope.transactionHistory = data.data;
//             console.log("success", $scope.transactionHistory);
//             var self = this;
//             self.tableParams = new NgTableParams({}, { dataset: $scope.transactionHistory });

//         }, function() {
//             console.log("erfsdfror!");

//         });
//     };

// });
