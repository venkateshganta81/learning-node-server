app.controller('OperatorCtrl', ['$scope', '$rootScope', '$state', '$log', '$document', '$cookies', 'UserServices', '$timeout', function ($scope, $rootScope, $state, $log, $document, $cookies, UserServices, $timeout) {

    /* Getting user details from db and checking expiry data */
    $scope.selectedOperator = "All Operators";
    $scope.show = true;
    $scope.getOperatorWiseInventory = function () {
        if ($cookies.get('token')) {
            UserServices.getOperatorWiseInventory(function (success) {
                console.log(success)
                if (success.data.status) {
                    $scope.operatorsNames = success.data.operators
                    $scope.operatorData = success.data.aggregatedData;
                    $scope.drawGraphforOperator("All Operators");
                } else {

                }
            }, function (error) {

            })
        } else {
            $state.go('login');
        }
    }



    $scope.drawGraphforOperator = function (operator) {
        /*  if (operator == 'All Operators') {
             operatorAutomatedCharts($scope.operatorData);
         } else {
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
         } */
        $scope.Operators = [];
        $scope.operatorsNames.forEach((x) => {
            $scope.Operators.push({
                OperatorName: x,
                Count: parseInt(Math.random() * (80 - 20) + 20)
            })
        })

        operatorAutomatedCharts($scope.Operators);

    }



    /* Chart Generating Function For Operator Wise Analytics */

    function operatorAutomatedCharts(operatorData) {
        var crossfilterData = crossfilter(operatorData);
        var operatorDimesion = crossfilterData.dimension(function (d) { return d.OperatorName; })
        var operatorGroup = operatorDimesion.group().reduceSum(function (d) { return d.Count; })

        var operatorChart = dc.barChart("#operatorDataChart");

        operatorChart
            .width(768)
            .height(480)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .brushOn(true)
            .yAxisLabel("This is the Y Axis!")
            .dimension(operatorDimesion)
            .group(operatorGroup)
            .controlsUseVisibility(true)
            .on('pretransition', function (chart) {
                chart.selectAll("rect.bar").on("click", function (d) {
                    console.log('click');
                    chart.filter(null)
                        .filter(d.data.key)
                        .redrawGroup();
                });
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