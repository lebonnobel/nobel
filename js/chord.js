
nobelApp.controller('chord', function(nobelService, prizeService, $scope) {


// ********************** CODE FOR DATA AND CREATING CHORD *********************

	var chordAge;
	var chordGender;
	var chordData;
  var chordOld;
  var laureateCurrentGroups;
  var laureateAgeGroups;
  var laureateGenderGroups;

  $scope.chordText = "Instructions: Click on the rim of the circle to get more information.";

  // Get age data
	nobelService.getNobelDataForChordDiagram("age",function(data) {
		laureateAgeGroups = data;
		chordAge = [
    [data[0][0], data[0][1], data[0][2], data[0][3], data[0][4], data[0][5], data[0][6]],    
		[data[1][0], data[1][1].length, data[1][2].length, data[1][3].length, data[1][4].length, data[1][5].length, data[1][6].length], 
		[data[2][0], data[2][1].length, data[2][2].length, data[2][3].length, data[2][4].length, data[2][5].length, data[2][6].length],
		[data[3][0], data[3][1].length, data[3][2].length, data[3][3].length, data[3][4].length, data[3][5].length, data[3][6].length],
		[data[4][0], data[4][1].length, data[4][2].length, data[4][3].length, data[4][4].length, data[4][5].length, data[4][6].length],
		[data[5][0], data[5][1].length, data[5][2].length, data[5][3].length, data[5][4].length, data[5][5].length, data[5][6].length], 
		[data[6][0], data[6][1].length, data[6][2].length, data[6][3].length, data[6][4].length, data[6][5].length, data[6][6].length], 
		[data[7][0], data[7][1].length, data[7][2].length, data[7][3].length, data[7][4].length, data[7][5].length, data[7][6].length]];
  });
    
    // Get gender data
  	
  	nobelService.getNobelDataForChordDiagram("gender",function(data) {
  	laureateGenderGroups = data;

		chordGender = [
    [data[0][0], data[0][1], data[0][2], data[0][3], data[0][4], data[0][5], data[0][6]],
		[data[1][0], data[1][1].length, data[1][2].length, data[1][3].length, data[1][4].length, data[1][5].length, data[1][6].length], 
		[data[2][0], data[2][1].length, data[2][2].length, data[2][3].length, data[2][4].length, data[2][5].length, data[2][6].length],
		[data[3][0], data[3][1].length, data[3][2].length, data[3][3].length, data[3][4].length, data[3][5].length, data[3][6].length]];
		
    //Setting data for chord
    laureateCurrentGroups = laureateGenderGroups;
    chordData = chordGender;
  	chordOld = chordData;
  	chordDiagram = d3.elts.flowChord().colors(chordColors).rimWidth(screen.height*0.035);
  	chordDiagram.oldD(chordOld);
  	d3.select("#flow").datum(chordData).call(chordDiagram);
	});
  	
  // ********************* CODE FOR SETTING IT UP ***************************

  // Functions for changing from Gender to Age and Age to Gender.

  $scope.genderData = function() {
    chordData = chordGender; 
    chordOld = chordGender;
    chordColors = genderColors;
    chordDiagram.colors(chordColors);
    laureateCurrentGroups = laureateGenderGroups;
    d3.select("#flow")[0][0].innerHTML = "";
    d3.select("#flow").datum(chordData).call(chordDiagram);
  }


  $scope.ageData = function() {
    chordData = chordAge; 
    chordOld = chordAge;
    chordColors = ageColors;
    chordDiagram.colors(chordColors);
    laureateCurrentGroups = laureateAgeGroups;
    d3.select("#flow")[0][0].innerHTML = "";
    d3.select("#flow").datum(chordData).call(chordDiagram);
  }

  $scope.flowClick = function() {
    // Finding tempLeauratea
    $scope.chordText = "";
    var tempLeauratea;

    if (rightDepth > 0 && leftDepth > 0) {
      var index = laureateCurrentGroups[rightIndex+1][leftIndex - chordData.length + 2].length;
      var index2 = Math.floor((Math.random() * index - 1))+1;
      tempLeauratea = laureateCurrentGroups[rightIndex+1][leftIndex - chordData.length + 2][index2];    }
    
    else if (rightDepth > 0) {
      var index2 = -1;
      while (index2 < 0){
        var index = Math.floor((Math.random() * (chordData[0].length -1) )) + 1;
        var index2 = Math.floor((Math.random() * (laureateCurrentGroups[rightIndex + 1][index].length - 1) ));
      }
      tempLeauratea = laureateCurrentGroups[rightIndex+1][index][index2];
    }
    
    else if(leftDepth > 0) {
      var index2 = -1;
      while (index2 < 0) {
        var index = Math.floor((Math.random() * (laureateCurrentGroups.length - 1)));
        var index2 = Math.floor((Math.random() * (laureateCurrentGroups[index + 1][leftIndex - chordData.length + 2].length - 1) )) 
      }
      tempLeauratea = laureateCurrentGroups[index + 1][leftIndex - chordData.length + 2][index2];
    }
    
    else {$scope.chordText = "Instructions: Click on the rim of the circle to get more information."; return false;}
    
    //TODO FIXA FIN DESIGN
    if(tempLeauratea.surname == null) {tempLeauratea.surname = "";}
    
    //Fixing age so its shown.
    var ageText = "";

    if (tempLeauratea.born != null) {
      var bornYear = new Date(tempLeauratea.born);
      var awardYear = new Date(tempLeauratea.prizes[0].year + '-12-10');
      var chordYear = new Date(awardYear-bornYear).getFullYear() - 1970;
    }

    if (tempLeauratea.gender != "org") {
      ageText = " at age: " + chordYear;
    }

    //Text output.
    $scope.chordText = "Random winner: " + tempLeauratea.firstname + " " + tempLeauratea.surname + " won the Nobel Prize in " + tempLeauratea.prizes[0].category + " year: " + tempLeauratea.prizes[0].year + ageText + ".";

  }

  // Colours for Gender and Age

  var genderColors = d3.scale.ordinal().range(["#969696","#656565","#8c8c8c", "#455c7c", "#f9ce66", "#a86d6d", "#826a84","#8fb588","#d89f71"]);

  var ageColors = d3.scale.ordinal().range(["#969696","#656565","#8c8c8c","#787878","#A1A1A1","#575757","#818181", "#455c7c", "#f9ce66", "#a86d6d", "#826a84","#8fb588","#d89f71"]);

  var chordColors = genderColors;

});