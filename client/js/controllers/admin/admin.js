app.controller('AdminCtrl', ['$scope', '$rootScope', '$state', '$uibModal', '$log', '$document', '$cookies', 'uiGridConstants', 'Upload', 'AdminServices', '$interval', function ($scope, $rootScope, $state, $uibModal, $log, $document, $cookies, uiGridConstants, Upload, AdminServices, $interval) {
    function admin() {
        $rootScope.admin = true;
    }
    admin();
    $scope.frroleDataFromFrrole = [];
    var influencers = [], key = 0;
    $scope.client = {
        name: '',
        email: '',
        phone: '',
        organization: '',
        industry: '',
        description: '',
        tags: [],
        file: ''
    };
    $scope.custom = {
        file: ''
    };

    function validationAlert(type, message) {
        swal({
            type: type,
            title: message,
            showConfirmButton: false,
            timer: 1500
        })
    }

    function hideDataTable() {
        $scope.gridOptions.columnDefs = [];
        $scope.gridOptions.data = '';
    }

    $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
            return 'header-filtered';
        } else {
            return '';
        }
    };

    $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        data: [],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };
    $scope.logOut = function () {
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (cookie, key) {
            $cookies.remove(key);
        });
        $rootScope.userLogin = false;
        $state.go('login');
    };
    $scope.createClient = function () {
        if (!$scope.client.name) {
            validationAlert('error', 'Please Enter Name');
        } else if (!($scope.client.email && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.client.email))) {
            validationAlert('error', 'Please Enter Valid Email');
        } else if (!$scope.client.phone) {
            validationAlert('error', 'Please Enter Valid Phone Number');
        } else if (!$scope.client.analysisName) {
            validationAlert('error', 'Please Enter Analysis Name');
        } else if (!$scope.client.organization) {
            validationAlert('error', 'Please Enter Organization Name');
        } else if (!$scope.client.industry) {
            validationAlert('error', 'Please Enter Industry type');
        } else if (!$scope.client.description) {
            validationAlert('error', 'Please Add Description');
        } else if (!$scope.client.tags) {
            validationAlert('error', 'Please Add Keywords');
        } else if (!$scope.client.file) {
            validationAlert('error', 'Please Add a csv File');
        } else {
            //            console.log($scope.client.file);
            Upload.upload({
                url: '/common/addClient',
                method: 'POST',
                params: $scope.client,
                data: {
                    file: $scope.client.file
                }
            }).then(function (success) {

                /* console.log(success.data.data); */
                if (success.data.status) {
                    validationAlert('success', success.data.message);
                    $scope.client = {
                        name: '',
                        email: '',
                        phone: '',
                        organization: '',
                        analysisName: '',
                        industry: '',
                        description: '',
                        tags: [],
                        file: ''
                    };
                }
                else {
                    validationAlert('error', success.data.message);
                }
            });
        }
    };

    $scope.getClientDetails = function () {
        $rootScope.admin = true;
        AdminServices.getClientDetails(function (success) {
            if (success.data.status) {
                $scope.clientData = success.data.data;
                var dataObj = [];
                $scope.gridOptions.columnDefs = [
                    { name: 'SNo', field: 'SNo', type: 'number', enableFiltering: false, width: 50 },
                    { name: 'Name', field: 'Name', headerCellClass: $scope.highlightFilteredHeader, width: 150 },
                    { name: 'Email', field: 'Email', headerCellClass: $scope.highlightFilteredHeader, width: 150 },
                    { name: 'Mobile', field: 'Mobile', headerCellClass: $scope.highlightFilteredHeader, width: 100 },
                    { name: 'KeyWords', field: 'KeyWords', headerCellClass: $scope.highlightFilteredHeader, width: 190 },
                    {
                        name: 'Action',
                        cellTemplate: '<div><button class="btn btn-xs btn-custom mr-5" ng-click="grid.appScope.view(row.entity);">View</button><button class="btn btn-xs btn-custom mr-5" ng-click="grid.appScope.addAnalysis(row.entity);">Add</button><button class="btn btn-xs btn-custom mr-5" ng-click="grid.appScope.giveAccess(row.entity);">Give Access</button><button class="btn btn-xs btn-custom mr-5" ng-click="grid.appScope.getFrroleData(row.entity);">Get Frrole Data</button><button class="btn btn-xs btn-custom mr-5" ng-click="grid.appScope.uploadCustom(row.entity);">Upload Custom Frrole</button><button class="btn btn-xs btn-custom mr-5" ng-click="grid.appScope.addMoreAnalysis(row.entity);">Add More Analysis</button></div>',/* <button class="btn btn-xs btn-custom mr-5" ng-click="grid.appScope.addFiles(row.entity);">Add Files</button> */
                        enableFiltering: false,
                    }
                ];

                for (var i = 0; i < $scope.clientData.length; i++) {
                    dataObj.push({
                        "SNo": 1 + i,
                        "Name": $scope.clientData[i].name,
                        "Email": $scope.clientData[i].email,
                        "Mobile": $scope.clientData[i].phone,
                        "KeyWords": $scope.clientData[i].tags.join()
                    });
                }
                $scope.gridOptions.data = dataObj;
            } else {
                /* console.log("F",success.data); */
            }
        });
    }

    $scope.giveAccess = function (data) {
        /* console.log(data);
        console.log("Full Details",$scope.clientData[data.SNo-1]); */
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'sm',
            resolve: {
                modelType: function () {
                    return { data: $scope.clientData[data.SNo - 1], model: 'giveAccess' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {

            } else {

            }
        }, function () {
        });
    }

    $scope.view = function (data) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'md',
            resolve: {
                modelType: function () {
                    return { data: $scope.clientData[data.SNo - 1], model: 'viewDetails' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {

            } else {

            }
        }, function () {
        });
    }

    $scope.addAnalysis = function (data) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'md',
            resolve: {
                modelType: function () {
                    return { data: $scope.clientData[data.SNo - 1], model: 'addAnalysis' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {
                validationAlert("success", data.message);
            } else {

            }
        }, function () {
        });
    };

    $scope.getFrroleData = function (data) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'sm',
            resolve: {
                modelType: function () {
                    return { data: $scope.clientData[data.SNo - 1], model: 'getFrrole' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {
                $scope.frroleClientDetails = data.data.details;
                $scope.indexSelected = data.data.selectedIndex;
                $scope.ClientFiles = $scope.frroleClientDetails.files[$scope.indexSelected];
                var files = [], totalData = [], influencers = [], key = 0, frroleData = [];
                for (var i = 0; i < $scope.frroleClientDetails.files[$scope.indexSelected].length; i++) {
                    if (($scope.ClientFiles[i].indexOf("influencers-authors") == 0)) {
                        files.push("components/files/" + $scope.frroleClientDetails.name + "/" + $scope.frroleClientDetails.analysisName[$scope.indexSelected] + '/' + $scope.ClientFiles[i])
                    }
                }
                queue()
                    .defer(d3.csv, files[0])
                    .defer(d3.csv, files[1])
                    .defer(d3.csv, files[2])
                    .awaitAll(makeChart);

                function makeChart(error, results) {
                    if (error) throw error;
                    else {
                        for (var i = 0; i < results.length; i++) {
                            for (var j = 0; j < results[i].length; j++) {
                                totalData.push(results[i][j]);
                            }
                        }
                        var customKeys = Object.keys(totalData[0]);
                        for (var i = 0; i < totalData.length; i++) {
                            influencers.push(totalData[i][customKeys[0]]);
                        }
                        influencers = _.uniq(influencers);
                        function createProfile(k) {
                            AdminServices.createProfile(influencers[k], function (success) {
                                if (success.data.status === 'ok') {
                                    getFrroleData(influencers[k]);

                                } else {
                                    if (key + 1 < influencers.length) {
                                        $interval(createProfile(++key), 20000, true);
                                    }
                                }
                            }, function (error) {

                            })
                        }
                        createProfile(0);
                        function getFrroleData(influencer) {
                            AdminServices.getInfluencerProfile(influencer, function (success) {
                                if (success.data.status === 'ok') {
                                    saveFrroleData(influencer, success.data.results);

                                } else {
                                    if (key + 1 < influencers.length) {
                                        $interval(createProfile(++key), 20000, true);
                                    }
                                }
                            }, function (error) {

                            })
                        }
                        
                        function saveFrroleData(influencer, results) {
                            
                            AdminServices.saveFrroleData({
                                "id": $scope.frroleClientDetails._id,
                                "data":{
                                    "influencer":influencer,
                                    "results":results
                                },
                                "analysis":$scope.frroleClientDetails.analysisName[$scope.indexSelected]
                            }, function (success) {
                                if (success.data.status) {
                                    validationAlert('success', success.data.message);
                                    if (key + 1 < influencers.length) {
                                        $interval(createProfile(++key), 20000, true);
                                    }
                                } else {
                                    if (key + 1 < influencers.length) {
                                        $interval(createProfile(++key), 20000, true);
                                    }
                                }
                            }, function (error) {

                            })
                        }
                    }
                }
            } else {

            }
        }, function () {
        });

    }

    $scope.uploadCustom = function (data) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'sm',
            resolve: {
                modelType: function () {
                    return { data: $scope.clientData[data.SNo - 1], model: 'uploadFile' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {
                console.log(data)
                $scope.customizedFrroleFile = "components/files/" + data.data.name + "/" + data.data.customFrrole[data.data.customFrrole.length-1];
                console.log($scope.customizedFrroleFile)
                d3.csv($scope.customizedFrroleFile, function (error, result) {
                    if (error) throw error;
                    else {
                        console.log(result)
                        var customKeys = Object.keys(result[0]);
                        for (var i = 0; i < result.length; i++) {
                            influencers.push(result[i][customKeys[0]]);
                        }
                        influencers = _.uniq(influencers);
                        function createProfile(k) {
                            AdminServices.createProfile(influencers[k], function (success) {
                                if (success.data.status === 'ok') {
                                    getFrroleData(influencers[k]);

                                } else {
                                    if (key + 1 < influencers.length) {
                                        $interval(createProfile(++key), 20000, true);
                                    }
                                }
                            }, function (error) {

                            })
                        }
                        createProfile(0);
                        function getFrroleData(influencer) {
                            AdminServices.getInfluencerProfile(influencer, function (success) {
                                if (success.data.status === 'ok') {
                                    saveFrroleData(influencer, success.data.results);

                                } else {
                                    if (key + 1 < influencers.length) {
                                        createProfile(++key);
                                    }
                                }
                            }, function (error) {

                            })
                        }

                        function saveFrroleData(influencer, results) {
                            AdminServices.saveFrroleData({
                                "id": data.data._id,
                                "data": {
                                    "influencer": influencer,
                                    "results": results
                                },
                                "analysis": data.data.analysisName
                            }, function (success) {
                                if (success.data.status) {
                                    validationAlert('success', success.data.message);
                                    if (key + 1 < influencers.length) {
                                        createProfile(++key);
                                    }
                                } else {
                                    if (key + 1 < influencers.length) {
                                        createProfile(++key);
                                    }
                                }
                            }, function (error) {

                            })
                        }
                    }
                });
            } else {

            }
        }, function () {
        });
    }

    $scope.addFiles = function (data) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'sm',
            resolve: {
                modelType: function () {
                    return { data: $scope.clientData[data.SNo - 1], model: 'uploadMoreFile' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {

            } else {

            }
        }, function (error) {

        });
    }

    $scope.addMoreAnalysis = function (data) {
        var modalInstance = $uibModal.open({
            animation: false,
            templateUrl: 'pop-up-modal.html',
            controller: 'ModalCtrl',
            size: 'lg',
            resolve: {
                modelType: function () {
                    return { data: $scope.clientData[data.SNo - 1], model: 'AddMoreAnalysis' };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data.status) {
                validationAlert("success", data.message);
                $scope.getClientDetails();
            } else {
                validationAlert("error", data.message);
            }
        }, function (error) {

        });
    }


    $scope.getFrroleDataIntoCsv = function () {
        
        if (!$scope.custom.file) {
            validationAlert('error', 'Please Add a csv File');
        } else {
            //            console.log($scope.client.file);
            Upload.upload({
                url: '/common/addCustomizedFileToGetCSV',
                method: 'POST',
                data: {
                    file: $scope.custom.file   
                }
            }).then(function (success) {

                /* console.log(success.data.data); */
                if (success.data.status) {
                    $scope.customizedFrroleFile = "components/files/" + success.data.fileName  ;
                console.log($scope.customizedFrroleFile)
                d3.csv($scope.customizedFrroleFile, function (error, result) {
                    if (error) throw error;
                    else {
                        console.log(result)
                        var customKeys = Object.keys(result[0]);
                        for (var i = 0; i < result.length; i++) {
                            influencers.push(result[i][customKeys[0]]);
                        }
                        influencers = _.uniq(influencers);
                        console.log(influencers)
                        function createProfile(k) {
                            AdminServices.createProfile(influencers[k], function (success) {
                                console.log(influencers[k],success)
                                if (success.data.status === 'ok') {
                                    console.log(influencers[k])
                                    getFrroleData(influencers[k]);

                                } else {
                                    if (key + 1 < influencers.length) {
                                        $interval(createProfile(++key), 10000, true);
                                    }
                                }
                            }, function (error) {
                                console.log(error)
                            })
                        }
                        createProfile(0);
                        function getFrroleData(influencer) {
                            AdminServices.getInfluencerProfile(influencer, function (success) {
                                console.log(success)
                                if (success.data.status === 'ok') {
                                    console.log("fetched",influencer)
                                    saveFrroleData(influencer, success.data.results);

                                } else {
                                    if (key + 1 < influencers.length) {
                                        createProfile(++key);
                                    }else{
                                        saveData()
                                    }
                                }
                            }, function (error) {
                                console.log(error)
                            })
                        }

                        function saveFrroleData(influencer, results) {
                            $scope.header = Object.keys(results);
                            $scope.frroleData.push(results)
                            if (key + 1 < influencers.length) {
                                createProfile(++key);
                            }else{
                                saveData()
                            }

                            function saveData(){
                                AdminServices.saveDataIntoJsonFile({"header":$scope.header,"data":$scope.frroleData},function(success){

                                })
                            }



                            /* AdminServices.saveFrroleData({
                                "id": data.data._id,
                                "data": {
                                    "influencer": influencer,
                                    "results": results
                                },
                                "analysis": data.data.analysisName
                            }, function (success) {
                                if (success.data.status) {
                                    validationAlert('success', success.data.message);
                                    if (key + 1 < influencers.length) {
                                        createProfile(++key);
                                    }
                                } else {
                                    if (key + 1 < influencers.length) {
                                        createProfile(++key);
                                    }
                                }
                            }, function (error) {

                            }) */
                        }
                    }
                });








                   // validationAlert('success', success.data.message);
                    $scope.client = {
                        file: ''
                    };
                }
                else {
                    validationAlert('error', success.data.message);
                }
            });
        }
    };






}]);