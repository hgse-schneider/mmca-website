const DATA_REL_LINK = "../../../"

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
  current_graph = "sankey";
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
          let link = DATA_REL_LINK + d.data_link;
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