var debit = angular.module("debit", []);

debit.controller("debitController", debitController);
debitController.$inject = ["$window", "$scope", "$http"]

function debitController($window, $scope, $http) {
    $scope.debit = function(account_id, amount) {
        console.log($scope.amount);
        console.log($scope.accountID);
        $http({
            url: "http://ec2-54-86-74-235.compute-1.amazonaws.com/debit/",
            method: "POST",
            data: {
                account_id: account_id,
                amount: amount
            }
        }).then(function(data, status, headers, config) {
            console.log("success post");

        }, function(response) {
            console.log("fail");

            // $scope.customers = data;
        });
    };

};
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
