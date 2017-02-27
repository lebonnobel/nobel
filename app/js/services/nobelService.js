nobelApp.factory('nobelService', ['$window', '$http', '$q', function ($window, $http, $q) {
// This service loads all the Nobel data and stores it in variables for other parts of our visualization to acquire
// It also filters data from controller in order to send to D3 in a proper format
    
    // The url to the data, for easy change if needed
    var nobelDataUrl = "data/nobel/";
    var gapminderDataUrl = "data/gapminder/";
    
    // The data storing variables
    this.prizesData = [];    
    this.laureatesData = [];    
    this.countriesData = [];

    
    //////////////////// DATA LOADING ////////////////////
        
    // Called from teh controller. We check jQuery before loading
    this.loadData = function(){
        // We start a check interval to wait until jQuery has loaded before we start reading the data
        defer(jQueryLoadJSON);
    }

    // Load all JSON files
    function jQueryLoadJSON(){
        // First we load all the nobel data
        // Load the prizeData
        $.getJSON(nobelDataUrl + "prize.json", function(json){
            prizesData = json.prizes;
        });
        // Load the laureateData
        $.getJSON(nobelDataUrl + "laureate.json", function(json){
            laureatesData = json.laureates;
        });
        // Load the countriesData
        $.getJSON(nobelDataUrl + "country.json", function(json){
            countriesData = json.countries;
        });
        // Then we load all the gapminder data
    }

    //////////////////// DATA GETTER ////////////////////

    // This function returns the data requested. Might be redundant due to the data variables being public, but use this to avoid changing the original data.
    this.getData = function(dataName){
        // Temporary return array
        var retData = [];
        // We find and get the correct data requested
        switch (dataName){
        case "prizes":
            retData = this.prizesData;
            break;
        case "laureates":
            retData = this.laureatesData;
            break;
        case "countries":
            retData = this.countriesData;
            break;
        default:
            break;
        }
        // After we have found our data, we return it
        return retData;        
    }

    // This function returns nobel data for the given country, by the given year
    this.getNobelDataForCountry = function (countryName, year) {
        var formattedData = [];
        //var formattingArray = [["physics", "chemistry", "medicine", "litterature", "peace", "economics"], ["laureates"]];
        formattedData = this.formatNobelDataForSunburst(prizesData, laureatesData, countriesData, countryName, year);
        // Return the data
        return formattedData;
    }

    //////////////////// TIMEOUT ////////////////////

    // This function checks if jQuery has been loaded, otherwise we wait a little
    // jQuery is needed to load all our data, so no data operations can be done before it has been loaded
    function defer(method) {
        if (window.jQuery)
          method();
        else
          setTimeout(function() { defer(method) }, 50);
    }

    //////////////////// FORMATTING //////////////////////

    // The different formatting options for all the different D3 charts
    this.formattingOptions = { map:["data1", "data2", "data3"], sunburst:["data1", "data"]};
    // This is a dictionary to know what category is at what index in the sunburstFormattedData
    var nobelCategoryDictionary = {"physics":0, "chemistry":1, "medicine":2, "literature":3, "peace":4, "economics":5};
 
    // This function takes all data and transform it to the right format for the given formattingOption
    this.formatData = function(data, formatingOption){
      // A temporary array
      var formatedData = [];

      // Here we format the data to match our requested format

      return formatedData;
    }

    // This function formats our data to the requested type
    this.formatNobelDataForSunburst = function(prizesData, laureatesData, countriesData, countryName, year){
      var sunburstFormattedData = {"categories":[{"category":"physics", "laureates":[]}, {"category":"chemistry", "laureates":[]}, {"category":"medicine", "laureates":[]}, 
      {"category":"litterature", "laureates":[]}, {"category":"peace", "laureates":[]}, {"category":"economics", "laureates":[]}]};
      // First get the country code
      var countryCode = getCountryCodeByName(countriesData, countryName);
      // We loop through our prizesData
      for (var i = 0; i < prizesData.length; i++) {
        // If search for all prizes that have been awarded before the given year
        if (prizesData[i].year <= year) {
          // Then check if some of the laureates comes from the given country
          for (var j = 0; j < prizesData[i].laureates.length; j++) {
            var tempLaureate = getLaureateByID(laureatesData, prizesData[i].laureates[j].id);
            if (tempLaureate.bornCountryCode == countryCode) {
              sunburstFormattedData.categories[nobelCategoryDictionary[prizesData[i].category]].laureates.push({"id":tempLaureate.id, "share":(1 / prizesData[i].laureates[j].share)});
            }
          }
        }
      }
      // Return this to the requester
      return sunburstFormattedData;
    }
    
    // This function searches the country data for the country code
    function getCountryCodeByName(countriesData, countryName){
      // First we must find the given country's code in the nobel data
      var countryCode = "";
      // Then we search
      for (var i = 0; i < countriesData.length; i++) {
        if(countriesData[i].name.toLowerCase() == countryName.toLowerCase()) {
          countryCode = countriesData[i].code;
          break;
        } 
      }
      // We check if the country code has been found, otherwise we return an error
      return (countryCode == "") ? "Error, wrong name!" : countryCode;
    }
    
    // This function searches the laureate data by the given id
    function getLaureateByID(laureatesData, id){
      var laureateObj = {};
      // We search for our laureate
      for (var i = 0; i < laureatesData.length; i++){
        if(laureatesData[i].id == id){
          laureateObj = laureatesData[i];
          break;
        }
      }
      // We return the laureate if found
      return (Object.keys(laureateObj).length === 0 && laureateObj.constructor === Object) ? "Error, wrong id!" : laureateObj;
    }

    // Return this instance to the controller. We need to do this to be able to access it later
	return this;
}]);