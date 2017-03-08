nobelApp.factory('nobelService', ['$window', '$http', '$q', function ($window, $http, $q) {
// This service loads all the Nobel data and stores it in variables for other parts of our visualization to acquire
// It also filters data from controller in order to send to D3 in a proper format
    
    // The url to the data, for easy change if needed
    var nobelDataUrl = "data/nobel/";
    var gapminderDataUrl = "data/gapminder/";
    
    // The data storing variables
    var prizesData = [];    
    var laureatesData = [];    
    var countriesData = [];
    
    //////////////////// DATA LOADING ////////////////////
       
    // Called from teh controller. We check jQuery before loading
    this.loadData = function(){
        // We start a check interval to wait until jQuery has loaded before we start reading the data
        defer(jQueryLoadJSON);
    }

    // Load all JSON files
    function jQueryLoadJSON(callback){
        // First we load all the nobel data
        // Load the prizeData
        $.getJSON(nobelDataUrl + "prize.json", function(json){
            prizesData = json.prizes;
            if (!isUndefinedOrEmpty(prizesData) && !isUndefinedOrEmpty(laureatesData) && !isUndefinedOrEmpty(countriesData)){ 
                callback(); 
            }
        });
        // Load the laureateData
        $.getJSON(nobelDataUrl + "laureate.json", function(json){
            laureatesData = json.laureates;
            if (!isUndefinedOrEmpty(prizesData) && !isUndefinedOrEmpty(laureatesData) && !isUndefinedOrEmpty(countriesData)){ 
                callback(); 
            }
        });
        // Load the countriesData
        $.getJSON(nobelDataUrl + "country.json", function(json){
            countriesData = json.countries;
            if (!isUndefinedOrEmpty(prizesData) && !isUndefinedOrEmpty(laureatesData) && !isUndefinedOrEmpty(countriesData)){ 
                callback(); 
            }
        });
        // Then we load all the gapminder data
    }

    //////////////////// DATA GETTER ////////////////////

    // This function returns the data requested. Might be redundant due to the data variables being public, but use this to avoid changing the original data.
    this.getData = function(dataName, callback){
        if (isUndefinedOrEmpty(prizesData) || isUndefinedOrEmpty(laureatesData) || isUndefinedOrEmpty(countriesData)){ 
            jQueryLoadJSON(function(){
                callback(deferedGetData(dataName));
            });
        } else {
            callback(deferedGetData(dataName));
        }
    }

    // This function returns nobel data for the given country, by the given year
    this.getNobelDataForCountry = function (countryName, year, callback) {
        if (isUndefinedOrEmpty(prizesData) || isUndefinedOrEmpty(laureatesData) || isUndefinedOrEmpty(countriesData)){ 
            jQueryLoadJSON(function(){
                callback(deferedGetNobelDataForCountry(countryName, year));
            });
        } else {
            callback(deferedGetNobelDataForCountry(countryName, year));
        }
    }

    // This function returns all data for the sunburst
    this.getNobelDataForSunburst = function(year) {
      if (year == undefined) {
        year = 3500;
      }
      var root = {"name": "flare", "children": []};
      var contName;
      var prizesData;
      var laureatesData;
      var countriesData;

      this.getData("prizes", function(d) {
          prizesData = d;
      });
      this.getData("laureates", function(d) {
          laureatesData = d;
      });
      this.getData("countries", function(d) {
          countriesData = d;
      });

      // for each continent
      for (var k=0; k<this.continents.length; k++) {
        var contObj = { "children": []};
        contName = this.continents[k];
        contObj["continent"] = contName; 
        
        // Goes through each country and matches it to a continent
        for (var l=0; l<countriesData.length; l++) {
          
          continentName = this.countryContinentDictionary[countriesData[l].name];

          // If this country is supposed to be with this continent
          // Look for laureates from this country
          if (continentName == contName) {
            var countryObj = { "children": []};
            countryObj["country"] = countriesData[l].code;

            // Loops through our laureates to look for laureates from this country
            for (var n=0; n<laureatesData.length; n++){

              // If the laureate is born in this country, grab info about them
              if ( laureatesData[n].bornCountryCode == countriesData[l].code) { 
                // If search for all prizes that have been awarded before the given year
                if (laureatesData[n].prizes[laureatesData[n].prizes.length-1].year <= year) {
                  var laureateObj = {};
                  laureateObj["laureate"] = laureatesData[n].firstname + " " + laureatesData[n].surname;
                  laureateObj["laureateId"] = laureatesData[n].id;
                  laureateObj["gender"] = laureatesData[n].gender;
                  laureateObj["category"] = laureatesData[n].prizes[laureatesData[n].prizes.length-1].category;
                  laureateObj["year"] = laureatesData[n].prizes[laureatesData[n].prizes.length-1].year;
                
                  countryObj.children.push(laureateObj);
                }
              }
              
            }
            contObj.children.push(countryObj);
          }
        }

        root.children.push(contObj);
      }
      

      return root;
    }


    function deferedGetData(dataName){
        // Temporary return array
        var retData = [];
        // We find and get the correct data requested
        switch (dataName){
        case "prizes":
            retData = prizesData;
            break;
        case "laureates":
            retData = laureatesData;
            break;
        case "countries":
            retData = countriesData;
            break;
        default:
            break;
        }
        // After we have found our data, we return it
        return retData;   
    }
    
    function deferedGetNobelDataForCountry(countryName, year){
        var formattedData = [];
        //var formattingArray = [["physics", "chemistry", "medicine", "litterature", "peace", "economics"], ["laureates"]];
        formattedData = formatNobelDataForSunburst(prizesData, laureatesData, countriesData, countryName, year);
        // Return the data
        return formattedData;
    }

    function isUndefinedOrEmpty(array){
        return (array == undefined || array.length == 0);
    }

    //////////////////// TIMEOUT ////////////////////

    // This function checks if jQuery has been loaded, otherwise we wait a little
    // jQuery is needed to load all our data, so no data operations can be done before it has been loaded
    function defer(method) {
        if (window.jQuery){
            method();
        }
        else{
            setTimeout(function() {defer(method);}, 50);
        }
    }

    //////////////////// FORMATTING //////////////////////

    // The different formatting options for all the different D3 charts
    this.formattingOptions = { map:["data1", "data2", "data3"], sunburst:["data1", "data"]};
    // This is a dictionary to know what category is at what index in the sunburstFormattedData
    var nobelCategoryDictionary = {"physics":0, "chemistry":1, "medicine":2, "literature":3, "peace":4, "economics":5};

    this.countryContinentDictionary = { "Democratic Republic of Vietnam": "Asia", "USSR (now Belarus)": "Europe", "South Korea": "Asia", "Ottoman Empire (now Republic of Macedonia)": "Europe", "Trinidad": "South America", "Russian Empire (now Azerbaijan)": "Europe", "Southern Rhodesia (now Zimbabwe)": "Africa", "Guadeloupe Island": "North America", "Bosnia": "Europe", "Austria-Hungary (now Croatia)": "Europe", "Latvia, Russian Empire": "Europe", "Austria-Hungary (now Ukraine)": "Europe", "Czechoslovakia": "Europe", "Hungary (now Slovakia)": "Europe", "the Netherlands": "Europe", "USA": "North America", "Scotland": "Europe", "Austria-Hungary (now Slovenia)": "Europe", "Java, Dutch East Indies (now Indonesia)": "Asia", "Alsace, then Germany": "Europe", "Afghanistan": "Asia", "Aland Islands": "Europe", "Albania": "Europe", "Algeria": "Africa", "Andorra": "Europe", "Angola": "Africa", "Anguilla": "North America", "Antigua and Barbuda": "North America", "Argentina": "South America", "Armenia": "Europe", "Aruba": "North America", "Australia": "Oceania", "Austria": "Europe", "Azerbaijan": "Europe", "Bahamas": "North America", "Bahamas, The": "North America", "Bahrain": "Asia", "Bangladesh": "Asia", "Barbados": "North America", "Belarus": "Europe", "Belgium": "Europe", "Belize": "North America", "Benin": "Africa", "Bermuda": "North America", "Bhutan": "Asia", "Bolivia": "South America", "Bosnia and Herzegovina": "Europe", "Botswana": "Africa", "Bouvet Island": "South America", "Brazil": "South America", "British Indian Ocean Territory": "Asia", "British Virgin Islands": "North America", "Brunei": "Asia", "Bulgaria": "Europe", "Burkina": "Africa", "Burkina Faso": "Africa", "Burma": "Asia", "Burma (Myanmar)": "Asia", "Burundi": "Africa", "Cambodia": "Asia", "Cameroon": "Africa", "Canada": "North America", "Cape Verde": "Africa", "Cayman Islands": "North America", "Central African Republic": "Africa", "Chad": "Africa", "Chile": "South America", "China": "Asia", "Christmas Island": "Oceania", "Cocos (Keeling) Islands": "Oceania", "Colombia": "South America", "Comoros": "Africa", "Congo": "Africa", "Congo, Democratic Republic of": "Africa", "Congo, Democratic Republic of the": "Africa", "Congo, Republic of the": "Africa", "Cook Islands": "Oceania", "Costa Rica": "North America", "Cote d'Ivoire": "Africa", "Croatia": "Europe", "Cuba": "North America", "Cyprus": "Europe", "Czech Republic": "Europe", "Denmark": "Europe", "Djibouti": "Africa", "Dominica": "North America", "Dominican Republic": "North America", "East Timor": "Asia", "Ecuador": "South America", "Egypt": "Africa", "El Salvador": "North America", "Equatorial Guinea": "Africa", "Eritrea": "Africa", "Estonia": "Europe", "Ethiopia": "Africa", "Falkland Islands (Islas Malvinas)": "South America", "Faroe Islands": "Oceania", "Fiji": "Oceania", "Finland": "Europe", "France": "Europe", "French Guiana": "South America", "French Polynesia": "Oceania", "French Southern and Antarctic Lands": "Oceania", "Gabon": "Africa", "Gambia": "Africa", "Gambia, The": "Africa", "Georgia": "Europe", "Germany": "Europe", "Ghana": "Africa", "Gibraltar": "Europe", "Greece": "Europe", "Greenland": "North America", "Grenada": "North America", "Guadeloupe": "North America", "Guam": "Oceania", "Guatemala": "North America", "Guernsey": "Europe", "Guinea": "Africa", "Guinea-Bissau": "Africa", "Guyana": "South America", "Haiti": "North America", "Heard Island and McDonald Islands": "Oceania", "Holy See (Vatican City)": "Europe", "Honduras": "North America", "Hong Kong": "Asia", "Hungary": "Europe", "Iceland": "Europe", "India": "Asia", "Indonesia": "Asia", "Iran": "Asia", "Iraq": "Asia", "Ireland": "Europe", "Isle of Man": "Europe", "Israel": "Asia", "Italy": "Europe", "Ivory Coast": "Africa", "Jamaica": "North America", "Japan": "Asia", "Jersey": "Europe", "Jordan": "Asia", "Kazakhstan": "Asia", "Kenya": "Africa", "Kiribati": "Oceania", "Korea, North": "Asia", "Korea, South": "Asia", "Kuwait": "Asia", "Kyrgyzstan": "Asia", "Laos": "Asia", "Latvia": "Europe", "Lebanon": "Asia", "Lesotho": "Africa", "Liberia": "Africa", "Libya": "Africa", "Liechtenstein": "Europe", "Lithuania": "Europe", "Luxembourg": "Europe", "Macau": "Asia", "Macedonia": "Europe", "Madagascar": "Africa", "Malawi": "Africa", "Malaysia": "Asia", "Maldives": "Asia", "Mali": "Africa", "Malta": "Europe", "Marshall Islands": "Oceania", "Martinique": "North America", "Mauritania": "Africa", "Mauritius": "Africa", "Mayotte": "Africa", "Mexico": "North America", "Micronesia": "Oceania", "Micronesia, Federated States of": "Oceania", "Moldova": "Europe", "Monaco": "Europe", "Mongolia": "Asia", "Montenegro": "Europe", "Montserrat": "North America", "Morocco": "Africa", "Mozambique": "Africa", "Namibia": "Africa", "Nauru": "Oceania", "Nepal": "Asia", "Netherlands": "Europe", "Netherlands Antilles": "North America", "New Caledonia": "Oceania", "New Zealand": "Oceania", "Nicaragua": "North America", "Niger": "Africa", "Nigeria": "Africa", "Niue": "Oceania", "Norfolk Island": "Oceania", "Northern Mariana Islands": "Oceania", "Norway": "Europe", "Oman": "Asia", "Pakistan": "Asia", "Palau": "Oceania", "Palestine": "Asia", "Panama": "North America", "Papua New Guinea": "Oceania", "Paraguay": "South America", "Peru": "South America", "Philippines": "Asia", "Pitcairn Islands": "Asia", "Poland": "Europe", "Portugal": "Europe", "Puerto Rico": "North America", "Qatar": "Asia", "Reunion": "Africa", "Romania": "Europe", "Russia": "Asia", "Russian Federation": "Asia", "Rwanda": "Africa", "Saint Barthelemy": "North America", "Saint Helena": "Africa", "Saint Kitts and Nevis": "North America", "Saint Lucia": "North America", "Saint Martin": "North America", "Saint Pierre and Miquelon": "North America", "Saint Vincent and the Grenadines": "North America", "Samoa": "Oceania", "San Marino": "Europe", "Sao Tome and Principe": "Africa", "Saudi Arabia": "Asia", "Senegal": "Africa", "Serbia": "Europe", "Seychelles": "Africa", "Sierra Leone": "Africa", "Singapore": "Asia", "Slovakia": "Europe", "Slovenia": "Europe", "Solomon Islands": "Oceania", "Somalia": "Africa", "South Africa": "Africa", "South Georgia South Sandwich Islands": "South America", "South Sudan": "Africa", "Spain": "Europe", "Sri Lanka": "Asia", "Sudan": "Africa", "Suriname": "South America", "Svalbard": "Europe", "Swaziland": "Africa", "Sweden": "Europe", "Switzerland": "Europe", "Syria": "Asia", "Taiwan": "Asia", "Tajikistan": "Asia", "Tanzania": "Africa", "Thailand": "Asia", "Timor-Leste": "Asia", "Togo": "Africa", "Tokelau": "Oceania", "Tonga": "Oceania", "Trinidad and Tobago": "North America", "Tunisia": "Africa", "Turkey": "Asia", "Turkmenistan": "Asia", "Turks and Caicos Islands": "North America", "Tuvalu": "Oceania", "Uganda": "Africa", "Ukraine": "Europe", "United Arab Emirates": "Asia", "United Kingdom": "Europe", "United States": "North America", "Uruguay": "South America", "Uzbekistan": "Asia", "Vanuatu": "Oceania", "Vatican City": "Europe", "Venezuela": "South America", "Vietnam": "Asia", "Virgin Islands": "North America", "Wallis and Futuna": "Oceania", "Western Sahara": "Africa", "Yemen": "Asia", "Zambia": "Africa", "Zimbabwe": "Africa"}
    this.continents = ["North America", "South America", "Europe", "Asia", "Oceania", "Africa"];
 
    // This function takes all data and transform it to the right format for the given formattingOption
    this.formatData = function(data, formatingOption){
      // A temporary array
      var formatedData = [];

      // Here we format the data to match our requested format

      return formatedData;
    }

    // This function formats our data to the requested type
    function formatNobelDataForSunburst (prizesData, laureatesData, countriesData, countryName, year){
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

    // This function searches the country data for the country code
    function getCountryNameByCode(countriesData, countryCode){
      // First we must find the given country's code in the nobel data
      var countryName = "";
      // Then we search
      for (var i = 0; i < countriesData.length; i++) {
        if(countryCode.toLowerCase() == countriesData[i].code.toLowerCase()) {
          countryName = countriesData[i].name;
          break;
        } 
      }
      // We check if the country code has been found, otherwise we return an error
      return (countryName == "") ? "Error, wrong name!" : countryName;
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