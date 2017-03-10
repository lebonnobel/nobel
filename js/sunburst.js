nobelApp.controller('sunburst', function(nobelService, $scope) {

	//sets up the intial variables
	var width = 960,
	    height = 750,
	    radius = Math.min(width, height) / 2,
	    x = d3.scale.linear()
	    	.range([0, 2 * Math.PI]),
	    y = d3.scale.sqrt()
	    	.range([0, radius]);

	//predefined colors for continents
	var colors = {
		"Oceania": "#29374a" , //Purple
		"North America": "#4e3f4f", //Blue
		"South America": "#644141", //Cyan
		"Asia": "#815f43", //Teal
		"Africa": "#957b3d", //Amber
		"Europe": "#556c51" //Deep Orange
	};

	//below color variables returns a color in a predefined domain for countries belonging to the different continents
	var OceaniaColor = d3.scale.linear()
			.domain([1, 9])
			.range(["#6a7c96", "#29374a"])
			.interpolate(d3.interpolateHcl);
	var NAmericaColor = d3.scale.linear()
			.domain([1, 9])
			.range(["#9b879c", "#4e3f4f"])
			.interpolate(d3.interpolateHcl);
	var SAmericaColor = d3.scale.linear()
			.domain([1, 9])
			.range(["#b98a8a", "#644141"])
			.interpolate(d3.interpolateHcl);
	var AsiaColor = d3.scale.linear()
			.domain([1, 9])
			.range(["#dfb28d", "#815f43"])
			.interpolate(d3.interpolateHcl);
	var AfricaColor = d3.scale.linear()
			.domain([1, 9])
			.range(["#fad784", "#957b3d"])
			.interpolate(d3.interpolateHcl);
	var EuropeColor = d3.scale.linear()
			.domain([1, 9])
			.range(["#a5c39f", "#556c51"])
			.interpolate(d3.interpolateHcl);

	//perhaps unnecessary atm, but returns predefined colors for the different continents
	function colorPicker (country) {
		return colors[String(country)];
	}

	//the predefined colors of the different prize categories
	var categoryColors = {
	  "physics":  "#455C7C",
	  "literature": "#826A84",
	  "medicine": "#A86D6D",
	  "economics": "#D89F71",
	  "chemistry": "#F9CE66",
	  "peace": "#8FB588"
	};
	
	//sets up the svg canvas where sunburst is placed
	var vis = d3.select("#sunburst").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("id", "container")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	var partition = d3.layout.partition()
	    .sort(null)
	    .value(function(d) { return 1; });

	//determines the angles and radius of the levels and pieces
	var arc = d3.svg.arc()
		.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
		.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
		.innerRadius(function(d) { return Math.max(0, y(d.y)); })
		.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
	
	//global variables needed further down
	var node;
	var currentRoot;
	var count = 0;

	//loads json file & add attributes etc to the path (sunburst piece)
	function sunburstLoad (year = 1904) {
		nobelService.getData("prizes", function(data) {
			count += 1;
			$scope.nobelData = nobelService.getNobelDataForSunburst(2017);
			$scope.$apply();
			//console.log("data", $scope.nobelData);

			var json = nobelService.getNobelDataForSunburst(year);
			console.log("json", json);
		//d3.json("flare1.json", function(json) {
			var path = vis.datum(json).selectAll("path")
		    	.data(partition.nodes)
		     .enter().append("path")
		       	.attr("ID", function(d, i) { return "path-" + i; })
		       	.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
		       	.attr("d", arc)
		       	.style("stroke", "#fff")
		       	.style("fill", function(d) {
			    	if (d["category"]) {
			       		var category = d["category"];
			       		if (category === "physics") {
			       			return categoryColors["physics"];
			       		} else if (category === "literature") {
			       			return categoryColors["literature"];
			       		} else if (category === "medicine") {
			       			return categoryColors["medicine"];
			       		} else if (category === "economics") {
			       			return categoryColors["economics"];
			       		} else if (category === "chemistry") {
			       			return categoryColors["chemistry"];
			       		} else if (category === "peace") {
			       			return categoryColors["peace"];
			       		}
			    	} else {
			    		if(d["continent"]) {
			    			var continent = d["continent"];
			    			if (continent === "Africa") {
			    				return colorPicker("Africa");
			    			} else if (continent === "North America") {
			    				return colorPicker("North America");
			    			} else if (continent === "South America") {
			    				return colorPicker("South America");
			    			} else if (continent === "Europe") {
			    				return colorPicker("Europe");
			    			} else if (continent === "Asia") {
			    				return colorPicker("Asia");
			    			} else if (continent === "Oceania") {
			    				return colorPicker("Oceania");
			    			}
			    		} else if (d["country"]) {
			    			var parent = d.parent["continent"];
			    			if(parent === "Africa") {
			    				return AfricaColor(Math.floor(Math.random()*10));
			    			} else if(parent === "North America") {
			    				return NAmericaColor(Math.floor(Math.random()*10));
			    			} else if(parent === "South America") {
			    				return SAmericaColor(Math.floor(Math.random()*10));
			    			} else if(parent === "Europe") {
			    				return EuropeColor(Math.floor(Math.random()*10));
			    			} else if(parent === "Asia") {
			    				return AsiaColor(Math.floor(Math.random()*10));
			    			} else if(parent === "Oceania") {
			    				return OceaniaColor(Math.floor(Math.random()*10));
			    			}
			    		}
			    	}
			    })
				.on("click", clicked)
				.on("mouseover", mouseover)
				.on("mousemove", mousemove)
		       	.each(stash);

		    if (count <= 1) {
			    function globeViz () {
					var width = 378,
					    height = 378,
					    sens = 0.25,
					    focused;

					//Setting projection

					var projection = d3.geo.orthographic()
					  .scale(187)
					  .rotate([0, 0])
					  .translate([width / 2, height / 2])
					  .clipAngle(90);

					var path = d3.geo.path()
					  .projection(projection);

					//SVG container

					var svg = d3.select("#globe").append("svg")
					  .attr("width", width)
					  .attr("height", height);
					  //.style("border-radius", 50%);

					//Adding water

					svg.append("path")
					  .datum({type: "Sphere"})
					  .attr("class", "water")
					  .attr("d", path);

					var countryTooltip = d3.select("#globeSunburstPage")
					      .append("div")
					      .attr("class", "countryTooltip")
					      .style("position", "absolute")
					      .style("z-index", "4")
					      .style("opacity", 0);

					var countryList = d3.select("#globe").append("select").attr("name", "countries");

					//get data?
					var q = queue()
					  //.defer(d3.json, "http://bl.ocks.org/d/5685937/world-110m.json")
					  .defer(d3.json, "http://codepen.io/JohannaG92/pen/yMVEzY.js")
					  //.defer(d3.tsv, "http://bl.ocks.org/d/5685937/world-110m-country-names.tsv")
					  .defer(d3.tsv, "http://codepen.io/JohannaG92/pen/gmLKGQ.js")
					  .await(ready);

					var globalWorld;
					var globalCountryData;
					var globalCountries;

					//Main function

					function ready(error, world, countryData) {
					  globalWorld = world;
					  globalCountryData = countryData;

					  var countryById = {},
					      countries = topojson.feature(world, world.objects.countries).features;
					  
					  globalCountries = countries;

					  //Adding countries to select

					  countryData.forEach(function(d) {
					    countryById[d.id] = d.name;
					    option = countryList.append("option");
					    option.text(d.name);
					    option.property("value", d.id);
					  });

					  //Dragging water on the globe
					  svg.selectAll("path.water")
					  .call(d3.behavior.drag()
					        .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
					        .on("drag", function() {
					          var rotate = projection.rotate();
					          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
					          svg.selectAll("path.land").attr("d", path);
					          svg.selectAll(".focused").classed("focused", focused = false);
					        })
					      );

					  var world = svg.selectAll("path.land")
					    .data(countries)
					    .enter().append("path")
					    .attr("class", "land")
					    .attr("d", path)

					  //Drag event

					  .call(d3.behavior.drag()
					        .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
					        .on("drag", function() {
					          var rotate = projection.rotate();
					          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
					          svg.selectAll("path.land").attr("d", path);
					          svg.selectAll(".focused").classed("focused", focused = false);
					        }))
					  
					  //Mouse events
					    .on("click", function(d) {
					    //up3(d.id);
					      clicked(countryById[d.id]);
					      up2(d);

					      //alert(globalCountries[0][0]);
					      //alert(globalCountries[d.id]);
					      //alert(d.id);
					    })

					  .on("mouseover", function(d) {
					    var country = '<span class="country">' + countryById[d.id]
					                    + '</span>'
					    countryTooltip.html(country);

					    countryTooltip.transition()
					      .duration(25)
					      .style("opacity", 1.0);
					  })
					  .on("mouseleave", function(d) {
					    countryTooltip.style("opacity", 0);
					  })
					  .on("mousemove", function(d) {
					    countryTooltip
					      .style("top", (d3.event.pageY-30)+"px")
					      .style("left", (d3.event.pageX+20)+"px");
					  });

					  //Country focus on option select
					  // Här sätter man en listener som körs när man byter land
					  d3.select("select").on("change", function() {
					    up2(-1);  
					  });
					  
					  function up2(n) {
					  
					  //var t = d3.select("select");
					  var t = document.getElementsByTagName("select")[0];
					    
					  var rotate = projection.rotate();
					  var focusedCountry; 
					  if (n === -1) {
					    focusedCountry = country(globalCountries, t);
					  } else {
					    focusedCountry = n;
					    d3.selectAll("select").property("value", n.id);
					  }
					  p = d3.geo.centroid(focusedCountry);
					 
					    
					  svg.selectAll(".focused").classed("focused", focused = false);
					  //Globe rotating

					  (function transition() {
					    d3.transition()
					      .duration(2500)
					      .tween("rotate", function() {
					      var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
					      return function(t) {
					        projection.rotate(r(t));
					        svg.selectAll("path").attr("d", path)
					          .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
					        };
					      })
					    })();
					  };
					 
					  function country(cnt, sel) { 
					    for(var i = 0, l = cnt.length; i < l; i++) {
					      if(cnt[i].id == sel.value) {return cnt[i];}
					    }
					  };
					};
					// Här slutar ready

					function up3(n) { 
					  //var t = d3.select("select");
					  //var t = document.getElementsByTagName("select")[0];
					  var rotate = projection.rotate(),
					      fs = country2(globalCountries, n),
					      p = d3.geo.centroid(fs);
					      //focusedCountry = countries[20]
					      //p = d3.geo.centroid(focusedCountry);
					  svg.selectAll(".focused").classed("focused", focused = false);

					  //Globe rotating

					  (function transition() {
					    d3.transition()
					      .duration(2500)
					      .tween("rotate", function() {
					      var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
					      return function(t) {
					        projection.rotate(r(t));
					        svg.selectAll("path").attr("d", path)
					          .classed("focused", function(d, i) { return d.id == fs.id ? focused = d : false; });
					        };
					      })
					    })();
					  };
					 
					function country2(cnt, n) {
					  var sel = document.getElementsByTagName("select")[0];
					  for(var i = 0, l = cnt.length; i < l; i++) {
					    if(cnt[i].id == sel.value) {return cnt[n];}
					  }
					};
				}
				globeViz();
			}

		    d3.select("#container").on("mouseleave", mouseleave);
		    d3.select("#globeSunburstPage").on("mouseleave", mouseleave);

		    //sets the current root to the current data
		    currentRoot = path.data;

		    //sets tooltip variablef for showing name of piece in sunburst
		    var tooltip = d3.select("#globeSunburstPage")
			    .append("div")
			    .attr("class", "tooltip")
			    .style("opacity", 0);
			
			function mouseover(d) {
				var relatives = getRelatives(d);

				//Fade all paths
				d3.select("#sunburst")
					.selectAll("path")
						.style("opacity", 0.4)

				//Highlight chosen piece and relatives (parent paths)
				vis.selectAll("path")
					.filter(function(d) {
						return (relatives.indexOf(d) >= 0);
					})
		    		.style("opacity", 1.0)

		    	var content;
		    	if (d["depth"] === 1) {
		    		content = '<span class="continent">' + d["continent"]
		    		+ '</span>';
		    	} else if (d["depth"] === 2) {
		    		content = '<span class="country">' + d["country"]
		    		+ '</span>';
		    	} else if (d["depth"] === 3) {
		    		content = '<span class="winner"><strong>' + d["laureate"]
		    		+ '</strong></br>'+ d["category"]
		    		+ ', ' + d["year"]
		    		+ '</span>';
		    	}
		    	//calls tooltip to show content
		    	tooltip.html(content);
		    	
		    	tooltip.transition()
		    		.duration(25)
		    		.style("opacity", 1.0);
			}

			function mouseleave(d) {
				//deactivate pieces
				d3.select("#sunburst")
					.selectAll("path").on("mouseover", null);

				//return to full opacity on all pieces
				d3.select("#sunburst")
					.selectAll("path")
						.transition()
					.duration(300)
					.style("opacity", 1.0)
					.each("end", function() {
						d3.select(this).on("mouseover", mouseover);
					});

		    	tooltip.style("opacity", 0);
			}

			function getRelatives(data) {
				var path = [];
				var current = data;
				while (current.parent) {
					path.unshift(current);
					current = current.parent;
				}
				return path;
			}

		    function mousemove() {
		    	tooltip
		    		.style("top", (d3.event.pageY-30)+"px")
		    		.style("left", (d3.event.pageX+20)+"px");
		    }

		    //calculates the transition from old to new position of sunburst pieces
		    function arcTweenData(a, i) {
		    	var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
		    	function tween(t) {
		    		var b = oi(t);
		    		a.x0 = b.x;
		    		a.dx0 = b.dx;
		    		return arc(b);
		    	}

		    	if (i == 0) {
		    		var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
		    		return function(t) {
		    			x.domain(xd(t));
		    			return tween(t);
		    		};
		    	} else {
		    		return tween;
		    	} 
			}   
			//handles clicked data in sunburst
		    function clicked(d) {

		    	if (typeof(d) == "string"){
		    		var data = path[0];
		    		for (i=0; i < data.length; i++){
		    			var search = data[i];
		    			if(search.__data__.country) {
		    				console.log("COUNTRY");
		    				var country = search.__data__.country
		    				if(country === d){
		    					console.log("YEAH");
		    					currentRoot = search.__data__;
		    					node = search.__data__;

		    					path.transition()
						    		.duration(4000)
						    		.attrTween("d", arcTweenData);
						    	return;
		    				}
		    			}
		    		}
		    		return;
		    	}
		    	//makes it possible to click the already clicked level to go back to previous state
		    	else if(d === currentRoot && d.parent) {
		    		currentRoot = d.parent;
		    		node = currentRoot;
		    	} else if (!d.children){
		    		console.log("d in click", d);
		    		//here the winner info div will be called to show itself!
		    		//it is not possible to rearrange the sunburst if the clicked path is a winner
		    		//(ie. does not have any children)
		    		return;
		    	} else {
		    		currentRoot = d;
		    		node = d;
		    	}


		    	//makes the transition smooth (changing the levels)
		    	path.transition()
		    		.duration(1000)
		    		.attrTween("d", arcTweenData);
			}

			var globeViz = function() {
				var width = 378,
				    height = 378,
				    sens = 0.25,
				    focused;

				//Setting projection

				var projection = d3.geo.orthographic()
				  .scale(187)
				  .rotate([0, 0])
				  .translate([width / 2, height / 2])
				  .clipAngle(90);

				var path = d3.geo.path()
				  .projection(projection);

				//SVG container

				var svg = d3.select("#globe").append("svg")
				  .attr("width", width)
				  .attr("height", height);
				  //.style("border-radius", 50%);

				//Adding water

				svg.append("path")
				  .datum({type: "Sphere"})
				  .attr("class", "water")
				  .attr("d", path);

				var countryTooltip = d3.select("#globeSunburstPage")
				      .append("div")
				      .attr("class", "countryTooltip")
				      .style("position", "absolute")
				      .style("z-index", "4")
				      .style("opacity", 0);

				var countryList = d3.select("#globe").append("select").attr("name", "countries");

				//get data?
				var q = queue()
				  //.defer(d3.json, "http://bl.ocks.org/d/5685937/world-110m.json")
				  .defer(d3.json, "http://codepen.io/JohannaG92/pen/yMVEzY.js")
				  //.defer(d3.tsv, "http://bl.ocks.org/d/5685937/world-110m-country-names.tsv")
				  .defer(d3.tsv, "http://codepen.io/JohannaG92/pen/gmLKGQ.js")
				  .await(ready);

				var globalWorld;
				var globalCountryData;
				var globalCountries;

				//Main function

				function ready(error, world, countryData) {
				  globalWorld = world;
				  globalCountryData = countryData;

				  var countryById = {},
				      countries = topojson.feature(world, world.objects.countries).features;
				  
				  globalCountries = countries;

				  //Adding countries to select

				  countryData.forEach(function(d) {
				    countryById[d.id] = d.name;
				    option = countryList.append("option");
				    option.text(d.name);
				    option.property("value", d.id);
				  });

				  //Dragging water on the globe
				  svg.selectAll("path.water")
				  .call(d3.behavior.drag()
				        .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
				        .on("drag", function() {
				          var rotate = projection.rotate();
				          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
				          svg.selectAll("path.land").attr("d", path);
				          svg.selectAll(".focused").classed("focused", focused = false);
				        })
				      );

				  var world = svg.selectAll("path.land")
				    .data(countries)
				    .enter().append("path")
				    .attr("class", "land")
				    .attr("d", path)

				  //Drag event

				  .call(d3.behavior.drag()
				        .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
				        .on("drag", function() {
				          var rotate = projection.rotate();
				          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
				          svg.selectAll("path.land").attr("d", path);
				          svg.selectAll(".focused").classed("focused", focused = false);
				        }))
				  
				  //Mouse events
				    .on("click", function(d) {
				    //up3(d.id);
				    console.log(clicked);
				      clicked(countryById[d.id]);
				      up2(d);

				      console.log(countryById[d.id]);
				      //alert(globalCountries[0][0]);
				      //alert(globalCountries[d.id]);
				      //alert(d.id);
				    })

				  .on("mouseover", function(d) {
				    var country = '<span class="country">' + countryById[d.id]
				                    + '</span>'
				    countryTooltip.html(country);

				    countryTooltip.transition()
				      .duration(25)
				      .style("opacity", 1.0);
				  })
				  .on("mouseleave", function(d) {
				    countryTooltip.style("opacity", 0);
				  })
				  .on("mousemove", function(d) {
				    countryTooltip
				      .style("top", (d3.event.pageY-30)+"px")
				      .style("left", (d3.event.pageX+20)+"px");
				  });

				  //Country focus on option select
				  // Här sätter man en listener som körs när man byter land
				  d3.select("select").on("change", function() {
				    up2(-1);  
				  });
				  
				  function up2(n) {
				  
					  //var t = d3.select("select");
					  var t = document.getElementsByTagName("select")[0];
					    
					  var rotate = projection.rotate();
					  var focusedCountry; 
					  if (n === -1) {
					    focusedCountry = country(globalCountries, t);
					  } else {
					    focusedCountry = n;
					    d3.selectAll("select").property("value", n.id);
					  }
					  p = d3.geo.centroid(focusedCountry);
					 
					    
					  svg.selectAll(".focused").classed("focused", focused = false);
					  //Globe rotating

					  (function transition() {
					    d3.transition()
					      .duration(2500)
					      .tween("rotate", function() {
					      var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
					      return function(t) {
					        projection.rotate(r(t));
					        svg.selectAll("path").attr("d", path)
					          .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
					        };
					      })
				    })();
				  };
				 
				  function country(cnt, sel) { 
				    for(var i = 0, l = cnt.length; i < l; i++) {
				      if(cnt[i].id == sel.value) {return cnt[i];}
				    }
				  };
				};
				// Här slutar ready

				function up3(n) { 
				  //var t = d3.select("select");
				  //var t = document.getElementsByTagName("select")[0];
				  var rotate = projection.rotate(),
				      fs = country2(globalCountries, n),
				      p = d3.geo.centroid(fs);
				      //focusedCountry = countries[20]
				      //p = d3.geo.centroid(focusedCountry);
				  svg.selectAll(".focused").classed("focused", focused = false);

				  //Globe rotating

				  (function transition() {
				    d3.transition()
				      .duration(2500)
				      .tween("rotate", function() {
				      var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
				      return function(t) {
				        projection.rotate(r(t));
				        svg.selectAll("path").attr("d", path)
				          .classed("focused", function(d, i) { return d.id == fs.id ? focused = d : false; });
				        };
				      })
				    })();
				  };
				 
				function country2(cnt, n) {
				  var sel = document.getElementsByTagName("select")[0];
				  for(var i = 0, l = cnt.length; i < l; i++) {
				    if(cnt[i].id == sel.value) {return cnt[n];}
				  }
				};
			}
		});

	 }
	 
	 // Stash the old values for transition.
	function stash(d) {
	   d.x0 = d.x;
	   d.dx0 = d.dx;
	 }

	 function sunburstInit() {
	 	sunburstLoad(1950);
	 }

	sunburstInit();


});

////////////////////////////////// END SUNBURST //////////////////////////////////

////////////////////////////////// GLOBE //////////////////////////////////

