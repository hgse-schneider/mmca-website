function force_layout(data_link) {
    const margin = {top: 30, right: 80, bottom: 5, left: 5}
    const width =  890 - margin.left - margin.right
    const height=  800 - margin.top - margin.bottom
    // const colorScale  = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
        // .domain(["Team A", "Team B", "Team C", "Team D", "Team E"])
        // .range(['#ff9e6d', '#86cbff', '#c2e5a0','#fff686','#9e79db'])
    const colorScale  = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
        .domain(["Team A"])
        .range(['#ffff99'])

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
    .force("charge", d3.forceManyBody().strength(-3000)) // This adds repulsion (if it's negative) between nodes. 
    .force("center", d3.forceCenter(window.innerWidth / 2, height / 2))


    const svg = d3.select('.diagram').append("svg")
        .attr("width", window.innerWidth)
        .attr("height", sankey_height + sankey_margin.top)
        .attr("id", "force-layout-diagram")
        .append("g")
        .attr("transform", `translate(${margin.left - 40},${margin.top - 20})`)
 

    //appending little triangles, path object, as arrowhead
    //The <defs> element is used to store graphical objects that will be used at a later time
    //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
    svg.append('defs').append('marker')
        .attr("id",'arrowhead')
        .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
        .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
        .attr('refY',0)
        .attr('orient','auto')
        .attr('markerWidth',7)
        .attr('markerHeight',7)
        // .attr('markerUnits', "userSpaceOnUse")
        .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
    //create some data

    d3.json(data_link)
    .then(function(dataset){
        // Initialize the links
        const link = svg.selectAll(".links")
            .data(dataset.links)
            .enter()
            .append("line")
            .attr('class', 'links')
            .style("stroke", "rgb(104, 104, 104)")
            .style("stroke-dasharray", d => {return d.linetype})
            .style("stroke-width", d => {return d.linelevel})
            .attr('marker-end','url(#arrowhead)') 
        link.append("title")
            .text(d => d.linelevel);
        const edgepaths = svg.selectAll(".edgepath") //make path go along with the link provide position for link labels
            .data(dataset.links)
            .enter()
            .append('path')
            .attr('class', 'edgepath')
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 0)
            .attr('id', function (d, i) {return 'edgepath' + i})
            .style("pointer-events", "none");
        const edgelabels = svg.selectAll(".edgelabel")
            .data(dataset.links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr('class', 'edgelabel')
            .attr('id', function (d, i) {return 'edgelabel' + i})
            .attr('font-size', 10)
            .attr('fill', '#aaa')
        edgelabels.append('textPath') //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(d => d.type);
        // Initialize the nodes
        const node = svg.selectAll(".nodes")
            .data(dataset.nodes)
            .enter()
            .append("g") 
            .attr("class", "nodes")
            .call(drag(simulation))
            .append("a")
            .on('click', function(i, d) {
                window.open(
                    "https://scholar.google.com/scholar?hl=en&q=" + d.url,
                    '_blank' 
                );
            });
            
        node.append("circle")
            .attr("r", d=> 20)//+ d.runtime/20 )
            .style("stroke", "grey")
            .style("stroke-opacity",0.3)
            .style("stroke-width", d => d.runtime/10)
            .style("fill", d => colorScale(d.group))
        node.append("title")
            .text(d => d.name);
        node.append("text")
            .attr("dy", 4)
            .attr("dx", -15)
            .text(d => d.name) 
        // node.append("text")
        //     .attr("dy",12)
        //     .attr("dx", -8)
        //     .text(d => d.runtime);

        //Listen for tick events to render the nodes as they update in your Canvas or SVG.
        simulation
            .nodes(dataset.nodes)
            .on("tick", ticked);
        simulation.force("link")
            .links(dataset.links);
        // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
        function ticked() {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node.attr("transform", d => `translate(${d.x},${d.y})`);
            edgepaths.attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y);
        }
        //When the drag gesture starts, the targeted node is fixed to the pointer
        //The simulation is temporarily "heated" during interaction by setting the target alpha to a non-zero value.
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
            d.fy = d.y; //fx - the node's fixed x-position. Original is null.
            d.fx = d.x; //fy - the node's fixed y-position. Original is null.
        }
        //When the drag gesture starts, the targeted node is fixed to the pointer
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
    })
}

