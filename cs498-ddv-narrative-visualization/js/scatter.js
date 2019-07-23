
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 860 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/uv_tuition.csv").then( function(data) {

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 10])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // text label for the x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Sector");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([500, 80000])
        .range([ height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y).tickValues([0,5000,10000,20000,40000,60000,75000]).tickFormat(d3.format("d")));
    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Tuition($)");



    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("#my_dataviz")
         .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("width","500px")


    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function(d) {
        tooltip
            .html("Name of the Institution: <b>" + d.Institution +"</b><br>State: <b>"+d.State+"</b> <br> Tuition: $ <b>" + d.Tuition +"</b><br> Sector Name: <b>" + d.Sector_name +"</b>")
       // .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        //.style("top",  (d3.mouse(this)[1])+ "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add dots
    svg.append('g')
        .selectAll("circle")
        .data(data) // the .filter part is just to keep a few dots on the chart, not all of them
        .enter()
        .append("circle")
        .attr("cx", function (d) {  return x(d.Sector); } )
        .attr("cy", function (d) {  return y(d.Tuition); } )
        .attr("r", 7)
        .style("fill", "blue")
        .style("opacity", 0.5)
        .style("stroke", "white")
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )

})

