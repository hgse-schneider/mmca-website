// Globals to store the data. Must check that these are loaded in correctly before using!
let circle_data;
let sankey_data;

// Read in the data!
Promise.all([
  d3.json('circle_data_new.json'),
  d3.json('layers.json')
]).then(function(files) {
  // filter_updater(files[0]);
  circle_data = files[0];
  sankey_dat = files[1];
  console.log("REACHED HERE")
  graph_switcher(files[0], files[1]);
  
  console.log("REACHED HERE")
}).catch(function(err) {
  // Check errors
  // console.log(err)
});


const graph_switcher = (circle_data, sankey_data) => {
  
  // Handles the switch graph buttons
  d3.select("#sankey")
  .on("click", function(d,i) {
      sankey_chart(0, 100)
  })   
  // Switch to circle, applying filters
  d3.select("#circle")
  .on("click", function(d,i) {
      const filtered = filter_data(circle_data, filter_state);
      circle_chart(filtered)
  })   
  // Switch to tree, applying filters
  d3.select("#tree")
  .on("click", function(d,i) {
      const filtered = filter_data(circle_data, filter_state);
      tree_chart(filtered)
  }) 

  d3.select("#num_citations")
  .on("click", function(d, i) {
    if (display_setting == "citations")
    {
      display_setting = "";
    }
    else
    {
      display_setting = "citations";
    }
    if (current_graph == "circle")
    {
      const filtered = filter_data(circle_data, filter_state);
      const adjusted = switch_node_display(filtered);
      circle_chart(adjusted);
    }
  })

  // Update filter with 10s button
  d3.select("#teens")
  .on("click", function(d, i) {
    if (filter_state.has("10s")) {
      filter_state.delete("10s");
    }
    else {
      filter_state.delete("00s");
      filter_state.add("10s");
    }
    const filtered = filter_data(circle_data, filter_state);
    if (current_graph == "tree")
    {
      tree_chart(filtered);
    }
    if (current_graph == "circle")
    {
      circle_chart(filtered);
    }
    return;
  });

  // Update filter with 00s button
  d3.select("#noughts")
  .on("click", function(d, i) {
    if (filter_state.has("00s")) {
      filter_state.delete("00s");
    }
    else {
      filter_state.delete("10s");
      filter_state.add("00s");
    }
    const filtered = filter_data(circle_data, filter_state);
    if (current_graph == "tree")
    {
      tree_chart(filtered);
    }
    if (current_graph == "circle")
    {
      circle_chart(filtered);
    }
    return;
  })
}





let filter_state = {};

const slider = document.querySelector('#yearRange');
slider.oninput = function() {
  console.log(this.value);
  this.nextElementSibling.value = this.value;
  filter_state["yearRange"] = this.value;
  console.log(filter_state)
  const filtered = filter_data(circle_data, filter_state);
  if (current_graph == "tree")
  {
    tree_chart(filtered);
  }
  if (current_graph == "circle")
  {
    circle_chart(filtered);
  }
}

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
let current_graph = "";                

const filter_data = (data, filter) => {
  // Look at all children
  const filtered_children = data.children
  // Map over children at each layer
  .map((layer_1) => {
    let children = layer_1.children.map((layer_2) => {
      let children = layer_2.children.map((layer_3) => {
        let children = layer_3.children.map((layer_4) =>{
          // When we reach base layer, filter according to data that interests us
          let children = layer_4.children.filter((leaf) => {

            pass_list = []
            // FILTER LOGIC TO GO HERE DEPENDING ON TYPE OF FILTER
            if('yearRange' in filter_state)
            {
              pass_list.push(leaf.year < filter_state['yearRange']);
            }
            return pass_list.every(v => v === true);
          })
          // If no children, set to null for cleanup
          if (!children.length) {
            return null;
          }
          // Else return what we had with the filtered children
          return {...layer_4, children};
        // Then filter out the nulls
        }).filter(Boolean);
        // Repeat this process at every layer so that we don't have any empty nodes
        if (!children.length) {
          return null;
        }
        return {...layer_3, children};
      }).filter(Boolean)
      if(!children.length) {
        return null;
      }
      return {...layer_2, children};
    }).filter(Boolean)
    if(!children.length)
    {
      return null;
    }
    return {...layer_1, children}
  })
  .filter(Boolean);

  // Reconstruct the data structure as we could only use map
  // over the children array and return
  const filtered = {"name": "data", "children": filtered_children}
  return filtered;
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
  return {event: e,
          update_nodes: update_nodes,
          chart_type: chart_type,
          }
}

let display_setting = "";

const switch_node_display = (data) => {
  if (!display_setting)
  {
    return data;
  }
  if (display_setting == "citations")
  {
    data.children.forEach((layer_1) => {
      layer_1.children.forEach((layer_2) => {
        layer_2.children.forEach((layer_3) => {
          layer_3.children.forEach((layer_4) => {
            layer_4.children.forEach((leaf) => {
              leaf.value = leaf.citations;
            })
          })
        })
      })
    })
  }
  return data;
}



