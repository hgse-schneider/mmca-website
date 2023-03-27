// Circular Packing

const format = d3.format(",d");

const color = d3.scaleLinear()
    .domain([0, 5])
    .range(["#14248a", "#f9f5ff"])
    .interpolate(d3.interpolateRgb);
  

const paperColor = d3.scaleLinear()
  .domain([0, 25, 50, 73])
  .range(["#ffe226", "#ff2626", "rgb(129, 254, 5)", "blue"])
  .interpolate(d3.interpolateRgb);

const nodeColor = (d) => {
  if (d.data.id == 2)
  {
    return "blue";
  }
  return d.children ? color(d.depth) : paperColor(d.data.id);
}

const circle_chart = (data) => {
  current_graph = "circle";
  d3.select('.container').html('');
  const root = pack(data);
  let focus = root;
  let view;

  const con = d3.select(".container")
    .append("div")
    .style("flex", "1");
  
    const svg = con
        .append("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

    const popout = con.append("div")
        .attr("class", "tooltip-text")
        .style("opacity", 0)
        .style("padding", "6px")
        .style("border-radius", "10px")
        .style("position", "absolute");

    const node = svg.append("g")
      .attr("transform", "translate(0, -200)")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => nodeColor(d))
        .attr("d", d => d)
        .attr("pointer-events", "all")
        .on("mouseover", function(event, d) { 
                                      d3.select(this).attr("stroke", "#000"); 
                                      // console.log(d.data)

                                      popout.html(!d.data.children ? d.data.name : "")
                                      popout.style("background", !d.data.children ? "white" : "none")
                                      popout.transition()
                                        .duration('50')
                                        .style("opacity", 1);
                                    })
        .on("mousemove", function(event, d) {
          popout.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
        })
        .on("mouseout", function(event, d) { 
          d3.select(this).attr("stroke", null); 
          popout.transition()
            .duration('50')
            .style("opacity", 0);
        })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
  
    const label = svg.append("g")

    const boxes = label
      .attr("transform", "translate(0, -200)")
    .selectAll("rect")
    .data(root.descendants())
    .join("rect")
        .style("fill-opacity", d => d.parent === root ? 0.7 : 0)
        .style("fill", "blue")
        .style("display", d => d.parent === root ? "inline" : "none")
        .attr("d", d => d)
        // For testing purposes
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "blue");

    const sublabels = label
        .attr("transform", "translate(0, -200)")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        // Doesn't seem to do anything
        .style("fill", "#fff")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);
    

    
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];
  
      view = v;
      // Transform everything according to the current view/zoom
      boxes.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      sublabels.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    // Function which draws boxes around labels
    function drawBoxes() {
      // For all the text's, get their bounding boxes (will be 0 if not currently visible)
      box_widths = [];
      sublabels.nodes().forEach((n, i) => {
        const bbox = n.getBBox();
        box_widths.push(bbox);
      })
  
      // Create rectangles
      const padding = 2;
        label.selectAll("rect")
          .attr("x", (d, i) => {return box_widths[i].x ? box_widths[i].x - padding: 0} )
          .attr("y", (d, i) => {return box_widths[i].x ? box_widths[i].y - padding : 0})
          .attr("width", (d, i) => {return box_widths[i].x  ? box_widths[i].width + (padding*2) : 0})
          .attr("height", (d, i) => {return box_widths[i].x  ? box_widths[i].height + (padding*2): 0});
    }

    function zoom(event, d) {
      // Update our state (redundant when coming from another vis, 
      // but needed when clicking around this vis, could save this one op but doesn't really hurt)
      state = findState(event, d, "CIRCLE");

      e = state.event;

      // Update focus position
      const focus0 = focus;
      focus = d;

      // Create our transition
      const transition = svg.transition()
          .duration(e.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
      
      // The boxes behind our labels
      // TODO: Handle drawBoxes more nicely within animation
      // Issue is that until text is visible, the bbox is 0. 
      // Idea for solution: Pretend they are all visible somehow before loading, store all bboxes and move from there?
      // Could be reasonably tricky to pre-process this.
      boxes
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; drawBoxes(); });
        
      sublabels
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
  
    drawBoxes();
  
  // If we have state transitiong from another chart, match that chart's state
  if (state)
  {
    // Extract out state information
    e = state.event;
    update_nodes = state.update_nodes;
    chart_type = state.chart_type;

    // Start from the root
    let pos = root;

    // For each node we had in our state, we need to update our position
    update_nodes.forEach((update_node) => {
      let skip = false;
      pos.children.forEach((child)=>{
        if (skip == true)
        {
          return;
        }
        // If we match, move pos to that child
        if(child.data.name == update_node)
        {
          pos = child;
          skip = true;
        }
      })
    })
    // Once we're done, pos should be at the position we want to zoom to, so zoom!
    zoom(state.event, pos);
  }
    return con;
}