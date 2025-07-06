
const svg = d3.select("#vis")
  .append("svg")
  .attr("width", 500)
  .attr("height", 300);

svg.append("circle")
  .attr("cx", 250)
  .attr("cy", 150)
  .attr("r", 80)
  .attr("fill", "steelblue");

