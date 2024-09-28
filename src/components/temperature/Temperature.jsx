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
  console.log(data);

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

        let airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`;

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
      style={{ width: '18rem', position: 'absolute', bottom: 16, left: 16 }}
    >
      <Card.Body>
        <Card.Title>Temperature in {cityValue}</Card.Title>
        <Card.Text>
          <div>☀️ Temperature: {data.temp}</div>
          <div>⛅ Feels like: {data.feelsLike}</div>
          <div>☁️ Pressure {data.pressure}</div>
          <div>💚 Air Quality {data.pollution}</div>
        </Card.Text>
        <Button variant='primary'>Reload</Button>
      </Card.Body>
    </Card>
  );
}

export default Temperature;
