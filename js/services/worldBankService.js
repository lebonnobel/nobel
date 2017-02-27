nobelApp.factory('worldBankService', ['$window', '$http', '$q', function ($window, $http, $q) {
	// This service takes care of the data from the World Bank 

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

	////// API CALLS DO NOT WORK :'( ///////////////////////
	/*this.dataUrl = "http://api.worldbank.org/v2/"

	$http.get(this.dataUrl + 'datacatalog' + '?format=json')
       .then(function(res){
          $scope.testWorldBank = res.data;                
        }); */

	return this; 
}]);