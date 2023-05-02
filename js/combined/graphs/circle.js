// Circular Packing
const circle_width = 1000;
const circle_height = circle_width;

const format = d3.format(",d");

const color = d3.scaleLinear()
    .domain([0, 5])
    .range(["#2574b6", "#eaf3fb"])
    // .range(["#14248a", "#f9f5ff"])
    .interpolate(d3.interpolateRgb);
  

const paperColor = d3.scaleLinear()
  .domain([0, 25, 50, 73])
  // .range(["#ffe226", "#ff2626", "rgb(129, 254, 5)", "blue"])
  .range(["#5d29ff", "#00b55b", "#fbad00", "#c76d81", "#510000"])
  .interpolate(d3.interpolateRgb);

  // A blue color range for testing
  // ["#f7fbff","#f6faff","#f5fafe","#f5f9fe","#f4f9fe","#f3f8fe","#f2f8fd","#f2f7fd","#f1f7fd","#f0f6fd","#eff6fc","#eef5fc","#eef5fc","#edf4fc","#ecf4fb","#ebf3fb","#eaf3fb","#eaf2fb","#e9f2fa","#e8f1fa","#e7f1fa","#e7f0fa","#e6f0f9","#e5eff9","#e4eff9","#e3eef9","#e3eef8","#e2edf8","#e1edf8","#e0ecf8","#e0ecf7","#dfebf7","#deebf7","#ddeaf7","#ddeaf6","#dce9f6","#dbe9f6","#dae8f6","#d9e8f5","#d9e7f5","#d8e7f5","#d7e6f5","#d6e6f4","#d6e5f4","#d5e5f4","#d4e4f4","#d3e4f3","#d2e3f3","#d2e3f3","#d1e2f3","#d0e2f2","#cfe1f2","#cee1f2","#cde0f1","#cce0f1","#ccdff1","#cbdff1","#cadef0","#c9def0","#c8ddf0","#c7ddef","#c6dcef","#c5dcef","#c4dbee","#c3dbee","#c2daee","#c1daed","#c0d9ed","#bfd9ec","#bed8ec","#bdd8ec","#bcd7eb","#bbd7eb","#b9d6eb","#b8d5ea","#b7d5ea","#b6d4e9","#b5d4e9","#b4d3e9","#b2d3e8","#b1d2e8","#b0d1e7","#afd1e7","#add0e7","#acd0e6","#abcfe6","#a9cfe5","#a8cee5","#a7cde5","#a5cde4","#a4cce4","#a3cbe3","#a1cbe3","#a0cae3","#9ec9e2","#9dc9e2","#9cc8e1","#9ac7e1","#99c6e1","#97c6e0","#96c5e0","#94c4df","#93c3df","#91c3df","#90c2de","#8ec1de","#8dc0de","#8bc0dd","#8abfdd","#88bedc","#87bddc","#85bcdc","#84bbdb","#82bbdb","#81badb","#7fb9da","#7eb8da","#7cb7d9","#7bb6d9","#79b5d9","#78b5d8","#76b4d8","#75b3d7","#73b2d7","#72b1d7","#70b0d6","#6fafd6","#6daed5","#6caed5","#6badd5","#69acd4","#68abd4","#66aad3","#65a9d3","#63a8d2","#62a7d2","#61a7d1","#5fa6d1","#5ea5d0","#5da4d0","#5ba3d0","#5aa2cf","#59a1cf","#57a0ce","#569fce","#559ecd","#549ecd","#529dcc","#519ccc","#509bcb","#4f9acb","#4d99ca","#4c98ca","#4b97c9","#4a96c9","#4895c8","#4794c8","#4693c7","#4592c7","#4492c6","#4391c6","#4190c5","#408fc4","#3f8ec4","#3e8dc3","#3d8cc3","#3c8bc2","#3b8ac2","#3a89c1","#3988c1","#3787c0","#3686c0","#3585bf","#3484bf","#3383be","#3282bd","#3181bd","#3080bc","#2f7fbc","#2e7ebb","#2d7dbb","#2c7cba","#2b7bb9","#2a7ab9","#2979b8","#2878b8","#2777b7","#2676b6","#2574b6","#2473b5","#2372b4","#2371b4","#2270b3","#216fb3","#206eb2","#1f6db1","#1e6cb0","#1d6bb0","#1c6aaf","#1c69ae","#1b68ae","#1a67ad","#1966ac","#1865ab","#1864aa","#1763aa","#1662a9","#1561a8","#1560a7","#145fa6","#135ea5","#135da4","#125ca4","#115ba3","#115aa2","#1059a1","#1058a0","#0f579f","#0e569e","#0e559d","#0e549c","#0d539a","#0d5299","#0c5198","#0c5097","#0b4f96","#0b4e95","#0b4d93","#0b4c92","#0a4b91","#0a4a90","#0a498e","#0a488d","#09478c","#09468a","#094589","#094487","#094386","#094285","#094183","#084082","#083e80","#083d7f","#083c7d","#083b7c","#083a7a","#083979","#083877","#083776","#083674","#083573","#083471","#083370","#08326e","#08316d","#08306b"]
  // 5d29ff
  // 00b55b
  // fbad00
  // c76d81
  // c76d81

