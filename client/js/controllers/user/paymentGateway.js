app.controller('UserCtrl', ['$scope', '$rootScope', '$state', '$uibModal', '$log', '$document', '$cookies',  'UserServices', '$timeout', function ($scope, $rootScope, $state, $uibModal, $log, $document, $cookies,  UserServices, $timeout) {

    /* Getting user details from db and checking expiry data */

    $scope.getOperatorWiseInventory = function () {
        UserServices.getOperatorWiseInventory(function (success) {
            console.log(success);
            if (success.data.status) {
                $scope.operatorData = success.data.data;
                operatorAutomatedCharts($scope.operatorData);
                //console.log($rootScope.operatorData);
            } else {

            }
        }, function (error) {

        })
    }

    $scope.getPaymentGateWayWiseInventory = function () {
        UserServices.getPaymentGateWayWiseInventory(function (success) {
            console.log(success);
            if (success.data.status) {
                $scope.userData = success.data.data;
                automatedCharts($scope.userData);
                //console.log($rootScope.userData);
            } else {

            }
        }, function (error) {

        })
    }


    /* Chart Generating Function For Operator Wise Analytics */

    function operatorAutomatedCharts(operatorData) {
        console.log('operatorData',operatorData);
        var repetitionChart = dc.pieChart('#operatorRepeat');
        var yearlyChart = dc.compositeChart("#operatorDataLine");
        /* var filterChart = dc.barChart('#operatorRangeChart'); */


        var xMin = d3.min(operatorData, function (d) { return parseInt(new Date(d._id.BookedDate).getTime())  });
        var xMax = d3.max(operatorData, function (d) { return parseInt(new Date(d._id.BookedDate).getTime()) });
        console.log(xMax, xMin)
        operatorData.forEach(function (d) {
            d.Month = new Date(d._id.BookedDate).getMonth();
        })
        var crossFilterData = crossfilter(operatorData);
        var groups = [];




        var repetitionDim = crossFilterData.dimension(function (d) { return d._id.OperatorName; });
        var repetitionGroup = repetitionDim.group();

        var dateDimension = crossFilterData.dimension(function (d) { /* console.log(new Date(d.BookedDate)); */return new Date(d._id.BookedDate) });
        var salesGroup = dateDimension.group().reduceSum(function (d) { /* console.log(d.TicketAmount); */return d.TicketAmount; });
        for (var i = 0; i < 1; i++) {
            groups.push(dc.lineChart(yearlyChart).group(salesGroup, 'Sales').renderDataPoints(true).on('pretransition', function (chart) {
                chart.selectAll('circle.dot')
                    .call(linetip)
                    .on('mouseover', linetip.show)
                    .on('mouseout', linetip.hide);
            }))
        }
        repetitionChart
            .width(150)
            .height(250)
            .slicesCap(20)
            .innerRadius(0)
            .dimension(repetitionDim)
            .group(repetitionGroup);


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

        yearlyChart
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
        var linetip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                console.log('d',d);
                return "Date: " + (d.data.key).toDateString() + '<br><br>' + "Value: " + d.data.value + '<br><br>' + "Group: " + d.layer;
            });



        dc.renderAll();
    }

    function automatedCharts(userData) {
        console.log('userData',userData);
        var repetitionChart = dc.pieChart('#paymentGateway');
        var yearlyChart = dc.compositeChart("#salesLine");
        var filterChart = dc.barChart('#range-chart');


        var xMin = d3.min(userData, function (d) { return parseInt(new Date(d._id.BookedDate).getTime())  });
        var xMax = d3.max(userData, function (d) { return parseInt(new Date(d._id.BookedDate).getTime()) });
        console.log(xMax, xMin)
        userData.forEach(function (d) {
            d.Month = new Date(d._id.BookedDate).getMonth();
        })
        var crossFilterData = crossfilter(userData);
        var groups = [];




        var repetitionDim = crossFilterData.dimension(function (d) { return d._id.PGType; });
        var repetitionGroup = repetitionDim.group();

        var dateDimension = crossFilterData.dimension(function (d) { /* console.log(new Date(d.BookedDate)); */return new Date(d._id.BookedDate) });
        var salesGroup = dateDimension.group().reduceSum(function (d) { /* console.log(d.TicketAmount); */return d.TicketAmount; });
        for (var i = 0; i < 1; i++) {
            groups.push(dc.lineChart(yearlyChart).group(salesGroup, 'Sales').renderDataPoints(true).on('pretransition', function (chart) {
                chart.selectAll('circle.dot')
                    .call(linetip)
                    .on('mouseover', linetip.show)
                    .on('mouseout', linetip.hide);
            }))
        }
        repetitionChart
            .width(150)
            .height(250)
            .slicesCap(12)
            .innerRadius(0)
            .dimension(repetitionDim)
            .group(repetitionGroup);


        filterChart
            .width(850)
            .height(70)
            .margins({ top: 0, bottom: 60, left: 80, right: 40 })
            .dimension(dateDimension)
            .group(groups[0])
            .alwaysUseRounding(true)
            .x(d3.scale.linear().domain([xMin, xMax]))
            .xUnits(d3.time.months);


        filterChart.xAxis().ticks(12);
        filterChart.yAxis().ticks(0).outerTickSize(0);

        yearlyChart
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
        var linetip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                console.log('d',d);
                return "Date: " + (d.data.key).toDateString() + '<br><br>' + "Value: " + d.data.value + '<br><br>' + "Group: " + d.layer;
            });



        dc.renderAll();
    }

    $scope.logOut = function () {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (cookie, key) {
            $cookies.remove(key);
        });
        $rootScope.userLogin = false;
        $state.go('login');
    };


    $scope.resetFilters = function(){
        dc.filterAll(); 
        dc.redrawAll();
    }

}]);