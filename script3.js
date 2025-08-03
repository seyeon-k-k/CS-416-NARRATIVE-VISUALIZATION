const svg3 = d3.select("#scene3-vis")
  .append("svg")
  .attr("width", 800)  // 너비 증가: 레전드 공간 확보
  .attr("height", 400);

const margin3 = { top: 40, right: 120, bottom: 40, left: 60 };
const width3 = 800 - margin3.left - margin3.right;
const height3 = 400 - margin3.top - margin3.bottom;

const chart3 = svg3.append("g")
  .attr("transform", `translate(${margin3.left}, ${margin3.top})`);

// CSV file processing
d3.csv("Scene3.csv").then(data => {
  data.forEach(d => {
    d.hpv = +d.hpv;
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

  // tooltip3 생성 위치는 여기 (데이터 로드 후 바로)
  const tooltip3 = d3.select("body").append("div")
    .attr("class", "tooltip3")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "8px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("pointer-events", "none") // 툴팁 위 마우스 이벤트 무시
    .style("font-size", "14px")
    .style("visibility", "hidden");

  // 전체 select 요소 선택
  const makeSelect = d3.select("#make-select");
  const yearSelect = d3.select("#year-select");
  const modelSelect = d3.select("#model-select");
  const trimSelect = d3.select("#trim-select");

  // 초기 드롭다운 옵션 세팅
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

    // year 옵션 초기화 및 추가
    yearSelect.selectAll("option").remove();
    yearSelect.append("option").text("Select Year").attr("value", "");
    filteredYears.forEach(year =>
      yearSelect.append("option").text(year).attr("value", year)
    );

    // model 초기화
    modelSelect.selectAll("option").remove();
    modelSelect.append("option").text("Select Model").attr("value", "");

    // trim 초기화
    trimSelect.selectAll("option").remove();
    trimSelect.append("option").text("Select Trim").attr("value", "");
  });

  // year 선택 시 model 옵션 업데이트
  yearSelect.on("change", function () {
    const selectedMake = makeSelect.property("value");
    const selectedYear = +this.value;

    const filteredModels = [...new Set(
      data
        .filter(d => d.make === selectedMake && d.year === selectedYear)
        .map(d => d.model)
    )].sort();

    modelSelect.selectAll("option").remove();
    modelSelect.append("option").text("Select Model").attr("value", "");
    filteredModels.forEach(model =>
      modelSelect.append("option").text(model).attr("value", model)
    );

    // trim 초기화
    trimSelect.selectAll("option").remove();
    trimSelect.append("option").text("Select Trim").attr("value", "");
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

  // 검색 버튼 클릭 시 2개의 별도 차트 생성
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

    const comparisonGroup = data.filter(d =>
      d.year === selectedYear &&
      d.type === result.type &&
      d.class === result.class
    );

    const avg = {
      mpg: d3.mean(comparisonGroup, d => d.mpg),
      saving: d3.mean(comparisonGroup, d => d.saving),
      hpv: d3.mean(comparisonGroup, d => d.hpv)
    };

    d3.select("#scene3-vis").selectAll("svg").remove(); // 기존 차트 모두 삭제

    if (!result) return; // 결과 없으면 종료

    const barWidth = 500;
    const barHeight = 500;
    const margin = { top: 40, right: 30, bottom: 50, left: 70 };
    const innerWidth = barWidth - margin.left - margin.right;
    const innerHeight = barHeight - margin.top - margin.bottom;

    const dataArr = [
  {
    label: "Horse Power",
    values: [
      { category: "Selected", value: result.hpv },
      { category: "Avg", value: avg.hpv }
    ]
  },
  {
    label: "MPG",
    values: [
      { category: "Selected", value: result.mpg },
      { category: "Avg", value: avg.mpg }
    ]
  }
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
      const values = d.values.map(v => v.value);
      const yMin = Math.min(0, d3.min(values) * 0.9);
      const yMax = d3.max(values) * 1.1;
      const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);

      // x축 스케일
    const xScale = d3.scaleBand()
    .domain(d.values.map(v => v.category))
    .range([0, innerWidth])
    .padding(0.4);

      const zeroY = yScale(0);

      // X축 그리기
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")  // <-- 축 레이블 선택
        .style("font-size", "14px")  // <-- 글씨 크기 변경
        .style("font-weight", "bold");

      // Y축 그리기
      g.append("g")
        .call(d3.axisLeft(yScale));

      // 막대 그리기 (음수는 아래로)
      g.selectAll(".bar")
        .data(d.values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", v => xScale(v.category))
        .attr("width", xScale.bandwidth())
        .attr("y", v => yScale(Math.abs(v.value)))  // 절대값 기준 y 위치
        .attr("height", v => innerHeight - yScale(Math.abs(v.value)))  // 절대값 기준 높이
        .attr("fill", v => v.category === "Selected" ? "#ff944d" : "#cccccc")
        .on("mouseover", (event, v) => {
          tooltip3.style("visibility", "visible")
        .html(() => {
          if (v.category === "Selected") {
            return `<strong>${v.category}</strong><br>
                    Make: ${result.make}<br>
                    Model: ${result.model}<br>
                    Year: ${result.year}<br>
                    Trim: ${result.trim}<br>
                    Car Type: ${result.type ? result.type : "Gas"}<br>
                    Car Class: ${result.class}<br>
                    ${d.label}: ${v.value.toFixed(2)}`;
          } else {
            return `<strong>${v.category}</strong><br>
                    Car Type: ${result.type ? result.type : "Gas"}<br>
                    Car Class: ${result.class}<br>
                    ${d.label}: ${v.value.toFixed(2)}`;
          }
        });
        })
        .on("mousemove", (event) => {
          tooltip3.style("top", (event.pageY + 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          tooltip3.style("visibility", "hidden");
        });

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
    });
  });
});