const nodeColor = (d) => {
  if (d.data.id == 2)
  {
    return "blue";
  }
  return d.children ? color(d.depth) : paperColor(d.data.id);
}

const pack = data => d3.pack()
  .size([circle_width, circle_height])
  .padding(3)
  (d3.hierarchy(data)
  .sum(d => d.value)
  .sort((a, b) => b.value - a.value));

  // const circle_scale = (data) => {

  //   d3.select('.scale').html('');

  //   const root = d3.hierarchy(data);
  
  //   const svg = d3.select(".scale")
  //     .append("svg")
  //     .attr("viewBox", [-margin.left, -margin.top, circle_width/6, dx/6])
  //     .style("font", "10px sans-serif")
  //     .attr("height", svgheight/6)
  //     .attr("width", svgwidth/6)
  //     .style("user-select", "none");
  
  //   const nodes = root.descendants().reverse();
  //   nodes.pop();
  //   nodes.reverse();
  
  //   nodes.forEach((d, i) => {
  //     svg.append("circle")
  //       .attr("r", node_size(d))
  //       .attr("transform", `translate(${i * 50},${0})`);
  //   })
  
  //   console.log(nodes);
  
  //   nodes.forEach((d, i) => {
  //     console.log(d.data);
  //     svg.append("text")
  //       .text(d.data[display_setting])
  //       .attr("transform", `translate(${i * 50 - node_size(d) - 2},${-8})`)
  //       .attr("text-anchor", "start");
  
  //   })  
  //   return svg;
  // }

  // const scale_width = 150;
  // const scale_height = scale_width;

const scale_pack = data => d3.pack()
  .size([svgwidth/6, svgheight/6])
  .padding(3)
  (d3.hierarchy(data)
  .sum(d => d.value)
  .sort((a, b) => b.value - a.value));

  const scaleNodeColor = (d) => {
    if (d.data.value == 1)
    {
      return "#5d29ff";
    }
    if (d.data.value == 10)
    {
      return "#fbad00";
    }
    return "#c76d81";
  }

