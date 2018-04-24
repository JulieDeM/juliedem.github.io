var width = window.innerWidth,
    height = window.innerHeight,
    centered,
    clicked_point;

var projection = d3.geoMercator()
    .translate([width / 2.2, height / 1.5]);

var plane_path = d3.geoPath()
        .projection(projection);

var svg = d3.select("#worldmap").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

var g = svg.append("g");
var path = d3.geoPath()
    .projection(projection);

// load and display the World
d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries)
          .features)
      .enter()
      .append("path")
      .attr("d", path)
      ;
 });

 // color country
function colorCountry(country) {
    if (visited_countries.includes(country.id)) {
        // hack to discolor ehtiopia
        if (country.id == '-99' & country.geometry.coordinates[0][0][0] != 20.590405904059054){
            return '#e7d8ad'
        } else {
            return '#c8b98d';
        };
    } else {
        return '#e7d8ad';
    }
};

g.selectAll('path')
    .attr('fill', colorCountry);

    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries)
          .features)
      .enter()
      .append("path")
      .attr("d", path)
      .on("click", clicked) //adding the click action

      //clicked
function clicked(d) {
      var x, y, k;
      //if not centered into that country and clicked country in visited countries
      if ((d && centered !== d) & (visited_countries.includes(d.id))) {
        var centroid = path.centroid(d); //get center of country
        var bounds = path.bounds(d); //get bounds of country
        var dx = bounds[1][0] - bounds[0][0], //get bounding box
            dy = bounds[1][1] - bounds[0][1];
        //get transformation values
        x = (bounds[0][0] + bounds[1][0]) / 2;
        y = (bounds[0][1] + bounds[1][1]) / 2;
        k = Math.min(width / dx, height / dy);
        centered = d;
      } else {
        //else reset to world view
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
      }
      //set class of country to .active
      g.selectAll("path")
       .classed("active", centered && function(d) { return d === centered; })


      // make contours thinner before zoom for smoothness
      if (centered !== null){
        g.selectAll("path")
         .style("stroke-width", (0.75 / k) + "px");
      }

      // map transition
      g.transition()
        //.style("stroke-width", (0.75 / k) + "px")
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .on('end', function() {
            if (centered === null){
              g.selectAll("path")
               .style("stroke-width", (0.75 / k) + "px");
      }
        });
}
