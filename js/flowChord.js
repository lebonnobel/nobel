/*
 * d3 elements (https://bitbucket.org/artstr/d3elements.git)
 * Copyright 2014 Artana Pty Ltd
 * Licensed under MIT (https://bitbucket.org/artstr/d3elements/src/master/LICENSE)
 */
/* global d3: true */
//
// flowChord
//
// A reusable d3 element
// Approach based on http://bost.ocks.org/mike/chart/
// 
// Requires a matrix of flows (an array of arrays).
// Assumes the rows and columns represent different concepts
// The matrix should have row and column headers, which are taken as the labels for the arcs.
// Rows appear on the right, columns on the left of the circle, with the flows
// shown connecting them.  (Use .flip() to transpose the rows and columns.)
// Hovering dims other flows, and optionally shows a popup with provided html.
// Eg.:
//
//  var chordDiagram = d3.elts.flowChord(); // append options eg. .width(500).flip() etc - see getters and setters list at end
//  var data = [['Eye colour','Introvert','Extrovert'],['Brown eyes', 0.8, 0.2],['Blue eyes', 0.4, 0.6],['Green eyes', 0.66, 0.34]];
//  d3.select("body").datum(data).call(chordDiagram);
//
// TODO: allow colors of rows and columns to be set separately
//       change hoverHtml structure (currently keyed off the labels) in case rows and columns have the same label
//
var chordOld;
var chordDiagram;

