import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const key = '6f99366a82f7397dbbb3fdc8dfbf5595';
const initialState = {
  temp: 20,
  pollution: 0,
  feelsLike: 20,
  pressure: 1000,
  driving_difficulty: 'Clear',
};

export default function Temperature() {
  const [data, setData] = useState(initialState);
  const [location, setLocation] = useState({ lat: null, lon: null });

  // Function to get user's location
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
          // Optionally handle default location (e.g., Krakow)
          setLocation({ lat: 50.0647, lon: 19.945 });
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setLocation({ lat: 50.0647, lon: 19.945 }); // Default to Krakow
    }
  }

  // Fetch weather data based on location
  useEffect(() => {
    if (!location.lat || !location.lon) return;

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${key}&units=metric`;

    fetch(url)
      .then((resp) => resp.json())
      .then((weatherData) => {
        if (weatherData.cod === '404') {
          throw new Error('City not found');
        }

        let airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${key}`;

        return Promise.all([
          weatherData,
          fetch(airPollutionUrl).then((resp) => resp.json()),
        ]);
      })
      .then(([weatherData, airData]) => {
        setData({
          temp: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          pressure: weatherData.main.pressure,
          pollution: airData.list[0].main.aqi,
          driving_difficulty: weatherData.weather[0].description,
        });
      })
      .catch((error) => console.error(error));
  }, [location]);

  // Call getUserLocation on page load
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to reload the weather data
  const handleReload = () => {
    getUserLocation();
  };

  return (
    <Card
      style={{ width: '18rem', position: 'absolute', bottom: 16, right: 16 }}
    >
      <Card.Body>
        <Card.Title>Temperature</Card.Title>
        <Card.Text>
          <span style={{ display: 'block' }}>
            ☀️ Temperature: {data.temp}°C
          </span>
          <span style={{ display: 'block' }}>
            ⛅ Feels like: {data.feelsLike}°C
          </span>
          <span style={{ display: 'block' }}>
            ☁️ Pressure: {data.pressure} hPa
          </span>
          <span style={{ display: 'block' }}>
            💚 Air Quality: {data.pollution}
          </span>
          <span style={{ display: 'block' }}>
            🚗 Driving Difficulty: {data.driving_difficulty}
          </span>
        </Card.Text>
        <Button variant='primary' onClick={handleReload}>
          Reload
        </Button>
      </Card.Body>
    </Card>
  );
}
