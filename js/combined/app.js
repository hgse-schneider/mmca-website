// Globals to store the data. Must check that these are loaded in correctly before using!
let circle_data;
let sankey_data;
let scale_data;

// Read in the data!
Promise.all([
  d3.json('circle_data_test.json'),
  d3.json('layers.json'),
  d3.json('scale_data.json')
]).then(function(files) {
  // Set the global variables to store the data
  circle_data = files[0];
  sankey_data = files[1];
  scale_data = files[2];
  // Run our graph switching logic
  graph_switcher(files[0], files[1]);
}).catch(function(err) {
  // Check errors
  console.log("ERROR: File reading error")
  console.log(err)
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
      console.log("scale_data");
      console.log(scale_data);
      tree_chart(filtered);
      tree_scale(scale_data);
  }) 

  d3.select("#num_citations")
  .on("click", function(d, i) {
    // Set this as the active and remove any other actives
    var current = document.querySelector(".active");
    current.className = current.className.replace(" active", "");
    this.className += " active";

    display_setting = "citations";
    if (current_graph == "circle")
    {
      const filtered = filter_data(circle_data, filter_state);
      const adjusted = switch_node_display(filtered);
      circle_chart(adjusted);
    }
    if (current_graph == "tree")
    {
      const filtered = filter_data(circle_data, filter_state);
      // This doesn't work because data is stored away in _children rather than childrens
      const adjusted = switch_node_display(filtered);
      console.log("adjusted tree chart");
      tree_chart(adjusted);
      tree_scale(scale_data);
    }
  })

  d3.select("#num_connections")
  .on("click", function(d, i) {
    // Set this as the active and remove any other actives
    var current = document.querySelector(".active");
    current.className = current.className.replace(" active", "");
    this.className += " active";

    display_setting = "connections";
    if (current_graph == "circle")
    {
      const filtered = filter_data(circle_data, filter_state);
      const adjusted = switch_node_display(filtered);
      circle_chart(adjusted);
    }
    if (current_graph == "tree")
    {
      const filtered = filter_data(circle_data, filter_state);
      const adjusted = switch_node_display(filtered);
      tree_chart(adjusted);
      tree_scale(scale_data);
    }
  })
}

let filter_state = {};

const slider = document.querySelector('#yearRange');
slider.oninput = function() {
  this.nextElementSibling.value = this.value;
  filter_state["yearRange"] = this.value;
  const filtered = filter_data(circle_data, filter_state);
  const adjusted = switch_node_display(filtered);
  if (current_graph == "tree")
  {
    tree_chart(adjusted);
    tree_scale(scale_data);
  }
  if (current_graph == "circle")
  {
    circle_chart(adjusted);
  }
}

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
          chart_type: chart_type}
}

let display_setting = "connections";

const switch_node_display = (data) => {
  // If no display setting, defaults to value
  // Which is # connections
  if (!display_setting)
  {
    return data;
  }

  // Else set the value to be the correct display setting!
  if (current_graph == "circle")
  {
    data.children.forEach((layer_1) => {
      layer_1.children.forEach((layer_2) => {
        layer_2.children.forEach((layer_3) => {
          layer_3.children.forEach((layer_4) => {
            layer_4.children.forEach((leaf) => {
              leaf.value = leaf[display_setting]
            })
          })
        })
      })
    })
  };
  if (current_graph == "tree")
  {
    console.log("Attempted to change node display");
    data.children.forEach((layer_1) =>{
      const layer_1_children = layer_1.children ? layer_1.children : layer_1._children;
      layer_1_children.forEach((layer_2) => {
        const layer_2_children = layer_2.children ? layer_2.children : layer_2._children;
        layer_2_children.forEach((layer_3) => {
          const layer_3_children = layer_3.children ? layer_3.children : layer_3._children;
          layer_3_children.forEach((layer_4) => {
            const layer_4_children = layer_4.children ? layer_4.children : layer_4._children;
            layer_4_children.forEach((leaf) => {
              const prev = leaf.value;
              leaf.value = leaf[display_setting];
              const post = leaf.value;
              if (post - prev > 500)
              {
                console.log(post);
              }
            })
          })
        })
      })
    })
  }


  // Return the data with now the correct data set to be value for each leaf
  return data;
}




