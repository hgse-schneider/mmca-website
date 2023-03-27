const width = 1000;
const height = width;

const dx = 10;
const dy = width / 6;

const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

const tree = d3.tree().nodeSize([dx, dy]);

const margin = ({top: 10, right: 120, bottom: 10, left: 40});

const pack = data => d3.pack()
                        .size([width, height])
                        .padding(3)
                        (d3.hierarchy(data)
                        .sum(d => d.value)
                        .sort((a, b) => b.value - a.value));

let state = "";                  

const tree_chart = (data) => {
  d3.select('.container').html('');
  const root = d3.hierarchy(data);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3.select(".container")
      .append("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", (event, d) => {
          state = findState(event, d, "TREE");
          unfurl_tree(state);
          // d.children = d.children ? null : d._children;
          // update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Update the root
  update(root);
  
  // Function for unfurling tree according to state from other visualizations
  const unfurl_tree = (state) => {
    // Pulling out state information to make life easier
    e = state.event;
    update_nodes = state.update_nodes;
    chart_type = state.chart_type;

    // Start unfurling from root
    let pos = root;
    // update each node in order
    update_nodes.forEach( (update_node, i) => {

      let skip = false;
      // If on our way pos doesn't have children (not unfurled), unfrul it
      if (!pos.children)
      {
        pos.children = pos._children;
        pos._children = null;
      }
      // Else consider its children
      else
      {
        // Check for each child if it matches the current category we're looking for
        pos.children.forEach((child)=>{
          if (skip == true)
          {
            return;
          }
          // If match and currently not unfurled, unfurl
          if(child.data.name == update_node)
          {
            if (!child.children)
            {
              child.children = child._children;
              child._children = null;
            }
            // If match and already unfurled, then if it's the final element, we should furl (?) it back a level
            else if (i == update_nodes.length - 1 && child.children) {
              child._children = child.children;
              child.children = null;
            }
            update(child);
            // Update pos to go down the tree
            pos = child;
            skip = true;
          }
        })
      }
    })

  }
  // If we have state, unfurl the tree according to the state
  if (state)
  {
    unfurl_tree(state);
  }

  return svg.node();
}

// Function used in visualizations to update state to have consistent state object
// between visualizations
const findState = (e, d, chart_type) => {
  // Some node that an event happened at
  let trav = d;
  // Going to backtrack to the root, keeping track of our path
  let update_nodes = [];
  while (trav && trav.data){
    update_nodes.push(trav.data.name);
    trav = trav.parent;
  }
    // Remove the root node
    update_nodes.pop();
    // Reverse data so we can update from lowest depth up
    update_nodes.reverse();
    // Gives us the nodes we need to unfurl
  return {event: e, update_nodes: update_nodes, chart_type: chart_type}
}


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
    
    const superlabel = svg.append("g")
    const label = superlabel
        .attr("transform", "translate(0, -200)")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        // Doesn't seem to do anything
        .style("fill", "#000")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);
    
    zoomTo([root.x, root.y, root.r * 2]);
  
    // const label_boxes = svg.append("g")
    //   .attr("transform", "translate(0, -200)")
    //   .style("font", "10px sans-serif")
    //   .attr("pointer-events", "none")
    //   .attr("text-anchor", "middle")
    //   // Doesn't seem to do anything
    //   .style("fill", "#000")
    // .selectAll("rect")
    // .data(root.descendants())
    // .join("rect")
    //     .attr("bbox", d => d.getBBox())
    //     .attr("x", bbox.x - padding)
    //     .attr("y", bbox.y - padding)
    //     .attr("width", bbox.width + (padding*2))
    //     .attr("height", bbox.height + (padding*2))
    //     .style("fill", "blue");

    console.log('test');
    console.log(svg.selectAll("text"));
      console.log(svg.selectAll("text").nodes());
      svg.selectAll("text").nodes().forEach((t) => {
        let bbox = t.getBBox();
        if (bbox.height) 
        {
          console.log(t);
          console.log(bbox);
          var padding = 2;
          // console.log(this.svg);
          console.log("LABEL HERE");
          console.log(label.nodes());
          label.nodes().forEach((r) => {

          r.insert("rect", "text")
              .attr("x", bbox.x - padding)
              .attr("y", bbox.y - padding)
              .attr("width", bbox.width + (padding*2))
              .attr("height", bbox.height + (padding*2))
              .style("fill", "blue");
            })
        }
        
      })
      console.log(svg);

    function zoomTo(v) {
      const k = width / v[2];
  
      view = v;
  
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    function zoom(event, d) {
      // Update our state (redundant when coming from another vis, 
      // but needed when clicking around this vis, could save this one op but doesn't really hurt)
      state = findState(event, d, "CIRCLE");

      e = state.event;

      // Update focus position
      const focus0 = focus;
      focus = d;
  
      const transition = svg.transition()
          .duration(e.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
  
      label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

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


// Sankey stuff

const sankey_margin = {top: 30, right: 80, bottom: 5, left: 5}
const sankey_width =  1200 - sankey_margin.left - sankey_margin.right
const sankey_height =  850 - sankey_margin.top - sankey_margin.bottom

// Set the sankey diagram properties
var sankey = d3.sankey()
  .nodeWidth(160)
//   Actually using this to squish items together lol
  .nodePadding(50)
  .size([sankey_width, sankey_height - 30])

function sankey_chart(low, high) {
  d3.select('.container').html('');
  sankey_svg = d3.select(".container").append("svg")
    .attr("width", sankey_width + sankey_margin.left + 100)
    .attr("height", sankey_height + sankey_margin.top)
    .attr("id", "sankey-diagram")
    .append("g")
    .attr("transform", "translate(" + sankey_margin.left + "," + sankey_margin.top + ")")

  // load the data
  d3.json("layers.json").then(function(sankeydata) {
    let data = sankeydata;
    let new_nodes =[];
    data["nodes"].forEach((d)=>{
      if (d.node <= high && d.node >= low)
      {
        new_nodes.push(d);
      }
    })
    let new_links = [];
    data["links"].forEach((d) => {
      if (d.source <= high && d.source >= low && d.target <= high && d.source >= low) {
        new_links.push(d);
      }
    })
    let new_data = {"nodes": new_nodes, "links": new_links};
    graph = sankey(new_data);         

    var link = sankey_svg.append("g").selectAll(".link")
      .data(graph.links)
      .enter()
        // Add path element used to draw the lines   
      .append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
    //   Set the width of the path
      .attr("stroke-width", function(d) { return d.link_width / 3; })
      .on('click', function(e, d) {
        let link = d.d_link
        if(link != "") {
          // console.log(d) 
        }
      })
      .style("stroke", d => {return d.color} )

    // add the link titles
    link.append("title")
      .text(function(d) { 
        return d.link_width })
    // add in the nodes
    var node = sankey_svg.append("g").selectAll(".node")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
    // add the rectangles for the nodes
    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0 - 10; })
        .attr("height", function(d) { return d.y1 - d.y0 + 20; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { 
            return "transparent" })
        .on('click', function(e, d) {
          // TODO: This link only works while in combined, will need fixing upon
          // Moving location
          let link = "../.." + d.data_link;
          console.log("DATALINK");
          console.log(link);
          force_layout(link);
        })
        .on('mouseover', function(e, d) {
          node.append("title")
          .text(function(d) { 
            return d.num_connections })
        })
    node.append("text")
        .attr("x", function(d) { return (d.x1 + d.x0) / 2; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("class", "text_node")
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("dy", "0.35em")
        .style("font-size", function(d) { return d.fontSize * 1.1 })
        .text(function(d) { return d.name; })
        .attr("text-anchor", "middle")
        .style("fill", function(d) { 
          if(d.node_color != "gray") {
            return d.node_color 
          } else {
            return "black"
          }})
        .style("text-shadow", "none")
  });
}


const graph_switcher = (circle_data, sankey_data) => {
  d3.select("#sankey")
  .on("click", function(d,i) {
      // console.log("test")
      sankey_chart(0, 100)
  })   
  d3.select("#circle")
  .on("click", function(d,i) {
      circle_chart(circle_data)
  })   
  d3.select("#tree")
  .on("click", function(d,i) {
      tree_chart(circle_data)
  }) 
}

Promise.all([
    d3.json('circle_data.json'),
    d3.json('layers.json')
]).then(function(files) {
    graph_switcher(files[0], files[1]);
}).catch(function(err) {
    // Check errors
    // console.log(err)
});