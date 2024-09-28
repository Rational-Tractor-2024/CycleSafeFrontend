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
  const [map, setMap] = useState({});
  const [mapLongitude, setMapLongitude] = useState(19.944544);
  const [mapLatitude, setMapLatitude] = useState(50.049683);
  const [mapZoom, setMapZoom] = useState(13);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');

  function findFirstBuildingLayerId() {
    var layers = map.getStyle().layers;
    for (var index in layers) {
      if (layers[index].type === 'fill-extrusion') {
        return layers[index].id;
      }
    }

    throw new Error(
      'Map style does not contain any layer with fill-extrusion type.'
    );
  }

  function handleSubmitRoute() {
    if (map.getLayer('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }
    Promise.all([
      ts.services.geocode({
        key: apiKey,
        query: source,
      }),
      ts.services.geocode({
        key: apiKey,
        query: target,
      }),
    ])
      .then((results) => {
        console.log(results);
        const sourceLat = results[0].results[0].position.lat;
        const sourceLng = results[0].results[0].position.lng;

        const targetLat = results[1].results[0].position.lat;
        const targetLng = results[1].results[0].position.lng;

        return ts.services.calculateRoute({
          key: apiKey,
          traffic: false,
          locations: `${sourceLng},${sourceLat}:${targetLng},${targetLat}`,
        });
      })
      .then(function (response) {
        var geojson = response.toGeoJson();
        map.addLayer(
          {
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson,
            },
            paint: {
              'line-color': '#4a90e2',
              'line-width': 6,
            },
          },
          findFirstBuildingLayerId()
        );
      });
  }

  useEffect(() => {
    function removeLayer(layerId) {
      if (map?.getLayer(layerId)) {
        map.removeLayer(layerId);
        map.removeSource(layerId);
      }
    }

    function findFirstBuildingLayerId() {
      var layers = map.getStyle().layers;
      for (var index in layers) {
        if (layers?.[index].type === 'fill-extrusion') {
          return layers[index].id;
        }
      }

      throw new Error(
        'Map style does not contain any layer with fill-extrusion type.'
      );
    }

    let map = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: mapZoom,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
    });

    removeLayer('route');

    const routePoints = {
      start: [19.944544, 50.049683],
      finish: [20.04758, 50.073377],
    };

    // ts.services
    //   .calculateRoute({
    //     key: apiKey,
    //     traffic: false,
    //     locations: [routePoints.start, routePoints.finish],
    //   })
    //   .then(function (response) {
    //     var geojson = response.toGeoJson();
    //     map.addLayer(
    //       {
    //         id: 'route',
    //         type: 'line',
    //         source: {
    //           type: 'geojson',
    //           data: geojson,
    //         },
    //         paint: {
    //           'line-color': '#4a90e2',
    //           'line-width': 6,
    //         },
    //       },
    //       findFirstBuildingLayerId()
    //     );
    //   });

    setMap(map);
    return () => map.remove();
  }, [mapLongitude, mapLatitude, mapZoom]);
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