const circle_scale_2 = (data) => {
  d3.select('.scale').html('');
  const root = scale_pack(data);
  let focus = root;
  let view;

  const con = d3.select(".scale");
    const svg = con
        .append("svg")
        .attr("viewBox", [-margin.left, -margin.top, svgwidth/6, dx/6])
        .style("display", "block")
        .style("cursor", "pointer")
        .attr("height", svgheight/6)
        .attr("width", svgwidth/6)
        .on("click", (event) => zoom(event, root));

    const node = svg.append("g")
      .attr("transform", "translate(0, 0)")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d =>  scaleNodeColor(d))
        .attr("d", d => d);
    
    zoomTo([root.x, root.y, root.r * 2]);

    function scaleSize(d) {

    }

    function zoomTo(v) {
      const k = circle_width / v[2];
  
      view = v;
      // Transform everything according to the current view/zoom
      node.attr("transform", d => `translate(${(d.x - v[0]) * k / 28 + 50},${(d.y - v[1]) * k / 24})`);
      node.attr("r", d => d.data.connections * 0.077 + 3.1691);
    }
    return con;
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
        .attr("viewBox", `-${circle_width / 2} -${circle_height / 2} ${circle_width} ${circle_height}`)
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

    const display_labels = (d) => {
      if (d.depth == 5 && d.data.connections > 2)
      {
        console.log(d);
      }
      if (d.parent === root || (d.parent && d.parent.parent === root))
      {
        // console.log(d);
        return "block";
      }
      return "none";
    }

    const boxes = label
      .attr("transform", "translate(0, -200)")
    .selectAll("rect")
    .data(root.descendants())
    .join("rect")
        .style("fill-opacity", d => d.parent === root ? 0.7 : 0.7)
        .style("fill", "blue")
        .style("display", d => display_labels(d))
        .attr("d", d => d)
        // For testing purposes
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "blue");

      const label_pos = (d) => {
        if (d.depth == 1){
          return -d.r;
        }
        if (d.depth == 2) {
          return -2 * d.r;
        }
        if (d.depth == 3) {
          return -5 * d.r;
        }
        if (d.depth == 4) {
          return -6 * d.r;
        }

      }

        const sublabels = label
        .attr("transform", "translate(0, -200)" )
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        // Doesn't seem to do anything
        .style("fill", "#fff")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .attr("d", d => d)
        .attr("rlab", d => d.r)
        .style("fill-opacity", d => d.parent === root || d.parent && d.parent.parent === root ? 1 : 0)
        .attr("y", d => label_pos(d))
        .style("font", d => d.parent === root ? "16px sans-serif" : "10px sans-serif")
        .style("display", d => display_labels(d))
        .text(d => d.data.name)
        .call(circle_text_wrap, 80);    

    
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
      const k = circle_width / v[2];
  
      view = v;
      // Transform everything according to the current view/zoom
      boxes.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      // sublabels.attr("y", d => -d.r * 100)
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

      const boxOpactiy = (d, obj, midValue) => {
        if (d.parent === focus)
        {
          return 1;
        }
        if (d.parent && d.parent.parent === focus)
        {
          return midValue;
        }
        return 0;
      }

      boxes
        .filter(function(d) { return (d.parent === focus || d.parent && d.parent.parent === focus ) || this.style.display === "block"; })
        .transition(transition)
        .style("fill-opacity", d => boxOpactiy(d, this, 0.5))
        .on("start", function(d) { if (d.parent === focus || d.parent && d.parent.parent === focus) this.style.display = "block"; })
        .on("end", function(d) { drawBoxes(); })
        
// .attr("y", d => d.parent === root ? -d.r + 20 : "0")

      sublabels
        .filter(function(d) { return (d.parent === focus || d.parent && d.parent.parent === focus ) || this.style.display === "block"; })
        .transition(transition)
          .style("fill-opacity",  d => boxOpactiy(d, this, 0.8))
          .style("font-weight", d => d.parent === focus ? "bold" : "plain")
          .on("start", function(d) { if (d.parent === focus || d.parent && d.parent.parent === focus) this.style.display = "block"; })
          // .on("end", function(d) { console.log(this.node())})
          // .on("end", function(d) { if (d.parent !== focus || d.parent && d.parent.parent != focus) this.style.display = "none"; });
          // console.log(this.getAttribute("y")); this.setAttribute("y", this.getAttribute("y") * 50); console.log(this.getAttribute("y"))
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

  console.log("svg details")
  svgwidth = svg.style("width");
  svgwidth = svgwidth.substring(0, svgwidth.length - 2);
  svgheight = svgwidth * (6/25);
  console.log(svgwidth);
  console.log(svgwidth * (6/25));
  console.log(svg);

    return con;
}