app.controller('OperatorCtrl', ['$scope', '$rootScope', '$state', '$log', '$document', '$cookies', 'UserServices', '$timeout', function ($scope, $rootScope, $state, $log, $document, $cookies, UserServices, $timeout) {

    /* Getting user details from db and checking expiry data */
    $scope.selectedOperator = "All Operators";
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
        var sortedOperatorData = _.sortBy(operatorData, 'TicketAmount');
        console.log(sortedOperatorData);
        var crossfilterData = crossfilter(sortedOperatorData);
        var operatorDimesion = crossfilterData.dimension(function (d) { return d._id.OperatorName; })
        var operatorGroup = operatorDimesion.group().reduceSum(function (d) { return d.TicketAmount; });

        var operatorChart = dc.barChart("#operatorDataChart");

        operatorChart
            .width(68000)
            .height(540)
            .margins({ top: 60, bottom: 240, left: 80, right: 40 })
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisPadding(10)
            .centerBar(true)
            .barPadding(0)
            .yAxisLabel("Total Sale")
            .dimension(operatorDimesion)
            .group(operatorGroup)
            .elasticX(true)
            .on('pretransition', function (chart) {
                chart.selectAll("rect.bar").on("click", function (d) {
                    console.log('click');
                    chart.filter(null)
                        .filter(d.data.key)
                        .redrawGroup();
                    $scope.getOperatorDetails(d.x);
                });
            });;


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

        operatorChart.render();
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

            operatorChart.render()
        } else {
            $scope.error = "Nothing Selected";
        }

    }

    var linetooltip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            console.log('d', d);
            return "Date: " + (d.data.key).toDateString() + '<br><br>' + "Value: " + d.data.value + '<br><br>' + "Group: " + d.layer;
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