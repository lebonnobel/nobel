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

	////// API CALLS DO NOT WORK :'( ///////////////////////
	/*this.dataUrl = "http://api.worldbank.org/v2/"

	$http.get(this.dataUrl + 'datacatalog' + '?format=json')
       .then(function(res){
          $scope.testWorldBank = res.data;                
        }); */

	return this; 
}]);