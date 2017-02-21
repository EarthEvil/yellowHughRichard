var login = angular.module("login", []);

login.controller("loginController", loginController);
loginController.$inject = ["$window", "$scope", "$http"]

function loginController($window, $scope, $http) {
    // var url = "http://localhost:3000";
    var url = LOAD_BALANCER_ADDRESS;
};
