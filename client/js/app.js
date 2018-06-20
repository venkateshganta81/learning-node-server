var app = angular.module('abhiBus', ['ui.router', 'ui.bootstrap', 'ngCookies']);


app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '/views/partials/home.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: '/views/templates/sign-up.html'

        })
        .state('user-dashboard',{
            url:'/dashboard',
            templateUrl: '/views/partials/user/user-dashboard.html'
        })
        .state('overview',{
            url:'/overview',
            templateUrl: '/views/partials/user/overview.html'
        })
        .state('paymentGateway-data',{
            url:'/payment-gateway',
            templateUrl: '/views/partials/user/payment-gateway.html'
        })
        .state('operator-data',{
            url:'/operator-analytics',
            templateUrl: '/views/partials/user/operator-analysis.html'
        })
        .state('route-wise-analysis',{
            url: '/routewise-analytics',
            templateUrl : '/views/partials/user/routewise-analysis.html'
        })
}]);





