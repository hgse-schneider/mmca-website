async function get_TF (data_link, margin) {
    console.log("get_TF called");

    const dataset = await d3.json("../../data/sankey_data/layers.json");
    const num_nodes = dataset["nodes"].length;
    console.log(dataset.links)
    if(num_nodes <= 63) {
        return 900 - margin.top - margin.bottom
    } else {
        return 1500 - margin.top - margin.bottom 
    }
}

async function force_layout(data_link) {
    d3.select(".container").html('');
    console.log("force_layout called");
    const margin = {top: 30, right: 80, bottom: 5, left: 5}
    const width =  890 - margin.left - margin.right

    const height = await get_TF(data_link, margin)

    const colorScale  = d3.scaleOrdinal() 
        .domain(["Color_1", "Color_2", "Color_3", "Color_4", "Color_5", "Color_6", "Parent_color"])
        .range(['#ffbfff','#a3ffab','#ffcba6', '#feffc0', '#ffd4dc', '#b5ffff', '#f5f2f2'])

    function drag(simulation) {
    
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }
    
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
 
    const simulation = d3.forceSimulation()
    .force("link", d3.forceLink() // This force provides links between nodes
                    .id(d => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
                    .distance(100)) 
    .force("charge", d3.forceManyBody().strength(-4000)) // This adds repulsion (if it's negative) between nodes. 
    .force("center", d3.forceCenter(window.innerWidth / 2, height / 2))

    const svg = d3.select('.container').append("svg")
        .attr("width", window.innerWidth)
        .attr("height", height)
        .attr("id", "force-layout-diagram")
        .append("g")
        .attr("transform", `translate(${margin.left - 40},${margin.top - 20})`)
 
    svg.append('defs').append('marker')
        .attr("id", "arrowhead")
        .attr("markerUnits","userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        // .attr("refX",32) 
        // .attr("refY", -1)
        .attr('refX',32) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
        .attr('refY',0)
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .attr("stroke-width",2)
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr('fill','rgb(104, 104, 104)');
    //create some data

    d3.json(data_link) .then(function(dataset){
            // Initialize the links
            const link = svg.selectAll(".links")
                .data(dataset.links)
                .enter()
                .append("line")
                .attr('class', 'links')
                .style("stroke", "rgb(104, 104, 104)")
                // .style("stroke-dasharray", d => {return d.linetype})
                .style("stroke-width", d => {return d.linelevel})
                .attr('marker-end','url(#arrowhead)') 
            link.append("title")
                .text(d => d.linelevel);

            const node = svg.selectAll(".nodes")
                .data(dataset.nodes)
                .enter()
                .append("g") 
                .attr("class", "nodes")
                .call(drag(simulation))
                .append("a")
                .on('click', function(i, d) {
                if(d.url != "parent"){
                    window.open(
                        "https://scholar.google.com/scholar?hl=en&q=" + d.url,
                        '_blank' 
                    );
                } else {
                    sankey_chart(0, 100)
                }})
                .style("cursor", "pointer"); 

            node.append("rect")
                .attr("height", 22)//+ d.runtime/20 )
                .attr("y", -10)
                .attr("x", -15 - 8)
                .style("fill", function(d){
                    if(d.url == "parent") {
                        return colorScale("Parent_color")
                    }
                    
                    // let color_dict = data["color_dict"]
                    // let lowercase_dict = []
                    // for (const [key, value] of Object.entries(color_dict)) {
                    //     lowercase_dict[key.toLowerCase()] = value
                    // }
                    // let d_name = d.name.toLowerCase()
                    // let color_type = lowercase_dict[d_name]
   
                    // if(color_type == undefined) {
                    //     console.log("Undefined: " + d_name)
                    // }
                    else {
                        // console.log(color_dict[d.name])
                        // TODO: Fix one color for all nodes
                        return colorScale("Color_1")
                    }
                })
            node.append("text")
                .attr("dy", 4)
                .attr("dx", -15)
                .text(d => d.name)
            node.append("title")
                .text(d => d.name);
            node.selectAll('rect')
                .attr("rx", 6)
                .attr("ry", 6)
                .attr("width", function(d) {return this.parentNode.getBBox().width + 15;})            

            //Listen for tick events to render the nodes as they update in your Canvas or SVG.
            simulation
                .nodes(dataset.nodes)
                .on("tick", ticked);
            simulation.force("link")
                .links(dataset.links);
            // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                node
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("cx", function(d) { return d.x = Math.max(this.parentNode.getBBox().width, Math.min(window.innerWidth - this.parentNode.getBBox().width, d.x)); })
                .attr("cy", function(d) { return d.y = Math.max(22, Math.min(height - 22, d.y)); })
                
            }
    })
}


function treeData (data_link) {
    console.log("tree data called");
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
                .attr("id",'arrowhead2')
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
            .attr('marker-end','url(#arrowhead2)')

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
            .style("cursor", "pointer")
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

            node.append("rect")
            .attr("y", "-11")
            .attr("x", 13)
            .attr("height", 22)//+ d.runtime/20 )
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
            .call(wrap, 480)

            node.selectAll('rect')
            .style("cursor", "pointer")
            .style("fill", "transparent")
            .attr("width", function(d) {return this.parentNode.getBBox().width;})
        }})
}


function wrap(text, width) {
    console.log("wrap called");
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
                const test = line.join(" ");
                console.log("tspan contents here:")
                console.log(test);
                tspan.text(line.join(" "));
                line = [word];
                console.log(line.join(" "));               
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y + 3)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(line.join(" "))
            }
        }
    });
}


function circle_text_wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0,
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" ").trim());
                prev_length = tspan.node().getComputedTextLength()
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .attr("dx", prev_length ? -prev_length - 3  : 0)
                            .text(word);
            }
        }
    });
}