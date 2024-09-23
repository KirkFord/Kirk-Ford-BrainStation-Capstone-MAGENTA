import { useEffect } from 'react';

export const useCursor = () => {
    useEffect(() => {
        const pointer1 = document.getElementById("g-pointer-1");
        const pointer2 = document.getElementById("g-pointer-2");
        const body = document.querySelector("body");

        let isHovering = false;

        const handleMouseMove = (e) => {
            window.requestAnimationFrame(() => setPosition(e.clientX, e.clientY));
        };

        const setPosition = (x, y) => {
            pointer1.style.transform = `translate(${x - 6}px, ${y - 6}px)`;
            if (!isHovering) {
                pointer2.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
            }
        };

        const handleMouseOver = (event) => {
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
        };

        const handleMouseOut = (event) => {
            const target = event.target;
            if (target.classList.contains("g-animation")) {
                isHovering = false;
                pointer2.style.width = `42px`;
                pointer2.style.height = `42px`;
                pointer2.style.borderRadius = `50%`;
            }
        };

        body.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mouseout", handleMouseOut);

        return () => {
            body.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);
};
