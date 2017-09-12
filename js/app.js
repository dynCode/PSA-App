//-- AngularJS --//
(function(){
    'use strict';
    
    var module = angular.module('app', ['onsen', 'ngMap', 'ngSanitize', 'ngFileUpload']);
    
    // angular data filters
    module.filter('externalLinks', function() {
        return function(text) {
            //return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
            //return String(text).replace(/href=/gm, "ng-click=\"exLink()\" href=");
            //
            // NOTE:
            // can't use ng-click as it is not in Angular Land as $sce and ng-bind-html
            // ALSO - must do filters in this order 'content | externalLinks | to_trusted'
            //        so this string stays in content
            return String(text).replace(/href=/gm, "onclick=\"angular.element(this).scope().exLink(this);return false\" href=");
        };
    });

    module.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    
    module.controller('AppController', function($scope, $http, $window, $timeout, Upload) {
        //API URL path
        var apiPath = 'http://www.psaclub.mobi/api';
        
        $scope.data = [];
        //points partners name dropdown
        $scope.pointsDD = [];
        $scope.pointsCatDD = [];
        $scope.pointsProvDD = [];
        $scope.pointsCityDD = [];
        $scope.searchOk = false;
        $scope.searchProvOk = false;
        $scope.partnerList = [];
        
        //discount partners name dropdown
        $scope.discountDD = [];
        $scope.discountCatDD = [];
        $scope.discountProvDD = [];
        $scope.discountCityDD = [];
        $scope.searchDiscountOk = false;
        $scope.searchDiscountProvOk = false;
        $scope.discountPartnerList = [];
        
        //Membder Data
        $scope.userMpacc = '';
        $scope.userPass = ''; 
        $scope.loggedIn = false; 
        $scope.updateDate = '';
        $scope.totalEarned = '';
        $scope.totalBonusEarned = '';
        $scope.totalUsed = '';
        $scope.currentUnits = '';
        $scope.currentRands = '';
        $scope.sessionId = '';
        $scope.FirstName = '';
        $scope.LastName = '';
        $scope.gender = '';
        $scope.title = '';
        $scope.IdNumber = '';
        $scope.dob = '';
        $scope.EmailAddress = '';
        $scope.ContactNumber = '';
        $scope.Province = '';
        $scope.City = '';
        $scope.Suburb = '';
        $scope.Addressline1 = '';
        $scope.Addressline2 = '';
        $scope.Addressline3 = '';
        $scope.postalCode = '';
        $scope.Title = '';
        $scope.tierDes = '';
        $scope.CardNumber = '';
        $scope.comId = '';
        $scope.commun = '';
        
        //Partner Data
        $scope.partner_id = '';
        $scope.partner_name = '';
        $scope.partner_logo = '';
        $scope.partner_voucher = '';
        $scope.partner_terms = '';
        $scope.partner_tel = '';
        $scope.partner_address = '';
        $scope.voucher_date = '';
        $scope.conImages = '';
        
        //Category Partner Lists
        $scope.catList = [];
        $scope.catPartnerList = [];
        
        //Coupons List
        $scope.couponList = [];
        
        //Coupon Code
        $scope.couponCode = '';
        
        //Coupon Data
        $scope.couponimageUrl = "";
        $scope.couponname = "";
        $scope.coupondescription = "";
        $scope.coupondiscount = "";
        $scope.coupontc = "";
        
        //tranaction fields
        $scope.transList = "";
        $scope.discountList = "";
        
        // Airtime Options
        $scope.selectedAir = [];
    	$scope.selectedAirData = [
            { 
                'id' : '0', 
                'network' : 'Vodacom',
                'airOptions' : [
                    {"cents" : '500', "rand" : 'R 5'},
                    {"cents" : '1000', "rand" : 'R 10'},
                    {"cents" : '1200', "rand" : 'R 12'},
                    {"cents" : '2900', "rand" : 'R 29'},
                    {"cents" : '5500', "rand" : 'R 55'},
                    {"cents" : '11000', "rand" : 'R 110'},
                    {"cents" : '27500', "rand" : 'R 275'}
                ]
            },{ 
                'id': '1',
                'network' : 'MTN',
                'airOptions' : [
                    {"cents" : '500', "rand" : 'R 5'},
                    {"cents" : '1000', "rand" : 'R 10'},
                    {"cents" : '1500', "rand" : 'R 15'},
                    {"cents" : '3000', "rand" : 'R 30'},
                    {"cents" : '6000', "rand" : 'R 60'},
                    {"cents" : '18000', "rand" : 'R 180'}
                ]
            },{ 
                'id': '2',
                'network' : 'CellC',
                "airOptions": [
                    {"cents" : '500', "rand" : 'R 5'},
                    {"cents" : '1000', "rand" : 'R 10'},
                    {"cents" : '2500', "rand" : 'R 25'},
                    {"cents" : '3500', "rand" : 'R 35'},
                    {"cents" : '5000', "rand" : 'R 50'},
                    {"cents" : '7000', "rand" : 'R 70'},
                    {"cents" : '10000', "rand" : 'R 100'},
                    {"cents" : '15000', "rand" : 'R 150'},
                    {"cents" : '20000', "rand" : 'R 200'}
                ] 
            },{ 
                'id': '3',
                'network' : 'Telkom',
                "airOptions": [
                    {"cents" : '2000', "rand" : 'R 20'},
                    {"cents" : '4000', "rand" : 'R 40'},
                    {"cents" : '5000', "rand" : 'R 50'},
                    {"cents" : '10000', "rand" : 'R 100'},
                    {"cents" : '20000', "rand" : 'R 200'}
                ] 
            }
	];
        
        // distName drop down for registration
        $scope.searchOk = false;
        $scope.regCityDD = [];
        
        // set member reg field to false
        $scope.cardReg = false;
        
        // retail Name & ID
        $scope.retailName = "";
        $scope.retailID = "";
        
        /*
        //partner map matkers
        $scope.partnerMarkers = [];
        
        // set map instance
        $scope.map;
        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;
            $scope.map = map;
        });
        */
        
        // Page content scopes
        $scope.homePage = '';
        $scope.psPage = '';
        $scope.hwPage = '';
        $scope.cuPage = '';
        $scope.tcPage = '';
        
        //Banners
        $scope.Banner1 = '';
        $scope.Banner2 = '';
        $scope.Banner3 = '';
        $scope.subBanner = '';
        
        // topbar and footer colours
        $scope.topbarBG = '';
        $scope.footerBG = '';
        
        // load home page 
        $scope.init = function() {
            $http.post(apiPath+'/getPageContent.php', {"pageID" : "1"})
            .success(function(data, status){
                console.log(data);
                console.log(status);
                if (data['error'] == 0) {
                    $scope.homePage = data['html'];
                    
                    $scope.topbarBG = data['topbarBG'];
                    $scope.footerBG = data['footerBG'];
                    
                    $scope.Banner1 = data['Banner1'];
                    $scope.Banner2 = data['Banner2'];
                    $scope.Banner3 = data['Banner3'];
                    $scope.subBanner = data['subBanner'];
                } else {
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                }
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        // load page data
        $scope.loadpage = function(pageId) {
            $http.post(apiPath+'/getPageContent.php', {"pageID" : pageId})
            .success(function(data, status){
                console.log(data);
                console.log(status);
                if (data['error'] == 0) {
                    if (pageId === 2) {
                        $scope.psPage = data['html'];
                        myNavigator.pushPage('views/wantToJoin.html', { animation : 'slide' });
                    } else if (pageId === 3) {
                        $scope.hwPage = data['html'];
                        myNavigator.pushPage('views/howItWorks.html', { animation : 'slide' });
                    } else if (pageId === 4) {
                        $scope.cuPage = data['html'];
                        myNavigator.pushPage('views/contactUs.html', { animation : 'slide' });
                    } else if (pageId === 5) {
                        $scope.tcPage = data['html'];
                        myNavigator.pushPage('views/TandC.html', { animation : 'slide' });
                    } 
                } else {
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                }
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }
        
        // login checker
        $scope.LogIn = function() {
            var user = $scope.data.loyaltyNum;
            var pass = $scope.data.password;
            
            if (user && pass) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/login.php', {"reqType" : "login", "user" : user, "pass" : pass})
                .success(function(data, status){
                    if (data['error'] == 0) {
                        console.log("Data:", data);
                        modal.hide();
                        $scope.totalEarned = data['totalEarned'];
                        $scope.totalBonusEarned = data['totalBonusEarned'];
                        $scope.totalUsed = data['totalUsed'];
                        $scope.totalBucks = data['totalBucks'];
                        $scope.currentUnits = data['currentUnits'];
                        $scope.currentRands = data['currentRands'];
                        $scope.userMpacc = user;
                        $scope.userPass = pass;
                        $scope.sessionId = data['sessionId'];
                        $scope.loggedIn = true;
                        $scope.FirstName = data['FirstName'];
                        $scope.LastName = data['LastName'];
                        $scope.gender = data['gender'];
                        $scope.IdNumber = data['IdNumber'];
                        $scope.dob = data['dob'];
                        $scope.EmailAddress = data['EmailAddress'];
                        $scope.ContactNumber = data['ContactNumber'];
                        $scope.Province = data['Province'];
                        $scope.City = data['City'];
                        $scope.Suburb = data['Suburb'];
                        $scope.Addressline1 = data['Addressline1'];
                        $scope.Addressline2 = data['Addressline2'];
                        $scope.Addressline3 = data['Addressline3'];
                        $scope.postalCode = data['postalCode'];
                        $scope.Title = data['title'];
                        $scope.tierDes = data['tierDes'];
                        $scope.CardNumber = '62786401'+user;
                        $scope.comId = data['comId'];
                        $scope.commun = data['commun'];
                        
                        modal.show();
                        $scope.data.errorCode = 'Collecting your data...';
                        
                        $timeout(function(){
                            modal.hide();
                            $scope.data = [];
                            myNavigator.pushPage('views/user/welcome.html', { animation : 'fade' });
                        },'2000');
                    } else if (data['error'] === 2) {    
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/register.html', { animation : 'fade' });
                        },'2000');
                    } else if (data['error'] === 3) {    
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/resetpassword.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        console.log(data['html']);
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/login.html', { animation : 'fade' });
                        },'1000');
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'Invalid Loyalty Number or Password.';
                modal.show();
            }
        };
        
        // password reset
        $scope.restPass = function () {
            var MPAcc = $scope.data.reset_MPacc;
            
            if (MPAcc) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/restpass.php', {"reqType" : "restPass", "MPAcc" : MPAcc})
                .success(function(data, status){
                    if (data['error'] == 0) {
                        
                        modal.show();
                        $scope.data.errorCode = data['html'];
                        
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/updatepassword.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        modal.hide();
                        ons.notification.alert({
                            message: data['html'],
                            title: 'Error',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                ons.notification.alert({
                    message: 'Please fill in your membership number.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        };
        
        //password update
        $scope.updatePass = function () {
            var MPAcc = $scope.data.pu_MPacc;
            var oldPass = $scope.data.pu_oldPass;
            var password = $scope.data.pu_newPass;
            var re_pass = $scope.data.pu_newPassR;
            
            if (MPAcc, oldPass, password, re_pass) {
                if (password.length >= 5) {
                    if (password === re_pass) {

                        modal.show();
                        $scope.data.errorCode = 'Processing, please wait...';
                        $http.post(apiPath+'/updatepass.php', {"member" : MPAcc, "password" : password, "oldpassword" : oldPass })
                        .success(function(data, status){
                            if (data['error'] == 0) {

                                modal.show();
                                $scope.data.errorCode = data['html'];

                                $timeout(function(){
                                    modal.hide();
                                    $scope.data = [];
                                    myNavigator.resetToPage('views/login.html', { animation : 'fade' });
                                },'2000');
                            } else {
                                modal.hide();
                                ons.notification.alert({
                                    message: data['html'],
                                    title: 'Error',
                                    buttonLabel: 'OK',
                                    animation: 'default'
                                });
                            }
                        })
                        .error(function(data, status) {
                            modal.hide();
                            $scope.data.errorCode = 'Request failed';
                            modal.show();
                        });
                    } else {
                        ons.notification.alert({
                            message: 'Your new passwords did not match.',
                            title: 'Oops!',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }
                } else {
                    ons.notification.alert({
                        message: 'Password not long enough.',
                        title: 'Oops!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            } else {
                ons.notification.alert({
                    message: 'Please fill all the fields.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        };
        
        // setup update fields
        $scope.SetupUpdate = function() {
            $scope.data.up_Addline1 = $scope.Addressline1;
            $scope.data.up_Addline2 = $scope.Addressline2;
            $scope.data.up_Addline3 = $scope.Addressline3;
            $scope.data.up_City = $scope.City;
            $scope.data.up_CNumber = $scope.ContactNumber;
            $scope.data.up_Email = $scope.EmailAddress;
            $scope.data.up_Name = $scope.FirstName;
            $scope.data.up_IdNum = $scope.IdNumber;
            $scope.data.up_LName = $scope.LastName;
            $scope.data.up_Prov = $scope.Province;
            $scope.data.up_Sub = $scope.Suburb;
            $scope.data.up_sex = $scope.gender;
            $scope.data.up_pCode = $scope.postalCode;
            $scope.data.up_title = $scope.Title;
            
            myNavigator.pushPage('views/user/profile_update.html', { animation : 'fade' });
        };
        
        //update profile
        $scope.updateProfile = function () {
            var CellNumber = $scope.data.up_CNumber;
            var EmailAddress = $scope.data.up_Email;
            var Address1 = $scope.data.up_Addline1;
            var Address2 = $scope.data.up_Addline2;
            var PostCode = $scope.data.up_pCode;
            var Suburb = $scope.data.up_Sub;
            var City = $scope.data.up_City;
            var Province = $scope.data.up_Prov;
            var MemberNo = $scope.userMpacc;
            var MemberPass = $scope.userPass;
            var MemberSession = $scope.sessionId;
            
            if ( CellNumber && EmailAddress ) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/updateProfile.php', {"reqType" : "update", "CellNumber" : CellNumber, "EmailAddress" : EmailAddress, "Address1" : Address1, "Address2" : Address2, "PostCode" : PostCode, "Suburb" : Suburb, "City" : City, "Province" : Province, "MemberNo" : MemberNo, "MemberPass" : MemberPass, "MemberSession" : MemberSession})
                .success(function(data, status){
                    console.log("Data:", data);
                    if (data['error'] == 0) {
                        console.log("Data:", data);
                        modal.hide();

                        ons.notification.alert({
                            message: data['html'],
                            title: 'Yay!',
                            buttonLabel: 'Continue',
                            animation: 'default',
                            callback: function() {
                                $scope.data = [];
                                myNavigator.resetToPage('views/user/welcome.html', { animation : 'fade' });
                            }
                        });

                    } else {
                        modal.hide();
                        ons.notification.alert({
                            message: data['html'],
                            title: 'Error',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });  
            } else {
                ons.notification.alert({
                    message: 'Please fill in all the fields.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        };
        
        // last 10 transactions
        $scope.myTransactions = function () {
            var user = $scope.userMpacc;
            var pass = $scope.userPass; 
            
            console.log("user: " + user+", pass: "+pass+", sessionId: " +$scope.sessionId);
            
            $scope.transList = [];
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/translistList.php', {"user" : user, "pass" : pass, "sessionId" : $scope.sessionId})
            .success(function(data, status){
                console.log("Data:",data);
                modal.hide();
                $scope.transList = data['tranactions'];
                $scope.discountList = data['discounts'];
                if (data) {
                    myNavigator.pushPage('views/user/mytransactions.html', { animation : 'fade'});
                } else {
                    ons.notification.alert({
                        message: 'No transactions found.',
                        title: 'Sorry!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }         
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        // airtime redemption
        $scope.redeemAir = function () {
            var mobile = $scope.data.CellNum;
            var airAmt = $scope.selectedAir.airOption;
            var spNetwork = $scope.selectedAir.network.network;
                        
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/redeemAir.php', {"reqType" : "redeemAir", "mobile" : mobile, "airAmt" : airAmt, "spNetwork": spNetwork, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    if (data['error'] == 0) {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        myNavigator.pushPage('views/user/welcome.html', { animation : 'fade'});
                    } else {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            }
        };
        // electricity redemption
        $scope.redeemElc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemElc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        // groceries redemption
        $scope.redeemFood = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemFood", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        // nu metro redemption
        $scope.redeemMovie = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemMovie", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //Edgars redemption
        $scope.redeemEdgarsGc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemEdgarsGc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    $scope.data = [];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //Edgars Active redemption
        $scope.redeemActiveGc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemActiveGc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    $scope.data = [];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //Boardmans redemption
        $scope.redeemBoardmansGc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemBoardmansGc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    $scope.data = [];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //JET redemption
        $scope.redeemJetGc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemJetGc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    $scope.data = [];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //JET MART redemption
        $scope.redeemJetMartGc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemJetMartGc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    $scope.data = [];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //RED SQUARE redemption
        $scope.redeemRedSGc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemRedSGc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    $scope.data = [];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //CNA redemption
        $scope.redeemCNAGc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemCNAGc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    $scope.data = [];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        //Feed A child Donation
        $scope.redeemDonateChild = function () {
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "redeemDonateChild", "voucher" : vAmount, "cardNum" : $scope.userMpacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    
                    modal.show();
                    $timeout(function(){
                        modal.hide();
                        $scope.data = [];
                        myNavigator.resetToPage('views/user/feed_thanks.html', { animation : 'fade' });
                    },'2000');
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        
        // build points name dropdown
        $scope.pointsName = function() {
            $scope.pointsDD = [];
            $scope.partnerList = [];
            $http.get(apiPath+'/pointsDD.php')
            .success(function (result, status) {
                $scope.pointsDD = result;
                myNavigator.pushPage('views/user/points_name.html', { animation : 'lift' });
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get parter names, please try again.';
                modal.show();
            });
        };
        
        // get points name and display list
        $scope.searchPointName = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerName = this.selectPointsName.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "PointPartnerName", "partnerName" : partnerName})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchOk = true;
                $scope.partnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        // build points category dropdown
        $scope.pointsCategory = function() {
            $scope.pointsCatDD = [];
            $scope.partnerList = [];
            $http.get(apiPath+'/pointsCatDD.php')
            .success(function (result, status) {
                $scope.pointsCatDD = result;
                myNavigator.pushPage('views/user/points_cat.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get categories, please try again.';
                modal.show();
            });
        };
        
        // get points category and display list
        $scope.searchPointCat = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerCat = this.selectPointsCat.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "PointPartnerCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.searchOk = true;
                $scope.partnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };       
        
        // build points province dropdown
        $scope.pointsProvince = function() {
            $scope.pointsProvDD = [];
            $scope.partnerList = [];
            $http.get(apiPath+'/pointsProvDD.php')
            .success(function (result, status) {
                $scope.pointsProvDD = result;
                myNavigator.pushPage('views/user/points_reg.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get regions, please try again.';
                modal.show();
            });
        };
        
        // get points category and display list
        $scope.searchPointProv = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerProv = this.selectPointsProv.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/pointsCityDD.php', {"partnerProv" : partnerProv})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchProvOk = true;
                $scope.pointsCityDD = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        // get points city and display list
        $scope.searchPointCity = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerCity = this.selectPointsCity.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "PointPartnerCity", "partnerCity" : partnerCity})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchOk = true;
                $scope.partnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        //build voucher
        $scope.pointsVoucher = function(partnerId) {
            console.log(partnerId);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "PartnerVoucher", "partnerId" : partnerId, "cardNum" : $scope.userMpacc})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_id = partnerId;
                $scope.partner_name = data[0]['partner_name'];
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.partner_voucher = data[0]['partner_voucher'];
                $scope.partner_terms = data[0]['partner_terms'];
                $scope.partner_tel = data[0]['partner_tel'];
                $scope.partner_address = data[0]['partner_address'];
                $scope.voucher_date = today;
                $scope.conImages = 'http://www.mahala.mobi/components/com_jumi/files/mahala_WSDL/partnerLogo.png';
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
            
            
            myNavigator.pushPage('views/user/voucher_points.html', { animation : 'fade', partnerId : partnerId });
        };
        
        // buile discount name dropdown
        $scope.discountName = function () {
            $scope.discountDD = [];
            $scope.discountPartnerList = [];
            $http.get(apiPath+'/discountDD.php')
            .success(function (result, status) {
                $scope.discountDD = result;
                myNavigator.pushPage('views/user/dis_name.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                console.log(result);
                console.log(status);
                $scope.data.errorCode = 'Failed to get partner names. Please try again.';
                modal.show();
            });
        };
        
        // get discount name and display list
        $scope.searchDiscountName = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerName = this.selectDiscountName.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "DiscountPartnerName", "partnerName" : partnerName})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchDiscountOk = true;
                $scope.discountPartnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        // build discount category dropdown
        $scope.discountCategory = function() {
            $scope.discountCatDD = [];
            $scope.discountPartnerList = [];
            $http.get(apiPath+'/discountCatDD.php')
            .success(function (result, status) {
                $scope.discountCatDD = result;
                myNavigator.pushPage('views/user/dis_cat.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get discount cat drop down';
                modal.show();
            });
        };
        
        // get discount category and display list
        $scope.searchDiscountCat = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerCat = this.selectDiscountCat.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "DiscountPartnerCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.searchDiscountOk = true;
                $scope.discountPartnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };       
        
        // build discount province dropdown
        $scope.discountProvine = function() {
            $scope.discountProvDD = [];
            $scope.discountPartnerList = [];
            $http.get(apiPath+'/discountProvDD.php')
            .success(function (result, status) {
                $scope.discountProvDD = result;
                myNavigator.pushPage('views/user/dis_reg.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get discount province drop down';
                modal.show();
            });
        };
        
        // get discount category and display list
        $scope.searchDiscountProv = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerProv = this.selectDiscountProv.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/discountCityDD.php', {"partnerProv" : partnerProv})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchDiscountProvOk = true;
                $scope.discountCityDD = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        // get discount city and display list
        $scope.searchDiscountCity = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerCity = this.selectDiscountCity.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "DiscountPartnerCity", "partnerCity" : partnerCity})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchDiscountOk = true;
                $scope.discountPartnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        //build voucher
        $scope.discountVoucher = function(partnerId) {
            console.log(partnerId);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "DiscountPartnerVoucher", "partnerId" : partnerId, "cardNum" : $scope.userMpacc})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_id = partnerId;
                $scope.partner_name = data[0]['partner_name'];
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.partner_voucher = data[0]['partner_voucher'];
                $scope.partner_terms = data[0]['partner_terms'];
                $scope.partner_tel = data[0]['partner_tel'];
                $scope.partner_address = data[0]['partner_address'];
                $scope.voucher_date = today;
                $scope.conImages = 'http://www.mahala.mobi/components/com_jumi/files/mahala_WSDL/partnerDisLogo.png';
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
            
            
            myNavigator.pushPage('views/user/voucher_discount.html', { animation : 'fade', partnerId : partnerId });
        };
        
        // log out function
        $scope.logout = function(){
            $scope.data = [];
            $scope.loggedIn = false;
            myNavigator.pushPage('views/home.html', { animation : 'fade' });
        };
        
        //contact us form function
        $scope.contactMe = function() {
            var contactMembership = $scope.data.contactMembership;
            var contactCare = $scope.data.contactCare;
            var contactProtect = $scope.data.contactProtect;
            var contactName = $scope.data.contactName;
            var contactSurname = $scope.data.contactSurname;
            var contactCell = $scope.data.contactCell;
            var contactEmail = $scope.data.contactEmail;
            var contactUpdate = $scope.data.contactUpdate;
            var contactId = $scope.data.contactId;
            
            if (contactName && contactSurname && contactCell && contactEmail) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', { "reqType" : "contactUs", "membership" : contactMembership, "Care" : contactCare, "Protect" : contactProtect, "cUpdate" : contactUpdate, "cName" : contactName, "cSurname" : contactSurname, "cID" : contactId, "cCell" : contactCell, "cEmail" : contactEmail })
                .success(function(data, status){
                    if (data['error'] == 0) {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        myNavigator.pushPage('views/home.html', { animation : 'fade'});
                    } else {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'Please fill in all the fields.';
                modal.show();
            }
        };
        
        $scope.getDiscountCatList = function() {
            $scope.catList = [];
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "listDiscountCat", "partnerCat" : "catList"})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catList = data;
                if (data) {
                    myNavigator.pushPage('views/partners/discount.html', { animation : 'fade'});
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                }         
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        $scope.getDiscountList = function(catName) {
            var partnerCat = catName;
            $scope.catPartnerList = [];
            console.log(catName);
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "listDiscountCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catPartnerList = data;
                
                if (data) {
                    if (partnerCat === 'catList') {
                        myNavigator.pushPage('views/partners/discount.html', { animation : 'fade'});
                    } else {
                        myNavigator.pushPage('views/partners/list.html', { animation : 'fade'});
                    }
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                }         
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        $scope.getPointCatList = function() {
            $scope.catList = [];
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "listPointCat", "partnerCat" : "catList"})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catList = data;
                
                if (data) {
                    myNavigator.pushPage('views/partners/points.html', { animation : 'fade'});
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                } 
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        $scope.getPointList = function(catName) {
            var partnerCat = catName;
            $scope.catPartnerList = [];
            console.log(catName);
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "listPointCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catPartnerList = data;
                
                if (data) {
                    if (partnerCat === 'catList') {
                        myNavigator.pushPage('views/partners/points.html', { animation : 'fade'});
                    } else {
                        myNavigator.pushPage('views/partners/list.html', { animation : 'fade'});
                    }
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                } 
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        //Coupons List Builder
        $http.get(apiPath+'/coupon-list.php')
        .success(function (result, status) {
            $scope.couponList = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        //Get coupon code
        $scope.getCouponCode = function() {
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/coupon-code.php', {"userRef" : $scope.userMpacc})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.couponCode = data['html'];
                myNavigator.pushPage('views/user/coupon_code.html', { animation : 'fade'});
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        //setup map search for points partenrs close by
        $scope.pointsCloseBy = function() {
            myNavigator.pushPage('views/user/points_close_by.html', {animation : 'lift'} );
        };
        
        //setup map search for discount partenrs close by
        $scope.discountCloseBy = function() {
            myNavigator.pushPage('views/user/discount_close_by.html', {animation : 'lift'} );
        };
        
        //build map voucher
        $scope.MapPartnerVoucher = function(partnerId,partnerType) {
            console.log(partnerId);
            console.log(partnerType);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "MapPartnerVoucher", "partnerId" : partnerId, "cardNum" : $scope.userMpacc, "partnerType": partnerType})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_id = partnerId;
                $scope.partner_name = data[0]['partner_name'];
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.partner_voucher = data[0]['partner_voucher'];
                $scope.partner_terms = data[0]['partner_terms'];
                $scope.partner_tel = data[0]['partner_tel'];
                $scope.partner_address = data[0]['partner_address'];
                $scope.voucher_date = today;
                
                if (partnerType === 'Points') {
                    $scope.conImages = 'http://www.mahala.mobi/components/com_jumi/files/mahala_WSDL/partnerLogo.png';
                } else {
                    $scope.conImages = 'http://www.mahala.mobi/components/com_jumi/files/mahala_WSDL/partnerDisLogo.png';
                }
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
            
            if (partnerType === 'Points') {
                myNavigator.pushPage('views/user/voucher_points.html', { animation : 'fade', partnerId : partnerId });
            } else {
                myNavigator.pushPage('views/user/voucher_discount.html', { animation : 'fade', partnerId : partnerId });
            }
        };
        
        $scope.showCoupon = function(couponId) {
            console.log(couponId);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/show_coupon.php', {"couponId" : couponId})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                $scope.couponimageUrl = data[0]['imageUrl'];
                $scope.couponname = data[0]['name'];
                $scope.coupondescription = data[0]['description'];
                $scope.coupondiscount = data[0]['discount'];
                $scope.coupontc = data[0]['tandc'];
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
            
            
            myNavigator.pushPage('views/user/coupon_view.html', { animation : 'fade' });
            
        };
        
        // nomination form submistion
        $scope.nominate = function () {
            var nom_MPAcc = $scope.data.nom_MPAcc;
            var nom_Details = '';
            var nom_Name = $scope.data.nom_Name;
            var nom_Cat = $scope.data.nom_Cat;
            var nom_Address = '';
            var nom_Str = $scope.data.nom_Str;
            var nom_Sub = $scope.data.nom_Sub;
            var nom_Prov = $scope.data.nom_Prov;
            var nom_MallName = $scope.data.nom_MallName;
            var nom_ContactPerson = $scope.data.nom_ContactPerson;
            var nom_Tel = $scope.data.nom_Tel;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "nominate", "MPAcc" : nom_MPAcc, "Details" : nom_Details, "Name" : nom_Name, "Cat" : nom_Cat, "Address" : nom_Address, "Street" : nom_Str, "Suburb" : nom_Sub, "Province" : nom_Prov, "Mall" : nom_MallName, "ContactPerson" : nom_ContactPerson, "Tel" : nom_Tel})
            
            .success(function(data, status){
                if (data['error'] == 0) {
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                    myNavigator.pushPage('views/home.html', { animation : 'fade'});
                } else {
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                }
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        // become a retailer form submistion
        $scope.becomeRetailer = function () {
            var bec_Name = $scope.data.bec_Name;
            var bec_Cat = $scope.data.bec_Cat;
            var bec_Str = $scope.data.bec_Str;
            var bec_Sub = $scope.data.bec_Sub;
            var bec_Prov = $scope.data.bec_Prov;
            var bec_inmall = $scope.data.bec_inmall;
            var bec_MallName = $scope.data.bec_MallName;
            var bec_NumBranch = $scope.data.bec_NumBranch;
            var bec_ContactPerson = $scope.data.bec_ContactPerson;
            var bec_Tel = $scope.data.bec_Tel;
            var bec_Email = $scope.data.bec_Email;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post(apiPath+'/app-results.php', {"reqType" : "becomeRetailer", "Name" : bec_Name, "Cat" : bec_Cat, "Str" : bec_Str, "Sub" : bec_Sub, "Prov" : bec_Prov, "inmall" : bec_inmall, "MallName" : bec_MallName, "NumBranch" : bec_NumBranch, "ContactPerson" : bec_ContactPerson, "Tel" : bec_Tel, "Email" : bec_Email})
            
            .success(function(data, status){
                if (data['error'] == 0) {
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                    myNavigator.pushPage('views/home.html', { animation : 'fade'});
                } else {
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                }
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        //cliam Points
        $scope.claimPoints = function(file) {
            
            var transVal = $scope.data.pointsTransVal;
            var transInv = $scope.data.pointsTransInv;
            var partName = $scope.partner_name;
            var partId = $scope.partner_id;
            var mpacc = $scope.userMpacc;
            var cardNum = $scope.CardNumber;
            var cashier = $scope.data.cashierCode;
            
            if (transVal && transInv && cashier) {                
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';

                if ((typeof file === 'undefined' || file === null) && $scope.data.pointsTransVal < 501) {
                    
                    $http.post(apiPath+'/uploadPoints.php', {'reqType': "claimPoints", 'transVal': transVal, 'transInv': transInv, 'partName': partName, 'partId': partId, 'mpacc': mpacc, 'cardNum': cardNum, 'cashierCode' : cashier})
                    .success(function(data, status){
                        modal.hide();
                        $scope.data.errorCode = "Thank you!";
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            $scope.data = [];
                            myNavigator.pushPage('views/user/feedback_form.html', { animation : 'fade'});
                        },'2000');
                    })
                    .error(function(data, status) {
                        modal.hide();
                        $scope.data.errorCode = 'Request failed';
                        modal.show();
                    });
                } else {

                    file.upload = Upload.upload({
                        url: apiPath+'/uploadPoints.php',
                        method: 'POST',
                        file: file,
                        data: {
                            'reqType': "claimPoints", 
                            'transVal': transVal, 
                            'transInv': transInv,
                            'partName': partName,
                            'partId': partId,
                            'mpacc': mpacc,
                            'cardNum': cardNum,
                            'cashierCode' : cashier
                        }
                    });

                    // returns a promise
                    file.upload.then(function(resp) {
                        // file is uploaded successfully
                        console.log('file ' + resp.config.data.file.name + ' is uploaded successfully. Response: ' + resp.data);
                        modal.hide();
                        $scope.data.errorCode = "Thank you!";
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            $scope.data = [];
                            myNavigator.pushPage('views/user/feedback_form.html', { animation : 'fade'});
                        },'2000');
                    }, function(resp) {
                        if (resp.status > 0) {
                            modal.hide();
                            $scope.data.result = resp.status + ': ' + resp.data;
                            $scope.data.errorCode = resp.status + ': ' + resp.data;
                            modal.show();
                        }            
                    }, function(evt) {
                        // progress notify
                        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.data.file.name);
                        $scope.data.errorCode = 'progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '%';
                    });
                }
            } else {
                ons.notification.alert({
                    message: 'Please fill in all the fields.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        };
        
        //cliam Discount
        $scope.claimDiscount = function(file) {
            if ((typeof file === 'undefined' || file === null) && $scope.data.pointsTransVal < 501) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/uploadDiscount.php', {"reqType" : "claimDiscount", 'transVal': $scope.data.pointsTransVal, 'transInv': $scope.data.pointsTransInv, 'partName': $scope.partner_name, 'partId': $scope.partner_id, 'mpacc': $scope.userMpacc, 'cardNum': $scope.CardNumber})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.errorCode = "Thank you!";
                    modal.show();
                    $timeout(function(){
                        modal.hide();
                        $scope.data = [];
                        myNavigator.pushPage('views/user/feedback_form.html', { animation : 'fade'});
                    },'2000');
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
            
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';

                file.upload = Upload.upload({
                    url: apiPath+'/uploadDiscount.php',
                    method: 'POST',
                    file: file,
                    data: {
                        'reqType': "claimDiscount", 
                        'transVal': $scope.data.pointsTransVal, 
                        'transInv': $scope.data.pointsTransInv,
                        'partName': $scope.partner_name,
                        'partId': $scope.partner_id,
                        'mpacc': $scope.userMpacc,
                        'cardNum': $scope.CardNumber
                    }
                });

                // returns a promise
                file.upload.then(function(resp) {
                    // file is uploaded successfully
                    console.log('file ' + resp.config.data.file.name + ' is uploaded successfully. Response: ' + resp.data);
                    modal.hide();
                    $scope.data.errorCode = "Thank you!";
                    modal.show();
                    $timeout(function(){
                        modal.hide();
                        $scope.data = [];
                        myNavigator.pushPage('views/user/feedback_form.html', { animation : 'fade'});
                    },'2000');
                }, function(resp) {
                    if (resp.status > 0) {
                        modal.hide();
                        $scope.data.result = resp.status + ': ' + resp.data;
                        $scope.data.errorCode = resp.status + ': ' + resp.data;
                        modal.show();
                    }            
                }, function(evt) {
                    // progress notify
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.data.file.name);
                    $scope.data.errorCode = 'progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '%';
                });
            }
        };
        
        // set partner feedback
        $scope.sendFeedback = function () {
            var question1 = $scope.data.question1;
            var question2 = $scope.data.question2;
            var question3 = $scope.data.question3;
            var partId = $scope.partner_id;
            
            if (question1 && question2 && question3) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/app-results.php', {"reqType" : "feedback", "question1" : question1, "question2" : question2, "question3" : question3, "partId" : partId, "mpacc" : $scope.userMpacc})
                .success(function(data, status){
                    if (data['error'] == 0) {
                        modal.hide();
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/user/welcome.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        ons.notification.alert({
                            message: 'Something went worng, please try again.',
                            title: 'Oops!',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                ons.notification.alert({
                    message: 'Please make all the selections.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
            
        };
        
        // promotion submit
        $scope.promoMe = function () {
            var promoMPacc = $scope.data.promoMPacc;
            var friendEmail1 = $scope.data.friendEmail1;
            var friendEmail2 = $scope.data.friendEmail2;
            var friendEmail3 = $scope.data.friendEmail3;
            
            if (promoMPacc && friendEmail1) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post(apiPath+'/promotions.php', {"reqType" : "promo", "promoMPacc" : promoMPacc, "friendEmail1" : friendEmail1, "friendEmail2" : friendEmail2, "friendEmail3" : friendEmail3})
                .success(function(data, status){
                    if (data['error'] == 0) {
                        console.log("Data:", data);
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/home.html', { animation : 'fade' });
                        },'2000');
                        
                    } else if (data['error'] === 2) {    
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/register.html', { animation : 'fade' });
                        },'2000');
                    } else {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        console.log(data['html']);
                        modal.show();
                        $timeout(function(){
                            modal.hide();
                            myNavigator.pushPage('views/promotions.html', { animation : 'fade' });
                        },'1000');
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
                
            } else {
                ons.notification.alert({
                    message: 'Please fill in all the fields.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        };
    });
    
    // Map Controler
    
    module.controller('mapController', function($scope, $http, StreetView) {
        $scope.map;
        $scope.stores = [];
        $scope.partnerType;
        $scope.mapRadius;
        $scope.partnerList = [];
        
        $scope.init = function(type,radius) {
            $scope.partnerType = type;
            $scope.mapRadius = radius;
        };
        
        var map;
        $scope.$on('mapInitialized', function(event, evtMap) {
            map = evtMap;
            $scope.map = map;
            $scope.myLat = $scope.map.center.A;
            $scope.myLng = $scope.map.center.F;
            
            $http.post(apiPath+'/mapMarkers.php', {"lat" : $scope.myLat, "lng" : $scope.myLng, "radius" : $scope.mapRadius, "type" : $scope.partnerType, cat : "%"}).success( function(stores) {
                var markers = [];
                console.log(stores);
                $scope.partnerList = stores;
                for (var i=0; i<stores.length; i++) {
                    var store = stores[i];
                    store.position = new google.maps.LatLng(store.partner_lat,store.partner_lng);
                    store.title = store.partner_name;
                    store.animation = google.maps.Animation.DROP;
                    markers[i] = new google.maps.Marker(store);
                    google.maps.event.addListener(markers[i], 'click', function() {
                        $scope.store = this;
                        //map.setZoom(18);
                        map.setCenter(this.getPosition());
                        $scope.storeInfo.show();
                    });
                    google.maps.event.addListener(map, 'click', function() {
                        $scope.storeInfo.hide();
                    });
                    $scope.stores.push(markers[i]); 
                    markers[i].setPosition(store.position);
                    markers[i].setMap($scope.map);
                }
            });
        });
        $scope.showStreetView = function() {
            StreetView.setPanorama(map, $scope.panoId);
            $scope.storeInfo.hide();
        };
        $scope.showHybridView = function() {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            map.setTilt(45);
            $scope.storeInfo.hide();
        }
    });
    module.directive('storeInfo', function() {
        var StoreInfo = function(s, e, a) {
            this.scope = s;
            this.element = e;
            this.attrs = a;
            this.show = function() {
                this.element.css('display', 'block');
                this.scope.$apply();
            }
            this.hide = function() {
                this.element.css('display', 'none');
            }
        };
        return {
            templateUrl: 'store-info.html',
            link: function(scope, e, a) {
                scope.storeInfo= new StoreInfo(scope, e, a);
            }
        }
    });
})();

// normal JS
// direction = boolean value: true or false. If true, go to NEXT slide; otherwise go to PREV slide

function toggleSlide(direction, className) {
    var elements = document.getElementsByClassName(className); // gets all the "slides" in our slideshow
    // Find the LI that's currently displayed
    //console.log('Elements', elements);
    var visibleID = getVisible(elements);
    elements[visibleID].style.display = "none"; // hide the currently visible LI
    if(!direction) {
        var makeVisible = prev(visibleID, elements.length); // get the previous slide
    } else {
        var makeVisible = next(visibleID, elements.length); // get the next slide
    }
    elements[makeVisible].style.display = "block"; // show the previous or next slide
}
function getVisible(elements) {
    var visibleID = -1;
    for(var i = 0; i < elements.length; i++) {
        if(elements[i].style.display == "block") {
            visibleID = i;
        }
    }
    return visibleID;
}
function prev(num, arrayLength) {
    if(num == 0) return arrayLength-1;
    else return num-1;
}
function next(num, arrayLength) {
    if(num == arrayLength-1) return 0;
    else return num+1;
}

var interval = 5000; // You can change this value to your desired speed. The value is in milliseconds, so if you want to advance a slide every 5 seconds, set this to 5000.
var switching = setInterval("toggleSlide(true,'hideable')", interval);
var switching = setInterval("toggleSlide(true,'hideableL')", interval);
var switching = setInterval("toggleSlide(true,'hideableW')", interval);

// Barcode scanner
function scanBarcodeRegShop(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          document.getElementById('cashierCode').value = result.text;
          console.log("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}

// Barcode scanner
function scanBarcodeRegFriend(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          document.getElementById('friendMpacc').value = result.text;
          console.log("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}

function showDivAttid(con,divid){
    if(con === 'show') {
        document.getElementById(divid).style.display = 'block';
    } else {
        document.getElementById(divid).style.display = 'none';
    }
}