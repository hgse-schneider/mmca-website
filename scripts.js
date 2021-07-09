const width = 1000
const height = 1000
       const colorScale = d3.scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
       .domain(["Team A", "Team B", "Team C", "Team D", "Team E"])
       .range(['#ff9e6d', '#86cbff', '#c2e5a0','#fff686','#9e79db'])

       const simulation = d3.forceSimulation()
       .force("link", d3.forceLink() // This force provides links between nodes
                       .id(d => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
                       .distance(120)
        ) 
       .force("charge", d3.forceManyBody().strength(-700)) // This adds repulsion (if it's negative) between nodes. 
       .force("center", d3.forceCenter(width / 2, height / 2))


       const svg = d3.select('.diagram')
        .append("svg")
            .attr("width", width + 30)
            .attr("height", height + 30)
      
     //appending little triangles, path object, as arrowhead
    //The <defs> element is used to store graphical objects that will be used at a later time
    //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
    svg.append('defs').append('marker')
        .attr("id",'arrowhead')
        .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
         .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
         .attr('refY',0)
         .attr('orient','auto')
            .attr('markerWidth',13)
            .attr('markerHeight',13)
            .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');
      
    //create some data
    const dataset =  {
      nodes: [
            {id: 1, name: 'AGGR', label: 'Aggregation', group: 'Team C', runtime: 20},
            {id: 2, name: 'ASMT', label: 'Assessment Repository', group: 'Team A', runtime: 60},
            {id: 3, name: 'CALC', label: 'Final Calc', group: 'Team C', runtime: 30},
            {id: 4, name: 'DEMO', label: 'Demographic', group: 'Team B', runtime: 40},
            {id: 5, name: 'ELIG', label: 'Eligibility', group: 'Team B', runtime: 20},
            {id: 6, name: 'GOAL', label: 'Goal Setting', group: 'Team C', runtime: 60},
            {id: 7, name: 'GROW', label: 'Growth Model', group: 'Team C', runtime: 60},
            {id: 8, name: 'LINK', label: 'Linkage', group: 'Team A', runtime: 100},
            {id: 9, name: 'MOSL', label: 'MOSL', group: 'Team A', runtime: 80},
            {id: 10, name: 'MOTP', label: 'MOTP', group: 'Team A', runtime: 20},
            {id: 11, name: 'REPT', label: 'Reporting', group: 'Team E', runtime: 240},
            {id: 12, name: 'SEDD', label: 'State Data', group: 'Team A', runtime: 30},
            {id: 13, name: 'SNAP', label: 'Snapshot', group: 'Team A', runtime: 40}
        ], 
      links: [
        {source: 1, target: 3, type: 'Next -->>'},
        {source: 6, target: 1, type: 'Next -->>'},
        {source: 7, target: 1, type: 'Next -->>'},
        {source: 9, target: 1, type: 'Next -->>'},
        {source: 2, target: 4, type: 'Next -->>'},
        {source: 2, target: 6, type: 'Next -->>'},
        {source: 2, target: 7, type: 'Next -->>'},
        {source: 2, target: 8, type: 'Next -->>'},
        {source: 2, target: 9, type: 'Next -->>'},
        {source: 10, target: 3, type: 'Next -->>'},
        {source: 3, target: 11, type: 'Next -->>'},
        {source: 8, target: 5, type: 'Go to ->>'},
        {source: 8, target: 11, type: 'Go to ->>'},
        {source: 6, target: 9, type: 'Go to ->>'},
        {source: 7, target: 9, type: 'Go to ->>'},
        {source: 8, target: 9, type: 'Go to ->>'},
        {source: 9, target: 11, type: 'Go to ->>'},
        {source: 12, target: 9, type: 'Go to ->>'},
        {source: 13, target: 11, type: 'Go to ->>'},
        {source: 13, target: 2, type: 'Go to ->>'},
        {source: 13, target: 4, type: 'This way>>'},
        {source: 13, target: 5, type: 'This way>>'},
        {source: 13, target: 8, type: 'This way>>'},
        {source: 13, target: 9, type: 'This way>>'},
        {source: 13, target: 10, type: 'This way>>'},
        {source: 4, target: 7, type: 'Next -->>'},
        {source: 4, target: 2, type: 'Next -->>'}
      ]
    };
    
        console.log("dataset is ...",dataset);
    
    // Initialize the links
    const link = svg.selectAll(".links")
            .data(dataset.links)
            .enter()
            .append("line")
            .attr("class", "links")
            .attr('marker-end','url(#arrowhead)') //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.
    
    
    //The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
    //Text in a <title> element is not rendered as part of the graphic, but browsers usually display it as a tooltip.
    link.append("title")
        .text(d => d.type);
    
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
            .attr('fill', '#aaa');
    
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
        .call(d3.drag() //sets the event listener for the specified typenames and returns the drag behavior.
            .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
            .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
            //.on("end", dragended)     //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
        );
    
    node.append("circle")
        .attr("r", d=> 17)//+ d.runtime/20 )
        .style("stroke", "grey")
        .style("stroke-opacity",0.3)
        .style("stroke-width", d => d.runtime/10)
        .style("fill", d => colorScale(d.group))
    
    node.append("title")
        .text(d => d.id + ": " + d.label + " - " + d.group +", runtime:"+ d.runtime+ "min");
    
    node.append("text")
        .attr("dy", 4)
        .attr("dx", -15)
        .text(d => d.name);
    node.append("text")
        .attr("dy",12)
        .attr("dx", -8)
        .text(d=> d.runtime);
    
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
    //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
    function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
          d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
          d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
    }
    
      //When the drag gesture starts, the targeted node is fixed to the pointer
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
    
    // the targeted node is released when the gesture ends
      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    
        console.log("dataset after dragged is ...",dataset);
      }
      
      //drawing the legend
      const legend_g = svg.selectAll(".legend")
      .data(colorScale.domain())
      .enter().append("g") 
      .attr("transform", (d, i) => `translate(${width},${i * 20})`); 
    
      legend_g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", colorScale);
    
      legend_g.append("text")
        .attr("x", 10)
        .attr("y", 5)
        .text(d => d);
      
      //drawing the second legend
      const legend_g2 = svg.append("g") 
      //.attr("transform", (d, i) => `translate(${width},${i * 20})`); 
      .attr("transform", `translate(${width}, 120)`);
      
      legend_g2.append("circle")
        .attr("r", 5)
        .attr("cx", 0)
        .attr("cy", 0)
        .style("stroke", "grey")
        .style("stroke-opacity",0.3)
        .style("stroke-width", 15)
        .style("fill", "black")
      legend_g2.append("text")
         .attr("x",15)
         .attr("y",0)
         .text("long runtime");
      
        legend_g2.append("circle")
        .attr("r", 5)
        .attr("cx", 0)
        .attr("cy", 20)
        .style("stroke", "grey")
        .style("stroke-opacity",0.3)
        .style("stroke-width", 2)
        .style("fill", "black")
      legend_g2.append("text")
         .attr("x",15)
         .attr("y",20)
         .text("short runtime");
      
    
