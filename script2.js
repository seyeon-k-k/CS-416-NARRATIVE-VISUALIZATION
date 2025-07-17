
// SVG setting
const svg2 = d3.select("#scene2-vis")
  .append("svg")
  .attr("width", 680)  // 너비 증가: 레전드 공간 확보
  .attr("height", 480);

const margin2 = { top: 40, right: 40, bottom: 60, left: 60 };
const width2 = 480 - margin2.left - margin2.right;
const height2 = 480 - margin2.top - margin2.bottom;

const chart2 = svg2.append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// CSV file processing
d3.csv("Scene2.csv").then(data => {
  data.forEach(d => {
    d.mpg = +d.comb08;
    d.save = +d.youSaveSpend;
    d.class = d.VClass;
    d.type = d.atvType;
    d.make = d.make;
    d.model = d.model;
  });

  console.log("Parsed data:", data.slice(0, 5));

  const colorMap = {
  "EV": "#1f77b4",        // 파란색
  "FCV": "#9467bd",       // 연보라색
  "Hybrid": "#ffdd00",    // 노란색
  "Plug-in Hybrid": "#ff7f0e", // 주황색
  "Gas": "#d62728" // 빨간색
  };

  const getColor = (type) => {
    if (!type) return "#d62728";
    return colorMap[type] || "#7f7f7f";
  };

  const x2 = d3.scaleLinear()
    .domain(d3.extent(data, d => d.mpg))
    .nice()
    .range([0, width2]);
  
  chart2.append("g")
    .attr("transform", `translate(0, ${height2})`)
    .call(d3.axisBottom(x2));

  chart2.append("text")
    .attr("x", width2 / 2)
    .attr("y", height2 + 40)
    .attr("text-anchor", "middle")
    .text("MPG or MPGe");

  const y2 = d3.scaleLinear()
    .domain(d3.extent(data, d => d.save))
    .nice()
    .range([height2, 0]);

  chart2.append("g")
    .call(d3.axisLeft(y2));

  chart2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height2 / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .text("5-Year Fuel Savings ($)");
  
  chart2.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x2(d.mpg))
    .attr("cy", d => y2(d.save))
    .attr("r", 5)
    .attr("fill", d => getColor(d.type))
    .attr("opacity", 0.7);

  const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background", "white")
  .style("padding", "6px")
  .style("border", "1px solid #ccc")
  .style("border-radius", "4px")
  .style("visibility", "hidden")
  .style("font-size", "12px");

chart2.selectAll("circle")
  .on("mouseover", (event, d) => {
    tooltip
      .html(`<strong>${d.make} ${d.model}</strong><br>
            MPG or MPGe: ${d.mpg}<br>
            5-Year Fuel Savings: $${d.save}`)
      .style("visibility", "visible");
  })
  .on("mousemove", (event) => {
    tooltip.style("top", `${event.pageY - 10}px`)
           .style("left", `${event.pageX + 10}px`);
  })
  .on("mouseout", () => {
    tooltip.style("visibility", "hidden");
  });
});
