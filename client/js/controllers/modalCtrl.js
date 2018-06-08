app.controller('ModalCtrl', ['$scope', '$uibModalInstance', 'CommonServices', 'AdminServices', '$cookies','$rootScope','$state','modelType','Upload','$interval', function ($scope, $uibModalInstance, CommonServices, AdminServices, $cookies,$rootScope,$state,modelType,Upload,$interval) {

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.templates = {
        'giveAccess' : 'views/templates/client-access-modal.html',
        'viewDetails' : 'views/templates/view-client-details-modal.html',
        'addAnalysis' : 'views/templates/add-client-analysis-modal.html',
        'uploadFile'  : 'views/templates/upload-client-custom-frrole-modal.html',
        'knowMore'    : 'views/templates/know-more-modal.html',
        'uploadMoreFile': 'views/templates/upload-more-files-modal.html',
        'AddMoreAnalysis':'views/templates/add-more-analysis-modal.html',
        'getFrrole': 'views/templates/get-frrole-data-modal.html'
    };

    function initializeAnalysis(){
        $scope.a={
            overviewData:'',
            topicsData:'',
            keywordsData:'',
            locationsData:'',
            influencersData:'',
            sitesData:''
        }
    }
    initializeAnalysis();

    $scope.tipTypes = {
        'channels' : ["The graphs are interconnected. Click on impressions, visibility or reach to apply filters. Elements on the graphs are clickable and the data can also be filtered using the date slider. Hover over each element to reveal more information.","Visibility is a score we assign to each post, across all channels, designed to measure the impact of a piece of content.","Impressions are how many times people have most likely seen or been exposed to a piece of content or keyword.","Reach on the other hand is the number of unique people who received impressions of a post."],
        'emotions' :["The graphs are interconnected. Click on impressions, visibility or reach to apply filters. Elements on the graphs are clickable and the data can also be filtered using the date slider. Hover over each element to reveal more information.","Visibility is a score we assign to each post, across all channels, designed to measure the impact of a piece of content.","Impressions are how many times people have most likely seen or been exposed to a piece of content or keyword.","Reach on the other hand is the number of unique people who received impressions of a post.","Emotion analysis provides a more granular level approach to sentiment analysis, allowing you to stay attuned to the feelings of your audience, namely joy, anger, disgust, sadness, and fear."],
        'mentions' : ["The graphs are interconnected. Click on impressions, visibility or reach to apply filters. Elements on the graphs are clickable and the data can also be filtered using the date slider. Hover over each element to reveal more information.","Visibility is a score we assign to each post, across all channels, designed to measure the impact of a piece of content.","Impressions are how many times people have most likely seen or been exposed to a piece of content or keyword.","Reach on the other hand is the number of unique people who received impressions of a post.","A mention is another term for a singular post or engagement online. It can also be called a result. "],
        'moments'  :["The Moments visualisation shows us during which hours of the day, and days of the week people are actively contributing to the dataset."],
        'sentiments':["The graphs are interconnected. Click on impressions, visibility or reach to apply filters. Elements on the graphs are clickable and the data can also be filtered using the date slider. Hover over each element to reveal more information.","Visibility is a score we assign to each post, across all channels, designed to measure the impact of a piece of content.","Impressions are how many times people have most likely seen or been exposed to a piece of content or keyword.","Reach on the other hand is the number of unique people who received impressions of a post.","Sentiment is a measure of the positive, negative, or neutral opinions about a particular topic, product or brand."],
        'keywords' : ["Shows you the most common keywords or topics, ranked by channel."],
        'influencers' : ["Influencers on Pulsar are those authors who not only produce the highest volume of mentions, but have a greater than average visibility or exposure, and exert influence around a particular subject by engaging with other users."]
    };

    if(modelType.model === 'giveAccess'){
        $scope.template = $scope.templates['giveAccess'];
        $scope.clientAccessDetails = modelType.data;
    }else if(modelType.model === 'viewDetails'){
        $scope.template = $scope.templates['viewDetails'];
        $scope.ViewClientData = modelType.data;
    }else if(modelType.model === 'addAnalysis'){
        $scope.template = $scope.templates['addAnalysis'];
        $scope.clientDetails = modelType.data;
    }else if(modelType.model === 'uploadFile'){
        $scope.template = $scope.templates['uploadFile'];
        $scope.customizedClientDetails = modelType.data;
    }else if(modelType.model === 'knowMore'){
        $scope.template = $scope.templates['knowMore'];
        /* $scope.customizedType = modelType.data; */
        $scope.CustomizedTip = $scope.tipTypes[modelType.data];
    }else if(modelType.model === 'uploadMoreFile'){
        $scope.template = $scope.templates['uploadMoreFile'];
        $scope.ADDClientData = modelType.data;
    }else if(modelType.model === 'AddMoreAnalysis'){
        $scope.template = $scope.templates['AddMoreAnalysis'];
        $scope.addClientAnalysisData = modelType.data;
    }else if(modelType.model === 'getFrrole'){
        $scope.template = $scope.templates['getFrrole'];
        $scope.clientFrroleDetails = modelType.data;
        console.log($scope.clientFrroleDetails)
    }
    
    

    function swalAlert(type,title){
        swal({
            type: type,
            title: title,
            showConfirmButton: false,
            timer: 1500
          })
    }

    function validateSigupParams() {
        var signUpParams = $scope.signUpParams;
        signUpParams.message = "";
        if (!signUpParams.phone && !signUpParams.name) {
            signUpParams.message = "All fields mandatory";
        } else if (!signUpParams.name || (signUpParams.name.length < 4) || (signUpParams.name.length > 40)) {
            signUpParams.message = "Enter name minimum 4";
        } else if (!signUpParams.phone || !_.isNumber(signUpParams.phone) || signUpParams.phone.toString().length !== 10) {
            signUpParams.message = "Enter valid phone number";
        } 
    }


    $scope.giveClientAccess = function(){
        console.log($scope.expiryDate);
        AdminServices.giveAccess({details:$scope.clientAccessDetails , expiryDate:$scope.expiryDate},function(success){
            if(success.data.status){
                swal({
                    type: 'success',
                    title: success.data.message,
                    showConfirmButton: false,
                    timer: 1500
                  })
                  $uibModalInstance.close({status:true, message:success.data.message});
            }else{

            }
        },function(error){

        });
    }

    

   $scope.addAnalysisData = function(){
       if(!$scope.a.analysisName){
        swalAlert("error","Please Add analysis name");
       }else if(!$scope.a.overviewData){
        swalAlert("error","Please Add Overview analysis");
       }else if(!$scope.a.topicsData){  
        swalAlert("error","Please Add Topic Analysis")
       }else if(!$scope.a.keywordsData){
        swalAlert("error","Please Add Keywords Analysis")
       }else if(!$scope.a.locationsData){
        swalAlert("error","Please Add Location Analysis")
        }else if(!$scope.a.influencersData){
            swalAlert("error","Please Add Influencers Analysis")
        }else if(!$scope.a.sitesData){
            swalAlert("error","Please Add Site Analysis")
        }else{
            var data = {
                "analysisName":$scope.a.analysisName,
                "analysis": [$scope.a.overviewData,$scope.a.topicsData,$scope.a.keywordsData,$scope.a.locationsData,$scope.a.influencersData,$scope.a.sitesData]
            }
            CommonServices.addAnalysis({id:$scope.clientDetails._id , data:data},function(success){
                if(success.data.status){
                    $uibModalInstance.close({status:true, message:success.data.message,data:success.data.data});
                }else{
                    swalAlert("error",success.data.message);
                }
            },function(error){

            });
        }
   }
   
   $scope.uploadCustomizedFile = function(){
       console.log($scope.customizedfile);
       if(!$scope.customizedfile){
        swalAlert("error","Please Upload Customized File");
       }else{
        Upload.upload({
            url: '/common/addCustomizedFile',
            method: 'POST',
            params:{"id":$scope.customizedClientDetails._id,"name":$scope.customizedClientDetails.name,'analysisName': $scope.analysisName },
            data: {
                file: $scope.customizedfile   
            }
        }).then(function(success){
            if(success.data.status){
                $uibModalInstance.close({status:true, message:success.data.message,data:success.data.data,'analysisName': $scope.analysisName  });
            }else{
                swalAlert("error",success.data.message);
            }

        },function(error){

        });
       }
   }


   $scope.uploadMoreFiles = function(){
    if(!$scope.morefiles){
     swalAlert("error","Please Upload a File");
    }else{
     Upload.upload({
         url: '/common/addMoreFile',
         method: 'POST',
         params:{"id":$scope.ADDClientData._id,'analysisName':$scope.analysisType,"name":$scope.ADDClientData.name},
         data: {
             file: $scope.morefiles   
         }
     }).then(function(success){
         if(success.data.status){
             $uibModalInstance.close({status:true, message:success.data.message,data:success.data.data});
         }else{
             swalAlert("error",success.data.message);
         }

     },function(error){

     });
    }
}

    $scope.addMoreAnalysis = function(){
        if(!$scope.addclientMore.analysisName){
            swalAlert('error','Please Add Analysis Name');
        }else if(!$scope.addclientMore.tags){
            swalAlert('error','Please Add Keywords');
        }else if(!$scope.addclientMore.file.length){
            swalAlert('error','Please Add atleast one file');
        }else{
            Upload.upload({
                url:"/common/addMoreAnalysis",
                method: 'POST',
                params:{"id":$scope.addClientAnalysisData._id,'analysisName':$scope.addclientMore.analysisName,"name":$scope.addClientAnalysisData.name,'tags':$scope.addclientMore.tags},
                data: {
                    file: $scope.addclientMore.file 
                }
            }).then(function(success){
                if(success.data.status){
                    $uibModalInstance.close({status:true, message:success.data.message,data:success.data.data});
                }else{
                    swalAlert("error",success.data.message);
                }
    
            },function(error){
    
            });
        }
    }


    $scope.getFrroleData = function(){
        $uibModalInstance.close({status:true, message:"Get Data",data:{'details':$scope.clientFrroleDetails , 'selectedIndex':$scope.analysisSelected}});
        
       
    };

}]);