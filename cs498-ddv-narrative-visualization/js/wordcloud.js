d3.csv('data/cwurData2015.csv').then(function(data) { // v5

    var h = 490;
    var w = 600;

    var random = d3.randomIrwinHall(2);
    var countMax = d3.max(data, function(d){ return d.world_rank} );
    var sizeScale = d3.scaleLinear().domain([0, countMax]).range([1, 100])
    var words = data.map(function(d) {
        return {
            text: d.institution,
            size: sizeScale(Math.abs(d.world_rank-1000)/5)
        };

    });
    // var words = wordsAll.slice(1,100)
    console.log(words);
    d3.layout.cloud().size([w, h])
        .words(words)
        //    .rotate(function() { return Math.round(1-random()) *90; }) /
        .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();


    // wordcloud
    function draw(words) {
        d3.select('#wordcloud')
            .append("svg")
            .attr("class", "ui fluid image") // style using semantic ui
            .attr("viewBox", "0 0 " + w + " " + h )  // ViewBox : x, y, width, height
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return d3.schemeCategory10[ i % 10]; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }

});
