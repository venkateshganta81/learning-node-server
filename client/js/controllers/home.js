app.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$uibModal', '$log', '$document', '$cookies', '$interval', 'CommonServices', '$sessionStorage', function ($scope, $rootScope, $state, $uibModal, $log, $document, $cookies, $interval, CommonServices, $sessionStorage) {
    $rootScope.userLogin = false;


    function initializeSignInParams() {
        $scope.signInParams = {
            email: '',
            password: ''
        };
    }
    initializeSignInParams();

    function initializeSignUpParams() {
        $scope.signUpParams = {
            phone: '',
            name: '',
            email: '',
            password: ''
        };
    }

    initializeSignUpParams();

    function validateSigInParams() {
        var signInParams = $scope.signInParams;
        signInParams.message = "";

        if (!signInParams.email && !signInParams.password) {
            signInParams.message = "All fields mandatory";
        } else if (!signInParams.password) {
            signInParams.message = "Please Enter password";
        }
    }

    $scope.login = function () {
        validateSigInParams();
        var signInParams = $scope.signInParams;
        if (!signInParams.message) {
            CommonServices.signIn({
                email: signInParams.email,
                password: signInParams.password
            }, function (success) {
                if (success.data.status) {
                    initializeSignInParams();
                    console.log(success.data)
                    $cookies.put('userId', success.data.id);
                    $cookies.put('token', success.data.token);
                    $cookies.put('userType', success.data.userType);
                    $cookies.put('name', success.data.name);
                    $rootScope.userLogin = true;
                    if (success.data.userType === 'superAdmin') {
                        $rootScope.admin = true;
                        $state.go('user-data', { activeTab: 'user-data' });
                    } else {
                        $rootScope.admin = false;
                        $state.go('user-data', { activeTab: 'user-data' });
                    }

                } else {
                    swal({
                        type: 'error',
                        title: success.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }, function (error) {

            });
        }
    };

    $scope.logOut = function () {
       /*  var clicks = $sessionStorage.mouseClicks;
        var result = _.map(clicks, function(click){
            var l =0; 
        _.countBy(clicks, function(c){
                if((c.X === click.X) && (c.Y === click.Y)){
                    l++;
                }
            }); 
            return {'X':click.X,'Y':click.Y, count: l};
        });
        result = _.uniq(result);
        CommonServices.saveMouseMovement({ "id": $cookies.get('userId'),"name": $cookies.get('name'), "mouseMovement": $sessionStorage.mouseMovement, "mouseClicks": result ,"image": $scope.base64Data}, function (success) {
            if (success.data.status) {
                var cookies = $cookies.getAll();
                angular.forEach(cookies, function (cookie, key) {
                    $cookies.remove(key);
                });
                $scope.mouseMovement = [];
                $scope.mouseClicks = [];
                delete $sessionStorage;
                $rootScope.userLogin = false;
                $state.go('login');
            } else {

            }
        }, function (error) {

        }); */
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (cookie, key) {
            $cookies.remove(key);
        });
        $rootScope.userLogin = false;
        $state.go('login');
    };

    function validateSigupParams() {
        var signUpParams = $scope.signUpParams;
        signUpParams.message = "";
        if (!signUpParams.phone && !signUpParams.name) {
            signUpParams.message = "All fields mandatory";
        } else if (!signUpParams.name || (signUpParams.name.length < 4) || (signUpParams.name.length > 40)) {
            signUpParams.message = "Enter name minimum 4";
        } else if (!signUpParams.phone || !_.isNumber(signUpParams.phone) || signUpParams.phone.toString().length !== 10) {
            signUpParams.message = "Enter valid phone number";
        }
    }

    $scope.signUp = function () {
        $scope.signUpParams.phone = parseInt($scope.signUpParams.phone);
        validateSigupParams();


        var signUpParams = $scope.signUpParams;
        if (!signUpParams.message) {
            CommonServices.signUp(signUpParams, function (success) {
                if (success.data.status) {
                    swal({
                        type: 'success',
                        title: success.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    $state.go('login');
                } else {
                    swal({
                        type: 'error',
                        title: success.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }

            }, function (error) {

            });
        }
    };




    $rootScope.knowMore = function (type) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'md',
            resolve: {
                modelType: function () {
                    return { data: type, model: 'knowMore' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {

            } else {

            }
        }, function () {
        });
    };

   /*  $scope.mouseMovement=[];
    $rootScope.mouseMovementTracking = function (e) {
        if ($cookies.get('token')) {
            $scope.mouseMovement.push({
                'X':e.pageX,
                'Y':e.pageY,
                'element':e.target,
                "timeStamp" : new Date().getTime()
            });
           // console.log(e.target)
            $sessionStorage.mouseMovement = $scope.mouseMovement;
            
        }
    }
    $scope.mouseClicks=[];
    $(document).on('click', function (e) {
        //console.log(e.pageX,e.pageY);
        if ($cookies.get('token')) {
            $scope.mouseClicks.push({
                "X": e.pageX,
                'Y': e.pageY,
                'element':e.target.outerHTML,
                "timeStamp": new Date().getTime()
            });
            var config = {
                container: document.getElementsByTagName('body')[0],
                radius: 10,
                maxOpacity: 1,
                minOpacity: 0.8,
                blur: .75,
                gradient: {
                    // enter n keys between 0 and 1 here
                    // for gradient color customization
                    '.3': 'blue',
                    '.4': 'yellow',
                    '.7': 'red'
                }
            };
            var heatmapInstance = h337.create(config);
            $sessionStorage.mouseClicks=$scope.mouseClicks;
            $sessionStorage.mouseClicks.forEach(function (click) {
               
                dataPoint={
                    x: parseInt(e.pageX),
                    y: parseInt(e.pageY),
                    value: 1
                }
            });
            heatmapInstance.addData(dataPoint);
            
        }
    });

    $(document).scroll('scroll', function () {
        //console.log($(document).scrollTop());
    }); */


}]);




