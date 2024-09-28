import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Map from './components/map/Map';
import Homepage from './components/homepage/Homepage';

function App() {
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
