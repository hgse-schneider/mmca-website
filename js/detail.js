function treeData (data_link) {
    d3.json(data_link).then(function(treeData) {
        for (let z = 0; z < treeData["data"].length; z++) { 
            var margin = {top: 0, right: 570, bottom: 0, left: 570},
                width = 300,
                height = 180;

            var _data = treeData["data"][z]

            if (_data.children.length >= 5) {
                margin = {top: 0, right: 570, bottom: 0, left: 570},
                width = 300,
                height = 280; 
            } else if (_data.children.length == 1) {
                width = 300,
                height = 60;
            } else if (_data.children.length < 5) {
                width = 300,
                height = 115;
            }

            var treemap = d3.tree()
                .size([height, width]);

            //  assigns the data to a hierarchy using parent-child relationships
            var nodes = d3.hierarchy(_data, function(d) {
                return d.children;
            });

            // maps the node data to the tree layout
            nodes = treemap(nodes);

            // append the svg object to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select(".detail").append("svg")
                .attr("id", "detail-diagram")
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
                return "translate(" + d.y + "," + d.x + ")"; })

            // adds the circle to the node
            node.append("circle")
            .attr("r", 7)
            .on('click', function(event, d) {
                let url = d.data.link
                if(url != undefined) {
                    window.open(
                        "https://scholar.google.com/scholar?hl=en&q=" + url,
                        '_blank' 
                    );
                }
            })

            // adds the text to the node
            node.append("text")
            .attr("dy", ".36em")
            .attr("x", function(d) { return d.children ? -13 : 13; })
            .style("text-anchor", function(d) { 
                return d.children ? "end" : "start"; })
            .style("font-size", 12)
            .text(function(d) { return d.data.name; })
            .call(wrap, 480);
        }})
}


function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y + 3)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word)
            }
        }
    });
}