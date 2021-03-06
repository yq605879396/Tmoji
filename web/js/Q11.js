// set the dimensions and margin_11s of the graph
var margin_11 = {top: 100, right: 0, bottom: 100, left: 0},
    width_11 = 760 - margin_11.left - margin_11.right,
    height_11 = 760 - margin_11.top - margin_11.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width_11, height_11) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
var svg_11 = d3.select("#try11")
  .append("svg")
    .attr("width", width_11 + margin_11.left + margin_11.right)
    .attr("height", height_11 + margin_11.top + margin_11.bottom)
  .append("g")
    .attr("transform", "translate(" + (width_11 / 2 + margin_11.left) + "," + (height_11 / 2 + margin_11.top) + ")");
var color = d3.scaleOrdinal(d3.quantize(d3.interpolateHcl("#FFAD05", "#1DA1F2"), 4));

d3.csv("https://raw.githubusercontent.com/Tmoji-Team/Tmoji/master/web/test_data/Q11_test.csv", function(data) {


  extent_value = d3.extent(data, d => d.value)

  // Scales
  var x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(function(d) { return d.Country; })); // The domain of the X axis is the list of states.
  var y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 20]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg_11.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
      //.attr("fill", "#1da1f2")
      .attr("fill", d =>color(d.Country.replace(/ .*/, "")))
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return y(d['Value']); })
          .startAngle(function(d) { return x(d.Country); })
          .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))


  // Add the labels
  svg_11.append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Value'])+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.Country)})
        .attr("transform", function(d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "20px")
        .attr("alignment-baseline", "middle")

});

