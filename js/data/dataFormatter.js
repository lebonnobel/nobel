//
//////////////////// CURRENTLY NOT IN USE
//



// Filters data from controller in order to send to D3 in a proper format
function DataFormatter(){
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
    
  return this;
}
