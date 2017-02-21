var debit = angular.module("debit", []);

debit.controller("debitController", debitController);
debitController.$inject = ["$window", "$scope", "$http"]

function debitController($window, $scope, $http) {
    var debitForm = document.getElementById('debitForm');
    var username = document.getElementById('usernameHeader').innerHTML;
    var idleTime = 0;

    $(document).ready(function() {
        var idleInterval = setInterval(timerIncrement, 120000);
        $(this).mousemove(function(e) {
            idletime = 0;
        });
        $(this).keypress(function(e) {
            idletime = 0;
        });
    });
    var url = API_SEVER_ADDRESS;
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
    $scope.getAccountInfo();

    var assign = function(data) {
        // $scope.$apply(function() {

        // });
    }
    $scope.debit = function(selectedAccount, amount) {
        console.log("amount:" + amount);
        console.log(selectedAccount);
        $http({
            url: url + "/api/debit/",
            method: "POST",
            data: {
                account_number: $scope.selectedAccount,
                amount: amount
            }
        }).then(function(data, status, headers, config) {
            $scope.serverResponse = data.data;

        }, function(response) {
            $scope.serverResponse = response;
        });
        debitForm.reset();

    };

    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 2) {
            window.location.replace(url);
        }
    }

};
