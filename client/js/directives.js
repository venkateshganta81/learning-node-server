app.directive('userMenu', userMenu)
    .directive('adminMenu', adminMenu);


function userMenu() {
    return {
        restrict: 'E',


        template: '<ul class="list-unstyled directive-list collapse navbar-collapse" id="bs-example-navbar-collapse-2">' +

        '<li ng-class="{active: activeTab === \'user-dashboard\'}"><a  ui-sref="user-dashboard"><span><i class="fa fa-tachometer mr-5 fa-2" aria-hidden="true"></i></span> Dashboard</a></li>' +
        '<li ng-class="{active: activeTab === \'user-data\'}"><a  ui-sref="user-data"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span> Charts</a></li>' +
        '<li ng-class="{active: activeTab === \'chart-data\'}"><a  ui-sref="chart-data"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>Automated Charts Under Progress</a></li>' +
        '<li ng-class="{active: activeTab === \'location-data\'}"><a  ui-sref="location-data"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>Location Map Cities</a></li>' +
        '<li ng-class="{active: activeTab === \'location-country-data\'}"><a  ui-sref="location-country-data"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>Location Map Countries</a></li>' +
        '<li ng-class="{active: activeTab === \'topics-tree-map\'}"><a  ui-sref="topics-tree-map"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>Topics-Tree</a></li>' +
        '<li ng-class="{active: activeTab === \'key-word-cloud\'}"><a  ui-sref="key-word-cloud"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>KeyWords</a></li>' +
        '<li ng-class="{active: activeTab === \'clustered-bubble\'}"><a  ui-sref="clustered-bubble"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>Clustered Bubble Chart</a></li>' +
        '<li ng-class="{active: activeTab === \'moments\'}"><a  ui-sref="moments"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>Moments Chart</a></li>' +
        '<li ng-class="{active: activeTab === \'multi-comm-data\'}"><a  ui-sref="multi-comm-data"><span><i class="fa fa-pie-chart mr-5" aria-hidden="true"></i></span>Communication Data</a></li>' +
        '</ul>'
        
        
    }
}

function adminMenu() {
    return {
        restrict: 'E',


        template: '<ul class="nav navbar-nav navbar-right">' +
        '<li class="dropdown" ng-class="{active: activeTab === \'admin-dashboard\'}"><a class="dropdown-toggle" data-toggle="dropdown"  ui-sref="admin-dashboard">Dashboard</a></li>' +
        '<li class="dropdown" ng-class="{active: activeTab === \'create-client\'}"><a class="dropdown-toggle" data-toggle="dropdown"  ui-sref="create-client">Add a Client</a></li>' +
        '<li class="dropdown" ng-class="{active: activeTab === \'give-access\'}"><a class="dropdown-toggle" data-toggle="dropdown"  ui-sref="give-access">Give Access</a></li>' +
        '<li class="dropdown"><a href="#" ng-click="logOut()" class="cursor">Logout</a></li>'+
        '</ul>'

    }
}


app.directive('datePicker', function () {
    return {
        restrict: 'E',
        scope: {
            ngModel: "="
        },
        template: '<div class="input-group">\n' +
        '          <input type="text"  class="form-control" datepicker-options="options" show-button-bar="false" uib-datepicker-popup="{{dateFormat}}" ng-model="ngModel" is-open="opened" ng-required="true"  close-text="Close"/>\n' +
        '          <span class="input-group-btn">\n' +
        '            <button type="button" class="btn btn-default" ng-click="open($event)">' +
        '<i class="glyphicon glyphicon-calendar"></i></button>\n' +
        '          </span>\n' +
        '        </div>\n',
        require: 'ngModel',
        link: function (scope) {
            scope.opened=false;
            scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened = !scope.opened;
            };

            scope.options = {
                minDate: new Date(),
                showWeeks: false
            }

        }
    };
});

