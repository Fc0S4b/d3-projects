const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const savedData = localStorage.getItem('savedData');
const loadingMessage = document.getElementById('loading');

const w = 800;
const h = 800;
const padding = 50;
const width = w - padding;
const height = h - padding;

if (savedData) {
  document.getElementById('loading').style.display = 'none';
  const parseData = JSON.parse(savedData);
  loadingMessage.style.display = 'none';
  createChart(parseData);
} else {
  loadingMessage.style.display = 'block';
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error en la solicitud de datos');
      }
      return response.json();
    })
    .then((data) => {
      loadingMessage.style.display = 'none';
      localStorage.setItem('savedData', JSON.stringify(data));
      createChart(data);
      loadingMessage.style.display = 'none';
    })
    .catch((error) => console.error('Error:', error));
}

function createChart(parseData) {
  const data = parseData.data;
  const { xScale, yScale } = createAxisScale(data);
  const barWidth = width / data.length;

  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', w + 20)
    .attr('height', h + 20);

  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => padding + i * barWidth)
    .attr('y', (d, i) => yScale(d[1]))
    .attr('width', barWidth)
    .attr('height', (d) => height - yScale(d[1]))
    .style('fill', '#1B3366');

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(' + padding + ',' + height + ')')
    .call(xAxis);
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ',0)')
    .call(yAxis);
}

function formatXAxis(data) {
  const years = data.map((year) => {
    return year[0].substring(0, 4);
  });
  return years;
}

function createAxisScale(data) {
  const xYears = formatXAxis(data);

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(xYears), d3.max(xYears)])
    .nice()
    .range([0, 750]);

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, (data) => data[1]), d3.max(data, (data) => data[1])])
    .range([height, padding]);

  return {
    xScale,
    yScale,
  };
}
