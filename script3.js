
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
    d.trim = d.trany;
  });

// 전체 select 요소 선택
const makeSelect = d3.select("#make-select");
const yearSelect = d3.select("#year-select");
const modelSelect = d3.select("#model-select");
const trimSelect = d3.select("#trim-select");

//초기 드롭다운
  makeSelect.append("option").text("Select Make").attr("value", "");
  yearSelect.append("option").text("Select Year").attr("value", "");
  modelSelect.append("option").text("Select Model").attr("value", "");
  trimSelect.append("option").text("Select Trim").attr("value", "");

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
  // model 선택 시 trim 옵션 업데이트
  modelSelect.on("change", function () {
    const selectedMake = makeSelect.property("value");
    const selectedYear = +yearSelect.property("value");
    const selectedModel = this.value;

    const filteredTrims = [...new Set(
      data
        .filter(d =>
          d.make === selectedMake &&
          d.year === selectedYear &&
          d.model === selectedModel
        )
        .map(d => d.trim)
    )].sort();

    trimSelect.selectAll("option").remove();
    trimSelect.append("option").text("Select Trim").attr("value", "");
    filteredTrims.forEach(trim =>
      trimSelect.append("option").text(trim).attr("value", trim)
    );
  });

d3.select("#scene3-search-btn").on("click", function () {
  const selectedMake = makeSelect.property("value");
  const selectedYear = +yearSelect.property("value");
  const selectedModel = modelSelect.property("value");
  const selectedTrim = trimSelect.property("value");

  const result = data.find(d =>
    d.make === selectedMake &&
    d.year === selectedYear &&
    d.model === selectedModel &&
    d.trim === selectedTrim
  );

d3.select("#scene3-vis").selectAll("svg").remove(); // 기존 차트 모두 삭제

const barWidth = 300;
const barHeight = 300;
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const innerWidth = barWidth - margin.left - margin.right;
const innerHeight = barHeight - margin.top - margin.bottom;

const dataArr = [
  { label: "MPG", value: result.mpg },
  { label: "Saving ($)", value: result.saving },
  { label: "CO₂ (g/mi)", value: result.co2 }
];

dataArr.forEach((d, i) => {
  const svg = d3.select("#scene3-vis")
    .append("svg")
    .attr("id", `bar-chart-${i}`)
    .attr("width", barWidth)
    .attr("height", barHeight)
    .style("display", "inline-block")  // 가로로 나란히 표시
    .style("vertical-align", "top")
    .style("margin-right", "20px");   // 차트 사이 간격

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // y축 스케일 (0 포함)
  const minVal = Math.min(0, d.value);
  const maxVal = Math.max(0, d.value);
  const yScale = d3.scaleLinear()
    .domain([minVal, maxVal])
    .range([innerHeight, 0]);

  // x축 스케일 (하나짜리라 그냥 0~innerWidth)
  const xScale = d3.scaleBand()
    .domain([d.label])
    .range([0, innerWidth])
    .padding(0.4);

  const zeroY = yScale(0);

  // X축 그리기
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));

  // Y축 그리기
  g.append("g")
    .call(d3.axisLeft(yScale));

  // 막대 그리기 (음수는 아래로)
  g.selectAll(".bar")
    .data([d])
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", xScale(d.label))
    .attr("width", xScale.bandwidth())
    .attr("y", d.value >= 0 ? yScale(d.value) : zeroY)
    .attr("height", Math.abs(yScale(d.value) - zeroY))
    .attr("fill", d.value >= 0 ? "#69b3a2" : "#d95f02");

  // 0 기준선 표시
  g.append("line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", zeroY)
    .attr("y2", zeroY)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // 차트 제목 (레이블)
  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(d.label);
  }
}
}
                          
});


  
