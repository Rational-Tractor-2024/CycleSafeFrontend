import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from './components/map/Map';

function App() {
  document.title = '🚴‍♀️ CycleSafe';
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Map />} />
        <Route path='map' element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
