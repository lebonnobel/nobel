// Filters data from controller in order to send to D3 in a proper format
function DataFormatter(){
    // The different formatting options for all the different D3 charts
    this.formattingOptions = { map:["data1", "data2", "data3"], sunburst:["data1", "data"]};
 
    // This function takes all data and transform it to the right format for the given formattingOption
    this.formatData = function(data, formatingOption){
      // A temporary array
      var formatedData = [];

      // Here we format the data to match our requested format

      return formatedData;
    }
    
  return this;
}
