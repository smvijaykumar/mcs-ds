// The SVG Element
var barchart_width  =   1200;
var barchart_height =   800;

// Creating projections
var projection = d3.geoMercator()
    .scale( 1)
    .translate([barchart_width, barchart_height ]);

var path = d3.geoPath(projection);

var color =
d3.scaleQuantile()
    .domain([1,1000])
    .range(d3.schemeCategory10
    );
    //d3.scaleQuantize().range([
    //'rgb(255,205,210)', 'rgb(239,154,154)', 'rgb(229,115,115)', 'rgb(239,83,80)',
    //'rgb(244,67,54)', 'rgb(229,57,53)', 'rgb(211,47,47)', 'rgb(198,40,40)']);

var svg = d3.select( '#barchart' )
    .append( 'svg' )
    .attr( 'width', barchart_width )
    .attr( 'height', barchart_height );

var zoom_map = d3.zoom()
    .scaleExtent([ 0.5, 3.0 ])
    .translateExtent([
        [ -1200, -800 ],
        [ 1200, 800 ]
    ]).on('zoom', function(){
        console.log(d3.event);

        var original_coordinates = [
            d3.event.transform.x,
            d3.event.transform.y
        ];

        var scale = d3.event.transform.k * 100;
        projection.translate(original_coordinates).scale(scale);
        svg.selectAll('path')
            .transition()
            .attr('d', path);

        svg.selectAll('circle')
            .transition()
            .attr('cx', function(d){
                return projection([d.Longitude,d.Latitude])[0];
            })
            .attr('cy', function(d){
                return projection([d.Longitude,d.Latitude])[1];
            });
    });

var my_map = svg.append('g')
    .attr('id', 'my_map')
    .call(zoom_map)
    .call(zoom_map.transform, d3.zoomIdentity
        .translate( barchart_width / 2, barchart_height/1.5)
        .scale(1.75));

my_map.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', barchart_width)
    .attr('height', barchart_height)
    .attr('opacity', 0);

// Data
d3.csv('data/uv_geo_new.csv').then(function(fires_data) {
    color.domain([0,1000]);

    var geo_data = d3.json('data/data.json').then(function(countries_data){
        countries_data.features.forEach(function (countries_e, countries_i){
            fires_data.forEach(function(fires_e, fires_i){
                if (countries_e.properties.name !== fires_e.Country) {
                    return null;
                }
                countries_data.features[countries_i].properties.num = parseFloat(fires_e.world_rank);
            });
        });

        my_map.selectAll('path')
            .data(countries_data.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', function(d){
                var num = d.properties.num ;
                return num ? color (num) : color(2);
            })
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
        add_univ(geo_data);
    });

});

function add_univ(geo_data) {
    d3.csv('data/uv_geo_new.csv').then(function(univ_data){
     my_map.selectAll('circle')
            .data(univ_data)
            .enter()
            .append('circle')
            .attr('fill', 'red')
            .attr('opacity', '0.5')
            .attr('cx', function(d){
                //console.log(projection([d.Longitude,d.Latitude]))
                return projection([d.Longitude,d.Latitude])[0];
            })
            .attr('cy', function(d){
                return projection([d.Longitude,d.Latitude])[1];
            })
            .attr('r', function(d){
                return 3;
            })
            .append('title')
            .text(function(d){
                return d.institution;
            });
    });
}

d3.selectAll('#buttons button').on('click', function(){
    var x           =   0;
    var y           =   0;
    //var original_coordinates = projection.translate();

    var distance = 10;

    var direction = d3.select(this).attr('class').replace( 'panning ', '' );

    if (direction === "left") {
        x -=distance;
    } else if (direction === "right") {
        x +=distance;
    } else if (direction === "up") {
        y -=distance;
    } else if (direction === "down") {
        y +=distance;
    }

    my_map.transition()
        .call( zoom_map.translateBy, x, y );
});

d3.selectAll( '#buttons button.zooming' ).on( 'click', function(){
    var scale       =   1;
    var direction   =   d3.select(this).attr("class").replace( 'zooming ', '' );

    if( direction === "in" ){
        scale       =  1.25;
    }else if(direction === "out"){
        scale       =  0.75;
    }

    my_map.transition()
        .call(zoom_map.scaleBy, scale);
});


