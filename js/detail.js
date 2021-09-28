function treeData (data_link) {
    // set the dimensions and margins of the diagram
    var margin = {top: 40, right: 570, bottom: 40, left: 570},
    width = 300,
    height = 150 - margin.top - margin.bottom;
    
    var treemap = d3.tree()
        .size([height, width]);

    d3.json(data_link).then(function(treeData) {
        for (let z = 0; z < treeData["data"].length; z++) {

            //  assigns the data to a hierarchy using parent-child relationships
            var nodes = d3.hierarchy(treeData["data"][z], function(d) {
                return d.children;
            });

            // maps the node data to the tree layout
            nodes = treemap(nodes);

            // append the svg object to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select(".detail").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append('defs').append('marker')
                    .attr("id",'arrowhead')
                    .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
                    .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
                    .attr('refY',0)
                    .attr('orient','auto')
                    .attr('markerWidth',10)
                    .attr('markerHeight',10)
                    .attr('xoverflow','visible')
                    .append('svg:path')
                    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                    .attr('fill', '#000')
                    .style('stroke','none')

            // adds the links between the nodes
            var link = g.selectAll(".link")
            .data( nodes.descendants().slice(1))
            .enter().append("path")
                .attr("class", "link")
                .attr("d", function(d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
                })
            .attr('marker-end','url(#arrowhead)')

            // adds each node as a group
            var node = g.selectAll(".node")
                .data(nodes.descendants())
            .enter().append("g")
                .attr("class", function(d) { 
                return "node" + 
                    (d.children ? " node--internal" : " node--leaf"); })
                .attr("transform", function(d) { 
                return "translate(" + d.y + "," + d.x + ")"; });

            // adds the circle to the node
            node.append("circle")
            .attr("r", 7);

            // adds the text to the node
            node.append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) { return d.children ? -13 : 13; })
            .style("text-anchor", function(d) { 
                return d.children ? "end" : "start"; })
            .style("font-size", 8)
            .text(function(d) { return d.data.name; })
        }})
}