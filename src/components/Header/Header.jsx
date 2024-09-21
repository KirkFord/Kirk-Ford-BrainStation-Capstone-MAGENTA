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
        <header className="header" role="banner">
            <div className="logo">
                <a href="/" aria-label="Return to Home Page">MAGENTA Home Page</a>
            </div>
            <nav className="navigation" role="navigation" aria-label="Primary Navigation">

                <a href="/gallery" aria-label="Navigate to Virtual Gallery">Virtual Gallery</a>
                <a href="/web-gallery" aria-label="Navigate to Web Gallery">Web Gallery</a>
                <a href="/guestbook" aria-label="Navigate to Guestbook">Guestbook</a>
                <a href="/submit-artwork" aria-label="Submit Artwork">Submit Work</a>
            </nav>
            <button
                className="accessibility-settings"
                onClick={toggleAccessibilityModal}
                aria-haspopup="dialog"
                aria-expanded={isAccessibilityModalOpen}
                aria-label="Open Accessibility Settings"
            >
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
