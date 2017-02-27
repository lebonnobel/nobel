nobelApp.factory('worldBankService', ['$window', '$http', '$q', function ($window, $http, $q) {
	// This service takes care of the calls to the World Bank API

	this.dataUrl = "http://api.worldbank.org/v2/"

	$http.get(this.dataUrl + 'datacatalog' + '?format=json')
       .then(function(res){
          $scope.testWorldBank = res.data;                
        });

	return this;
}]);