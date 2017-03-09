nobelApp.controller('nobelCtrl', 
	function(worldBankService, nobelService, $scope, $http, $rootScope, $timeout) {
 	// Controller that controls the view
 	// Put $scope. in front of a variable name in order for the view to be able to use this variable
	
 	///////////////////////// PAGES ////////////////////////////////
	$scope.hideSunburst = false;
	$scope.hideChord = true;
	$scope.hideProject = true;


	//hide/show of different views (sunburst/chord/project)
	$scope.pageButton = function(id) {
		if (id === "globeSunburstPage") {
			$scope.hideSunburst = false;
			$scope.hideChord = true;
			$scope.hideProject = true;
		} else if (id === "chord") {
			$scope.hideSunburst = true;
			$scope.hideChord = false;
			$scope.hideProject = true;
		} else if (id === "project") {
			$scope.hideSunburst = true;
			$scope.hideChord = true;
			$scope.hideProject = false;
		}
	}
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
	
	// This is our start function, here we can load up all initial values and tell the nobelService to start loading data
	$scope.onStart = function(){
		// Gets the data
		// Inside this function you can reach our data
		nobelService.getData("prizes", function(data){

			$scope.nobelData = nobelService.getNobelDataForSunburst(1930);
			$scope.$apply();	// $scope.$apply tells angular that we have loaded in the data so it updates the view

			console.log($scope.nobelData);
		})		
	}
  
	$scope.onStart();

	//////////////////////////// WORLD BANK DATA /////////////////////////////

	// Shows which datasets you can choose from, specified in worldBankService
	$scope.worldBankData = worldBankService.dataSets;

	// This function is called when a wb (World bank) dataset is chosen from the dropdown list
	$scope.onWbDataChange = function(wbDataChoice) {
		console.log("You chose this data",wbDataChoice);
		// only get the data if the wbDataChoice is valid
		if (wbDataChoice !== undefined) {
			// This function gets the data from worldbankService
			// It uses a callback, (the 'function(d)' part), instead of waiting for the returning result
			// the callback waits until the getData function is calling for it
			worldBankService.getData(wbDataChoice.filename, function(d){
				console.log("Here's your data", d);
				$scope.wbData = d;
			});
				
		} else {
			$scope.wbData = ''
		}
	}

});