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

		//console.log($scope.nobelData);
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


			// nobelService.getNobelDataForSunburst ***********************************
			// Input: (year, showAllCountries) 
			// year: Int. Up until that year you want to show. Use 0 or '*' to show all years
			// showAllCountries: bool/Empty. Send in true if you want to show all countries, if you only want to show winners, leave blank or false
			// EX: nobelService.getNobelDataForSunburst(1930, true); <---- Shows all countries, and winners up to 1930
			// EX: nobelService.getNobelDataForSunburst(0); <---- Shows only countries with winners for all years
		// 	$scope.nobelData = nobelService.getNobelDataForSunburst(0); 
		// 	$scope.$apply();	// $scope.$apply tells angular that we have loaded in the data so it updates the view

		// 	//console.log("scope", $scope.nobelData);
		// })		

      
		});
		
    // nobelService.getNobelDataForSunburst ***********************************
		// Input: (year, showAllCountries, callback) 
		// year: Int. Up until that year you want to show. Use 0 or '*' to show all years
		// showAllCountries: bool/Empty. Send in true if you want to show all countries, if you only want to show winners, leave blank or false
		// callback: The function that will run when the data has arrived
		// EX: nobelService.getNobelDataForSunburst(1930, true); <---- Shows all countries, and winners up to 1930
		// EX: nobelService.getNobelDataForSunburst(0); <---- Shows only countries with winners for all years
		// EX: nobelService.getNobelDataForSunburst(0, undefined, function(data){ <---- Returns only countries with winners for all years and prints the result
		//		console.log(data);		
		// }); 
		nobelService.getNobelDataForSunburst(0, undefined, function(data){
			//$scope.nobelData = data;
			//$scope.$apply();	// $scope.$apply tells angular that we have loaded in the data so it updates the view
			console.log($scope.nobelData);
		});
	}

	// To make our onStart function run on start
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
			$scope.wbData = '';
		}
	}
	
	// This function requests data from the worldBankService, as a controller to the view
	$scope.getDataForGlobe = function(dataType, year, callback){
		// worldBankService.getDataForGlobe
		// Input: (dataType, year, callback)
		// dataType: The type of data requested, look in worldBankService to know what data is avaliable
		// year: what year to look for data
		// callback: The function that runs when the data has returned
		worldBankService.getDataForGlobe(dataType, year, function(data){
			callback(data);
		});
	}

	// JUST A TEST FUNCTION, JUST REMOVE IF YOU WANT
	$scope.getDataForGlobe('mean-years-in-school', 2009, function(data){
  		console.log(data);
  	});
});