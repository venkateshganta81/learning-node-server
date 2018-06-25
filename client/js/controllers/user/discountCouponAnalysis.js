app.controller('DiscountCtrl', ['$scope', '$rootScope', '$state', '$log', '$document', '$cookies', 'UserServices', '$timeout', function ($scope, $rootScope, $state, $log, $document, $cookies, UserServices, $timeout) {

    /* Getting details from db */

    $scope.getDiscountDetails = function () {
        if ($cookies.get('token')) {
            UserServices.getDiscountwiseSales(function (success) {
                if (success.data.status) {
                    $scope.discountwiseData = success.data.data;
                    renderDiscountWiseCharts();
                } else {

                }
            }, function (error) {

            })
        } else {
            $state.go('login');
        }
    }


    function renderDiscountWiseCharts(){
        
    }
 

    $scope.logOut = function () {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (cookie, key) {
            $cookies.remove(key);
        });
        $rootScope.userLogin = false;
        $state.go('login');
    };

    $scope.resetFilters = function () {
        dc.filterAll();
        dc.redrawAll();
    }

}]);