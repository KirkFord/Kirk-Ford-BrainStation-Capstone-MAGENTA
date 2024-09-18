const body = document.querySelector("body");
const element = document.getElementById("g-pointer-1");
const element2 = document.getElementById("g-pointer-2");
const halfAlementWidth = element.offsetWidth / 2;
const halfAlementWidth2 = element2.offsetWidth / 2;
let isHovering = false;

window.addEventListener("mouseover", (event) => {
    const target = event.target;

    if (target.classList.contains("g-animation")) {
        isHovering = true;

        const rect = target.getBoundingClientRect();
        const style = window.getComputedStyle(target);

        element2.style.width = `${rect.width + 20}px`;
        element2.style.height = `${rect.height + 20}px`;
        element2.style.borderRadius = `${style.borderRadius}`;
        element2.style.transform = `translate(${rect.left - 10}px, ${
            rect.top - 10
        }px)`;
    }
});

window.addEventListener("mouseout", (event) => {
    const target = event.target;
    if (target.classList.contains("g-animation")) {
        isHovering = false;

        element2.style.width = `42px`;
        element2.style.height = `42px`;
        element2.style.borderRadius = `50%`;
    }
});

body.addEventListener("mousemove", (e) => {
    window.requestAnimationFrame(function () {
        setPosition(e.clientX, e.clientY);
    });
});

function setPosition(x, y) {
    window.requestAnimationFrame(function () {
        element.style.transform = `translate(${x - halfAlementWidth}px, ${
            y - halfAlementWidth
        }px)`;

        if (!isHovering) {
            element2.style.transform = `translate(${x - halfAlementWidth2}px, ${
                y - halfAlementWidth2
            }px)`;
        }
    });
}

// remember to throw in
// <div id="g-pointer-1"></div>
// <div id="g-pointer-2"></div>
