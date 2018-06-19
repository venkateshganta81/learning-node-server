app.controller('RouteCtrl', ['$scope', '$rootScope', '$state', '$uibModal', '$log', '$document', '$cookies',  'UserServices', '$timeout', function ($scope, $rootScope, $state, $uibModal, $log, $document, $cookies,  UserServices, $timeout) {

                /* Getting the required data from the API */   
    $scope.getRoutewiseInventory = function () {
        UserServices.getRoutewiseInventory(function (success) {
            console.log(success);
            if (success.data.status) {
                $scope.userData = success.data.data;
                
            } else {

            }
        }, function (error) {

        })
    }

   

    $scope.logOut = function () {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (cookie, key) {
            $cookies.remove(key);
        });
        $rootScope.userLogin = false;
        $state.go('login');
    };


    $scope.resetFilters = function(){
        dc.filterAll(); 
        dc.redrawAll();
    }

}]);