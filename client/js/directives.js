app.directive('userMenu', userMenu);


function userMenu() {
    return {
        restrict: 'E',


        template: `
        <nav class="side-navbar col-sm-2">
          <ul class="list-unstyled">
              <li class="active"><a href="#Analytics" aria-expanded="false" data-toggle="collapse"> <i class="linea-icon linea-basic fa-fw" data-icon="H"></i> Analytics </a>
                <ul id="Analytics" class="list-unstyled ">
                  <li class="active" ><a href="#salesAnalytics" aria-expanded="false" data-toggle="collapse"><i class="linea-icon linea-basic fa-fw" data-icon="H"></i>Sales Analytics</a>
                    <ul id="salesAnalytics">
                        <li ng-class="{'active': activeTab == 'paymentGateway-data'}"><a ui-sref="paymentGateway-data">Payment Gateway</a></li>
                        <li ng-class="{'active': activeTab == 'operator-data'}"><a ui-sref="operator-data" >Operator</a></li>
                    </ul>
                  </li>
                  <li><a href="#">Route-wise Analytics</a></li>
                  <li><a href="#">Customer Analytics</a></li>
                  <li><a href="#">Booking Patterns</a></li>
                  <li><a href="#">Cancellations Patterns</a></li>
                  <li><a href="#">Top Performers</a></li>
                  <li><a href="#">Revenue Statistics</a></li>
                  <li><a href="#">Offers/Discount Results</a></li>
                </ul>
              </li>
              <li><a href="#" aria-expanded="false" data-toggle="collapse"> <i class="linea-icon linea-basic fa-fw" data-icon="."></i>Add User</a>
              </li>
          </ul>
        </nav>
        `
        
        
    }
}



