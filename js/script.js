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
   Smooth Hero Scroll Motion
========================= */

let ticking = false;

function updateHeroMotion() {
  ticking = false;

  if (!hero || reducedMotion.matches) {
    return;
  }

  const rect = hero.getBoundingClientRect();

  if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
    return;
  }

  const scrollDistance = Math.max(0, -rect.top);
  const progress = Math.min(scrollDistance / rect.height, 1);

  const copyY = progress * -34;
  const dashboardY = progress * -16;
  const dashboardScale = 1 + progress * 0.006;

  hero.style.setProperty("--copy-y", `${copyY}px`);
  hero.style.setProperty("--dashboard-y", `${dashboardY}px`);
  hero.style.setProperty("--dashboard-scale", dashboardScale.toFixed(4));
}

function requestHeroMotion() {
  if (ticking) {
    return;
  }

  ticking = true;
  requestAnimationFrame(updateHeroMotion);
}

window.addEventListener("scroll", requestHeroMotion, {
  passive: true,
});

window.addEventListener("resize", requestHeroMotion);

updateHeroMotion();

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