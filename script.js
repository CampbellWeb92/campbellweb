"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* Advert modal */
  const modal = document.getElementById("advModal");
  const closeAdvertButton = document.getElementById("closeAdvBtn");
  const advertCallToAction = document.getElementById("advCtaLink");

  const closeAdvert = () => {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    try {
      sessionStorage.setItem("campbellwebAdvertSeen", "true");
    } catch {
      // Keep the site usable when browser storage is unavailable.
    }
  };

  if (modal) {
    let advertSeen = false;
    try {
      advertSeen = sessionStorage.getItem("campbellwebAdvertSeen") === "true";
    } catch {
      advertSeen = false;
    }

    if (!advertSeen) {
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      closeAdvertButton?.focus();
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeAdvert();
    });
  }

  closeAdvertButton?.addEventListener("click", closeAdvert);
  advertCallToAction?.addEventListener("click", closeAdvert);

  /* Mobile navigation */
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const primaryNavigation = document.getElementById("primaryNavigation");
  const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

  const setMobileNavigation = (open) => {
    if (!mobileNavToggle || !primaryNavigation) return;
    mobileNavToggle.setAttribute("aria-expanded", String(open));
    primaryNavigation.classList.toggle("is-open", open);

    const icon = mobileNavToggle.querySelector("i");
    icon?.classList.toggle("fa-bars", !open);
    icon?.classList.toggle("fa-xmark", open);
  };

  const closeMobileNavigation = () => setMobileNavigation(false);

  if (mobileNavToggle && primaryNavigation) {
    mobileNavToggle.addEventListener("click", () => {
      const isOpen = mobileNavToggle.getAttribute("aria-expanded") === "true";
      setMobileNavigation(!isOpen);
    });

    primaryNavigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMobileNavigation();
    });

    document.addEventListener("click", (event) => {
      if (!mobileBreakpoint.matches) return;
      if (!event.target.closest(".nav-container")) closeMobileNavigation();
    });

    mobileBreakpoint.addEventListener("change", closeMobileNavigation);
  }

  /* Smooth home and back-to-top links */
  document.querySelector(".logo")?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    const updateBackToTopVisibility = () => {
      backToTopButton.classList.toggle("show", window.scrollY > 300);
    };
    window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
    updateBackToTopVisibility();
    backToTopButton.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Service quote links */
  const serviceSelect = document.querySelector('#footerContactForm select[name="service"]');
  const nameField = document.querySelector('#footerContactForm input[name="name"]');

  document.querySelectorAll(".quote-link[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const requestedService = link.dataset.service;
      if (serviceSelect && requestedService) {
        const matchingOption = Array.from(serviceSelect.options).find(
          (option) => option.text.trim().toLowerCase() === requestedService.trim().toLowerCase()
        );
        serviceSelect.value = matchingOption ? matchingOption.value : "Not Sure Yet";
      }
      window.setTimeout(() => nameField?.focus({ preventScroll: true }), 650);
    });
  });

  /* Shared keyboard controls */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (modal?.classList.contains("show")) closeAdvert();
    if (primaryNavigation?.classList.contains("is-open")) {
      closeMobileNavigation();
      mobileNavToggle?.focus();
    }
  });

  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
});
