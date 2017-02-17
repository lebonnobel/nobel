nobelApp.controller('nobelCtrl', function($scope, $http, nobelService) {
 
	// This is our formatter, we will send data and it will format it for us
	var dataFormatter = new dataFormatter();
	
	
  // Gets called from .html, calls nobelService to fetch data
  // Gets looped in .html to display results
$scope.getNobelPrizeData = function () {
	$scope.data = nobelService.getData();
	$scope.nobelData = $scope.data.$$state;
	console.log($scope.nobelData);
}
  
  
});