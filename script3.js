
const svg3 = d3.select("#scene3-vis")
  .append("svg")
  .attr("width", 1000)  // 너비 증가: 레전드 공간 확보
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
    d.year = +d.year;
  });

    // 고유한 값 추출
  const makes = [...new Set(data.map(d => d.make))].sort();
  const models = [...new Set(data.map(d => d.model))].sort();
  const years = [...new Set(data.map(d => d.year))].sort();

  // 드롭다운에 옵션 추가
  const makeSelect = d3.select("#make-select");
  const modelSelect = d3.select("#model-select");
  const yearSelect = d3.select("#year-select");

  makes.forEach(make => makeSelect.append("option").text(make).attr("value", make));
  models.forEach(model => modelSelect.append("option").text(model).attr("value", model));
  years.forEach(year => yearSelect.append("option").text(year).attr("value", year));
});

  
