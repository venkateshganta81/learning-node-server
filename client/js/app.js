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
        .state('topics',{
            url:'/topics',
            templateUrl: '/views/partials/user/topics.html',
            data: {activeTab: 'topics'}
        })
        .state('keywords',{
            url:'/keywords',
            templateUrl: '/views/partials/user/keywords.html',
            data: {activeTab: 'keywords'}
        })
        .state('locations',{
            url:'/locations',
            templateUrl: '/views/partials/user/locations.html',
            data: {activeTab: 'locations'}
        })
        .state('user-data',{
            url:'/sales-analytics',
            templateUrl: '/views/partials/user/overview-channels.html',
            data: {activeTab: 'user-data'}
        })
        .state('chart-data',{
            url:'/overview-emotions',
            templateUrl: '/views/partials/user/overview-emotions.html',
            data: {activeTab: 'chart-data'}
        })
        .state('location-data',{
            url:'/location-cities',
            templateUrl: '/views/partials/user/location-cities.html',
            data: {activeTab: 'location-data'}
        })
        .state('location-country-data',{
            url:'/location-countries',
            templateUrl: '/views/partials/user/location-countries.html',
            data: {activeTab: 'location-country-data'}
        })
        .state('multi-comm-data',{
            url:'/communication',
            templateUrl: '/views/partials/user/multi-comm-map.html',
            data: {activeTab: 'multi-comm-data'}
        })
        .state('topics-tree-map',{
            url:'/topics-trends',
            templateUrl: '/views/partials/user/topics-tree-map.html',
            data: {activeTab: 'topics-tree-map'}
        })
        .state('key-word-cloud',{
            url:'/keywords-cloud',
            templateUrl: '/views/partials/user/keywords-wordcloud.html',
            data: {activeTab: 'key-word-cloud'}
        })
        .state('clustered-bubble',{
            url:'/sites',
            templateUrl: '/views/partials/user/sites.html',
            data: {activeTab: 'clustered-bubble'}
        })
        .state('moments',{
            url:'/overview-moments',
            templateUrl: '/views/partials/user/overview-moments.html',
            data: {activeTab: 'moments'}
        })
        .state('topics-wordcloud',{
            url:'/topics-wordcloud',
            templateUrl: '/views/partials/user/topics-cloud.html',
            data: {activeTab: 'topics-wordcloud'}
        })
        .state('keywords-treemap',{
            url:'/keywords-trend',
            templateUrl: '/views/partials/user/keywords-treemap.html',
            data: {activeTab: 'keywords-treemap'}
        })
        .state('influencers-authors-clustered-bubble',{
            url:'/influencers-authors',
            templateUrl: '/views/partials/user/influencers-authors.html',
            data: {activeTab: 'influencers-authors-clustered-bubble'}
        })
        .state('influencers-network',{
            url:'/influencers-network',
            templateUrl: '/views/partials/user/influencers-network.html',
            data: {activeTab: 'influencers-network'}
        })
        .state('overview-mentions',{
            url:'/overview-mentions',
            templateUrl: '/views/partials/user/overview-mentions.html',
            data: {activeTab: 'overview-mentions'}
        })
        .state('overview-sentiments',{
            url:'/overview-sentiments',
            templateUrl: '/views/partials/user/overview-sentiments.html',
            data: {activeTab: 'overview-sentiments'}
        })
        .state('content-posts',{
            url:'/posts',
            templateUrl: '/views/partials/user/content-posts.html',
            data: {activeTab: 'content-posts'}
        })
        .state('emotions-filter',{
            url:'/emotions',
            templateUrl:'/views/partials/user/emotionsData.html',
            data: { activeTab: 'emotions-filter' },
            params :{
                "day":null,
                'emotion':null
            }
        })
        .state('profiles',{
            url:'/profiles',
            templateUrl: '/views/partials/user/profiles.html',
            data: {activeTab: 'profiles'}
        })
        .state('siteHeatMap',{
            url:'/website-heatmap',
            templateUrl: '/views/partials/user/siteHeatmap.html',
            data: {activeTab: 'siteHeatMap'}
        })
        .state('terms&conditions',{
            url:'/terms-and-conditions',
            templateUrl: '/views/partials/terms-and-conditions.html',
            data: {activeTab: 'terms&conditions'}
        })
}]);





