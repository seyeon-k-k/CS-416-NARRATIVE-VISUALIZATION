
// SVG setting
const svg = d3.select("#scene2-vis")
  .append("svg")
  .attr("width", 680)  // 너비 증가: 레전드 공간 확보
  .attr("height", 480);

const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = 480 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

const chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
    .range([0, width]);
  
  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x2));

  chart.append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("MPG or MPGe");

  const y2 = d3.scaleLinear()
    .domain(d3.extent(data, d => d.save))
    .nice()
    .range([height, 0]);

  chart.append("g")
    .call(d3.axisLeft(y2));

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -45)
    .attr("text-anchor", "middle")
    .text("5년 연료비 절감/비용 ($)");
  
  chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x2(d.mpg))
    .attr("cy", d => y2(d.save))
    .attr("r", 5)
    .attr("fill", d => getColor(d.type))
    .attr("opacity", 0.7);
