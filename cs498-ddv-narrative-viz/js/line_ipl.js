
function change(id) {
    d3.selectAll("path")
        .style("stroke-width",'2px');
    d3.select("path#"+id)
        .style("stroke-width",'5px');
}



var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 630 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%m/%Y").parse,
    bisectDate = d3.bisector(function(d) { return d.Year; }).left,
    formatValue = d3.format(","),
    dateFormatter = d3.time.format("%m/%d/%y");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
// .rangeRound([height - margin.top - margin.bottom, 0])
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(12)
    .innerTickSize(15)
    .outerTickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(function(d) { return d ;})
    .ticks(10)
    // .innerTickSize(15)
    //.outerTickSize(0)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) {  return x(d.date); })
    .y(function(d) { return y(d.price); });


var svg = d3.select("#line_ipl_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/ipl.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

    data.forEach(function(d) {
        d.Year = parseDate(d.Year);
    });

    var companies = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {date: d.Year, price: +d[name]};
            })
        };
    });


    x.domain(d3.extent(data, function(d) { return d.Year; }));

    //y.domain(d3.extent(companies, function(d,i) {  return d.values[i].price; }));
    y.domain([
        d3.min(companies, function(c) { return d3.min(c.values, function(v) { return v.price; }); }),
        d3.max(companies, function(c) { return d3.max(c.values, function(v) { return v.price; }); })
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Win Percentage");


    svg.append("line")
        .attr(
            {
                "class":"horizontalGrid",
                "x1" : 0,
                "x2" : width,
                "y1" : y(0),
                "y2" : y(0),
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "black",
                "stroke-width" : "1px",
                "stroke-dasharray": ("3, 3")
            });

    // ==== LEFT ====== //
    var annotations = [
        {
            "cx": 400,
            "cy": 291,
            "r": 69,
            "text": "Team Chennai snd Rajasthan suspended during this period",
            "textWidth": 70,
            "textOffset": [
                100,
                10
            ]
        }
    ];

    const makeAnnotations = d3.annotation().annotations(annotations)

    var company = svg.selectAll(".company")
        .data(companies)
        .enter().append("g")
        .attr("class", "company");




    var path = svg.selectAll(".company").append("path")
        .attr("class", "line")
        .attr("d", function(d) { console.log(d); return line(d.values); })

        .style("stroke", function(d,i) { return color(i);
        }).attr('id',function(d){ return d.name; })
        .on("mouseover", function() {  tooltip.style("display", null);  })
        .on("mouseout", function() {   tooltip.style("display", "none"); })
        .on("mousemove", mousemove);




    //var totalLength = path.node().getTotalLength();
    /*
    console.log(path);
    console.log(path.node());
    console.log(path[0][0]);
    console.log(path[0][1]);
    */
    var totalLength = [path[0][0].getTotalLength(), path[0][1].getTotalLength(),path[0][2].getTotalLength(),path[0][3].getTotalLength(),path[0][4].getTotalLength()];

    //  console.log(totalLength);


    d3.select(path[0][0])
        .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] )
        .attr("stroke-dashoffset", totalLength[0])
        .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    d3.select(path[0][1])
        .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
        .attr("stroke-dashoffset", totalLength[1])
        .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);


    d3.select(path[0][2])
        .attr("stroke-dasharray", totalLength[2] + " " + totalLength[2] )
        .attr("stroke-dashoffset", totalLength[2])
        .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    d3.select(path[0][3])
        .attr("stroke-dasharray", totalLength[3] + " " + totalLength[3] )
        .attr("stroke-dashoffset", totalLength[3])
        .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
    d3.select(path[0][4])
        .attr("stroke-dasharray", totalLength[4] + " " + totalLength[4] )
        .attr("stroke-dashoffset", totalLength[4])
        .transition()
        .duration(5000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);


    var ringNote = d3.ringNote()
        .draggable(false);

    svg.append("g")
        .attr("class", "annotations")
        .call(ringNote, annotations);

    var tooltip = d3.select("#line_ipl_chart").append("div")
        .attr("class", "tooltip")
        .style("display", "none");

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 5);


    var tooltipPercentage = tooltip.append("div")
        .attr("class", "tooltip-team");

    var tooltipName = tooltip.append("div");
    tooltipName.append("span")
        .attr("class", "tooltip-title")
        .text("Win %: ");

    var tooltipNameValue = tooltipName.append("span")
        .attr("class", "tooltip-win");
    // width=50;
    //height=50;
    /*  svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); tooltip.style("display", null);  })
          .on("mouseout", function() { focus.style("display", "none"); tooltip.style("display", "none"); })
          .on("mousemove", mousemove);*/


    function mousemove() {
        //console.log(data)
        // console.log(d3.mouse(this))
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;

        var date = new Date(d.Year);
        var year = date.getFullYear()

        var name = d3.select(this).attr("id")

        //focus.attr("transform", "translate(" + x(d.Year) + "," + y(d[name]) + ")");
        focus.attr("transform", "translate(" + d3.mouse(this)[0] + "," + d3.mouse(this)[1] + ")");
        //focus.style("display", null);
        tooltip.attr("style", "left:" + (x(d.Year) + 64) + "px;top:" + y(d[name]) + "px;");
        tooltip.attr("data-html", "true")
        tooltip.select(".tooltip-team").text("Team: "+ name+""+"Year: "+year);
        tooltip.select(".tooltip-win").text(formatValue(d[name]))
        tooltip.style("display", null);
        // tooltip.attr("x",10+d3.mouse(this)[0] +"px")
        //tooltip.attr("y",10+d3.mouse(this)[1] +"px")
    }



});