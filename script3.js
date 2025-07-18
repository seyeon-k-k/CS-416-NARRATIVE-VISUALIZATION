
const svg3 = d3.select("#scene3-vis")
  .append("svg")
  .attr("width", 800)  // 너비 증가: 레전드 공간 확보
  .attr("height", 680);

const margin3 = { top: 40, right: 120, bottom: 60, left: 60 };
const width3 = 800 - margin3.left - margin3.right;
const height3 = 680 - margin3.top - margin3.bottom;

const chart3 = svg3.append("g")
  .attr("transform", `translate(${margin3.left}, ${margin3.top})`);

// CSV file processing
d3.csv("Scene3.csv").then(data => {
  data.forEach(d => {
    d.saving = +d.youSaveSpend;
    d.co2 = +d.co2;
    d.mpg = +d.comb08;
    d.class = d.VClass;
    d.type = d.atvType;
    d.make = d.make;
    d.model = d.model;
  });
});

  
