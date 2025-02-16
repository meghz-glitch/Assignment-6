document.getElementById('search-button').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim(); // Fixed 'Value'
  if (!city) {
    showError("Please enter a city name.");
    return;
  }
  document.getElementById('search-button').disabled = true; // Disable button during fetch
  getCoordinates(city);
});

function getCoordinates(city) {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
  fetch(geoUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch location data.");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        throw new Error("City not found.");
      }
      const { latitude, longitude, name } = data.results[0];
      fetchWeatherData(latitude, longitude, name);
    })
    .catch((error) => {
      showError(error.message);
      document.getElementById('search-button').disabled = false; // Re-enable button
    });
}

function fetchWeatherData(latitude, longitude, cityName) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unable to fetch weather data.");
      }
      return response.json();
    })
    .then((data) => {
      const { temperature, windspeed, weathercode } = data.current_weather || {};
      if (temperature === undefined || windspeed === undefined || weathercode === undefined) {
        throw new Error("Incomplete weather data received.");
      }
      displayWeather(cityName, temperature, windspeed, weathercode);
      document.getElementById('search-button').disabled = false; // Re-enable button
    })
    .catch((error) => {
      showError(error.message);
      document.getElementById('search-button').disabled = false; // Re-enable button
    });
}

function displayWeather(cityName, temperature, windspeed, weathercode) {
  const conditions = {
    0: "Clear sky",
    1: "Partly cloudy",
    2: "Mainly clear",
    3: "Overcast",
    4: "Foggy",
    4: "Depositing rime fog",
    5: "Drizzle: Light",
    5: "Drizzle: Moderate",
    5: "Drizzle: Dense intensity",
    6: "Rain: Light",
    6: "Rain: Moderate",
    6: "Rain: Heavy intensity",
    7: "Snow: Slight",
    7: "Snow: Moderate",
    7: "Snow: Heavy",
    9: "Thunderstorm: Slight or moderate",
    9: "Thunderstorm: Heavy",
  };

  document.getElementById('city-name').textContent = cityName;
  document.getElementById('temperature').textContent = temperature;
  document.getElementById('wind-speed').textContent = windspeed;
  document.getElementById('condition').textContent =
    conditions[weathercode] || "Unknown";

  document.getElementById('weather-result').classList.remove('hidden');
  document.getElementById('error-message').classList.add('hidden');
}

function showError(message) {
  document.getElementById('error-text').textContent = message;
  document.getElementById('error-message').classList.remove('hidden');
  document.getElementById('weather-result').classList.add('hidden');
 document.getElementById('search-button').disabled= false;
}
