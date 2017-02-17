nobelApp.factory('nobelService', ['$window', '$http', '$q', function ($window, $http, $q) {

// 	this.getData = function (data) {
// 		var postData = 'myData='+JSON.stringify(data);
// 		$http({
// 			method : 'POST',
// 			url : '          ', //insert URL to fetch dataz
// 			data: postData,
// 			headers : {'Content-Type': 'application/x-www-form-urlencoded'}  
// 			}).success(function(res){
// 					console.log(res);
// 			}).error(function(error){
// 					console.log(error);
// 			});
//   }]);
  
	// This function fetches the data we require from an API
  this.getData = function (id) {
		apiKey = ''; // insert key
    url = 'http://api.nobelprize.org/v1/prize.json?';
		var promise = $http.get(url + apiKey);
        return promise;
	};
}]);