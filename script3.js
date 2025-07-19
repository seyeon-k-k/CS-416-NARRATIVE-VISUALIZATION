
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

  // 기존 차트 제거
d3.select("#bar-chart").remove(); 

  if (result) {
    const chartData = [
      { label: "MPG", value: result.mpg },
      { label: "Saving ($)", value: result.saving },
      { label: "CO₂ (g/mi)", value: result.co2 }
    ];

    const barWidth = 500;
    const barHeight = 300;
    const margin = { top: 40, right: 30, bottom: 50, left: 70 };
    const innerWidth = barWidth - margin.left - margin.right;
    const innerHeight = barHeight - margin.top - margin.bottom;

    const svg = d3.select("#scene3-vis")
      .append("svg")
      .attr("id", "bar-chart")
      .attr("width", barWidth)
      .attr("height", barHeight);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X, Y 스케일
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) * 1.2])
      .range([innerHeight, 0]);

    // X축 그리기
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Y축 그리기
    g.append("g")
      .call(d3.axisLeft(yScale));

    // 바 그리기
    g.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.label))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.value))
      .attr("fill", "#69b3a2");
  }

});
});

  
