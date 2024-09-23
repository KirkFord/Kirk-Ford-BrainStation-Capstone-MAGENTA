import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage/LandingPage';
import ThreeGallery from './components/ThreeGallery/ThreeGallery';
import Guestbook from './components/Guestbook/Guestbook';
import ArtistSubmissionForm from './components/ArtistSubmissionForm/ArtistSubmissionForm';
import WebGallery from './components/WebGallery/WebGallery';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function AnimatedRoutes() {
  const location = useLocation();

  const pageTransition = {
    duration: 2,
    ease: "easeInOut"
  };

  const pageVariants = {
    initial: { opacity: 0, position: "absolute", width: "100%" },
    animate: { opacity: 1, position: "absolute", width: "100%" },
    exit: { opacity: 0, position: "absolute", width: "100%" }
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/gallery"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ThreeGallery />
            </motion.div>
          }
        />
        <Route
          path="/guestbook"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Guestbook />
            </motion.div>
          }
        />
        <Route
          path="/submit-artwork"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ArtistSubmissionForm />
            </motion.div>
          }
        />
        <Route
          path="/web-gallery"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <WebGallery />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div id="g-pointer-1" className="custom-cursor"></div>
      <div id="g-pointer-2" className="custom-cursor"></div>
      <div style={{ position: "relative" }}>
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
