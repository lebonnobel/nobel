nobelApp.controller('sunburst', function(wikipediaService, worldBankService, nobelService, yearService, prizeService, $scope) {

	$scope.$on('reloadSunburst', function(event, data) {
		updatePage(data.year);
	});

	$scope.$on('reverseGlobeColours', function(event, data) {
		reverseUpdateCountryColors();
	});

	$scope.$on('updateCountryColors', function(event, data) {
		updateCountryColors(data.year, data.dataset)
	})

	//global variables needed further down
	var node;
	var currentRoot;
	var vis;
	var partition;
	var arc;
	var counter = 0;
	var json;
	var path;
	var tooltip;
	var tooltioContent;

	// Global variables for functions that are outside of the ready-function
	// NOTE: These variables will not be set before the ready-function has run 
	var globalWorld;
	var globalCountryData;
	var globalCountries;
	var globalCodeToId;
	var globalById;
	var projection;
	var globepath;
	var globeSvg;
	var q;
	var countryList;
	var countryTooltip;
	var countryTooltipContent;
	var countryById = {};
	var countries;
	var world;
	var worldClick = false;
	var countryClicked;

	//sets up the intial variables
	// width is relative to window size instead of screen size
	var screenSize = window.innerWidth;
	var width = screenSize * 0.43, //960
	    height =  width,//750,
	    radius = Math.min(width, height) / 2,
	    x = d3.scale.linear()
	    	.range([0, 2 * Math.PI]),
	    y = d3.scale.sqrt()
	    	.range([0, radius]);

	//predefined colors for continents
	var colors = {
		"Oceania": "#84acad" , 
		"North America": "#79acb2", 
		"South America": "#7e9ea8",
		"Asia": "#80969b", 
		"Africa": "#8fa8a6", 
		"Europe": "#99bcbc" 
	};

	var countryColorList = {};

	function colorGenerator(continent, country) {
		var color;
		if(!countryColorList[country]){
			color = continentColors(continent);
			countryColorList[country] = color;
		} else {
			color = countryColorList[country];
		}
		return color;
	}

	//perhaps unnecessary atm, but returns predefined colors for the different continents
	function colorPicker (country) {
		return colors[String(country)];
	}

	//generates colors for countries, depending on which continent they belong to
	function continentColors(continent) {
		var color;
		if (continent === "Oceania") {
			var colors = d3.scale.linear()
				.domain([1, 9])
				.range(["#557f6b", "#95d0c0"])
				.interpolate(d3.interpolateHcl);
			color = colors(Math.floor(Math.random()*10)); 
		} else if (continent === "North America") {
			var colors = d3.scale.linear()
				.domain([1, 9])
				.range(["#578675", "#90c6bb"])
				.interpolate(d3.interpolateHcl);
				color = colors(Math.floor(Math.random()*10));
		} else if (continent === "South America"){
			var colors = d3.scale.linear()
				.domain([1, 9])
				.range(["#568468", "#a1d0bb"])
				.interpolate(d3.interpolateHcl);
				color = colors(Math.floor(Math.random()*10));
		} else if (continent === "Asia") {
			var colors = d3.scale.linear()
				.domain([1, 9])
				.range(["#517361", "#90d1bc"])
				.interpolate(d3.interpolateHcl);
				color = colors(Math.floor(Math.random()*10));
		} else if (continent === "Africa") {
			var colors = d3.scale.linear()
				.domain([1, 9])
				.range(["#6d9879", "#a9d3bb"])
				.interpolate(d3.interpolateHcl);
				color = colors(Math.floor(Math.random()*10));
		} else if (continent === "Europe") {
			var colors = d3.scale.linear()
				.domain([1, 9])
				.range(["#648b77", "#a3d8c5"])
				.interpolate(d3.interpolateHcl);
				color = colors(Math.floor(Math.random()*10));
		}
		return color;
	}

	//the predefined colors of the different prize categories
	var categoryColors = {
	  "physics":  "#455C7C", //#455C7C",
	  "literature": "#826A84", //#826A84",
	  "medicine": "#A86D6D", //#A86D6D",
	  "economics": "#D89F71", //#D89F71",
	  "chemistry": "#F9CE66", //#F9CE66",
	  "peace": "#8FB588", //#8FB588"
	};

	//loads json file & add attributes etc to the path (sunburst piece)
	function sunburstLoad (year) {
		nobelService.getNobelDataForSunburst(year, false, $scope.catChoices, function(json) {
			chartOn = true;
			
			//$scope.nobelData = nobelService.getNobelDataForSunburst(2017,);
			//$scope.$apply();

			//sets up the svg canvas where sunburst is placed
			vis = d3.select("#sunburst").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .append("g")
			    .attr("id", "container")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
			
			partition = d3.layout.partition()
			    .sort(null)
			    .value(function(d) { return 1; });

			//determines the angles and radius of the levels and pieces
			arc = d3.svg.arc()
				.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
				.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
				.innerRadius(function(d) { return Math.max(0, y(d.y)); })
				.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

			path = vis.datum(json).selectAll("path")
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
			    				return colorGenerator("Africa", d["country"]);
			    			} else if(parent === "North America") {
			    				return colorGenerator("North America", d["country"]);
			    			} else if(parent === "South America") {
			    				return colorGenerator("South America", d["country"]);
			    			} else if(parent === "Europe") {
			    				return colorGenerator("Europe", d["country"]);
			    			} else if(parent === "Asia") {
			    				return colorGenerator("Asia", d["country"]);
			    			} else if(parent === "Oceania") {
			    				return colorGenerator("Oceania", d["country"]);
			    			}
			    		}
			    	}
			    })
				.on("click", clicked)
				.on("mouseover", mouseover)
				.on("mousemove", mousemove)
		       	.each(stash);

		    //globe specific variables
		    var globeWidth = width * 0.51, //378,
		    	globeHeight = globeWidth, //378,
		    	sens = 0.25,
		    	focused;
		    //will only load globe once as the data should be the same
			function globeViz () {
				//Setting projection
				projection = d3.geo.orthographic()
				  .scale(width * 0.25) //187
				  .rotate([0, 0])
				  .translate([globeWidth / 2, globeHeight / 2])
				  .clipAngle(90);

				globepath = d3.geo.path()
				  .projection(projection);

				//SVG container
				globeSvg = d3.select("#globe").append("svg")
				  .attr("width", globeWidth)
				  .attr("height", globeHeight);
				  //.style("border-radius", 50%);

				//Adding water
				globeSvg.append("path")
				  .datum({type: "Sphere"})
				  .attr("class", "water")
				  .attr("d", globepath);

				countryTooltip = d3.select("#globeSunburst")
				      .append("div")
				      .attr("class", "countryTooltip")
				      .style("opacity", 0);

				countryList = d3.select("#selectCountryDiv").append("select")
					.attr("name", "countries")
					.attr("class","countryChoice")
					.attr("id", "selectCountry");

				d3.selectAll("#selectCountry").on("change", function() {
					privateUpdateMap(-1);  
				});


				//get data?
				q = queue()
				  .defer(d3.json, "https://codepen.io/JohannaG92/pen/KWmZZv.js")
				  .defer(d3.tsv, "https://codepen.io/JohannaG92/pen/xqdppQ.js")
				  //.defer(d3.json, "http://codepen.io/JohannaG92/pen/VpbZBW.js")       // World bank data
				  //.defer(d3.json, "http://codepen.io/JohannaG92/pen/RpVxQw.js")   // World bank data
				  .defer(d3.json, "https://codepen.io/JohannaG92/pen/ZeKvrx.js")     // World bank data
				  .defer(d3.json, "https://codepen.io/JohannaG92/pen/LWyeQv.js")     // Code to id jsonfile 
				  .await(ready);

				// Här slutar ready

				// Returns the id of the country code 
				// Input: inputCode, format: "SE"
				// Output: c, number				
			}

			//Main globe function
			function ready(error, world, countryData, schoolData, countryCodeToId) {
			 	globalWorld = world;
			 	globalCountryData = countryData;
			 	globalCodeToId = countryCodeToId;
			 	
			   	countries = topojson.feature(world, world.objects.countries).features;
			  
				globalCountries = countries;

				//Adding countries to select
				var count = 0;
				var youthData = schoolData[1];

				// Adding the countries to the select list
				
				countryData.forEach(function(d) {
				    countryById[d.id] = d.name;
				    option = countryList.append("option");
				    option.text(d.name);
				    option.property("value", d.id);
				});

				globalById = countryById;

				//Dragging water on the globe
				globeSvg.selectAll("path.water")
					.call(d3.behavior.drag()
				        .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
				        .on("drag", function() {
				          var rotate = projection.rotate();
				          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
				          globeSvg.selectAll("path.land").attr("d", globepath);
				          globeSvg.selectAll(".focused").classed("focused", focused = false);
				        })
			      	);

				world = globeSvg.selectAll("path.land")
					.data(countries)
					.enter().append("path")
					.attr("class", "land")
					.attr("d", globepath)
					.style("fill", getGlobeColor)
					.classed("nonWinners", function(d) {
					    var out = true;
					    countryCodeToId.forEach(function(e) {
					      if (d.id === e.id) {
					        out = false;
					      }
					    })
					    return out;
					})

					//Drag event
					.call(d3.behavior.drag()
				    	.origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
				    	.on("drag", function() {
				        	var rotate = projection.rotate();
				        	projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
				        	globeSvg.selectAll("path.land").attr("d", globepath);
				        	globeSvg.selectAll(".focused").classed("focused", focused = false);
				        })
				    )
			  
					//Mouse events
					.on("click", globeClick)
					.on("mouseover", globeMouseover)
					.on("mouseleave", globeMouseleave)
					.on("mousemove", globeMousemove);	
			} 
			
			function globeClick(d) {
					if (!worldClick) {
						worldClick = true; 
						countryClicked = this; 

						d3.select(this.parentNode.appendChild(this)).transition().duration(100)
							.style({'stroke-opacity': 1, 'stroke': '#616161', 'stroke-width': 2});
					
					} else if (worldClick) {
						d3.select(countryClicked.parentNode.appendChild(countryClicked)).transition().duration(100)
							.style({'stroke-opacity': 1, 'stroke': 'white', 'stroke-width': 0.5});
						
						countryClicked = this;
						d3.select(this.parentNode.appendChild(this)).transition().duration(100)
							.style({'stroke-opacity': 1, 'stroke': '#616161', 'stroke-width': 2});
					}

					//checks if clicked country on map has ID, if so, below runs
					var found;
					if (id2Code(d.id) != -1){
						found = false;
						var ID = id2Code(d.id)
						
						thisData = getCountryData(ID);
						if (thisData) {
							thisParent = thisData.parent;
							currentRoot = thisParent.parent;
							node = thisParent.parent;
			    			found = true;

			    			countryClick(thisData);
						}

		    			if (!found) {
		    				currentRoot = json;
		    				node = json;
		    			}

			    		//fixes the hover on the sunburst to the selected country
						path.transition()
							.duration(4000)
							.attrTween("d", arcTweenData);
					} 
					//calls function to rotate to and highlight clicked country
					privateUpdateMap(d);
			}

			function globeMouseover(d) {
				//makes border even all around country
				d3.select(this.parentNode.appendChild(this)).transition().duration(100)
					.style({'stroke-opacity': 1, 'stroke': '#616161', 'stroke-width': 2});
				
				/*var country = ($scope.$parent.chosenWBD != undefined || $scope.$parent.chosenWBD != '') ? 
				'<span class="country">' + countryById[d.id] + '<br>' + $scope.$parent.chosenWBD + ': 1' + '</span>' :
				'<span class="country">' + countryById[d.id] + '</span>';*/
				
				countryTooltipContent = '<span class="country">' + countryById[d.id] + '</span>';

				countryTooltip.html(countryTooltipContent);

				countryTooltip.transition()
			    	.duration(1)
			    	.style("opacity", 1.0);
			}

			function globeMouseleave(d) {
				//if the country the mouse is leaving is not the currently clicked, the following if will run
				if (this != countryClicked) {
					d3.select(this).transition().duration(100)
						.style({'stroke-opacity': 1, 'stroke': 'white', 'stroke-width': 0.5})
				}
				
				//d3.select('#globeSunburst').selectAll("countryTooltip").remove();
				countryTooltip.style("opacity", 0);
			}

			function globeMousemove(d) {
				countryTooltip
					.style("top", (d3.event.pageY-15)+"px")
					.style("left", (d3.event.pageX+15)+"px");
			}

			//removes hover/select on country
			d3.selectAll("#selectCountry").on("change", function() {
				privateUpdateMap(-1);  
			});

				
			function code2Id(inputCode) {
				//takes country code and turns to numerical id
				  var number = null;
				  globalCodeToId.forEach(function(d){
				    if (d.code === inputCode) {
				      number = d.id;
				    }
				  });
				  return number;
			}

			// Returns the country code from id
			// Input: inputId, a number
			// Output: i, format: "SE"
			function id2Code(inputId) {
			//takes the country id and turns it to country code to be mapped to sunburst data
			  var i = -1;
			  globalCodeToId.forEach(function(d){
			    if (d.id === inputId) {
			      i = d.code;
			    }
			  });
			  return i;
			}

			// This function is a copy of country()
			function country2(cnt, n) {
			  var sel = $('select.countryChoice')[0];
			  for(var i = 0, l = cnt.length; i < l; i++) {
			    if(cnt[i].id == n) {return cnt[i];}
			  }
			}
		  
			// ---- UPDATE FUNCTION ----
			// Input: n, the id of the country
			// The function rotates the map and selects the country
			// If n == -1 the call comes from the selection list
			function privateUpdateMap(n) {
			    // Getting the selection tag
			    var t = $('select.countryChoice')[0];
			    var rotate = projection.rotate();
			    var focusedCountry; 

			    // If the call comes from selection list, we have to check which country is selected in the selection list
			    if (n === -1) {
			      focusedCountry = country(globalCountries, t);
			    } 
			    // If the call comes from a click, then n.id is the correct id
			    else {
			      focusedCountry = n;
			      d3.selectAll("select").property("value", n.id);   // Making the country selected in the selection after clicking
			    }
			    p = d3.geo.centroid(focusedCountry);

			    //Updating the sunburst after globe selection
			    mouseover(id2Code(focusedCountry.id));
			      
			    globeSvg.selectAll(".focused").classed("focused", focused = false);
			    //Globe rotating
			    (function transition() {
			      d3.transition()
			        .duration(2500)
			        .tween("rotate", function() {
			        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
			        return function(t) {
			          projection.rotate(r(t));
			          globeSvg.selectAll("path").attr("d", globepath)
			            .classed("focused", function(d, i) {return d.id == focusedCountry.id ? focused = d : false; });
			          };
			        })
			    })
			    ();
		  	}
							 
			function country(cnt, sel) { 
				for(var i = 0, l = cnt.length; i < l; i++) {
					if(cnt[i].id == sel.value) {return cnt[i];}
				}
			}

			// CALL FROM SUNBURST TO THE GLOBE
			function upDateFromSunburst(COUNTRYCODE) {
				n = code2Id(COUNTRYCODE);
					  
				d3.selectAll("select.countryChoice").property("value", n);   // Making the country selected in the selection after clicking

				var rotate = projection.rotate(),
					fs = country2(globalCountries, n),
					p = d3.geo.centroid(fs);

				//projection.rotate(r(t));
				if(fs != undefined){
					globeSvg.selectAll(".focused").classed("focused", focused = false);

					// Globe rotating
					(function transition() {
						d3.transition()
							.duration(2500)
							.tween("rotate", function() {
								var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
								return function(t) {
									projection.rotate(r(t));
									globeSvg.selectAll("path").attr("d", globepath)
										.classed("focused", function(d, i) { return d.id == fs.id ? focused = d : false; });
								};
							})
					})
					();
				}
			}

		    d3.select("#container").on("mouseleave", mouseleave);
		    d3.select("#globeSunburst").on("mouseleave", mouseleave);

		    //sets the current root to the current data
		    currentRoot = path.data;

		    //sets tooltip variable for showing name of piece in sunburst
		    tooltip = d3.select("#globeSunburst")
			    .append("div")
			    .attr("class", "tooltip")
			    .style("opacity", 0);

			function getCountryData(countryId) {
				var data = path[0];
	    		for (i=0; i < data.length; i++){
	    			var search = data[i];
	    			if(search.__data__.countryId) {
	    				var country = search.__data__.countryId;
	    				if (country === countryId){
	    					return search.__data__;
	    				}
	    			}
	    		}

			}

			//mouseover on sunburst
			function mouseover(d) {
				if (typeof(d) == "string"){
					var countryData = getCountryData(d);
					if (countryData) {
						d = countryData;
						highlight(d);
					}

		    	} else {
		    		if (d == -1) {
		    			d3.select("#sunburst")
							.selectAll("path")
								.style("opacity", 1.0);
		    			return;
		    		}
		    		highlight(d);
		    		tooltipShow(d);
		    	}

		    	//highlights "trail" on sunburst
		    	function highlight(d) {
					var relatives = getRelatives(d);

					//Fade all paths
					d3.select("#sunburst")
						.selectAll("path")
							.style("opacity", 0.5);
					
					//Highlight chosen piece and relatives (parent paths)
					vis.selectAll("path")
						.filter(function(d) {
							return (relatives.indexOf(d) >= 0);
						})
		    			.style("opacity", 1.0);

		    	}

		    	//tooltip content
				function tooltipShow(d) {
			    	if (d["depth"] === 1) {
			    		tooltioContent = '<span class="continent">' + d["continent"]
			    		+ '</span>';
			    	} else if (d["depth"] === 2) {
			    		tooltioContent = '<span class="country">' + d["country"]
			    		+ '</span>';
			    	} else if (d["depth"] === 3) {
			    		tooltioContent = '<span class="winner"><strong>' + d["laureate"]
			    		+ '</strong></br>'+ d["category"]
			    		+ ', ' + d["prizeYear"]
			    		+ '</span>';
			    	}
			    	//calls tooltip to show content
			    	tooltip.html(tooltioContent);
			    	
			    	tooltip.transition()
			    		.duration(10)
		    			.style("opacity", 1.0);
				}	    	
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
				var relativesPath = [];
				var current = data;
				while (current.parent) {
					relativesPath.unshift(current);
					current = current.parent;
				}

				return relativesPath;
			}

		    function mousemove() {
		    	tooltip
		    		.style("top", (d3.event.pageY)+"px")
		    		.style("left", (d3.event.pageX)+"px");
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
		    				var country = search.__data__.country
		    				if(country === d){
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
		    		leafClick(d);
		    		//here the winner info div will be called to show itself!
		    		//it is not possible to rearrange the sunburst if the clicked path is a winner
		    		//(ie. does not have any children)
		    		return;
		    	} else {
		    		if (d.depth === 2) {
		    			countryClick(d);
		    		}
		    		currentRoot = d;
		    		node = d;
		    		upDateFromSunburst(node.countryId);
		    	}

		    	//makes the transition smooth (changing the levels)
		    	path.transition()
		    		.duration(1000)
		    		.attrTween("d", arcTweenData);
			}

			//makes sure globe setup is only loaded once
			if (counter < 1) {
				counter += 1;
				globeViz();
			}
		
		});
	}

   	var chartOn = false;
	
	//creates the time slider and updates sunburst accoringly.
	function slider() {
		formatDate = d3.time.format("%Y");
		var margin = {top: 30, right: 30, bottom: 30, left: 30}
		var width = 400,
			height = 80;

		//scale function
		var timeScale = d3.time.scale()
			.domain ([new Date('1901'), new Date('2017')])
			.range([0, width])
			.clamp(true);

		//initial value
		var startValue = timeScale(new Date('1920'));
			startingValue = new Date('1920');

		//defines brush
		var brush = d3.svg.brush()
			.x(timeScale)
			.extent([startingValue, startingValue])
			.on("brush", brushed);

		var sliderSvg = d3.select('#timeslide').append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			//classic transform to position g
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		sliderSvg.append("g")
			.attr("class", "x axis")
			//put in middle of screen
			.attr("transform", "translate(0," + height/2 + ")")
			//introduce axis
			.call(d3.svg.axis()
				.scale(timeScale)
				.orient("bottom")
				.tickFormat(function (d) {
					return formatDate(d);
				})
				.tickSize(0)
				.tickPadding(12)
				.tickValues([timeScale.domain()[0], timeScale.domain()[1]])
			)
			.select(".domain")
			.select(function() {
				return this.parentNode.appendChild(this.cloneNode(true));
			})
			.attr("class", "halo");

		var slider = sliderSvg.append("g")
			.attr("class", "slider")
			.call(brush);

		slider.selectAll(".extent, .resize")
			.remove();

		var ticks = d3.selectAll('.tick text')
			.style("font-size", "14px");

		slider.select(".background")
			.attr("height", height)
			.style("cursor", "pointer");

		var handle = slider.append("g")
			.attr("class", "handle");

		handle.append("path")
			.attr("transform", "translate(0," + height / 2 + ")")
			.attr("d", "M 0 -15 V 15")

		handle.append("text")
			.text(startingValue)
			.style("font-size", "14px")
			.attr("transform", "translate(" + (-18) + "," + (height / 2 - 20) + ")")

		slider
			.call(brush.event)

		function brushed() {
			var value = brush.extent()[0];

			if (d3.event.sourceEvent) {
				value = timeScale.invert(d3.mouse(this)[0]);
				brush.extent([value, value]);
			}

			handle.attr("transform", "translate(" + timeScale(value) + ", 0)");
			handle.select("text").text(formatDate(value));
			
			//calls functions to update data as slider has been moved to new year
			updatePage(parseInt(formatDate(value)));

			updateCountryColors(parseInt(formatDate(value)), $scope.$parent.chosenWBD);

			yearService.update(formatDate(value));
			$scope.$parent.safeApply();
			
		}
	}

	//function to get the land color
	function getGlobeColor() {
		var land = "#a9c099";
		return land;
	}

	//if user no longer wants to see specific data /education data, the earth colors are reversed.
	function reverseUpdateCountryColors() {
		globeSvg.selectAll("path.land")
			.style("fill", getGlobeColor);
	}

	//if user choses to see education data, then this runs
	function updateCountryColors(year, dataset){
		worldBankService.getDataForGlobe(dataset, year, function(data){
			if(globeSvg != undefined){
			var world = globeSvg.selectAll("path.land")
				.style("fill", function(d) {
					var max = d3.max(data, function(d){ return d.value; }); // Max antal years in school
					var color = "#cccccc";
					var sc = d3.scale.linear().range(['#e5d87f','#d65d3c']).domain([0, max]);
					for (var i = 0; i < data.length; i++) {
						if (globalById[d.id] == data[i].name){   // Om landet matchar/finns med i datat
							color = sc(data[i].value);    // Räkna ut färg här
						}

					}

					if (!color) {
						color = getGlobeColor();
					}
					return color;
			 	})	
			}
		})
	}

	//updates globe + sunburst svg with new data by calling sunburstLoad(year)
	function updatePage(year) {
		if (chartOn === false) {
			sunburstInit(year);
		} else {
			tooltip.style("opacity", 0);
			countryTooltip.style("opacity", 0);
			document.getElementById("sunburst").innerHTML = "";
			d3.select('#sunburst').selectAll("*").remove();
			vis = "";
			arc = "";
			partition = "";
			json = "";
			path = "";
			sunburstLoad(year);
		}	
	}

	// Stash the old values for transition.
	function stash(d) {
	   d.x0 = d.x;
	   d.dx0 = d.dx;
	}

	//starts the visualization with given year
	function sunburstInit(year) {
		sunburstLoad(year);
	}

	//calls slider function which in turn calls for the sunburst page to update
	function timesliderInit() {
		slider();
	}

	timesliderInit();

	//Fulkod för att fixa size
	$("#globeSunburst").css("width",width);
	$("#globeSunburst").css("height",height);
	$("#topbar").css("width",width);
	$("#topbar").css("height",width/50);
	//$("#sidebar").css("position","absolute");
	//$("#sidebar").css("left",width+50);
	//$("#sidebar").css("width",width*0.8);

	$("#laureateInfo, #info").hide();
	$("#countryInfo").hide();


	function leafClick(d){
		$("#laureateInfo, #info").show();
		$("#countryInfo").hide();
		$("#laureate_img").html("");
		wikipediaService.apiWikiSearch(d.laureate, "image", function(data){
			$("#laureate_img").html('<img src="'+data+'">');
			//$("#laureate_img").html('<img src="'+data+'">');
		});
		// First clear previous data
		$("#laureate_wiki").html("");
		wikipediaService.apiWikiSearch(d.laureate, "info", function(data){
			$("#laureate_wiki").html(data);
		});

		$("#laureate_gender").html(d.gender);
		$("#laureate_born").html(d.born);
		$("#laureate_name").html(d.laureate);
		$("#laureate_country").html(d.parent.country);
		$("#laureate_category").html(d.category);
		$("#laureate_year").html(d.prizeYear);
		if (d.motivation !== undefined) {
			$("#laureate_motivation").html(d.motivation);
		} else {
			$("#laureate_motivation").html("&nbsp;&mdash;");
		}
	}

	function countryClick(d){
		$("#laureateInfo").hide();
		$("#countryInfo, #info").show();
		document.getElementById('laureate_img').innerHTML = "";
		$("#laureate_name").html(d.country);
		prizeService.updatePrizes(d.children.length);
		prizeService.updateCountry(d.country);

		$scope.$emit('clickedCountrySunburst', {
			prizes: d.children.length,
			country: d.country
		});
	}

	// window.onresize = function(event) {
	//     screenSize = window.innerWidth;
	// 	width = screenSize * 0.5, //960
	//     height =  width,//750,
	//     radius = Math.min(width, height) / 2,
	//     x = d3.scale.linear()
	//     	.range([0, 2 * Math.PI]),
	//     y = d3.scale.sqrt()
	//     	.range([0, radius]);
	//     updatePage(yearService.year.label);

	//     //globe specific variables
 //    	globeWidth = width * 0.51; //378,
 //    	globeHeight = globeWidth; //378,
 //    	sens = 0.25;
 //    	var focused;
	//     //will only load globe once as the data should be the same
	// 	globeViz()
	// }

});

////////////////////////////////// END SUNBURST //////////////////////////////////


