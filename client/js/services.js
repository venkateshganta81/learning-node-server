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
        },
        addAnalysis:function(data,success,error){
            $http({
                url:"/common/addAnalysis",
                method:"POST",
                data:data
            }).then(success,error);
        },
        dump : function(data,success,error){
            $http({
                
            })
        }
    };
});

app.factory('AdminServices', function ($http) {
    return {
        getClientDetails: function(success,error){
            $http({
                url:'/admin/getClientDetails',
                method:'GET'
            }).then(success,error);
        },
        giveAccess:function(data,success,error){
            $http({
                url:'/admin/giveAccess',
                method:'POST',
                data:data
            }).then(success,error);
        },
        createProfile:function(data,success,error){
            $http({
                url:'http://api.frrole.com/v4/user-profile/create?apikey=Sortinghat-EvoSJ70bxd9XJ5U0dxat59b6320711342&userid=' + data,
                method:'POST'
            }).then(success,error);
        },
        getInfluencerProfile:function(data,success,error){
            $http({
                url:' http://api.frrole.com/v4/user-profile?apikey=Sortinghat-EvoSJ70bxd9XJ5U0dxat59b6320711342&userid=' + data,
                method:'GET'
            }).then(success,error);
        },
        saveFrroleData:function(data,success,error){
            $http({
                url:'/admin/saveFrroleData',
                method:'POST',
                data:data
            }).then(success,error);
        },
        saveDataIntoJsonFile:function(data,success,error){
            $http({
                url:'/admin/saveDataIntoJsonFile',
                method:'POST',
                data:data
            }).then(success,error);
        }
        
    };
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
        saveDataIntoJsonFile:function(data,success,error){
            $http({
                url:'/common/saveDataIntoJsonFile',
                method:'POST',
                data:data
            }).then(success,error);       
        }
    };
});