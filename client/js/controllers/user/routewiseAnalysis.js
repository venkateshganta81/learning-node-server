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

        /* Rendering Scatter Plot  */
    $scope.drawRoutewiseChart = function () {
        var routeWiseChart = dc.seriesChart("#routeWiseChart");
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
            .height(280)
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
                    UserServices.getRouteWiseDetails({ source: d.key[0].Source, destination: d.key[0].Destination }, function (success) {
                        if (success.data.status) {
                            $scope.operatorDataRoteWise = success.data.data;
                            $scope.routeWiseOperatorChart();

                        }
                    }, function (error) {

                    })
                });
        });
        routeWiseChart.render();
    }

    $scope.routeWiseOperatorChart = function () {
        console.log($scope.operatorDataRoteWise)
        var operatorChart = dc.compositeChart("#operatorSalesRouteWise");

        var filterChart = dc.barChart("#routeWiseRangeChart");
        var xMin = d3.min($scope.operatorDataRoteWise, function (d) { return d.TicketAmount });
        var xMax = d3.max($scope.operatorDataRoteWise, function (d) { return d.TicketAmount });
        console.log(xMax, xMin);
        var crossFilterData = crossfilter($scope.operatorDataRoteWise);
        var groups = [];
        var dateDimension = crossFilterData.dimension(function (d) { return [d.TicketAmount, d._id.OperatorName, d._id.Source, d._id.Destination] });
        var operatorGroup = dateDimension.group().reduceSum(function (d) { return d.TicketAmount; })
        groups.push(dc.barChart(operatorChart).group(operatorGroup, 'Operators')
            .keyAccessor(function (d) {
                return d.key[0];
            })
            .valueAccessor(function (d) {
                return d.key[0];
            })
            .controlsUseVisibility(true).on('pretransition', function (chart) {
                chart.selectAll('rect.bar')
                    .call(barToolTip)
                    .on('mouseover', barToolTip.show)
                    .on('mouseout', barToolTip.hide)
                chart.selectAll("rect.bar").on("click", function (d) {
                    console.log('click', d);
                    $scope.routeWiseSelectedOperator = d.data.key[1];
                    $scope.getRouteWiseSelectedOperator(d.data.key[1],d.data.key[2],d.data.key[3]);
                });
            }))



        filterChart
            .width(850)
            .height(90)
            .margins({ top: 0, bottom: 60, left: 80, right: 40 })
            .dimension(dateDimension)
            .group(operatorGroup)
            .keyAccessor(function (d) {
                return d.key[0];
            })
            .mouseZoomable(true)
            .alwaysUseRounding(true)
            .x(d3.scale.linear().domain([xMin, xMax]))
            .elasticX(true);
        filterChart.xAxis().ticks(10);
        filterChart.yAxis().ticks(0).outerTickSize(0);

        operatorChart
            .width(850)
            .height(250)
            .margins({ top: 60, bottom: 60, left: 80, right: 40 })
            .rangeChart(filterChart)
            .dimension(dateDimension)
            .renderHorizontalGridLines(true)
            .renderTitle(false)
            .x(d3.scale.linear().domain([xMin, xMax]))
            .elasticY(true)
            .mouseZoomable(true)
            .brushOn(false)
            .clipPadding(100)
            .compose(groups)
            .xAxis();



        //yearlyChart.xUnits(d3.time.months);

        var barToolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "Operator Name: " + d.data.key[1] + '<br><br>' + "Value: " + d.data.key[0] + '<br><br>' + "Route: " + d.data.key[2] + '-' + d.data.key[3];
        });


        $scope.show = false;
        operatorChart.render();
        filterChart.render();

    }


    $scope.getRouteWiseSelectedOperator = function(operatorName , source, destination){
        UserServices.getOperatorWiseSalesTotalByRoutWise ({source:source , destination:destination , operatorName:operatorName},function(success){
            console.log(success);
        },function(error){

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


    $scope.resetFilters = function () {
        dc.filterAll();
        dc.redrawAll();
    }

}]);