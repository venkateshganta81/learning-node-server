app.controller('OperatorCtrl', ['$scope', '$rootScope', '$state', '$log', '$document', '$cookies', 'UserServices', '$timeout', function ($scope, $rootScope, $state, $log, $document, $cookies, UserServices, $timeout) {

    /* Getting user details from db and checking expiry data */
    $scope.selectedOperator = "select Operator";
    
    $scope.getOperatorWiseInventory = function () {
        if ($cookies.get('token')) {
            UserServices.getOperatorWiseInventory(function (success) {
                console.log(success)
                if (success.data.status) {
                    $scope.operatorsNames = success.data.operators
                    $scope.operatorData = success.data.aggregatedData;
                    console.log($scope.operatorsNames.length);
                } else {

                }
            }, function (error) {

            })
        } else {
            $state.go('login');
        }
    }



    $scope.drawGraphforOperator = function (operator) {
        $scope.selectedOperatorWiseAnalytics = "";
        $scope.selectedOperator = operator;
        $scope.error = "";
        console.log($scope.selectedOperator, $scope.operatorData)
        $scope.selectedOperatorWiseAnalytics = _.filter($scope.operatorData, function (d) { if (d._id.OperatorName == operator) { return d } });
        console.log($scope.selectedOperatorWiseAnalytics);
        if ($scope.selectedOperatorWiseAnalytics.length) {
            operatorAutomatedCharts($scope.selectedOperatorWiseAnalytics)
        } else {
            $scope.error = "No Data for Selected Operator"
        }

    }



    /* Chart Generating Function For Operator Wise Analytics */

    function operatorAutomatedCharts(operatorData) {
        var operatorChart = dc.compositeChart("#operatorDataLine");
        var xMin = d3.min(operatorData, function (d) { return new Date(d._id.BookedDate).getTime() });
        var xMax = d3.max(operatorData, function (d) { return new Date(d._id.BookedDate).getTime() });
        console.log(xMax, xMin)
        operatorData.forEach(function (d) {
            d.Month = new Date(d._id.BookedDate).getMonth();
        })
        var crossFilterData = crossfilter(operatorData);
        var groups = [];
        var dateDimension = crossFilterData.dimension(function (d) { /* console.log(new Date(d.BookedDate)); */return new Date(d._id.BookedDate) });
        var operatorGroup = dateDimension.group().reduceSum(function (d) { /* console.log(d.TicketAmount); */return d.TicketAmount; });
        // for (var i = 0; i < 1; i++) {
            groups.push(dc.lineChart(operatorChart).group(operatorGroup, 'Operators').renderDataPoints(true).on('pretransition', function (chart) {
                chart.selectAll('circle.dot')
                    .call(linetooltip)
                    .on('mouseover', linetooltip.show)
                    .on('mouseout', linetooltip.hide);
            }))
        // }



        /* filterChart
            .width(850)
            .height(70)
            .margins({ top: 0, bottom: 60, left: 80, right: 40 })
            .dimension(dateDimension)
            .group(groups[0])
            .alwaysUseRounding(true)
            .x(d3.scale.linear().domain([xMin, xMax]))
            .xUnits(d3.time.months);


        filterChart.xAxis().ticks(30);
        filterChart.yAxis().ticks(0).outerTickSize(0); */

        operatorChart
            .width(850)
            .height(250)
            .margins({ top: 60, bottom: 60, left: 80, right: 40 })
            /* .rangeChart(filterChart) */
            .dimension(dateDimension)
            .renderHorizontalGridLines(true)
            .x(d3.time.scale().domain([xMin, xMax]))
            .elasticY(true)
            .mouseZoomable(true)
            .brushOn(false)
            .clipPadding(100)
            .compose(groups)
            .xAxis();

        //yearlyChart.xUnits(d3.time.months);


        /* Tooltip for the line charts in Composite chart */
        var linetooltip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                console.log('d', d);
                //return "Date: " + (d.data.key).toDateString() + '<br><br>' + "Value: " + d.data.value + '<br><br>' + "Group: " + d.layer;
            });



            operatorChart.render();
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