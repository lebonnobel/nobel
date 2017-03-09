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
		"Australia": "#29374a" , //Purple
		"North America": "#4e3f4f", //Blue
		"South America": "#644141", //Cyan
		"Asia": "#815f43", //Teal
		"Africa": "#957b3d", //Amber
		"Europe": "#556c51" //Deep Orange
	};

	//below color variables returns a color in a predefined domain for countries belonging to the different continents
	var AustraliaColor = d3.scale.linear()
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
	  "Physics":  "#455C7C",//"#B2DFDB", //"#A5D6A7", //Green
	  "Literature": "#826A84",//"#26A69A", //"#E6EE9C", //Lime
	  "Medicine": "#A86D6D",//"#004D40", //"#B3E5FC", //Light Blue
	  "Economics": "#D89F71",//"#CDDC39", //"#B0BEC5", //Blue Grey
	  "Chemistry": "#F9CE66",//"#81C784", //"#F06292", //Pink
	  "Peace": "#8FB588"//"#AFB42B"//"#E57373" //Red
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

	//loads json file & add attributes etc to the path (sunburst piece)
	d3.json("flare1.json", function(json) {
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
		       		if (category === "Physics") {
		       			return categoryColors["Physics"];
		       		} else if (category === "Literature") {
		       			return categoryColors["Literature"];
		       		} else if (category === "Medicine") {
		       			return categoryColors["Medicine"];
		       		} else if (category === "Economics") {
		       			return categoryColors["Economics"];
		       		} else if (category === "Chemistry") {
		       			return categoryColors["Chemistry"];
		       		} else if (category === "Peace") {
		       			return categoryColors["Peace"];
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
		    			} else if (continent === "Australia") {
		    				return colorPicker("Australia");
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
		    			} else if(parent === "Australia") {
		    				return AustraliaColor(Math.floor(Math.random()*10));
		    			}
		    		}
		    	}
		    })
			.on("click", click)
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
	       	.each(stash);

	    d3.select("#container").on("mouseleave", mouseleave);

	    //sets the current root to the current data
	    currentRoot = path.data;

	    //sets tooltip variablef for showing name of piece in sunburst
	    var tooltip = d3.select("#globeSunburstPage")
		    .append("div")
		    .attr("class", "tooltip")
		    .style("position", "absolute")
		    .style("z-index", "4")
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
	    		.duration(50)
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
	    function click(d) {
	    	//makes it possible to click the already clicked level to go back to previous state
	    	if(d === currentRoot && d.parent) {
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
	    	}
	    	//makes the transition smooth (changing the levels)
	    	path.transition()
	    		.duration(1000)
	    		.attrTween("d", arcTweenData);
		}

	 });
	 
	 // Stash the old values for transition.
	 function stash(d) {
	   d.x0 = d.x;
	   d.dx0 = d.dx;
	 }

////////////////////////////////// END SUNBURST //////////////////////////////////

////////////////////////////////// GLOBE //////////////////////////////////

