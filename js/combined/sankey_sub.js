async function get_TF (data_link, margin) {
    console.log("get_TF called");
    const dataset = await d3.json(data_link);
    const num_nodes = dataset["nodes"].length
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
