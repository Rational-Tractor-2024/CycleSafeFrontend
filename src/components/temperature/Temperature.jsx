import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const key = '6f99366a82f7397dbbb3fdc8dfbf5595';

const initialState = {
  temp: 20,
  pollution: 0,
  feelsLike: 20,
  pressure: 1000,
};

function Temperature() {
  const [data, setData] = useState(initialState);
  const cityValue = 'Krakow'; // Predefined city

  useEffect(() => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.cod === '404') {
          throw new Error('City not found');
        }

        let lat = data.coord.lat;
        let lon = data.coord.lon;

        let airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`;

        return Promise.all([
          data,
          fetch(airPollutionUrl).then((resp) => resp.json()),
        ]);
      })
      .then(([weatherData, airData]) => {
        setData({
          temp: weatherData.main.temp,
          feelsLike: weatherData.main.feels_like,
          pressure: weatherData.main.pressure,
          pollution: airData.list[0].main.aqi,
        });
      });
  }, []);
  return (
    <Card
      style={{ width: '18rem', position: 'absolute', bottom: 16, right: 16 }}
    >
      <Card.Body>
        <Card.Title>Temperature in {cityValue}</Card.Title>
        <Card.Text>
          <span style={{ display: 'block' }}>☀️ Temperature: {data.temp}</span>
          <span style={{ display: 'block' }}>
            ⛅ Feels like: {data.feelsLike}
          </span>
          <span style={{ display: 'block' }}>☁️ Pressure {data.pressure}</span>
          <span style={{ display: 'block' }}>
            💚 Air Quality {data.pollution}
          </span>
        </Card.Text>
        <Button variant='primary'>Reload</Button>
      </Card.Body>
    </Card>
  );
}

export default Temperature;
