let result = document.getElementById("result");

// Function to fetch weather details for Krakow and display them
let getWeather = () => {
  let cityValue = "Krakow";  // Predefined city

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;

  // Fetch weather data
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      if (data.cod === "404") {
        throw new Error("City not found");
      }

      let lat = data.coord.lat;
      let lon = data.coord.lon;

      // Fetch air pollution data using latitude and longitude
      let airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`;

      return Promise.all([data, fetch(airPollutionUrl).then((resp) => resp.json())]);
    })
    .then(([weatherData, airData]) => {
      console.log(weatherData);
      console.log(airData);

      // Display weather and air quality data
      result.innerHTML = `
        <h2>${weatherData.name}</h2>
        <h4 class="weather">${weatherData.weather[0].main}</h4>
        <h4 class="desc">${weatherData.weather[0].description}</h4>
        <img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png">
        <h1>${weatherData.main.temp} &#176;C</h1>
        <div class="temp-container">
            <div>
                <h4 class="title">Feels like</h4>
                <h4 class="temp">${weatherData.main.feels_like} &#176;C</h4>
            </div>
            <div>
                <h4 class="title">Air Quality (AQI)</h4>
                <h4 class="temp">${airData.list[0].main.aqi}</h4>
            </div>
        </div>
      `;
    })
    // If city name is NOT valid
    .catch((error) => {
      result.innerHTML = `<h3 class="msg">City not found</h3>`;
      console.error(error);
    });
};

// Automatically fetch weather for Krakow when the page loads
window.addEventListener("load", getWeather);
