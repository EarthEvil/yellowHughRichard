var signup = angular.module("signup", []);

signup.controller("signupController", signupController);
signupController.$inject = ["$window", "$scope", "$http"]

function signupController($window, $scope, $http) {
    $(document).ready(function() {
        $('select').material_select();
    });
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 100,
        max: true // Creates a dropdown of 15 years to control year
    });
    $scope.genders = ["Emil", "Tobias", "Linus"];
    // var url = "http://localhost:3000";
    var url = "http://ec2-54-208-152-167.compute-1.amazonaws.com";
    var signupButton = document.getElementById("signupButton");
    var passwordField = document.getElementById("password");
    var confirmPasswordField = document.getElementById("confirmPassword");

    function validatePassword() {
        if ($scope.password != $scope.confirmPassword || ($scope.password === "")) {
            signupButton.className = "btn waves-effect waves-light disabled";

        } else {
            signupButton.className = "btn waves-effect waves-light";
        }
    }
    passwordField.onchange = validatePassword;
    confirmPasswordField.onkeyup = validatePassword;
    
    function mysqlDate(date) {
        date = date || new Date();
        return date.toISOString().split('T')[0];
    }
};
