var inquire = angular.module("inquire", ["ngTable"]);

inquire.controller("inquireController", inquireController);
inquireController.$inject = ["NgTableParams", "$window", "$scope", "$http"]

function inquireController(NgTableParams, $window, $scope, $http) {
    $scope.count = 0;
    $scope.showTable = false;
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
    $scope.inquire = function() {

        $scope.showTable = true;
        $http({
            url: "http://localhost:3000/inquire/" + 1,
            method: "GET"
                // data: data
        }).then(function(data, status, headers, config) {
            $scope.transactionHistory = data.data;
            $scope.count++;
            console.log("success", $scope.transactionHistory);
            var self = this;
            self.tableParams = new NgTableParams({}, { dataset: data.data });

        }, function() {
            console.log("erfsdfror!");

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
