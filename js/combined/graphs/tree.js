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

const tree_chart = (data) => {
    current_graph = "tree";
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