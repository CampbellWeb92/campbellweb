document.addEventListener("DOMContentLoaded", () => {
    const backToTopBtn = document.getElementById("backToTopBtn");

    // Hide button instantly on layout initialization
    backToTopBtn.style.opacity = "0";
    backToTopBtn.style.pointerEvents = "none";
    backToTopBtn.style.transition = "opacity 0.3s ease";

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) { // Shows up after scrolling down 300 pixels
            backToTopBtn.style.opacity = "1";
            backToTopBtn.style.pointerEvents = "auto";
        } else {
            backToTopBtn.style.opacity = "0";
            backToTopBtn.style.pointerEvents = "none";
        }
    });
});
const modal = document.getElementById("advModal");
const closeBtn = document.getElementById("closeAdvBtn");

window.addEventListener("load", () => {
    modal.classList.add("show");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
});

document.addEventListener("DOMContentLoaded", () => {
    const logoLink = document.querySelector(".logo a");

    if (logoLink) {
        logoLink.addEventListener("click", (e) => {
            e.preventDefault(); // Prevents URL hash parameter bloating
            
            // Elegantly scrolls window view safely right back to coordinate zero
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});
