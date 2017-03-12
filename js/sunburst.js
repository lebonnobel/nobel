nobelApp.controller('sunburst', function(nobelService, worldBankService, $scope) {

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
	  "physics":  "#efa833", //#455C7C",
	  "literature": "#826a84", //#826A84",
	  "medicine": "#ef7a65", //#A86D6D",
	  "economics": "#faf775", //#D89F71",
	  "chemistry": "#a86d6d", //#F9CE66",
	  "peace": "#d89f71", //#8FB588"
	};

	//global variables needed further down
	var node;
	var currentRoot;
	var vis;
	var partition;
	var arc;
	var counter = 0;
	var json;
	var path;

	// Global variables for functions that are outside of the ready-function
	// NOTE: These variables will not be set before the ready-function has run 
	var globalWorld;
	var globalCountryData;
	var globalCountries;
	var globalCodeToId;
	var globalById;
	var projection;
	var globepath;
	var svg;
	var q;
	var countryList;
	var countryTooltip;
	var countryById = {};
	var countries;
	var world;

	//loads json file & add attributes etc to the path (sunburst piece)
	function sunburstLoad (year) {
		nobelService.getNobelDataForSunburst(year, false, function(json) {
			chartOn = true;
			
			//$scope.nobelData = nobelService.getNobelDataForSunburst(2017,);
			$scope.$apply();

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

			//json = nobelService.getNobelDataForSunburst(year, false);
			//console.log("json", json);
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

		    //globe specific variables
		    var globeWidth = 378,
		    	globeHeight = 378,
		    	sens = 0.25,
		    	focused;
		    //will only load globe once as the data should be the same
			function globeViz () {
				//Setting projection
				projection = d3.geo.orthographic()
				  .scale(187)
				  .rotate([0, 0])
				  .translate([globeWidth / 2, globeHeight / 2])
				  .clipAngle(90);

				globepath = d3.geo.path()
				  .projection(projection);

				//SVG container
				svg = d3.select("#globe").append("svg")
				  .attr("width", globeWidth)
				  .attr("height", globeHeight);
				  //.style("border-radius", 50%);

				//Adding water
				svg.append("path")
				  .datum({type: "Sphere"})
				  .attr("class", "water")
				  .attr("d", globepath);

				countryTooltip = d3.select("#globeSunburst")
				      .append("div")
				      .attr("class", "countryTooltip")
				      .style("position", "absolute")
				      .style("z-index", "4")
				      .style("opacity", 0);

				countryList = d3.select("#globe").append("select").attr("name", "countries").style("visibility", "hidden");

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
					

				// CALL FROM GLOBE TO SUNBURST
				function updateSunburst(COUNTRYCODE) {
				  // Här får Maria kalla på sin sunburst
				}
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
				svg.selectAll("path.water")
				.call(d3.behavior.drag()
			        .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
			        .on("drag", function() {
			          var rotate = projection.rotate();
			          projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
			          svg.selectAll("path.land").attr("d", globepath);
			          svg.selectAll(".focused").classed("focused", focused = false);
			        })
			      );

				world = svg.selectAll("path.land")
					.data(countries)
					.enter().append("path")
					.attr("class", "land")
					.attr("d", globepath)

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
			        	svg.selectAll("path.land").attr("d", globepath);
			        	svg.selectAll(".focused").classed("focused", focused = false);
			        }))
			  
				//Mouse events
				.on("click", globeClick)
				.on("mouseover", globeMouseover)
				.on("mouseleave", globeMouseleave)
				.on("mousemove", globeMousemove);	
			} 
			
			function globeClick(d) {
					//clicked(countryById[d.id]);
					//mouseover(countryById[d.id]);
					if (id2Code(d.id) != -1){
						var ID = id2Code(d.id)
						var data = path[0];

		    			for (i=0; i < data.length; i++){
		    				var search = data[i];
		    				//console.log("search-__data_iid", search.__data__.countryId);
		    				if(search.__data__.countryId) {
		    					
		    					var country = search.__data__.countryId;
		    					//console.log("IF", country);
		    					//console.log("d", d);
		    					if(country == ID){
		    						//console.log("country = d", search.__data__.parent);
		    						thisParent = search.__data__.parent;
		    						currentRoot = thisParent.parent;
		    						node = thisParent.parent;
		    				}
		    			}
		    		}

					path.transition()
						.duration(4000)
						.attrTween("d", arcTweenData);
					}
					

					privateUpdateMap(d);
			}

			function globeMouseover(d) {
				var country = '<span class="country">' + countryById[d.id]
			                    + '</span>'
				countryTooltip.html(country);

				countryTooltip.transition()
			    	.duration(25)
			    	.style("opacity", 1.0);
			}

			function globeMouseleave(d) {
				countryTooltip.style("opacity", 0);
			}

			function globeMousemove(d) {
				countryTooltip
					.style("top", (d3.event.pageY-30)+"px")
					.style("left", (d3.event.pageX+20)+"px");
			}

			//Country focus on option select
			// Här sätter man en listener som körs när man byter land
			d3.select("select").on("change", function() {
				privateUpdateMap(-1);  
			});
				
			function code2Id(inputCode) {
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
			  var i = -1;
			  globalCodeToId.forEach(function(d){
			    if (d.id === inputId) {
			      i = d.code;
			      console.log("i", i);
			    }
			  });
			  return i;
			}

			// This function is a copy of country()
			function country2(cnt, n) {
			  var sel = document.getElementsByTagName("select")[0];
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
			    var t = document.getElementsByTagName("select")[0];
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
			    //updateSunburst(id2Code(focusedCountry.id));
			      
			    svg.selectAll(".focused").classed("focused", focused = false);
			    //Globe rotating
			    (function transition() {
			      d3.transition()
			        .duration(2500)
			        .tween("rotate", function() {
			        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
			        return function(t) {
			          projection.rotate(r(t));
			          svg.selectAll("path").attr("d", globepath)
			            .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
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
					  
				d3.selectAll("select").property("value", n);   // Making the country selected in the selection after clicking

				var rotate = projection.rotate(),
					fs = country2(globalCountries, n),
					p = d3.geo.centroid(fs);
				
				if(fs != undefined){
					svg.selectAll(".focused").classed("focused", focused = false);

					// Globe rotating
					(function transition() {
						d3.transition()
							.duration(2500)
							.tween("rotate", function() {
								var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
								return function(t) {
									projection.rotate(r(t));
									svg.selectAll("path").attr("d", globepath)
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

		    //sets tooltip variablef for showing name of piece in sunburst
		    var tooltip = d3.select("#globeSunburst")
			    .append("div")
			    .attr("class", "tooltip")
			    .style("opacity", 0);
			
			function mouseover(d) {
				if (typeof(d) == "string"){
		    		var data = path[0];
		    		for (i=0; i < data.length; i++){
		    			var search = data[i];
		    			if(search.__data__.countryId) {
		    				var country = search.__data__.countryId;
		    				if(country === d){
		    					d = search.__data__;
		    					highlight(d);
		    				}
		    			}
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

		    	function highlight(d) {
					var relatives = getRelatives(d);

					//Fade all paths
					d3.select("#sunburst")
						.selectAll("path")
							.style("opacity", 0.5);
					
					//if (relatives.indexOf(d)>=0){console.log("d", relatives.indexOf(d))};

					//Highlight chosen piece and relatives (parent paths)
					vis.selectAll("path")
						.filter(function(d) {
							//console.log("d in filter", d);
							return (relatives.indexOf(d) >= 0);
						})
		    			.style("opacity", 1.0);

		    	}

				function tooltipShow(d) {
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

				//console.log("path", relativesPath);
				return relativesPath;
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
		    		//here the winner info div will be called to show itself!
		    		//it is not possible to rearrange the sunburst if the clicked path is a winner
		    		//(ie. does not have any children)
		    		return;
		    	} else {
		    		currentRoot = d;
		    		node = d;
		    		upDateFromSunburst(node.countryId);
		    	}


		    	//makes the transition smooth (changing the levels)
		    	path.transition()
		    		.duration(1000)
		    		.attrTween("d", arcTweenData);
			}
			if (counter < 1) {
				counter += 1;
				globeViz();
			}
		
		});
	}

   	var chartOn = false;
	
	function slider() {
		formatDate = d3.time.format("%Y");
		var margin = {top: 50, right: 50, bottom: 50, left: 50}
		var width = 960 - margin.left - margin.right,
			height = 300 - margin.bottom - margin.top;

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

		var svg = d3.select('#timeslide').append('svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", width + margin.top + margin.bottom)
			.append("g")
			//classic transform to position g
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("g")
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

		var slider = svg.append("g")
			.attr("class", "slider")
			.call(brush);

		slider.selectAll(".extent, .resize")
			.remove();

		slider.select(".background")
			.attr("height", height);

		var handle = slider.append("g")
			.attr("class", "handle");

		handle.append("path")
			.attr("transform", "translate(0," + height / 2 + ")")
			.attr("d", "M 0 -20 V 20")

		handle.append("text")
			.text(startingValue)
			.attr("transform", "translate(" + (-18) + "," + (height / 2 - 25) + ")")

		slider
			.call(brush.event)

		function brushed() {
			var value = brush.extent()[0];

			if (d3.event.sourceEvent) {
				value = timeScale.invert(d3.mouse(this)[0]);
				brush.extent([value, value]);
			}

			handle.attr("transform", "translate(" + timeScale(value) + ", 0");
			handle.select("text").text(formatDate(value));
			updatePage(parseInt(formatDate(value)));
			updateCountryColors(parseInt(formatDate(value)));
		}
	}

	function updatePage(year) {
		if (chartOn === false) {
			sunburstInit();
		} else {
			document.getElementById("sunburst").innerHTML = "";
			//document.getElementById("globe").innerHTML = "";
			d3.select('#sunburst').selectAll("*").remove();
			//d3.select('#globe').selectAll("*").remove();
			vis = "";
			arc = "";
			partition = "";
			json = "";
			path = "";

			sunburstLoad(year);
		}	
	}

	function updateCountryColors(year){
		worldBankService.getDataForGlobe('mean-years-in-school', year, function(data){
	 	var world = svg.selectAll("path.land")
	 	.style("fill", function(d) {
	 		var max = d3.max(data, function(d){ return d.value; });    // Max antal years in school
	 		var color = null;
	 		var sc = d3.scale.linear().range(['red','green']).domain([0, max]);
	 		for (var i = 0; i < data.length; i++) {
	 			if (globalById[d.id] == data[i].name){   // Om landet matchar/finns med i datat
	 		  		color = sc(data[i].value);    // Räkna ut färg här
	 		  		//color = "red";
	 			}
	 		}
 			if (color === null){
	 			color = "gray"; // Om det inte finns någon data
	 		}
	 		return color;
	     })
		})
	}
  

	// Stash the old values for transition.
	function stash(d) {
	   d.x0 = d.x;
	   d.dx0 = d.dx;
	}

	function sunburstInit() {
		sunburstLoad(2016);
	}

	//calls slider function which in turn calls for the sunburst page to update
	function timesliderInit() {
		slider();
	}

	timesliderInit();

});

////////////////////////////////// END SUNBURST //////////////////////////////////


