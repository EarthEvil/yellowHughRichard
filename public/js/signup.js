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
    $scope.genders = ["Male", "Female", "Other"];
    // var url = "http://localhost:3000";
    var url = LOAD_BALANCER_ADDRESS;
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
    var strength = {
        0: "Worst ?",
        1: "Bad ?",
        2: "Weak ?",
        3: "Good ?",
        4: "Strong ?"
    }

    var password = document.getElementById('password');
    var meter = document.getElementById('password-strength-meter');
    var text = document.getElementById('password-strength-text');
    
    password.addEventListener('input', function()
    {
        var val = password.value;
        var result = zxcvbn(val);
        
        // Update the password strength meter
        meter.value = result.score;
       
        // Update the text indicator
        if(val !== "") {
            text.innerHTML = "Strength: " + "<strong>" + strength[result.score] + "</strong>" + "<span class='feedback'>" + result.feedback.warning + " " + result.feedback.suggestions + "</span"; 
        }
        else {
            text.innerHTML = "";
        }
    });

    function mysqlDate(date) {
        date = date || new Date();
        return date.toISOString().split('T')[0];
    }
};
