nobelApp.factory('wikipediaService', ['$window', '$http', '$q', function ($window, $http, $q, $resource) {
	
	var apiUrl = "https://en.wikipedia.org/w/api.php?";
	var apiExtractsQuery = "action=query&prop=extracts&exintro&indexpageids=true&format=json";
	var apiImagesQuery = "action=query&prop=pageimages&pithumbsize=200&exintro&indexpageids=true&format=json";
	

    this.apiWikiSearch = function(query, type, callback){
    	var corrQuery;
    	if(type == "image") {
			corrQuery= apiUrl + apiImagesQuery + "&generator=search&gsrlimit=1&gsrsearch=" 
			+ replaceAll(query, " ", "-");
    	} else if (type == "info") {
			corrQuery= apiUrl + apiExtractsQuery + "&generator=search&gsrlimit=1&gsrsearch=" 
			+ replaceAll(query, " ", "-");
    	}

		console.log(corrQuery);
		$.ajax({
			url: corrQuery,
			data: {
				format: "json"
			},
			dataType: "jsonp",
			success: function(data){

				if (type == "image") {
					for (var key in data.query.pages) {
						if (data.query.pages[key].thumbnail != undefined) {
							if (data.query.pages[key].thumbnail.source != undefined) {
								callback(data.query.pages[key].thumbnail.source);
								break;
						 	}
						}
					}
				} else if (type = "info"){
					for (var key in data.query.pages) {
						if (data.query.pages[key].extract != undefined) {
							callback(data.query.pages[key].extract);
							break;
						}
					}
				}
			}
		});
    }

    function replaceAll(str, find, replace) {
  		return str.replace(new RegExp(find, 'g'), replace);
	}


	return this; 
}]);