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
  let popup;

  let mousePopupOpenOrigin = {
    x: 0,
    y: 0
  };

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

  async function handleSubmitRoute() {
    let blue = '#4a90e2';
    let purple = '#4f4ae2';
    let cyan = '#4ad6e2';
    await CreateRoute('route1', 'bicycle', 'line', blue);
    await CreateRoute('route2', 'pedestrian', 'line', purple);
    await CreateRoute('route3', 'car', 'line', cyan);
  }

  useEffect(() => {
    function removeLayer(layerId) {
      if (map?.getLayer(layerId)) {
        map.removeLayer(layerId);
        map.removeSource(layerId);
      }
    }

    // function findFirstBuildingLayerId() {
    //   var layers = map.getStyle().layers;
    //   for (var index in layers) {
    //     if (layers?.[index].type === 'fill-extrusion') {
    //       return layers[index].id;
    //     }
    //   }

    //   throw new Error(
    //     'Map style does not contain any layer with fill-extrusion type.'
    //   );
    // }

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

    removeLayer('route1');
    removeLayer('route2');
    removeLayer('route3');

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

  async function CreateRoute(routeId, travelMode, styleType, styleColor) {
    if (map.getLayer(routeId)) {
      map.removeLayer(routeId);
      map.removeSource(routeId);
    }
    let results = await Promise.all([
      ts.services.geocode({
        key: apiKey,
        query: source,
      }),
      ts.services.geocode({
        key: apiKey,
        query: target,
      }),
    ])
    console.log(results);
    const sourceLat = results[0].results[0].position.lat;
    const sourceLng = results[0].results[0].position.lng;

    const targetLat = results[1].results[0].position.lat;
    const targetLng = results[1].results[0].position.lng;
    let factory = await ts.services.calculateRoute({
      key: apiKey,
      traffic: false,
      locations: `${sourceLng},${sourceLat}:${targetLng},${targetLat}`,
      travelMode: travelMode,
    });

    var geojson = factory.toGeoJson();
    let features = factory.toGeoJson().features;
    let summary = features[0].properties.summary;
    let coordinates = features[0].geometry.coordinates;
    let lngLat = coordinates[Math.floor(coordinates.length / 2)];

    await map.addLayer(
      {
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
      },
    );
    map.on('mouseover', routeId, onPopupTrigger);
    //createPopup(summary, lngLat);
  }

  
  function checkPopupShouldClose(e) {
    console.log('check popup should close', e, mousePopupOpenOrigin);
    let distance = (mousePopupOpenOrigin.x - e.clientX)**2 + (mousePopupOpenOrigin.y - e.clientY)**2;
    if(distance > 2000 && e.target.closest('.mapboxgl-popup-content') === null) {
      if(popup) popup.remove();
      window.removeEventListener('mousemove', checkPopupShouldClose);
      console.log('distance grater - closing');
    }
  }

  function onPopupTrigger(event) {
    console.log(event);
    //infoHint.hide();
    if (popup) {
      popup.remove();
    }
    var feature = JSON.parse(event.features[0].properties.summary);

    createPopup(feature, event.lngLat);
    window.removeEventListener('mousemove', checkPopupShouldClose);
    mousePopupOpenOrigin.x = event.originalEvent.clientX;
    mousePopupOpenOrigin.y = event.originalEvent.clientY;
    window.addEventListener('mousemove', checkPopupShouldClose);
  }

  function createPopup(feature, lngLat) {
    popup = new tt.Popup({ className: 'tt-popup', offset: [0, 0] })
      .setLngLat(lngLat)
      .setHTML(
        '<div class="tt-pop-up-container">' +
        '<div class="pop-up-content -small">' +
        '<div class="pop-up-result-address">' +
        'Distance: ' + feature.lengthInMeters +
        '</div>' +
        '<div class="pop-up-result-address">' +
        'Estimated travel time: ' +
        feature.travelTimeInSeconds +
        '</div>' +
        '<div class="pop-up-result-address">' +
        'Traffic delay: ' + feature.trafficDelayInSeconds +
        '</div>' +
        '</div>' +
        '</div>'
      )
      .setMaxWidth('none');
    // popup.addEventListener("onmouseleave", (e) => {
    //   if (popup) {
    //     popup.remove();
    //   }
    // });
    popup.addTo(map);
  }
}

export default Map;
