app.controller('RouteCtrl', ['$scope', '$rootScope', '$state', '$uibModal', '$log', '$document', '$cookies', 'UserServices', '$timeout', function ($scope, $rootScope, $state, $uibModal, $log, $document, $cookies, UserServices, $timeout) {

    /* Getting the required data from the API */
    $scope.getRoutewiseInventory = function () {
        UserServices.getRoutewiseInventory(function (success) {
            console.log(success);
            if (success.data.status) {
                $scope.routeWiseData = success.data.data;
                $scope.drawRoutewiseChart();
            } else {

            }
        }, function (error) {

        })
    }

    $scope.getRoutewiseInventory();


    $scope.drawRoutewiseChart = function () {
        var routeWiseChart = dc.seriesChart("#routeWiseChart");
        $scope.sources = _.uniq($scope.sources);
        var routewiseCrossFilterData = crossfilter($scope.routeWiseData);
        var routewiseDimension = routewiseCrossFilterData.dimension(function (d) { return [d._id, d.count] });
        var routewiseGroup = routewiseDimension.group().reduceSum(function (d) { return d.count });
        var symbolScale = d3.scale.ordinal().range(d3.symbols);
        var symbolAccessor = function (d) { return symbolScale($scope.sources[i++]); };

        var subChart = function (c) {
            return dc.scatterPlot(c)
                .symbol("circle")
                .symbolSize(8)
                .highlightedSize(10)
        };

        routeWiseChart
            .width(768)
            .height(480)
            .margins({ top: 60, bottom: 30, left: 80, right: 40 })
            .chart(subChart)
            .x(d3.scale.linear().domain([0, 50000]))
            .brushOn(false)
            .clipPadding(10)
            .elasticY(true)
            .dimension(routewiseDimension)
            .group(routewiseGroup)
            .mouseZoomable(true)
            .shareTitle(false) // allow default scatter title to work
            .seriesAccessor(function (d) { return "Route: " + d.key[0].Source + "-" + d.key[0].Destination; })
            .keyAccessor(function (d) { return d.key[1] - 500; })
            .valueAccessor(function (d) { return d.value - 500; });


        routeWiseChart.on('pretransition.exclude-dots', function () {
            routeWiseChart.selectAll('path.symbol')
                .style('cursor', 'pointer')
                .on('click.exclude-dots', function (d) {
                    UserServices.getRouteWiseDetails({source:d.key[0].Source , destination : d.key[0].Destination},function(success){
                        console.log(success);
                    },function(error){

                    })
                });
        });


        routeWiseChart.render();
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