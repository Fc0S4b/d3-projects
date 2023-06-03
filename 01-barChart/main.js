const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const savedData = localStorage.getItem('savedData');
const loadingMessage = document.getElementById('loading');

const w = 800;
const h = 600;
const padding = 50;
const margin = 20;

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
  const { xScale, yScale, barHeightScale, hzScale } = createScale(data);
  const barWidth = (w - 2 * padding) / data.length;

  // canvas
  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', w + margin)
    .attr('height', h + margin);

  // bars
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('height', (d) => barHeightScale(d[1]))
    .attr('width', barWidth)
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('x', (d, i) => hzScale(i))
    .attr('y', (d, i) => yScale(d[1]))
    .style('fill', '#1C3738');

  //  axis

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);
}

function formatXAxis(data) {
  const years = data.map((year) => {
    return new Date(year[0]);
  });
  return years;
}

function createScale(data) {
  const xYears = formatXAxis(data);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(xYears), d3.max(xYears)])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (data) => data[1])])
    .range([h - padding, padding]);

  const barHeightScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => {
        return d[1];
      }),
    ])
    .range([0, h - 2 * padding]);

  const hzScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([padding, w - padding]);

  return {
    xScale,
    yScale,
    barHeightScale,
    hzScale,
  };
}
