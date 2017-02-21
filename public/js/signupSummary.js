var summary = angular.module('summary', []);

summary.controller("summaryController", summaryController);
summaryController.$inject = ["$scope", "$http"]

function summaryController($scope, $http) {
    // var url = "http://localhost:3000";
    var url = API_SEVER_ADDRESS;
    var username = document.getElementById('usernameHeader').innerHTML;
    $http({
        url: url + '/api/user/' + username,
        method: "GET",
    }).then(function(data, status, headers, config) {
        $scope.user_information = data.data[0];
    }, function(response) {
        console.log("fail");
    });


};
