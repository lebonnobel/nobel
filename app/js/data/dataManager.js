// This object loads all the data and stores it in variables for other parts of our visualization to acquire
function DataManager(){
    
    // The url to the data, for easy change if needed
    var nobelDataUrl = "data/nobel/";
    var gapminderDataUrl = "data/gapminder/";
    
    // The data storing variables
    this.prizesData = [];    
    this.laureatesData = [];    
    this.countriesData = [];

    // Create the formatter instance
    this.dataFormatter = new DataFormatter();
    
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

    //////////////////// TIMEOUT ////////////////////

    // This function checks if jQuery has been loaded, otherwise we wait a little
    // jQuery is needed to load all our data, so no data operations can be done before it has been loaded
    function defer(method) {
        if (window.jQuery)
          method();
        else
          setTimeout(function() { defer(method) }, 50);
    }

    // Return this instance to the controller. We need to do this to be able to access it later
    return this;
}