var locationApp = angular.module('locationApp', []);

locationAppController.$inject = ["$scope", "$http"]

function locationAppController($scope, $http) {
    $scope.showTable = false;
    $scope.locations;
    $scope.test = [];
    var request = {
        location: {
            lat: 40.7476374,
            lng: -73.9851754
        },
        radius: '500',
        query: 'chase branch and atm'
    };
    var mpa;
    var infowindow;
    var geocoder;

    $scope.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: request.location
        });
        geocoder = new google.maps.Geocoder()
        infowindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        // service.textSearch(request, callback);
    }
    $scope.initMap();
    $scope.find = function() {
        var promise = geocodeAddress(geocoder);
        promise.then(function() {
            console.log("promise good");
        }, function() {
            console.log("promise failed");
        });
    };

    function callback(results, status) {

        $scope.$apply(function() {
            $scope.locations = results;
            $scope.showTable = true;
            console.log($scope.showTable);
        });

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }



    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name + '<br>' + place.formatted_address);
            infowindow.open(map, this);
        });
    }

    function geocodeAddress(geocoder) {
        return new Promise(function(resolve, reject) {
            var address = document.getElementById('address').value;
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status === 'OK') {
                    request.location = results[0].geometry.location;
                    map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 13,
                        center: request.location
                    });
                    service.textSearch(request, callback);
                    resolve('success');
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                    reject('fail');
                }
            });
        });
    }
};
locationApp.controller("locationAppController", locationAppController);
