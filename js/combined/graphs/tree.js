const tree_width = 1000;
const tree_height = tree_width;


let svgwidth;
let svgheight;

const dx = 10;
const dy = tree_width / 6;

const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

const tree = d3.tree().nodeSize([dx, dy]);

const margin = ({top: 10, right: 120, bottom: 10, left: 40});

const information_backprop = (root) => {
  root.children.forEach((layer_1) =>{
    const layer_1_children = layer_1.children ? layer_1.children : layer_1._children;
    let sum_connections_1 = 0;
    let sum_citations_1 = 0;
    layer_1_children.forEach((layer_2) => {
      const layer_2_children = layer_2.children ? layer_2.children : layer_2._children;
      let sum_connections_2 = 0;
      let sum_citations_2 = 0;
      layer_2_children.forEach((layer_3) => {
        const layer_3_children = layer_3.children ? layer_3.children : layer_3._children;
        let sum_connections_3 = 0;
        let sum_citations_3 = 0;
        layer_3_children.forEach((layer_4) => {
          const layer_4_children = layer_4.children ? layer_4.children : layer_4._children;
          let sum_connections = 0;
          let sum_citations = 0;
          layer_4_children.forEach((leaf) => {
            sum_citations += leaf.data.citations;
            sum_connections += leaf.data.connections;
            leaf.y0 = leaf.y0 + 100;
          })
          layer_4.data.citations = sum_citations;
          layer_4.data.connections = sum_connections;
          sum_connections_3 += sum_connections;
          sum_citations_3 += sum_citations;
        })
        layer_3.data.citations = sum_citations_3;
        layer_3.data.connections = sum_connections_3;
        sum_citations_2 += sum_citations_3;
        sum_connections_2 += sum_connections_3;
      })
      layer_2.data.citations = sum_citations_2;
      layer_2.data.connections = sum_connections_2;
      sum_citations_1 += sum_citations_2;
      sum_connections_1 += sum_connections_2;
    })
    layer_1.data.citations = sum_citations_1;
    layer_1.data.connections = sum_connections_1;
  })
}

const node_size = (d) => {
  // Root node size
  if (d.depth === 0)
  {
    return 5;
  }
  // All other nodes
  if (display_setting === "citations") {
    return 1 + Math.log10(Math.abs(d.data[display_setting]) + 1);
  }
  return 1 + Math.log(Math.abs(d.data[display_setting]) + 1);
}

// Colors for tree diagram nodes & text
// TODO: Confirm whether I'm using the right hierarchy?? 
// I swear we confirmed this before, but now I'm confused
const tree_colors = {
  "Physiological": "#00b0b0",
  "Body language": "#510000",
  "Log data": "#00b55b",
  "Facial expression": "#fbad00"
}

// TODO: Fix scale only updating on initial display
const tree_scale = (data) => {
  // Reset viz
  d3.select('.scale').html('');

  const root = d3.hierarchy(data);

  const svg = d3.select(".scale")
    .append("svg")
    .attr("viewBox", [-margin.left, -margin.top, tree_width/6, dx/6])
    .style("font", "10px sans-serif")
    .attr("height", svgheight/6)
    .attr("width", svgwidth/6)
    .style("user-select", "none");

  const nodes = root.descendants().reverse();
  nodes.pop();
  nodes.reverse();

  nodes.forEach((d, i) => {
    svg.append("circle")
      .attr("r", node_size(d))
      .attr("transform", `translate(${i * 50},${0})`);
  })

  console.log(nodes);

  nodes.forEach((d, i) => {
    console.log(d.data);
    svg.append("text")
      .text(d.data[display_setting])
      .attr("transform", `translate(${i * 50 - node_size(d) - 2},${-8})`)
      .attr("text-anchor", "start");

  })

}

const tree_chart = (data) => {
    
    const separation = (a, b) => {
      return a.parent == b.parent ? 2 : 3;
    }
  
    tree.separation(separation);
    // tree.size([500, 800])
    current_graph = "tree";
    d3.select('.container').html('');
    const root = d3.hierarchy(data);

    information_backprop(root);
    console.log(root);
  
    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth && d.data.name.length !== 7) d.children = null;
    });
  
    const svg = d3.select(".container")
        .append("svg")
        .attr("viewBox", [-margin.left, -margin.top, tree_width, dx])
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

      console.log("try to get bounding box");
      // console.log(root.node().getBBox());
  
      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });
  
      const height = right.x - left.x + margin.top + margin.bottom;
  
      const transition = svg.transition()
          .duration(duration)
          .attr("viewBox", [-margin.left, left.x - margin.top, tree_width, height])
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
            // Update state
            state = findState(event, d, "TREE");
            // If at a leaf node, open the corresponding URL
            if (!d.children && !d._children)
            {
              window.open(
                d.data.url 
              );
            }
            // Else unfurl the tree appropriately
            else 
            {
              unfurl_tree(state);
            }
          });

      nodeEnter.append("circle")
          .attr("r", d => node_size(d))
          .attr("fill", d => tree_colors[d.data.name] ?? "#555")
          .attr("stroke-width", 10);
      
      nodeEnter.append("rect")
          .attr("width", 6)
          .attr("height", 6)
          .attr("transform", d => `translate(-3,-3)`)
          .attr("fill", "transparent")
          .attr("stroke", d => d.depth != 5 ? "transparent" : "black" )
          .attr("stroke-width", 1);
  
      nodeEnter.append("text")
          .attr("dy", "0.31em")
          .attr("font-size", d => Math.max(2 * node_size(d), 8))
          .attr("x", d => d.depth != 5 ? -6 : 6)
          .attr("text-anchor", d => d.depth != 5 ? "end" : "start")
          .text(d => d.data.name)
          // .style('fill', 'blue')
          .style('fill', d => tree_colors[d.data.name] ?? "black")
          .call(wrap, 150)
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");
          // .call(wrap, 10);
  
      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => {return d.depth == 5 ? `translate(${d.y -100},${d.x})` : `translate(${d.y},${d.x})`})
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
          .attr("d", diagonal)
          // How to change edge colors
          .style("stroke", "blue");
  
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
    console.log(root);

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
              if (i == update_nodes.length - 1 && child.children)
              {
                console.log(child.children);
                child.children.forEach((c) => {
                  console.log(c);
                  c.data.value = c.data[display_setting];
                })
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
  
    console.log("svg details")
    svgwidth = svg.style("width");
    svgwidth = svgwidth.substring(0, svgwidth.length - 2);
    svgheight = svgwidth * (6/25);
    console.log(svgwidth);
    console.log(svgwidth * (6/25));
    console.log(svg);

    return svg.node();
  }