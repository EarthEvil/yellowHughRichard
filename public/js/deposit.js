var deposit = angular.module("deposit", []);

deposit.controller("depositController", depositController);
depositController.$inject = ["$window", "$scope", "$http"]

function depositController($window, $scope, $http) {
    // var url = "http://localhost:3000";
    var url = API_SEVER_ADDRESS;
    var depositForm = document.getElementById('depositForm');
    var username = document.getElementById('usernameHeader').innerHTML;
    var idleTime = 0;
    $(document).ready(function() {
        var idleInterval = setInterval(timerIncrement, 10000);
        $(this).mousemove(function(e) {
            idletime = 0;
        });
        $(this).keypress(function(e) {
            idletime = 0;
        });
        $scope.getAccountInfo();
    });

    $scope.getAccountInfo = function() {
        $http({
            url: url + '/api/get_account_info/' + username,
            method: "GET"
        }).then(function(data) {
            if (data.data[0]) {
                $scope.accounts = data.data;
                $scope.selectedAccount = $scope.accounts[0].account_number;
            } else {}
            setTimeout(function() {
                $('select').material_select();
            }, 1);
        }, function(response) {});
    };
    $scope.deposit = function(account_number, amount) {
        console.log(account_number);
        console.log(amount);
        $http({
            url: url + "/api/deposit/",
            method: "POST",
            data: {
                account_number: account_number,
                amount: amount
            }
        }).then(function(data, status, headers, config) {
            $scope.serverResponse = data.data;

        }, function(response) {
            $scope.serverResponse = response;
        });
        console.log("afterward");
        depositForm.reset();
    };

    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 2) {
            window.location.replace(url);
        }
    }
};
