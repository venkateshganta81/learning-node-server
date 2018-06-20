app.directive('userMenu', userMenu);


function userMenu() {
    return {
        restrict: 'E',


        template: `
        <nav class="side-navbar col-sm-2">
          <ul class="list-unstyled">
              <li><a href="#Analytics" aria-expanded="false" data-toggle="collapse">  Analytics </a>
                <ul id="Analytics" class="list-unstyled ">
                  <li><a href="#salesAnalytics" aria-expanded="false" data-toggle="collapse"><i class="fa fa-line-chart" aria-hidden="true"></i>Sales Analytics</a>
                    <ul id="salesAnalytics">
                        <li ui-sref-active="active"><a ui-sref="paymentGateway-data">Payment Gateway</a></li>
                        <li ui-sref-active="active"><a ui-sref="operator-data" >Operator</a></li>
                    </ul>
                  </li>
                  <li ui-sref-active="active"><a  ui-sref="route-wise-analysis">Route-wise Analytics</a></li>
                  <li><a href="#">Customer Analytics</a></li>
                  <li><a href="#">Booking Patterns</a></li>
                  <li><a href="#">Cancellations Patterns</a></li>
                  <li><a href="#">Top Performers</a></li>
                  <li><a href="#">Revenue Statistics</a></li>
                  <li><a href="#">Offers/Discount Results</a></li>
                </ul>
              </li>
              <li><a href="#" aria-expanded="false" data-toggle="collapse"> <i class="fa fa-user-plus" aria-hidden="true"></i>Add User</a>
              </li>
          </ul>
        </nav>
        `
        
        
    }
}



