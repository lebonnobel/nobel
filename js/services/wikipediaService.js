nobelApp.factory('wikipediaService', ['$window', '$http', '$q', function ($window, $http, $q, $resource) {
	
	var apiUrl = "https://en.wikipedia.org/w/api.php?";
	var apiExtractsQuery = "action=query&prop=extracts&exintro&indexpageids=true&format=json";
	var apiImagesQuery = "action=query&prop=pageimages&pithumbsize=200&exintro&indexpageids=true&format=json";
	

    this.apiWikiSearch = function(query, type, callback){
    	var corrQuery;
    	if(type == "image") {
			corrQuery= apiUrl + apiImagesQuery + "&generator=search&gsrlimit=1&gsrsearch=" 
			+ replaceCharsToLink(query);
    	} else if (type == "info") {
			corrQuery= apiUrl + apiExtractsQuery + "&generator=search&gsrlimit=1&gsrsearch=" 
			+ replaceCharsToLink(query);
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

    function replaceCharsToLink(str) {
    	var retStr = str;
  		// First replace spaces
  		retStr = retStr.replace(new RegExp(" ", 'g'), "-");  		
		// Then replace wierd characters
  		retStr = retStr.replace(new RegExp("á", 'g'), "a");
  		retStr = retStr.replace(new RegExp("é", 'g'), "e");
  		retStr = retStr.replace(new RegExp("ó", 'g'), "o");
  		return retStr;
	}


	return this; 
}]);