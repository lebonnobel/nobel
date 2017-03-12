$("#info table, #info h1").hide();

//Sätter bredd och position på sidoruta och top-legend beroende på SVGn
$("svg").css("position", "relative");
$("#sidebar");
$("#sidebar").css("left",width);
$("#sidebar").css("width",width/4);
$("#sidebar").css("height",height);
$("#topbar").css("width",width);


function leafClick(d){
	$("#laureateInfo, #info h1").show();
	$("#countryInfo").hide();

	$("#name").html(d.laureate);
	$("#country").html(d.parent.country);
	$("#category").html(d.category);
	$("#year").html(d.year);
}

function countryClick(d){
	$("#laureateInfo").hide();
	$("#countryInfo, #info h1").show();

	$("#name").html(d.country);
	$("#num").html(d.children.length);
}