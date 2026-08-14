const body = document.body;
const hero = document.querySelector(".hero");
const mobileToggle = document.querySelector(".mobile-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const mobileOverlay = document.querySelector(".mobile-overlay");
const mobileClose = document.querySelector(".mobile-nav__close");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    body.classList.add("is-ready");
  });
});

function openMobileMenu() {
  mobileNav.classList.add("is-open");
  mobileOverlay.classList.add("is-visible");
  body.classList.add("menu-open");

  mobileToggle.setAttribute("aria-expanded", "true");
  mobileToggle.setAttribute("aria-label", "Close menu");
  mobileNav.setAttribute("aria-hidden", "false");
  mobileOverlay.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    mobileClose.focus();
  });
}

function closeMobileMenu(returnFocus = false) {
  mobileNav.classList.remove("is-open");
  mobileOverlay.classList.remove("is-visible");
  body.classList.remove("menu-open");

  mobileToggle.setAttribute("aria-expanded", "false");
  mobileToggle.setAttribute("aria-label", "Open menu");
  mobileNav.setAttribute("aria-hidden", "true");
  mobileOverlay.setAttribute("aria-hidden", "true");

  if (returnFocus) {
    mobileToggle.focus();
  }
}

function toggleMobileMenu() {
  const isOpen = mobileNav.classList.contains("is-open");

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

mobileToggle.addEventListener("click", toggleMobileMenu);

mobileClose.addEventListener("click", () => {
  closeMobileMenu(true);
});

mobileOverlay.addEventListener("click", () => {
  closeMobileMenu();
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (mobileNav.classList.contains("is-open")) {
    closeMobileMenu(true);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && mobileNav.classList.contains("is-open")) {
    closeMobileMenu();
  }
});

/* =========================
   Mobile Drawer Focus Trap
========================= */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab" || !mobileNav.classList.contains("is-open")) {
    return;
  }

  const focusableElements = mobileNav.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});


/* =========================
   Smooth Anchor Scroll
========================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();

    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const linksToCheck = document.querySelectorAll(
    ".navbar__link, .mobile-nav__link, .navbar__cta, .mobile-nav__cta, .hero-button--primary, .hero-button--outline"
  );

  linksToCheck.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const targetId = href.slice(1);
    const targetExists = document.getElementById(targetId);

    if (!targetExists) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const label = link.textContent.trim() || "This section";
        showToast(`${label} — coming soon`);
      });
    }
  });
});

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
