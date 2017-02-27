nobelApp.controller('nobelCtrl', 
	function(worldBankService, nobelService, $scope, $http, $rootScope, $timeout) {
 	// Controller that controls the view
 	// Put $scope. in front of a variable name in order for the view to be able to use this variable
	
	//////////////////////// NOBEL DATA ////////////////////////////////

	$scope.searchCountryName = "Sweden";
	$scope.searchYear = 2016;
	
	// Testing, called from button onClick
	$scope.getNobelPrizeData = function (){
		//$scope.data = nobelService.getData();
		//$scope.nobelData = $scope.data.$$state;		
		$scope.nobelData = nobelService.getNobelDataForCountry($scope.searchCountryName, $scope.searchYear);

		console.log($scope.nobelData);
	}




	//////////////////// ON LOAD ////////////////////
	// This is a local on load function. All the variables created here will not be accessable from outside
	//(function () {
		// Here we can do stuff on load if we need to
	//})();
	
	// This is our start function, here we can load up all initial values and tell the dataManager to start loading data
	$scope.onStart = function(){
		// Start loading the data
		nobelService.loadData();
	}

  
  $scope.onStart();
});