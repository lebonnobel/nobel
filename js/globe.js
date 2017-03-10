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