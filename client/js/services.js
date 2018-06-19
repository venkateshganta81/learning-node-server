app.factory('CommonServices', function ($http) {
    return {
        signUp: function (data, success, error) {
            $http({
                url: '/common/sign-up',
                method: "POST",
                data: data
            }).then(success, error);
        },
        signIn: function (data, success, error) {
            $http({
                url: '/common/sign-in',
                method: "POST",
                data: data
            }).then(success, error);
        }
    };
});

app.factory('AdminServices', function ($http) {
    /* return {
       
        
    }; */
});

app.factory('UserServices', function ($http) {
    return {
        getOperatorWiseInventory : function(success,error){
            $http({
                url:'/common/getOperatorWiseInventory',
                method:'GET'
            }).then(success,error);
        },
        getPaymentGateWayWiseInventory : function(success,error){
            $http({
                url:'/common/getPaymentGateWayWiseInventory',
                method:'GET'
            }).then(success,error);
        },
        getOperatorDetails : function(name,success,error){
            $http({
                url:'/common/getOperatorBookings?operatorName='+ encodeURIComponent(name) ,
                method : 'GET'
            }).then(success,error);
        },
        getRoutewiseInventory : function(success,error){
            $http({
                url : "/common/",
                method: 'GET',
            }).then(success,error);
        }
    };
});