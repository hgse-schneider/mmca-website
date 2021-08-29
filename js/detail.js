var margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    },
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) {
        return [d.y, d.x];
    });

var line = d3.svg.line()
    .x(function(d) {
        return d.y;
    })
    .y(function(d) {
        return d.x;
    });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



root = treeData[0];

update(root);

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
        d.y = d.depth * 180;
    });

    // Declare the nodesâ€¦
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeEnter.append("circle")
        .attr("r", 40)
        .style("fill", "#ff9900");



    // append icon inside circle
    nodeEnter.append("image")
        .attr("xlink:href", "http://localhost/d3/user2.jpg")
        .attr("x", "-18px")
        .attr("y", "-18px")
        .attr("width", "35px")
        .attr("height", "35px");


    nodeEnter.append("text")
        .attr("x", function(d) {
            return d.children || d._children ? -40 : -50;
        })
        .attr("y", function(d) {
            return d.children || d._children ? 55 : 55;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "start" : "start";
        })
        .text(function(d) {
            return d.name;
        })
        .style("fill-opacity", 1);

    // Declare the linksâ€¦
    var link = svg.selectAll("path.link")
        .data(links, function(d) {
            return d.target.id;
        });

    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link-1")
        .attr("d", function(d) { return line([d.source, d.target])});
}
