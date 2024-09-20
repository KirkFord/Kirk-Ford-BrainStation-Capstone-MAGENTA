// Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AccessibilityModal from '../AccessibilityModal/AccessibilityModal';
import './Header.scss';

const Header = () => {
    const [isAccessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
    const [settings, setSettings] = useState({
        cursorOn: true,
        animationsOn: true,
        fontSize: 100,
        highContrast: false,
        screenReaderHints: true,
        keyboardNavigation: true,
        simplifiedMode: false,
        autoPlayOn: true,
        colorScheme: 'default',
    });

    const toggleAccessibilityModal = () => {
        setAccessibilityModalOpen(!isAccessibilityModalOpen);
        console.log("Accessibility modal open state:", !isAccessibilityModalOpen); // Debug
    };
    

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Magenta Home Page</Link>
            </div>
            <nav className="navigation">
                <Link to="/gallery">Virtual Gallery</Link>
                <Link to="/web-gallery">Web Gallery</Link>
                <Link to="/guestbook">Guestbook</Link>
                <Link to="/submit-artwork">Submit Work</Link>
            </nav>

            <button onClick={toggleAccessibilityModal} aria-haspopup="dialog">
                Accessibility Settings
            </button>

            <AccessibilityModal
                isOpen={isAccessibilityModalOpen}
                closeModal={toggleAccessibilityModal}
                settings={settings}
                setSettings={setSettings}
            />
        </header>
    );
};

export default Header;
