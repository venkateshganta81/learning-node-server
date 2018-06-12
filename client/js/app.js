var app = angular.module('abhiBus', ['ui.router', 'ui.bootstrap', 'ngCookies']);


app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: '/views/partials/home.html',
            data: {activeTab: 'login'}

        })
        .state('signup', {
            url: '/signup',
            templateUrl: '/views/templates/sign-up.html',
            data: {activeTab: 'signup'}

        })
        .state('admin-dashboard',{
            url:'/admin-dashboard',
            templateUrl: '/views/partials/dashboard.html',
            data: {activeTab: 'admin-dashboard'}
        })
        .state('create-client',{
            url:'/create-client',
            templateUrl: '/views/partials/create-client.html',
            data: {activeTab: 'create-client'}
        })
        .state('give-access',{
            url:'/give-access',
            templateUrl: '/views/partials/give-access.html',
            data: {activeTab: 'give-access'}
        })
        .state('user-dashboard',{
            url:'/dashboard',
            templateUrl: '/views/partials/user/user-dashboard.html',
            data: {activeTab: 'user-dashboard'}
        })
        .state('overview',{
            url:'/overview',
            templateUrl: '/views/partials/user/overview.html',
            data: {activeTab: 'overview'}
        })
        .state('paymentGateway-data',{
            url:'/sales-analytics',
            templateUrl: '/views/partials/user/payment-gateway.html',
            data: {activeTab: 'sales-data'}
        })
        .state('operator-data',{
            url:'/operator-analytics',
            templateUrl: '/views/partials/user/operator-analysis.html',
            data: {activeTab: 'operator-data'}
        })
        
}]);





