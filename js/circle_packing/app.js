
const width = 900;
const height = width;

const pack = data => d3.pack()
                        .size([width, height])
                        .padding(3)
                        (d3.hierarchy(data)
                        .sum(d => d.value)
                        .sort((a, b) => b.value - a.value));

const color = d3.scaleLinear()
    .domain([0, 5])
    .range(["#14248a", "#f9f5ff"])
    .interpolate(d3.interpolateRgb);
  

const format = d3.format(",d");

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

const chart = (data) => {
    const root = pack(data);
    let focus = root;
    let view;
  
    const svg = d3.select(".container")
        .append("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

    // Currently only returning the SVG node :( 
    const popout = d3.select("body").append("div")
        .attr("class", "tooltip-text")
        .style("opacity", 0);

    const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => nodeColor(d))
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { 
                                      d3.select(this).attr("stroke", "#000"); 
                                      console.log("test");
                                      popout.html("test")
                                        .style("opacity", 1);
                                    })
        .on("mouseout", function() { 
                                    d3.select(this).attr("stroke", null); 
                                    popout.transition()
                                      .duration('50')
                                      .style("opacity", 0);
                                  })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
  
    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("fill", "#000")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);
      
      svg.selectAll("text").each(function(d) {
        d.bbox = this.getBBox();
        console.log(d.bbox);
      });

    zoomTo([root.x, root.y, root.r * 2]);
  
    function zoomTo(v) {
      const k = width / v[2];
  
      view = v;
  
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    function zoom(event, d) {
      const focus0 = focus;
  
      focus = d;
  
      const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
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

    return svg.node();
  }

Promise.all([
    d3.json('circle_data.json'),
]).then(function(files) {
    chart(files[0]);
}).catch(function(err) {
    // Check errors
    console.log(err)
});
