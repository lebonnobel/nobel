
nobelApp.controller('chord', function(nobelService, $scope) {


// ********************* CHORD CODE ****************************




// ********************** CODE FOR DATA AND CREATING CHORD *********************

	var chordAge;
	var chordGender;
	var chordData;
  	var chordOld;
  	//var chordDiagram;
  	var laureateAgeGroups;
  	var laureateGenderGroups;

	nobelService.getNobelDataForChordDiagram("age",function(data) {
		laureateAgeGroups = data;

		chordAge = [data[0], 
		[data[1][0], data[1][1].length, data[1][2].length, data[1][3].length, data[1][4].length, data[1][5].length, data[1][6].length], 
		[data[2][0], data[2][1].length, data[2][2].length, data[2][3].length, data[2][4].length, data[2][5].length, data[2][6].length],
		[data[3][0], data[3][1].length, data[3][2].length, data[3][3].length, data[3][4].length, data[3][5].length, data[3][6].length],
		[data[4][0], data[4][1].length, data[4][2].length, data[4][3].length, data[4][4].length, data[4][5].length, data[4][6].length],
		[data[5][0], data[5][1].length, data[5][2].length, data[5][3].length, data[5][4].length, data[5][5].length, data[5][6].length], 
		[data[6][0], data[6][1].length, data[6][2].length, data[6][3].length, data[6][4].length, data[6][5].length, data[6][6].length], 
		[data[7][0], data[7][1].length, data[7][2].length, data[7][3].length, data[7][4].length, data[7][5].length, data[7][6].length]];
	});
  	
  	nobelService.getNobelDataForChordDiagram("gender",function(data) {
  		laureateGenderGroups = data;

		chordGender = [data[0], 
		[data[1][0], data[1][1].length, data[1][2].length, data[1][3].length, data[1][4].length, data[1][5].length, data[1][6].length], 
		[data[2][0], data[2][1].length, data[2][2].length, data[2][3].length, data[2][4].length, data[2][5].length, data[2][6].length],
		[data[3][0], data[3][1].length, data[3][2].length, data[3][3].length, data[3][4].length, data[3][5].length, data[3][6].length]];
		
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

  // Colours for Gender and Age

  var genderColors = d3.scale.ordinal().range(["#969696","#656565","#8c8c8c", "#455c7c", "#f9ce66", "#a86d6d", "#826a84","#8fb588","#d89f71"]);

  var ageColors = d3.scale.ordinal().range(["#969696","#656565","#8c8c8c","#787878","#A1A1A1","#575757","#818181", "#455c7c", "#f9ce66", "#a86d6d", "#826a84","#8fb588","#d89f71"]);

  var chordColors = genderColors;
});