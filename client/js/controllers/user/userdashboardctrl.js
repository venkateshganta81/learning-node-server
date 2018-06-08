app.controller('UserDashboardCtrl', ['$scope', '$rootScope', '$state', '$uibModal', '$log', '$document', '$cookies', 'uiGridConstants', 'Upload', 'UserServices', '$timeout', function ($scope, $rootScope, $state, $uibModal, $log, $document, $cookies, uiGridConstants, Upload, UserServices, $timeout) {
    $rootScope.selectedAnalysis = '';
    $scope.getDetails = function () {
        if ($cookies.get('token')) {
            $rootScope.userLogin = true;
            UserServices.getUserDetails(function (success) {
                if (success.data.status) {
                    $rootScope.myData = success.data.data;
                    var date = new Date($rootScope.myData.expiryDate.split('T')[0])
                    date = date.getTime();
                    $rootScope.expiryDate = date;
                    var currentDate = (new Date()).getTime();
                    if ((currentDate < $rootScope.expiryDate) && $rootScope.expiryDate) {
                        if($cookies.get('activeAnalysis')){
                            $scope.loadAnalysis($cookies.get('index'), $cookies.get('activeAnalysis'));
                        }else{
                            $scope.loadAnalysis(0, $rootScope.myData.analysisName[0]);
                        }
                    } else {
                        $rootScope.message = "Your Subscription has been Expired , Please Contact HatsAI Team"
                    }

                } else {

                }
            }, function (error) {

            })
        } else {
            $rootScope.userLogin = false;
            $state.go('login');
        }
    }


    $scope.loadAnalysis = function (index, analysis) {
        $cookies.put('index', index);
        $cookies.put('activeAnalysis', analysis);
        $rootScope.selectedAnalysis = $cookies.get('activeAnalysis');
        for(var i=0;i<$rootScope.myData.analysis.length;i++){
            if($rootScope.selectedAnalysis === $rootScope.myData.analysis[i].analysisName){
                $scope.selectedDetailedAnalysis = $rootScope.myData.analysis[i].analysis;
            }
        }
    };


    $scope.logOut = function () {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (cookie, key) {
            $cookies.remove(key);
        });
        $rootScope.userLogin = false;
        $state.go('login');
    };
}]);