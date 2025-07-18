
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

  // VClass별 평균 mpg 계산
  const mpgByClass = Array.from(
    d3.group(data, d => d.class),
    ([key, values]) => ({
      VClass: key,
      avgMPG: d3.mean(values, d => d.mpg)
    })
  ).sort((a, b) => d3.descending(a.avgMPG, b.avgMPG)); // MPG 내림차순 정렬

  // X, Y 스케일 설정
  const x3 = d3.scaleBand()
    .domain(mpgByClass.map(d => d.VClass))
    .range([0, width3])
    .padding(0.2);

  const y3 = d3.scaleLinear()
    .domain([0, d3.max(mpgByClass, d => d.avgMPG) + 5])
    .range([height3, 0]);

  // X축 추가
  chart3.append("g")
    .attr("transform", `translate(0, ${height3})`)
    .call(d3.axisBottom(x3))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px");

  // Y축 추가
  chart3.append("g")
    .call(d3.axisLeft(y3));

  // 바 차트 그리기
  chart3.selectAll(".bar")
    .data(mpgByClass)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x3(d.VClass))
    .attr("y", d => y3(d.avgMPG))
    .attr("width", x3.bandwidth())
    .attr("height", d => height3 - y3(d.avgMPG))
    .attr("fill", "#1f77b4");


  // 차트 제목
  chart3.append("text")
    .attr("x", width3 / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Average MPG and MPGe by Vehicle Class");
});

