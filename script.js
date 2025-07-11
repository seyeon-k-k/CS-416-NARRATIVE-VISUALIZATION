// SVG setting
const svg = d3.select("#scene1-vis")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 400);

const margin = { top: 40, right: 40, bottom: 40, left: 200 };
const width = 1000 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// CSV file processing
d3.csv("Scene1.csv").then(data => {
  data.forEach(d => {
    d.mpg = +d.comb08;
    d.horsepower = +d.hpv;
  });

  // x axis: Horsepower
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.horsepower))
    .range([0, width]);

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  chart.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Horsepower");

  // y axis: MPG
  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.mpg))
    .range([height, 0]);

  chart.append("g")
    .call(d3.axisLeft(y));

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .text("MPG");

  // Scatter Plot
  chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.horsepower))
    .attr("cy", d => y(d.mpg))
    .attr("r", 4)
    .attr("fill", "#1f77b4")
    .attr("opacity", 0.7);

  // Tooltip
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "6px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("visibility", "hidden")
    .style("font-size", "12px");

  chart.selectAll("circle")
    .on("mouseover", (event, d) => {
      tooltip
        .html(`<strong>${d.model}</strong><br>MPG: ${d.mpg}<br>HP: ${d.horsepower}`)
        .style("visibility", "visible");
    })
    .on("mousemove", event => {
      tooltip
    .style("top", (event.clientY + 10) + "px")
    .style("left", (event.clientX + 10) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });
});
