nobelApp.controller('nobelCtrl', 
	function($scope,worldBankService, nobelService, wikipediaService, yearService, prizeService, informationService, $http, $rootScope, $timeout) {
 	// Controller that controls the view
 	// Put $scope. in front of a variable name in order for the view to be able to use this variable
	
 	///////////////////////// PAGES ////////////////////////////////
	$scope.hideSunburst = false;
	$scope.hideChord = true;
	$scope.hideProject = true;
	$scope.isLoading = true;
	$scope.hidePageInfo = true;
	$scope.pageInformation;

	$timeout(function() {
		$scope.isLoading = false;
	}, 2000);


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

	$scope.pageInformationText = function(page){
		console.log("pageInformation", page);
		if ($scope.hidePageInfo) {
			$scope.hidePageInfo = false;
			$scope.pageInformation = informationService.getPageInformation(page);
			console.log("pageInformation", $scope.pageInformation);
		} else if (!$scope.hidePageInfo) {
			console.log("hide");
			$scope.hidePageInfo = true;
			$scope.pageInformation = "";
		}
	}
	////////////////////////////// PRIZE CATEGORIES ///////////////////////
	$scope.catChoiceChemistry = true;
	$scope.catChoiceEconomics = true;
	$scope.catChoiceLiterature = true;
	$scope.catChoiceMedicine = true;
	$scope.catChoicePeace = true;
	$scope.catChoicePhysics = true;
	$scope.catList = [$scope.catChoiceChemistry, $scope.catChoiceEconomics, $scope.catChoiceLiterature, $scope.catChoiceMedicine, $scope.catChoicePeace, $scope.catChoicePhysics];
	$scope.sliderYear = yearService.year;

	$scope.catChoices = {
			"chemistry": $scope.catChoiceChemistry, "economics": $scope.catChoiceEconomics, "literature": $scope.catChoiceLiterature, "medicine": $scope.catChoiceMedicine, "peace": $scope.catChoicePeace, "physics": $scope.catChoicePhysics
		};
	$scope.catChoices.dict = {
		"chemistry": 0, "economics": 1, "literature": 2, "medicine": 3, "peace": 4, "physics": 5
	};
	$scope.catChoices.array = ["chemistry","economics","literature","medicine","peace","physics"];
	$scope.catChoices.emptyArray = [ [], [], [], [], [], [] ];

	$scope.catChoice = function(choice) {
		console.log("Your choice",choice);
		// If there's only one choice left and it's the one you clicked, refill all the category choices to true
		if ($scope.catChoices.array.length === 1 && $scope.catChoices.array[0] === choice) {

			$scope.catChoices.array = ["chemistry","economics","literature","medicine","peace","physics"];
			$scope.catChoices.emptyArray = [ [], [], [], [], [], [] ];
			$scope.catChoices.dict = {
				"chemistry": 0, "economics": 1, "literature": 2, "medicine": 3, "peace": 4, "physics": 5
			};
			$scope.catChoiceChemistry = true;
			$scope.catChoiceEconomics = true;
			$scope.catChoiceLiterature = true;
			$scope.catChoiceMedicine = true;
			$scope.catChoicePeace = true;
			$scope.catChoicePhysics = true;

		} else {

			$scope.catChoices = {
				"chemistry": $scope.catChoiceChemistry, "economics": $scope.catChoiceEconomics, "literature": $scope.catChoiceLiterature, "medicine": $scope.catChoiceMedicine, "peace": $scope.catChoicePeace, "physics": $scope.catChoicePhysics
			};
			$scope.catChoices.array = [];
			$scope.catChoices.dict = {};
			$scope.catChoices.emptyArray = [];

			// If the choice is checked (true), we are going to show
			if ($scope.catChoiceChemistry === true) {
				$scope.catChoices.array.push("chemistry");
				$scope.catChoices.emptyArray.push([]);
			}
			if ($scope.catChoiceEconomics === true) {
				$scope.catChoices.array.push("economics");
				$scope.catChoices.emptyArray.push([]);
			}
			if ($scope.catChoiceLiterature === true) {
				$scope.catChoices.array.push("literature");
				$scope.catChoices.emptyArray.push([]);
			}
			if ($scope.catChoiceMedicine === true) {
				$scope.catChoices.array.push("medicine");
				$scope.catChoices.emptyArray.push([]);
			}
			if ($scope.catChoicePeace === true) {
				$scope.catChoices.array.push("peace");
				$scope.catChoices.emptyArray.push([]);
			}
			if ($scope.catChoicePhysics === true) {
				$scope.catChoices.array.push("physics");
				$scope.catChoices.emptyArray.push([]);
			}
			// Create a category dictionary containing each category and their id
			// Will be used by service
			for (var i=0; i<$scope.catChoices.array.length; i++) {
				var cat = $scope.catChoices.array[i];
				$scope.catChoices.dict[cat] = i;
			}
		}


		$scope.$broadcast('reloadSunburst', {
			year: $scope.sliderYear.label // send whatever you want
		});
	};

	////////////////////// TOTAL PRIZES ////////////////////////////
	$scope.totalPrizes = prizeService.prizes;
	$scope.totalPrizesCountry = prizeService.country;

	$scope.$on('clickedCountrySunburst', function (event, data) {
		$scope.updatePrizes(data);
	});
	$scope.updatePrizes = function(data) {
		if (data != undefined) {
			prizeService.updatePrizes(data.prizes);
			prizeService.updateCountry(data.country);
		}
		
		$scope.$apply();
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
		
		//wikipediaService.wikiSearch();
		//worldBankService.genData();
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
		//nobelService.getNobelDataForSunburst(0, false, "hej", function(data){
			//$scope.nobelData = data;
			//$scope.$apply();	// $scope.$apply tells angular that we have loaded in the data so it updates the view
		//	console.log($scope.nobelData);
		//});
	}

	// To make our onStart function run on start
	
	
	//////////////////////////// WORLD BANK DATA /////////////////////////////

	// Shows which datasets you can choose from, specified in worldBankService
	$scope.worldBankData = worldBankService.dataSets;
	$scope.chosenWBD = '';	
	$scope.chosenWBDDescription = '';
	$scope.hasChosenData = false;


	// This function is called when a wb (World bank) dataset is chosen from the dropdown list
	$scope.onWbDataChange = function(wbDataChoice) {
		//console.log("You chose this data",wbDataChoice);
		// only get the data if the wbDataChoice is valid
		if (wbDataChoice !== undefined) {
			$scope.hasChosenData = true;
			$scope.chosenWBD = wbDataChoice.filename;			
			$scope.chosenWBDDescription = wbDataChoice.description;
			// This function gets the data from worldbankService
			// It uses a callback, (the 'function(d)' part), instead of waiting for the returning result
			// the callback waits until the getData function is calling for it

			$scope.$broadcast('updateCountryColors', {
				year: yearService.year.label,
				dataset: $scope.chosenWBD
			});

		} else {
			$scope.hasChosenData = false;
			$scope.wbData = '';
			$scope.chosenWBD = '';
			$scope.$broadcast('reverseGlobeColours');
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
  		//console.log(data);
  	});


  	////////////////// OTHER ////////////////////////////
  	$scope.safeApply = function(fn) {
	  var phase = this.$root.$$phase;
	  if(phase == '$apply' || phase == '$digest') {
	    if(fn && (typeof(fn) === 'function')) {
	      fn();
	    }
	  } else {
	    this.$apply(fn);
	  }
	};


	$scope.onStart();


	//////////////////////// SUNBURST LEGEND ////////////////////////////////////////
	//Create the SVG
	var leg = d3.select("#sunburst-legend").append("svg")
			.attr("width", 80)
			.attr("height", 60);
				
	//Create an SVG path			
	leg.append("path")
		.attr("id", "legend-text1") //very important to give the path element a unique ID to reference later
		.attr("d", "M 16,51 A 10,10 0 0,1 45, 51") //Notation for an SVG path, from bl.ocks.org/mbostock/2565344
		.style("fill", "none")
		.style("stroke", "none");

	//Create an SVG text element and append a textPath element
	leg.append("text")
	   .append("textPath") //append a textPath to the text element
		.attr("xlink:href", "#legend-text1") //place the ID of the path here
		.style("text-anchor","middle") //place the text halfway on the arc
		.attr("startOffset", "50%")		
		.text("Continent");

	//Create an SVG path			
	leg.append("path")
		.attr("id", "legend-text2") //very important to give the path element a unique ID to reference later
		.attr("d", "M 4,44 A 28,28 0 0,1 57, 44") //Notation for an SVG path, from bl.ocks.org/mbostock/2565344
		.style("fill", "none")
		.style("stroke", "none");

	//Create an SVG text element and append a textPath element
	leg.append("text")
	   .append("textPath") //append a textPath to the text element
		.attr("xlink:href", "#legend-text2") //place the ID of the path here
		.style("text-anchor","middle") //place the text halfway on the arc
		.attr("startOffset", "50%")		
		.text("Country");

	//Create an SVG path			
	leg.append("path")
		.attr("id", "legend-text3") //very important to give the path element a unique ID to reference later
		.attr("d", "M 0,27 A 40,40 0 0,1 60, 27") //Notation for an SVG path, from bl.ocks.org/mbostock/2565344
		.style("fill", "none")
		.style("stroke", "none");

	//Create an SVG text element and append a textPath element
	leg.append("text")
	   .append("textPath") //append a textPath to the text element
		.attr("xlink:href", "#legend-text3") //place the ID of the path here
		.style("text-anchor","middle") //place the text halfway on the arc
		.attr("startOffset", "50%")		
		.text("Laureate");

});