var d3 = (function (d3) {
  'use strict';
  // requires d3
  // adds d3.elts.flowChord

  function fakeAnimate(oldThing,newData) {
    var element = d3.select("#flow");
    var t = 0;
      var id = setInterval(frame, 1);
      function frame() {
          if (t == 20) {
             clearInterval(id);
          } else {
              t++; 
              element[0][0].innerHTML = "";
              element.datum(mergeData(oldThing,newData,Math.sqrt(Math.sqrt(t/20)))).call(chordDiagram); 

          }
      }


  }

  function mergeData(oldThing,newThing,t) {
    var merge = [];
    merge[0] = oldThing[0];
    for (var row in oldThing) {
      if (row > 0) {
      	merge[row] = [];
    	merge[row][0] = oldThing[row][0];
        for (var value in oldThing[row]) {
          if (value > 0) {merge[row][value] = ((1-t)*oldThing[row][value]) + (t*newThing[row][value]);}
      }}
    }
    return merge
  }

  function reDrawChord(d,i,datas) {
    var selected = 0;
    if (i < datas.length -1) {
      selected = datas[i+1][0];
      var newData = newData1(i+1,datas);
    }
    else {
      selected = datas[0][i-datas.length +2];
      var newData = newData2(i-datas.length +2,datas);
    }
    return newData;
  }

  function newData1(i,datas) {
    var newData = transposes(transposes(datas));
    for (var line in newData){
      if (line > 0 && line != i) {
        for (var thing in newData[line]){
          if (thing > 0) {
            newData[line][thing] = 0;
          }
        }
      }
    }
    return newData;
  }

  function newData2(i,datas) {
    var newData = transposes(datas);
    for (var line in newData){
      if (line > 0 && line != i) {
        for (var thing in newData[line]){
          if (thing > 0) {
            newData[line][thing] = 0;
          }
        }
      }
    }
    return transposes(newData);
  }

  function transposes(A) {
    return A[0].map(function(col, i) { 
      return A.map(function(row) { 
        return row[i];
      });
    });
  }

  function flowHover(d,oldData) {
    var sum = 0;
    for (var item in oldData) {
      if (item !=0) {
        sum += oldData[item][d.target.index -oldData.length+2]
      }
    }
    return sum;
  } 

  function flowChord() {
    // call this using selection.call(flowChord); (or just flowChord())
    var width = screen.width * 0.73, //3000,
      height = screen.height *0.73, //1750,
      margin = {top: width*0.1, right: width*0.1, bottom: width*0.1, left: width*0.1}, // leaves room for labels
      arcPadding = 0,
      leftDepth = 0,
      leftIndex = 0,
      rightIndex = 0,
      rightDepth = 0,
      flip = null,  // append .flip() to transpose the matrix
      hoverFadeOpacity = 0.2,
      colors = d3.scale.category10(),
      rimWidth = function(outerRadius) {return outerRadius*0.1}, // or use a constant
      hoverHtml = {}, // an object keyed off the row and column labels
      hoverOffset = {top: 60, left: 50},
      svgClass = "chord-diagram",
      hoverClass = "chord-hover",
        minAngleForLabel = 0;

    function transpose(A) {
      return A[0].map(function(col, i) { 
        return A.map(function(row) { 
          return row[i];
        });
      });
    }

    function expandedMatrix(A) {
      // given an n x m matrix A, convert to an (n+m) x (n+m) matrix
      // with A in the top right corner and A.transpose in the bottom left corner
      var n = A.length,
          m = A[0].length;
      var big = [];
      for (var i = 0; i < n+m; i++) {
        var row = [];
        for (var j = 0; j < n+m; j++) {
          if ((j>=n) && (i<n)) { 
            row.push(A[i][j-n]); 
          } else {
            if ((j<n) && (i>=n)) { 
              row.push(A[j][i-n]);
            } else {
              row.push(0); 
            }
          }
        }
        big.push(row);
      }
      return big;
    }

    // Returns an event handler for fading a given chord group.
    function fade(svg, opacity) {
      return function(g, i) {
        svg.selectAll(".flows path")
            .filter(function(d) {
              return d.source.index !== i && d.target.index !== i; })
          .transition()
            .style("opacity", opacity);
      };
    }

    function fade2(svg, opacity) {
      return function(g, i) {
        svg.selectAll(".flows path")
            .filter(function(d) {
              return g.source.index !== d.source.index || g.target.index !== d.target.index; })
          .transition()
            .style("opacity", opacity);
      };
    }

    function showHover (hoverDiv, d, label, thing) {
      var html = hoverHtml[label];
      if (!html) {
        if (thing == 0) {html = label + "<br></br>" + "Number of Awards: " +Math.round(d.value);}
        else {html = thing;}
      }
      hoverDiv
        .html(html)
        .style("top", function () { 
          return Math.min((d3.event.pageY - hoverOffset.top), Math.max(5,window.innerHeight-hoverDiv[0][0].offsetHeight))+"px";
        })
        .style("left", function () { 
          return (d3.event.pageX + (d.angle > Math.PI ? -hoverDiv[0][0].offsetWidth-hoverOffset.left : hoverOffset.left))+"px";
        }) 
        .style("visibility", "visible")
        .style("opacity", 1e-6)
        .transition()
          .style("opacity", 1);
    }

    function hideHover (hoverDiv) {
      hoverDiv
        .transition()
          .style("opacity", 1e-6);
          //.style("visibility", "hidden");
    }


    function chart(selection) {
      selection.each(function(data) {
        // generates chart, using width & height etc; 'data' is the data and 'this' is the element
        if (flip) {
          data = transpose(data);
        }
        // take off the labels
        var oldD;
        var chordData = data;
        var subMatrix = data.slice(1).map(function(row) { return row.slice(1).map(function(elt) { return +elt }); });
        var colLabels = data[0].slice(1);
        var rowLabels = data.slice(1).map(function(row) { return row[0] });
        var labelText = rowLabels.concat(colLabels); // TODO: check
        var flowMatrix = expandedMatrix(subMatrix);
        var chord = d3.layout.chord()
          .padding(arcPadding)
          .sortChords(d3.descending)
          .matrix(flowMatrix);

        var outerRadius = (Math.min(width-margin.left-margin.right, height-margin.top-margin.bottom)/2);
        // Note d3.functor allows for constants or functions
        //  - see https://github.com/mbostock/d3/wiki/Internals#functor
        var innerRadius = outerRadius - d3.functor(rimWidth)(outerRadius);
        
        // Make the hover svg element if needed
        var hoverDiv = d3.select(this).selectAll("div."+hoverClass).data(["TBD"]);
        hoverDiv.enter().append("div").attr("class",hoverClass);

        // Select the svg element, if it exists.
        var svg = d3.select(this).selectAll("svg."+svgClass).data([data]);

        // Otherwise, create the svg and the g which translates the chord diagram properly.
        var gEnter = svg.enter()
                .append("svg").attr("class",svgClass)
                  .append("g");
        gEnter.append("g").attr("class", "rim");
        gEnter.append("g").attr("class", "labels");
        gEnter.append("g").attr("class", "flows");

        svg .attr("width", width)
          .attr("height", height);

        // Update the location
        svg.select("g")
          .attr("transform", "translate("+(width+margin.left-margin.right)/2+","+(height+margin.top-margin.bottom)/2+")");

        var rim = svg.select("g.rim")
          .selectAll("path")
          .data(chord.groups);
        rim.enter().append("path");
        rim.style("fill", function(d) { return colors(d.index); })
          .style("stroke", function(d) { return colors(d.index); })
          .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
          .on("mouseover", function(d,i) {showHover(hoverDiv, d, labelText[d.index],0); return fade(svg, hoverFadeOpacity)(d,i)})
          .on("click", function(d,i) {
            if (i < data.length -1) {
              rightIndex = i;
              if (rightDepth == 1) {
                if (leftDepth ==1) {
                  var theNewData = reDrawChord(d,leftIndex,chordOld);
                }
                else {
                  var theNewData = chordOld;
                }
                rightDepth = 0;
              }
              else {
                if (leftDepth ==1) {
                  var theNewData = reDrawChord(d,i,chordData);
                }
                else {
                  var theNewData = reDrawChord(d,i,chordData);
                  chordOld = chordData;
                }
                rightDepth = 1;
              }
            }
            else {
              leftIndex = i;
              if (leftDepth == 1) {
                if (rightDepth ==1) {
                  var theNewData = reDrawChord(d,rightIndex,chordOld);
                }
                else {
                  var theNewData = chordOld;
                }
                leftDepth = 0;
              }
              else {
                if (rightDepth ==1) {
                  var theNewData = reDrawChord(d,i,chordData);
                }
                else {
                  var theNewData = reDrawChord(d,i,chordData);
                  chordOld = chordData;
                }
                leftDepth = 1;
              }
            }
            fakeAnimate(data,theNewData);            
          })
          .on("mouseout", function(d,i) {hideHover(hoverDiv); return fade(svg, 1)(d,i)});

        rim.exit()
            .transition()
              .duration(1500)
              .attr("opacity", 0)
              .remove();



        var labels = svg.select("g.labels")
          .selectAll("text")
          .data(chord.groups);
        labels.enter().append("text");
        labels.attr("class", "labels")
          .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
            "translate(" + (outerRadius + 6) + ")" +
            (d.angle > Math.PI ? "rotate(180)" : "");
          })
          .attr("class", function(d) {return d.index<rowLabels.length ? "row" : "column"})
          .text(function(d) { if ((d.endAngle-d.startAngle)>minAngleForLabel) return labelText[d.index]; }); 

        var flows = svg.select("g.flows")
          .selectAll("path")
          .data(chord.chords);
        flows.enter().append("path");
        flows.attr("d", d3.svg.chord().radius(innerRadius))
          .style("fill", function(d) { return colors(d.target.index); })
          .style("opacity", 1)
          .style("border","10px solid black")
          .on("mouseover",function(d,i){
            showHover(hoverDiv, d, labelText[d.index],labelText[d.source.index] + " have recieved: " + d.source.value +" of " + flowHover(d,chordOld) + " prices in " +labelText[d.target.index]);
            return fade2(svg, hoverFadeOpacity)(d,i);//i+data.length-1
          })
          .on("mouseout", function(d,i) {hideHover(hoverDiv); return fade2(svg, 1)(d,i)});
      });
    }

    // getters and setters

    chart.oldD = function(oldData){
      chart.old = oldData;
    }

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };

    chart.arcPadding = function(_) {
      if (!arguments.length) return arcPadding;
      arcPadding = _;
      return chart;
    };

    chart.rimWidth = function(_) {
      if (!arguments.length) return rimWidth;
      rimWidth = _;
      return chart;
    };

    chart.colors = function(_) {
      if (!arguments.length) return colors;
      colors = _;
      return chart;
    };

    chart.flip = function() {
      // include chart.flip() to transpose the data before plotting
      flip = true;
      return chart;
    };

    chart.minAngleForLabel = function(_) {
      if (!arguments.length) return minAngleForLabel;
      minAngleForLabel = _;
      return chart;
    };

    chart.hoverFadeOpacity = function(_) {
      if (!arguments.length) return hoverFadeOpacity;
      hoverFadeOpacity = _;
      return chart;
    };

    chart.hoverHtml = function(_) {
      if (!arguments.length) return hoverHtml;
      hoverHtml = _;
      return chart;
    };

    chart.hoverOffset = function(_) {
      if (!arguments.length) return hoverOffset;
      hoverOffset = _;
      return chart;
    };

    chart.svgClass = function(_) {
      if (!arguments.length) return svgClass;
      svgClass = _;
      return chart;
    };

    chart.hoverClass = function(_) {
      if (!arguments.length) return hoverClass;
      hoverClass = _;
      return chart;
    };

    return chart;
  }

  // attach to d3.elts
  if (typeof d3.elts==="undefined") {
    d3.elts = {};
  }
  d3.elts.flowChord = flowChord;
  return d3;

}(d3));

