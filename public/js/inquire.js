var inquire = angular.module("inquire", ["ngTable"]);

inquire.controller("inquireController", inquireController);
inquireController.$inject = ["NgTableParams", "$window", "$scope", "$http"]

function inquireController(NgTableParams, $window, $scope, $http) {

    $scope.count = 0;
    $scope.showTable = false;
    var error = function() {
        console.log("error!");
    };


    $scope.thoughtputTest = function(runs) {
        $http({
            url: "http://ec2-54-86-74-235.compute-1.amazonaws.com/thoughtputTest/" + runs,
            method: "GET"
            
        }).then(function(data, status, headers, config) {
        	console.log("success");
        }, function() {
            console.log("erfsdfror!");

        });
    };

    $scope.getTransaction = function() {

        $scope.showTable = true;
        $http({
            url: "http://ec2-54-86-74-235.compute-1.amazonaws.com/inquire/" + 1,
            method: "GET"
                // data: {
                //     account_id: 1
                //         // data: data
                // }
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