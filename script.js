"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* Accessible advert modal: delayed, focus-contained and hidden for 30 days after dismissal. */
  const modal = document.getElementById("advModal");
  const closeAdvertButton = document.getElementById("closeAdvBtn");
  const dismissAdvertButton = document.getElementById("advDismissButton");
  const advertCallToAction = document.getElementById("advCtaLink");
  const advertImage = modal?.querySelector(".adv-popup-img");
  const advertStorageKey = "campbellwebAdvertHiddenUntil";
  const advertHideDuration = 30 * 24 * 60 * 60 * 1000;
  let advertTimer;
  let advertImageTimer;
  let advertImageLoadPromise;
  let advertRevealed = false;
  let previouslyFocusedElement = null;

  const getFocusableElements = () => {
    if (!modal) return [];
    return Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute("hidden") && element.offsetParent !== null);
  };

  const advertIsHidden = () => {
    try {
      return Number(localStorage.getItem(advertStorageKey) || 0) > Date.now();
    } catch {
      return false;
    }
  };

  const rememberAdvertDismissal = () => {
    try {
      localStorage.setItem(advertStorageKey, String(Date.now() + advertHideDuration));
    } catch {
      // The popup still closes when storage is unavailable.
    }
  };

  const prepareAdvertImage = () => {
    if (!advertImage?.dataset.src) return Promise.resolve();
    if (advertImageLoadPromise) return advertImageLoadPromise;

    advertImageLoadPromise = new Promise((resolve) => {
      const finishLoading = () => resolve();
      advertImage.addEventListener("load", finishLoading, { once: true });
      advertImage.addEventListener("error", finishLoading, { once: true });
      advertImage.src = advertImage.dataset.src;
      advertImage.removeAttribute("data-src");
      if (advertImage.complete) finishLoading();
    });

    return advertImageLoadPromise;
  };

  const revealAdvert = () => {
    if (!modal) return;
    previouslyFocusedElement = document.activeElement;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => closeAdvertButton?.focus(), 80);
  };

  const showAdvert = () => {
    if (!modal || advertRevealed || advertIsHidden()) return;
    advertRevealed = true;
    window.clearTimeout(advertTimer);
    window.clearTimeout(advertImageTimer);
    prepareAdvertImage().finally(revealAdvert);
  };

  const closeAdvert = ({ remember = true } = {}) => {
    if (!modal || !modal.classList.contains("show")) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (remember) rememberAdvertDismissal();
    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus({ preventScroll: true });
    }
  };

  if (modal && !advertIsHidden()) {
    // Load the flyer after critical page content, then display it later.
    advertImageTimer = window.setTimeout(prepareAdvertImage, 2500);
    advertTimer = window.setTimeout(showAdvert, 8000);

    const showAfterMeaningfulScroll = () => {
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableDistance > 0 && window.scrollY / scrollableDistance >= 0.35) {
        window.removeEventListener("scroll", showAfterMeaningfulScroll);
        showAdvert();
      }
    };
    window.addEventListener("scroll", showAfterMeaningfulScroll, { passive: true });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeAdvert();
    });

    modal.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = getFocusableElements();
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  closeAdvertButton?.addEventListener("click", () => closeAdvert());
  dismissAdvertButton?.addEventListener("click", () => closeAdvert());
  advertCallToAction?.addEventListener("click", () => closeAdvert());

  /* Shared desktop and mobile dropdown navigation. */
  document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    // Adjust the 80 value to match your navbar height
    const navbarHeight = 45; 
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});


  /* Smooth home and back-to-top links. */
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

  /* Service quote links. */
  const contactForm = document.getElementById("footerContactForm");
  const serviceSelect = contactForm?.querySelector('select[name="service"]');
  const nameField = contactForm?.querySelector('input[name="name"]');

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

  /* Enquiry-form feedback and duplicate-submission protection. */
  const formStatus = document.getElementById("footerFormStatus");
  const submitButton = document.getElementById("footerSubmitButton");
  const originalSubmitMarkup = submitButton?.innerHTML || "";
  let formResetTimer;

  const setFormStatus = (message = "", state = "") => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove("is-loading", "is-success", "is-error");
    if (state) formStatus.classList.add(`is-${state}`);
  };

  const resetSubmitButton = () => {
    window.clearTimeout(formResetTimer);
    if (!submitButton) return;
    submitButton.disabled = false;
    submitButton.innerHTML = originalSubmitMarkup;
  };

  if (contactForm) {
    contactForm.addEventListener(
      "invalid",
      () => setFormStatus("Please complete all required fields before sending your enquiry.", "error"),
      true
    );

    contactForm.addEventListener("input", () => {
      if (formStatus?.classList.contains("is-error")) setFormStatus();
    });

    contactForm.addEventListener("submit", (event) => {
      if (!contactForm.checkValidity()) return;

      if (!navigator.onLine) {
        event.preventDefault();
        resetSubmitButton();
        setFormStatus("You appear to be offline. Please reconnect and try again.", "error");
        formStatus?.focus?.();
        return;
      }

      const honeypot = contactForm.querySelector('input[name="_honey"]');
      if (honeypot instanceof HTMLInputElement && honeypot.value.trim()) {
        event.preventDefault();
        setFormStatus("Your enquiry could not be sent. Please refresh the page and try again.", "error");
        return;
      }

      setFormStatus("Sending… You may be asked to complete a quick security check.", "loading");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Sending…</span><i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
      }

      formResetTimer = window.setTimeout(() => {
        resetSubmitButton();
        setFormStatus("The form is taking longer than expected. Please try again or contact CampbellWeb on WhatsApp.", "error");
      }, 15000);
    });

    window.addEventListener("pageshow", () => {
      resetSubmitButton();
      setFormStatus();
    });
  }

  /* Shared keyboard controls. */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (modal?.classList.contains("show")) closeAdvert();
    if (primaryNavigation?.classList.contains("is-open")) {
      closeNavigation();
      navToggle?.focus();
    }
  });

  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
});

/* Register the offline-capable service worker after the page has loaded. */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // The website remains fully usable when service workers are unsupported or blocked.
    });
  });
}
