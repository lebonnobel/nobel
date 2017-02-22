nobelApp.controller('nobelCtrl', function($scope, $http, $rootScope, $timeout) {
 
	// This is our dataManager. It loads and formats all the data for us to use
	$scope.dataManager = DataManager();	
	$scope.searchCountryName = "Sweden";
	$scope.searchYear = 2016;

	
	
	// Testing, called from button onClick
	$scope.getNobelPrizeData = function (){
		//$scope.data = nobelService.getData();
		//$scope.nobelData = $scope.data.$$state;		
		$scope.nobelData = $scope.dataManager.getNobelDataForCountry($scope.searchCountryName, $scope.searchYear);

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
		$scope.dataManager.loadData();
	}

  
  $scope.onStart();
});