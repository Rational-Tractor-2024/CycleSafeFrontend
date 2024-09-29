import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';
import * as ts from '@tomtom-international/web-sdk-services';
import { useEffect, useState, useRef } from 'react';
import NavBar from '../navbar/NavBar';
import Temperature from '../temperature/Temperature';
import Route from '../route/Route';

const apiKey = 'MRhc4UF0QIXq32ejONQd12W3bu2vGYlL';
function Map() {
  const mapElement = useRef();
  const [map, setMap] = useState(null);
  const [mapLongitude, setMapLongitude] = useState(19.944544);
  const [mapLatitude, setMapLatitude] = useState(50.049683);
  const [mapZoom, setMapZoom] = useState(13);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const listener = useRef();

  async function handleSubmitRoute() {
    let blue = '#4a90e2';
    let purple = '#4f4ae2';
    let cyan = '#4ad6e2';
	document.querySelector('#side-menu').classList.add('show-loader')
    await CreateRoute('route1', 'bicycle', 'line', blue);
    await CreateRoute('route2', 'pedestrian', 'line', purple);
    await CreateRoute('route3', 'car', 'line', cyan);
	document.querySelector('#side-menu').classList.remove('show-loader')
  }

  async function createRoute(routeId, travelMode, styleType, styleColor) {
    if (map.getLayer(routeId)) {
      map.removeLayer(routeId);
      map.removeSource(routeId);
    }

    Promise.all([
      !source.includes(',')
        ? ts.services.geocode({
            key: apiKey,
            query: source,
          })
        : Promise.resolve(),
      !target.includes(',')
        ? ts.services.geocode({
            key: apiKey,
            query: target,
          })
        : Promise.resolve(),
    ])
      .then((results) => {
        let sourceLat, sourceLng, targetLat, targetLng;
        if (!results[0]) {
          [sourceLat, sourceLng] = source.split(',');
        } else {
          sourceLat = results[0].results[0].position.lat;
          sourceLng = results[0].results[0].position.lng;
        }

        if (!results[1]) {
          [targetLat, targetLng] = target.split(',');
        } else {
          targetLat = results[1].results[0].position.lat;
          targetLng = results[1].results[0].position.lng;
        }
        return ts.services.calculateRoute({
          key: apiKey,
          traffic: false,
          locations: `${sourceLng},${sourceLat}:${targetLng},${targetLat}`,
          travelMode: travelMode,
        });
      })
      .then(function (response) {
        var geojson = response.toGeoJson();
        map.addLayer({
          id: routeId,
          type: styleType,
          source: {
            type: 'geojson',
            data: geojson,
          },
          paint: {
            'line-color': styleColor,
            'line-width': 6,
          },
        });
      });
  }
  useEffect(() => {
    function handleMapClick(e) {
      const { lat, lng } = e.lngLat;
      if (!source) {
        setSource(`${lat},${lng}`);
      } else if (!target) {
        setTarget(`${lat},${lng}`);
      }
    }
    let m = map;
    if (!m) {
      m = tt.map({
        key: apiKey,
        container: mapElement.current,
        center: [mapLongitude, mapLatitude],
        zoom: mapZoom,
        stylesVisibility: {
          trafficIncidents: true,
          trafficFlow: true,
        },
      });
    }

    m.once('click', handleMapClick);

    setMap(m);

    return;
  }, [mapLongitude, mapLatitude, mapZoom, listener, source, target, map]);

  return (
    <div>
      <NavBar />

      <div ref={mapElement} className='mapDiv' />
      <Route
        source={source}
        target={target}
        setSource={setSource}
        setTarget={setTarget}
        onSubmit={handleSubmitRoute}
      />
      <Temperature />
    </div>
  );
}

export default Map;
