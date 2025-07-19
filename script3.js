
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

// 전체 select 요소 선택
const makeSelect = d3.select("#make-select");
const yearSelect = d3.select("#year-select");
const modelSelect = d3.select("#model-select");

// make 드롭다운 채우기
const makes = [...new Set(data.map(d => d.make))].sort();
makes.forEach(make => makeSelect.append("option").text(make).attr("value", make));

// make 선택 시 year 옵션 업데이트
makeSelect.on("change", function () {
  const selectedMake = this.value;

  // 해당 make에 해당하는 연도 추출
  const filteredYears = [...new Set(
    data.filter(d => d.make === selectedMake).map(d => d.year)
  )].sort();

  // 기존 year 옵션 초기화 후 재구성
  yearSelect.selectAll("option").remove();
  yearSelect.append("option").text("Select Year").attr("value", "");
  filteredYears.forEach(year =>
    yearSelect.append("option").text(year).attr("value", year)
  );

  // model 초기화
  modelSelect.selectAll("option").remove();
  modelSelect.append("option").text("Select Model").attr("value", "");
});

// year 선택 시 model 옵션 업데이트
yearSelect.on("change", function () {
  const selectedMake = makeSelect.property("value");
  const selectedYear = +this.value;

  // 해당 make + year에 해당하는 모델 추출
  const filteredModels = [...new Set(
    data
      .filter(d => d.make === selectedMake && d.year === selectedYear)
      .map(d => d.model)
  )].sort();

  // 기존 model 옵션 초기화 후 재구성
  modelSelect.selectAll("option").remove();
  modelSelect.append("option").text("Select Model").attr("value", "");
  filteredModels.forEach(model =>
    modelSelect.append("option").text(model).attr("value", model)
  );
});

});

  
