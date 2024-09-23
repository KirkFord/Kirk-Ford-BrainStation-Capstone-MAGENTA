import React, { useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useCursor } from '../../scripts/UseCursor';
import './LandingPage.scss';


const LandingPage = () => {
    useCursor();

    useEffect(() => {
        console.log("Landing Page rendered");
    }, []);


    useEffect(() => {
        const letters = document.querySelectorAll('.magenta-letter span');
        const acronyms = document.querySelectorAll('.acronym span');

        letters.forEach((letter, index) => {
            letter.style.animation = `drop-in 0.5s ease forwards ${index * 0.5}s`;
        });

        acronyms.forEach((acronym, index) => {
            acronym.style.animation = `slide-in 0.5s ease forwards ${(index * 0.5) + 0.5}s`;
        });
    }, []);

    return (
        <div className="landing-page" aria-labelledby="landing-page-title">

            <Header className="g-animation" />

            <div className="magenta-animation complex-component" aria-label="MAGENTA acronym and full form">
                {[
                    { letter: 'M', acronym: 'Museum of' },
                    { letter: 'A', acronym: 'Accessible' },
                    { letter: 'G', acronym: 'Gallery' },
                    { letter: 'E', acronym: 'Exhibitions and' },
                    { letter: 'N', acronym: 'Non-' },
                    { letter: 'T', acronym: 'Traditional' },
                    { letter: 'A', acronym: 'Art' }
                ].map((item, index) => (
                    <div
                        className="letter-acronym"
                        key={index}
                        style={{ '--index': index }}
                        aria-label={`Letter ${item.letter} stands for ${item.acronym}`}
                    >
                        <div className="magenta-letter">
                            <span className="g-animation">{item.letter}</span>
                        </div>
                        <div className="acronym">
                            <span className="g-animation">{item.acronym}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hero-banner decorative-elements" aria-label="Main Hero Banner">
                <img
                    src="/assets/images/landingpage.jpeg"
                    alt="Hero Banner showcasing the MAGENTA project"
                    className="hero-banner-image"
                />
            </div>

            <main className="main-content" role="main" aria-labelledby="main-content-heading">
                <section className="about g-animation" aria-labelledby="about-heading">
                    <h2 id="about-heading" className="g-animation">About MAGENTA</h2>
                    <p className="g-animation">MAGENTA is a pioneering virtual gallery designed to be accessible and inclusive for all audiences. It offers a unique blend of immersive 3D experiences and a fully accessible web interface, ensuring that everyone, regardless of ability, can engage with a diverse range of non-traditional artworks. Through innovative use of Three.js and strict adherence to W3C Accessibility Guidelines, MAGENTA creates a platform where artists and audiences can connect in both virtual and traditional web formats. Our goal is to make art a more inclusive space for everyone to explore, enjoy, and contribute to.</p>
                </section>

                <section className="mission g-animation" aria-labelledby="mission-heading">
                    <h2 id="mission-heading" className="g-animation">Mission Statement</h2>
                    <p className="g-animation">Our mission is to break down the barriers that prevent people from experiencing art. We believe that art should be for everyone, which is why we are committed to making our gallery accessible to users with visual, auditory, or motor impairments. Through thoughtful design, accessible features like keyboard navigation, high-contrast mode, and adaptable viewing options, we aim to create a space where all individuals can explore and appreciate non-traditional and innovative art forms. Our focus is on fostering inclusivity, allowing artists to showcase their work in a space that embraces diversity in both medium and audience.</p>
                </section>

                <section className="who g-animation" aria-labelledby="who-heading">
                    <h2 id="who-heading" className="g-animation">Who Made This?</h2>
                    <p className="g-animation">MAGENTA was created by Kirk Ford (He/Him/il), a Canadian artist and software developer based in Saskatoon, SK – Treaty 6 Territory. MAGENTA was born from a desire to create an inclusive, accessible space within the online art community. Driven by Kirk’s personal experiences and commitment to inclusivity, MAGENTA ensures that artists and audiences alike can experience and contribute to the gallery regardless of their abilities.</p>
                </section>

                <nav aria-label="Main Navigation" role="navigation">
                    <a href="/gallery" aria-label="Enter the Virtual Gallery Experience">Enter Gallery Experience</a>
                    <a href="/web-gallery" aria-label="Enter the Accessible Exhibit Page">Enter Accessible Exhibit Page</a>
                </nav>
            </main>

            <Footer className="g-animation" />
        </div>
    );
};

export default LandingPage;