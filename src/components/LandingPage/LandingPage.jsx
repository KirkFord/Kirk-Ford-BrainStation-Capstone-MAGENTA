import React, { useEffect } from 'react';
import './LandingPage.scss';

const LandingPage = () => {
    useEffect(() => {
        const letters = document.querySelectorAll('.magenta-letter span');
        const acronyms = document.querySelectorAll('.acronym span');

        letters.forEach((letter, index) => {
            letter.style.animation = `drop-in 0.5s ease forwards ${index * 0.5}s`; // Cascading delay for each letter
        });

        acronyms.forEach((acronym, index) => {
            acronym.style.animation = `slide-in 0.5s ease forwards ${(index * 0.5) + 0.5}s`; // Slight delay for acronym after letter
        });
    }, []);

    return (
        <div className="landing-page">
            <header>
                <h1 className="header-title">Welcome to MAGENTA</h1>
            </header>

            <div className="magenta-animation">
                {[
                    { letter: 'M', acronym: 'useum of' },
                    { letter: 'A', acronym: 'ccessible' },
                    { letter: 'G', acronym: 'allery' },
                    { letter: 'E', acronym: 'xhibitions and' },
                    { letter: 'N', acronym: 'on-' },
                    { letter: 'T', acronym: 'raditional' },
                    { letter: 'A', acronym: 'rt' }
                ].map((item, index) => (
                    <div className="letter-acronym" key={index} style={{ '--index': index }}>
                        <div className="magenta-letter"><span>{item.letter}</span></div>
                        <div className="acronym"><span>{item.acronym}</span></div>
                    </div>
                ))}
            </div>

            <main>
                <section className="about">
                    <h2>About MAGENTA</h2>
                    <p>MAGENTA is a virtual gallery designed with accessibility in mind...</p>
                </section>

                <section className="mission">
                    <h2>Mission Statement</h2>
                    <p>Our mission is to create an accessible platform for showcasing non-traditional and accessible art...</p>
                </section>

                <section className="who">
                    <h2>Who Made This?</h2>
                    <p>Insert text here...</p>
                </section>

                <nav>
                    <a href="/gallery">Enter Gallery Experience</a>
                    <a href="/accessible-exhibit">Enter Accessible Exhibit Page</a>
                </nav>
            </main>

            <footer>
                <p>&copy; 2024 MAGENTA | All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default LandingPage;
