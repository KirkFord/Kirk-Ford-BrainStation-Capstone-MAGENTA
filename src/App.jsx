import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import ThreeGallery from './components/ThreeGallery/ThreeGallery';
import Guestbook from './components/Guestbook/Guestbook';
import ArtistSubmissionForm from './components/ArtistSubmissionForm/ArtistSubmissionForm'; 
import WebGallery from './components/WebGallery/WebGallery'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gallery" element={<ThreeGallery />} />
        <Route path="/guestbook" element={<Guestbook />} />
        <Route path="/submit-artwork" element={<ArtistSubmissionForm />} /> 
        <Route path="/web-gallery" element={<WebGallery />} /> 
      </Routes>
    </Router>
  );
}

export default App;
