nobelApp.controller('chord', function(nobelService, $scope) {



// ********************** CODE FOR DATA AND CREATING CHORD *********************

	var chordAge;
	var chordGender;
	var chordData;
  	var chordOld;
  	//var chordDiagram;

	nobelService.getNobelDataForChordDiagram("age",function(data) {
		chordAge = data;
	});
  	
  	nobelService.getNobelDataForChordDiagram("gender",function(data) {
		chordGender = data;
		var chordData = chordGender;
  		var chordOld = chordData;
  		chordDiagram = d3.elts.flowChord().colors(chordColors).rimWidth(screen.height*0.035);
  		chordDiagram.oldD(chordOld);
  		d3.select("#flow").datum(chordData).call(chordDiagram);
	});
  	
  // ********************* CODE FOR SETTING IT UP ***************************

  // Functions for changing from Gender to Age and Age to Gender.

  $scope.genderData = function() {
    document.getElementById("text").innerHTML = "Now showing: Prizes by Category and Gender";
    chordData = chordGender; 
    chordOld = chordGender;
    chordColors = genderColors;
    chordDiagram.colors(chordColors);
    d3.select("#flow")[0][0].innerHTML = "";
    d3.select("#flow").datum(chordData).call(chordDiagram);
  }


  $scope.ageData = function() {
    document.getElementById("text").innerHTML = "Now showing: Prizes by Category and Age";
    chordData = chordAge; 
    chordOld = chordAge;
    chordColors = ageColors;
    chordDiagram.colors(chordColors);
    d3.select("#flow")[0][0].innerHTML = "";
    d3.select("#flow").datum(chordData).call(chordDiagram);
  }

  // Colours for Gender and Age.

  var genderColors = d3.scale.ordinal().range(["#969696","#656565","#8c8c8c", "#455c7c", "#f9ce66", "#a86d6d", "#826a84","#8fb588","#d89f71"]);

  var ageColors = d3.scale.ordinal().range(["#969696","#656565","#8c8c8c","#787878","#A1A1A1","#575757","#818181", "#455c7c", "#f9ce66", "#a86d6d", "#826a84","#8fb588","#d89f71"]);

  var chordColors = genderColors;
});