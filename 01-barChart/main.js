const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const savedData = localStorage.getItem('savedData');

const loadingMessage = document.getElementById('loading');

if (savedData) {
  document.getElementById('loading').style.display = 'none';
  const parseData = JSON.parse(savedData);
  console.log(parseData);
  loadingMessage.style.display = 'none';
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
    })
    .catch((error) => console.error('Error:', error));
}
