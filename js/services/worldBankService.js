nobelApp.factory('worldBankService', ['$window', '$http', '$q', function ($window, $http, $q) {
	// This service takes care of the data from the World Bank 

	this.wbDataUrl = "data/worldbank/";
	this.dataSets = [
		{
			'title' : 'Countries',
			'description' : '',
			'filename' : 'countries'
		}, 
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
		}
	}



	////// API CALLS DO NOT WORK :'( ///////////////////////
	/*this.dataUrl = "http://api.worldbank.org/v2/"

	$http.get(this.dataUrl + 'datacatalog' + '?format=json')
       .then(function(res){
          $scope.testWorldBank = res.data;                
        }); */

	return this; 
}]);