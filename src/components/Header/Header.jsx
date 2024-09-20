import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const Header = () => {
    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">Magenta Home Page</Link>
            </div>
            <nav className="nav-links">
                <Link to="/gallery">Virtual Gallery</Link>
                <Link to="/web-gallery">Web Gallery</Link>
                <Link to="/guestbook">Guestbook</Link>
                <Link to="/submit-artwork">Submit Work</Link>
            </nav>
        </header>
    );
};

export default Header;
