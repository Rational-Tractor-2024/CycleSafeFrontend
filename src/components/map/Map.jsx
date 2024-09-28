import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';
import { useEffect, useState, useRef } from 'react';

const apiKey = 'MRhc4UF0QIXq32ejONQd12W3bu2vGYlL';
const refreshTimeInMillis = 30000;
function Map() {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [mapLongitude, setMapLongitude] = useState(19.944544);
  const [mapLatitude, setMapLatitude] = useState(50.049683);
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    let trafficFlowTilesTier = new tt.TrafficFlowTilesTier({
      key: apiKey,
      style: '',
      refresh: refreshTimeInMillis,
    });
    let map = tt.map({
      key: 'MRhc4UF0QIXq32ejONQd12W3bu2vGYlL',
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: mapZoom,
    });
    map.addTier(trafficFlowTilesTier);
    setMap(map);
    return () => map.remove();
  }, [mapLongitude, mapLatitude, mapZoom]);
  return <div ref={mapElement} className='mapDiv' />;
}

export default Map;
