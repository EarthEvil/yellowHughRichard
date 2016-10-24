var login = angular.module("login", []);

login.controller("loginController", loginController);
loginController.$inject = ["$window", "$scope", "$http"]

function loginController($window, $scope, $http) {
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    $scope.login = function(username, password) {
        console.log($scope.username);
        console.log($scope.password);
        $http({
            url: url + "/api/signin",
            method: "POST",
            data: {
                username: username,
                password: password
            }
        }).then(function(data, status, headers, config) {
            console.log("success post");
            console.log("return:" + data.data);
            if (data.data === 'success') {
                Materialize.toast("Successfully log in", 2000, 'teal lighten-2');
                Materialize.toast("Redirecting to home page...", 2000, 'teal lighten-2');
                setTimeout(function() { window.location.replace(url); }, 2000);
            } else {
                // login fail
                Materialize.toast("Incorrect username or password", 4000, 'red');

            }
        }, function(response) {
            // POST fail
            console.log("POST fail");
        });
    };

};
