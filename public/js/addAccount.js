var addAccountApp = angular.module('addAccountApp', []);

addAccountApp.controller("addAccountController", addAccountController);
addAccountController.$inject = ["$scope", "$http"]

function addAccountController($scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    var username = document.getElementById('usernameHeader').innerHTML;
    // $http({
    //     url: url + '/api/user/' + username,
    //     method: "GET",
    // }).then(function(data, status, headers, config) {
    //     $scope.user_information = data.data[0];
    // }, function(response) {
    //     console.log("fail");
    // });
};
