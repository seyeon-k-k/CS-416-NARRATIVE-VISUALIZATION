
// SVG setting
const svg2 = d3.select("#scene2-vis")
  .append("svg")
  .attr("width", 800)  // 너비 증가: 레전드 공간 확보
  .attr("height", 680);

const margin2 = { top: 40, right: 120, bottom: 60, left: 60 };
const width2 = 800 - margin2.left - margin2.right;
const height2 = 680 - margin2.top - margin2.bottom;

const chart2 = svg2.append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// CSV file processing
d3.csv("Scene2.csv").then(data => {

  svg2.append("text")
  .attr("x", 800 / 2)
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .attr("font-size", "18px")
  .attr("font-weight", "bold")
  .text("2024 Fuel Efficiency vs. 5-Year Fuel Savings");
  
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
  "Gas": "#d62728", // 빨간색
  "Diesel": "#2ca02c"          // 초록색
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

  const legendData2 = Object.entries(colorMap);
    const legend2 = svg2.append("g")
    .attr("transform", `translate(${width2 + margin2.left + 20}, ${margin2.top})`);

  legendData2.forEach(([type, color], i) => {
    const row2 = legend2.append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    row2.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", color)
      .attr("stroke", "#000");

    row2.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .attr("font-size", "12px")
      .text(type);
  });
  
  d3.selectAll("#scene2-class-buttons button").on("click", function () {
    const selectedClass = d3.select(this).attr("data-class");

    // 모든 버튼 초기화
    d3.selectAll("#scene2-class-buttons button")
      .style("background-color", "white")
      .style("color", "black");

    // 클릭된 버튼 강조
    d3.select(this)
      .style("background-color", "#d3d3d3")
      .style("color", "black");

    // 점(circle) 업데이트: 해당 클래스만 강조
    svg2.selectAll("circle")
      .transition()
      .duration(500)
      .style("opacity", d => d.class === selectedClass ? 1 : 0)

  });


  
});
