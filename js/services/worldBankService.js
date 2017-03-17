nobelApp.factory('worldBankService', ['$window', '$http', '$q', function ($window, $http, $q) {
	// This service takes care of the data from the World Bank 

	this.wbDataUrl = "data/worldbank/";
	this.dataSets = [ 
		{
			'title' : 'Education spending',
			'description' : '',
			'filename' : 'edu-spending'
		}, 
		{
			'title' : 'Literacy',
			'description' : '',
			'filename' : 'literacy'
		}, 
		{
			'title' : 'Youth in school',
			'description' : '',
			'filename' : 'youth-in-school'
		},
		{
			'title': 'Mean years in school',
			'description' : 'Mean years in school: Men and Women 25+',
			'filename' : 'mean-years-in-school'
		}
	];

	// Load JSON files
	// uses a callback instead of returning a value
	// When we have our json, we call the callback function and add the json as parameter
	// the json will then be available in the controller that called the getData function in the first place
    this.getData = function(filename, callback){
        $.getJSON(this.wbDataUrl + filename + ".json", function(json){
        	// send the json back
            callback(json);
        });
        
    }

	// Here we load and format the data for the globe
	// The function can take different data types to format, and will try to look for the latest valid value if some values are missing
	this.getDataForGlobe = function(dataType, year, callback){
		if(dataType == "mean-years-in-school"){
			// We request the data
			this.getData('mean-years-in-school', function(data){
				var retArray = [];
				// For every country with the data
				for (var i = 0; i < data.length; i++) {
					var countryObj = {};
					countryObj["name"] = data[i].name;
					countryObj["value"] = (data[i][year] != undefined) ? data[i][year] : undefined;
					// We remove the files with invalid values
					if(countryObj["value"] != undefined)
						retArray.push(countryObj);
				}
				// Then we return the array
				callback(retArray);
			});
		} else if(dataType == "literacy") {
			this.getData('literacy', function(data){
				var retArray = [];
				// For every country with the data
				for (var i = 0; i < Object.keys(data).length; i++) {
					var countryObj = {};
					countryObj["name"] = Object.keys(data)[i];
					countryObj["value"] = (data[Object.keys(data)[i]][year] != undefined) ? data[Object.keys(data)[i]][year] : undefined;
					// We remove the files with invalid values
					if(countryObj["value"] != undefined)
						retArray.push(countryObj);
				}
				// Then we return the array
				callback(retArray);
			});
		}
	}

	// Only used to generate static data. This function is slow and should NEVER be run at runtime
	// It takes and combines different data sources into one usable dictionary
	this.genData = function() {
		var self = this;
		this.getData('literacyUNESCO', function(unescoData){
			self.getData('literacyWORLDBANK', function(worldbankData){
				self.getData('literacyGAPMINDER', function(gapminderData){
					var dataArray = [unescoData, worldbankData, gapminderData];
					var nullDataArray = ["..", 0, 0];
					var correctData = {};
					// For each dataArray that needs to be merged
					for (var d = 0; d < dataArray.length; d++) {
						var data = dataArray[d];
						var dataCountriesArray = Object.keys(data);
						// We find each country in these arrays
						for (var c = 0; c < dataCountriesArray.length; c++){
							var countryName = dataCountriesArray[c];
							// Does the country exist in our data?
							if (correctData[dataCountriesArray[c]] == undefined){
								correctData[dataCountriesArray[c]] = {};
							}
							// For each year
							for (var y = 0; y < Object.keys(data[dataCountriesArray[c]]).length; y++) {
								var yearStr = Object.keys(data[dataCountriesArray[c]])[y];
								if (correctData[dataCountriesArray[c]][yearStr] == undefined){
									correctData[dataCountriesArray[c]][yearStr] = "nodata";
								}
								// We must check if we have a null value before we insert
								if(correctData[countryName][yearStr] == "nodata" || correctData[countryName][yearStr] == undefined){
									correctData[countryName][yearStr] = (data[countryName][yearStr] != nullDataArray[d]) ? 
									data[countryName][yearStr] : "nodata";
								}
							}
						}
					}

					// Then we calculate missing values by 1) linearly interpolate between missing data, 2) if the country does not have any future data, then take the most previous value
					
					for (var c = 0; c < Object.keys(correctData).length; c++){
						var countryName = Object.keys(correctData)[c];
						// For each year
						var firstValueFound = false;
						var lastValue = 0;
						for (var y = 0; y < Object.keys(correctData[countryName]).length; y++) {
							var yearStr = Object.keys(correctData[countryName])[y];
							// We remove all missing values before the first
							if (correctData[countryName][yearStr] == "nodata" && !firstValueFound){
								delete correctData[countryName][yearStr];
								y--;
							} else if(correctData[countryName][yearStr] == "nodata" && lastValue != 0) {
								correctData[countryName][yearStr] = lastValue;
							} else {
								firstValueFound = true;
								lastValue = correctData[countryName][yearStr];
							}
						}
						if(Object.keys(correctData[countryName]).length == 0){
							delete correctData[countryName];
							c--;
						}
					}
					console.log(JSON.stringify(correctData));
				});
			});
		});

	}



	////// API CALLS DO NOT WORK :'( ///////////////////////
	/*this.dataUrl = "http://api.worldbank.org/v2/"

	$http.get(this.dataUrl + 'datacatalog' + '?format=json')
       .then(function(res){
          $scope.testWorldBank = res.data;                
        }); */

	return this; 
}]);