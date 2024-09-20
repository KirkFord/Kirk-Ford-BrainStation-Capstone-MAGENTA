import React, { useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './LandingPage.scss';

const LandingPage = () => {
    useEffect(() => {
        const letters = document.querySelectorAll('.magenta-letter span');
        const acronyms = document.querySelectorAll('.acronym span');

        letters.forEach((letter, index) => {
            letter.style.animation = `drop-in 0.5s ease forwards ${index * 0.5}s`;
        });

        acronyms.forEach((acronym, index) => {
            acronym.style.animation = `slide-in 0.5s ease forwards ${(index * 0.5) + 0.5}s`;
        });

        // Custom cursor blending effect
        const pointer1 = document.getElementById("g-pointer-1");
        const pointer2 = document.getElementById("g-pointer-2");
        const body = document.querySelector("body");

        let isHovering = false;

        body.addEventListener("mousemove", (e) => {
            window.requestAnimationFrame(() => setPosition(e.clientX, e.clientY));
        });

        function setPosition(x, y) {
            pointer1.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
            if (!isHovering) {
                pointer2.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
            }
        }

        window.addEventListener("mouseover", (event) => {
            const target = event.target;
            if (target.classList.contains("g-animation")) {
                isHovering = true;

                const rect = target.getBoundingClientRect();
                const style = window.getComputedStyle(target);

                pointer2.style.width = `${rect.width + 20}px`;
                pointer2.style.height = `${rect.height + 20}px`;
                pointer2.style.borderRadius = `${style.borderRadius}`;
                pointer2.style.transform = `translate(${rect.left - 10}px, ${rect.top - 10}px)`;
            }
        });

        window.addEventListener("mouseout", (event) => {
            const target = event.target;
            if (target.classList.contains("g-animation")) {
                isHovering = false;
                pointer2.style.width = `42px`;
                pointer2.style.height = `42px`;
                pointer2.style.borderRadius = `50%`;
            }
        });
    }, []);

    return (
        <div className="landing-page">
            {/* Custom cursors */}
            <div id="g-pointer-1"></div>
            <div id="g-pointer-2"></div>

            <Header />

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
                <section className="about g-animation">
                    <h2>About MAGENTA</h2>
                    <p>MAGENTA is a virtual gallery designed with accessibility in mind...</p>
                </section>

                <section className="mission g-animation">
                    <h2>Mission Statement</h2>
                    <p>Our mission is to create an accessible platform for showcasing non-traditional and accessible art...</p>
                </section>

                <section className="who g-animation">
                    <h2>Who Made This?</h2>
                    <p>Insert text here...</p>
                </section>

                <nav>
                    <a href="/gallery">Enter Gallery Experience</a>
                    <a href="/accessible-exhibit">Enter Accessible Exhibit Page</a>
                </nav>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
