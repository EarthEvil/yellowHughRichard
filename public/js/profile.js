var profileApp = angular.module('profileApp', []);

profileApp.controller("profileAppController", profileAppController);
profileAppController.$inject = ["$scope", "$http"]

function profileAppController($scope, $http) {
    // var url = "http://localhost:3000";
    var url = API_SEVER_ADDRESS;
    var username = document.getElementById('usernameHeader').innerHTML;
    $scope.showTable = false;
    $scope.getProfile = function() {
        $http({
            url: url + '/api/user/' + username,
            method: "GET",
        }).then(function(data, status, headers, config) {
            $scope.profile = data.data[0];
            $('.collapsible').collapsible();
            console.log(JSON.stringify($scope.profile));
        }, function(response) {
            console.log("fail");
        });
    };


    $scope.getProfile();

};
