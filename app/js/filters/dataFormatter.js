// Filters data from controller in order to send to D3 in a proper format
function dataFormatter(){
  // The different formatting options for all the different D3 charts
  var formattingOptions = { map:["data1", "data2", "data3"], sunburst:["data1", "data"]};
  
  // This function takes all data and transform it to the right format for the given formattingOption
  this.formatData = function(data, formatingOption){
    var formatedData = [];
    
    return formatedData;
  }
    
  return this;
}
