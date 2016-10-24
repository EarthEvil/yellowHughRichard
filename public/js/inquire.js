var inquire = angular.module("inquire", ["smart-table"]);

inquire.controller("inquireController", inquireController);
inquireController.$inject = ["$window", "$scope", "$http"]

function inquireController($window, $scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    $scope.itemsByPage = 5;
    $scope.exportData = function() {
        var blob = new Blob([document.getElementById('transactionTable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
    };

    $scope.count = 0;
    $scope.showTable = false;
    var error = function() {
        console.log("error!");
    };

    $scope.thoughtputTest = function(runs) {
        $http({
            url: url + "/api/thoughtputTest/" + runs,
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
            url: url + "/api/inquire/" + 1,
            method: "GET"
                // data: {
                //     account_id: 1
                //         // data: data
                // }
        }).then(function(data, status, headers, config) {
            $scope.transactionHistory = data.data;
            $scope.count++;
            console.log("success", $scope.transactionHistory);

        }, function() {
            console.log("erfsdfror!");

        });
    };

}
