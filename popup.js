let waterHardnessData = {};
let pricingData = {};

// Fetch water hardness data
fetch(chrome.runtime.getURL('data.json'))
  .then(response => response.json())
  .then(data => {
    waterHardnessData = data;
  })
  .catch(error => console.error('Error loading data:', error));

// Fetch pricing data
fetch(chrome.runtime.getURL('prices.json'))
  .then(response => response.json())
  .then(data => {
    pricingData = data;
  })
  .catch(error => console.error('Error loading data:', error));

document.getElementById('cityInput').addEventListener('input', function() {
  const input = document.getElementById('cityInput').value.toUpperCase();
  showSuggestions(input);
});

document.getElementById('fetchData').addEventListener('click', function() {
  const city = document.getElementById('cityInput').value.toUpperCase();
  fetchData(city);
});

function showSuggestions(input) {
  const suggestionsContainer = document.getElementById('suggestions');
  suggestionsContainer.innerHTML = '';
  if (input.length === 0) return;

  const suggestions = Object.keys(waterHardnessData).filter(city => city.startsWith(input));
  suggestions.forEach(city => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.innerText = city;
    suggestionItem.addEventListener('click', function() {
      document.getElementById('cityInput').value = city;
      suggestionsContainer.innerHTML = '';
    });
    suggestionsContainer.appendChild(suggestionItem);
  });
}

function fetchData(city) {
  const waterHardness = waterHardnessData[city] || "Unknown";
  const prices = pricingData[waterHardness.toLowerCase()] || [];

  let resultsHTML = `<p>Water Hardness: ${waterHardness}</p><table><tr><th>Model/Tank Type</th><th>Price</th><th>Price with Tax</th><th>Enercare Price</th></tr>`;
  prices.forEach(item => {
    resultsHTML += `<tr><td>${item.type}</td><td>${item.price}</td><td>${item.price_with_tax}</td><td>${item.enercare_price}</td></tr>`;
  });
  resultsHTML += `</table>`;

  document.getElementById('results').innerHTML = resultsHTML;
}
