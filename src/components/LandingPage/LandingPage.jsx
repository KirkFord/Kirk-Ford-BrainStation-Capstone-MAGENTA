import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <header>
        <h1>MAGENTA - Museum of Accessible Gallery Exhibitions and Non-Traditional Art</h1>
      </header>
      <main>
        <section>
          <p>
            Welcome to MAGENTA, a virtual gallery designed with accessibility in mind. Explore our
            immersive 3D experience or navigate through the accessible exhibits.
          </p>
        </section>
        <nav>
          <Link to="/gallery">Enter Gallery Experience</Link>
          <Link to="/accessible-exhibit">Enter Accessible Exhibit Page</Link>
        </nav>
      </main>
      <footer>
        <p>&copy; 2024 MAGENTA</p>
      </footer>
    </div>
  );
};

export default LandingPage;
