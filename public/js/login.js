var login = angular.module("login", []);

login.controller("loginController", loginController);
loginController.$inject = ["$window", "$scope", "$http"]

function loginController($window, $scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://elastic-load-balancer-189287619.us-east-1.elb.amazonaws.com";

};
