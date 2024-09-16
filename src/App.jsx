import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import ThreeGallery from './components/ThreeGallery/ThreeGallery';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<ThreeGallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;