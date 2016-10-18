var login = angular.module("login", []);

login.controller("loginController", loginController);
loginController.$inject = ["$window", "$scope", "$http"]

function loginController($window, $scope, $http) {
     var url = "http://localhost:3000";
    // var url = "http://ec2-54-86-74-235.compute-1.amazonaws.com/deposit";
    $scope.login = function(username, password) {
        console.log($scope.username);
        console.log($scope.password);
        // $http({
        //     url: url + "/debit/",
        //     method: "POST",
        //     data: {
        //         account_id: account_id,
        //         amount: amount
        //     }
        // }).then(function(data, status, headers, config) {
        //     console.log("success post");

        // }, function(response) {
        //     console.log("fail");
        // });
    };

};