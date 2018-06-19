app.controller('OperatorCtrl', ['$scope', '$rootScope', '$state', '$log', '$document', '$cookies', 'UserServices', '$timeout', function ($scope, $rootScope, $state, $log, $document, $cookies, UserServices, $timeout) {

    /* Getting user details from db and checking expiry data */
    $scope.selectedOperator = "";
    $scope.show = true;
    $scope.getOperatorWiseInventory = function () {
        if ($cookies.get('token')) {
            UserServices.getOperatorWiseInventory(function (success) {
                console.log(success)
                if (success.data.status) {
                    $scope.operatorsNames = success.data.data;
                    console.log($scope.operatorsNames)
                    operatorAutomatedCharts($scope.operatorsNames);
                } else {

                }
            }, function (error) {

            })
        } else {
            $state.go('login');
        }
    }



    /* Chart Generating Function For Operator Wise Analytics */

    function operatorAutomatedCharts(operatorData) {
        var operatorChart = dc.compositeChart("#operatorDataChart");
        var filterChart = dc.barChart("#rangeChart");
        var xMin = d3.min(operatorData, function (d) { return d.TicketAmount });
        var xMax = d3.max(operatorData, function (d) { return d.TicketAmount });
        console.log(xMax, xMin);
        var crossFilterData = crossfilter(operatorData);
        var groups = [];
        var dateDimension = crossFilterData.dimension(function (d) { /* console.log(new Date(d.BookedDate)); */return [d.TicketAmount, d._id.OperatorName] });
        var operatorGroup = dateDimension.group().reduceSum(function (d) { return d.TicketAmount; })
        // for (var i = 0; i < 1; i++) {
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
                    $scope.selectedOperator = d.data.key[1];
                    $scope.getOperatorDetails(d.data.key[1]);
                });
            }))
        // }



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

        d3.selectAll("rect.bar")
            .attr("width", 20);

        console.log(operatorChart.selectAll("rect.bar"));

        //yearlyChart.xUnits(d3.time.months);




        $scope.show = false;
        operatorChart.render();
        filterChart.render();
    }

    $scope.getOperatorDetails = function (operatorName) {
        UserServices.getOperatorDetails(operatorName, function (success) {
            console.log(success);
            if (success.data.status) {
                $scope.selectedOperatorDetails = success.data.data;
                $scope.automateChart("TicketAmount");
            }
        }, function (error) {

        })
    }




    $scope.automateChart = function (type) {
        var operatorChart = dc.compositeChart("#operatorDataLine");
        var xMin = d3.min($scope.selectedOperatorDetails, function (d) { return new Date(d._id.BookedDate).getTime() });
        var xMax = d3.max($scope.selectedOperatorDetails, function (d) { return new Date(d._id.BookedDate).getTime() });
        var operatorCorssFilterData = crossfilter($scope.selectedOperatorDetails);
        var dateDimension = operatorCorssFilterData.dimension(function (d) { return new Date(d._id.BookedDate) });
        var dataTypeGroup;
        if (type == "seats") {
            dataTypeGroup = dateDimension.group().reduceSum(function (d) { return d.seats });
        } else if (type == "bookings") {
            dataTypeGroup = dateDimension.group().reduceSum(function (d) { return d.bookings });
        } else if (type == "TicketAmount") {
            dataTypeGroup = dateDimension.group().reduceSum(function (d) { return d.TicketAmount });
        } else {
            dataTypeGroup = "";
        }
        if (dataTypeGroup) {
            var groups = [];
            groups.push(dc.lineChart(operatorChart).group(dataTypeGroup, 'Operators').renderDataPoints(true).on('pretransition', function (chart) {
                chart.selectAll('circle.dot')
                    .call(linetooltip)
                    .on('mouseover', linetooltip.show)
                    .on('mouseout', linetooltip.hide);
            }))
            operatorChart
                .width(850)
                .height(250)
                .margins({ top: 60, bottom: 30, left: 80, right: 40 })
                /* .rangeChart(filterChart) */
                .dimension(dateDimension)
                .renderHorizontalGridLines(true)
                .renderTitle(false)
                .x(d3.time.scale().domain([xMin, xMax]))
                .elasticY(true)
                .mouseZoomable(true)
                .brushOn(false)
                .clipPadding(100)
                .compose(groups)
                .xAxis();

            operatorChart.render();
            dc.redrawAll();
        } else {
            $scope.error = "Nothing Selected";
        }

    }

    var linetooltip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "Date: " + (d.data.key).toDateString() + '<br><br>' + "Value: " + d.data.value + '<br><br>' + "Group: " + d.layer;
        });


    var barToolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "Operator Name: " + d.data.key[1] + '<br><br>' + "Value: " + d.data.key[0];
        });

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