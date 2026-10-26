/* ==============================
   COLLINS OTIENO PORTFOLIO
   Main JavaScript
============================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     THEME TOGGLE
  ============================ */

  const themeToggle = document.getElementById("theme-toggle");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const savedThemeKey = "collins-portfolio-theme";

  function readSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(savedThemeKey);
      return savedTheme === "dark" || savedTheme === "light" ? savedTheme : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme, savePreference = false) {
    const safeTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", safeTheme);

    if (themeToggle) {
      const isDark = safeTheme === "dark";
      themeToggle.textContent = isDark ? "☀ Light" : "☾ Dark";
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", safeTheme === "dark" ? "#111713" : "#faf9f6");
    }

    if (savePreference) {
      try {
        localStorage.setItem(savedThemeKey, safeTheme);
      } catch (error) {
        // Theme switching still works when browser storage is unavailable.
      }
    }
  }

  applyTheme(readSavedTheme() || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      applyTheme(currentTheme === "dark" ? "light" : "dark", true);
    });
  }

  /* ============================
     MOBILE NAVIGATION TOGGLE
  ============================ */

  const nav = document.querySelector("nav[aria-label='Main navigation']");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("primary-navigation");

  function setMobileMenuOpen(isOpen) {
    if (!nav || !navToggle || !navLinks) return;

    nav.classList.toggle("menu-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navToggle.textContent = isOpen ? "✕ Close" : "☰ Menu";
  }

  if (nav && navToggle && navLinks) {
    setMobileMenuOpen(false);

    navToggle.addEventListener("click", () => {
      setMobileMenuOpen(!nav.classList.contains("menu-open"));
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMobileMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    });

    const mobileBreakpoint = window.matchMedia("(max-width: 48rem)");
    mobileBreakpoint.addEventListener("change", (event) => {
      if (!event.matches) setMobileMenuOpen(false);
    });
  }

  /* ============================
     PORTFOLIO SECTION SWITCHING
  ============================ */

  const portfolioSections = Array.from(
    document.querySelectorAll(
      "main > section#home, " +
      "main > section#about, " +
      "main > section#skills, " +
      "main > section#projects, " +
      "main > section#services, " +
      "main > section#contact"
    )
  );

  const footer = document.getElementById("footer");
  const sectionIds = new Set(portfolioSections.map((section) => section.id));

  function showSection(sectionId, updateHistory = true) {
    if (!sectionIds.has(sectionId)) return;

    portfolioSections.forEach((section) => {
      const isSelected = section.id === sectionId;
      section.classList.toggle("view-active", isSelected);
      section.classList.toggle("view-hidden", !isSelected);
      section.setAttribute("aria-hidden", String(!isSelected));
    });

    if (footer) footer.classList.toggle("view-hidden", sectionId !== "contact");

    document.querySelectorAll("nav a[href^='#']").forEach((link) => {
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (updateHistory) {
      try {
        history.replaceState(null, "", `#${sectionId}`);
      } catch (error) {
        // Navigation still works if history updates are unavailable.
      }
    }

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;

      const sectionId = href.slice(1);
      if (sectionIds.has(sectionId)) {
        event.preventDefault();
        showSection(sectionId);
      }
    });
  });

  const requestedSection = window.location.hash.slice(1);
  showSection(sectionIds.has(requestedSection) ? requestedSection : "home", false);

  window.addEventListener("popstate", () => {
    const sectionId = window.location.hash.slice(1);
    showSection(sectionIds.has(sectionId) ? sectionId : "home", false);
  });

  /* ============================
     PROFILE PICTURE HOVER
  ============================ */

  const profileWrapper = document.querySelector(".profile-picture-wrapper");
  const profileHover = document.querySelector(".profile-hover");
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (profileWrapper && profileHover && supportsHover) {
    profileHover.style.clipPath = "circle(0 at 50% 50%)";
    profileWrapper.addEventListener("pointermove", (event) => {
      const rect = profileWrapper.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      profileHover.style.clipPath = `circle(4.5rem at ${x}px ${y}px)`;
    });
    profileWrapper.addEventListener("pointerleave", () => {
      profileHover.style.clipPath = "circle(0 at 50% 50%)";
    });
  }

  /* ============================
     SCROLL REVEAL ANIMATIONS
  ============================ */

  const revealElements = document.querySelectorAll(
    ".about-intro, .highlight, .about-details > div, .skill-card, .project-card, " +
    ".service-card, .contact-item, .contact-form, .comment-section, .lets-connect"
  );
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => element.classList.add("reveal-visible"));
  }

  /* ============================
     CONTACT AND COMMENT FORMS
  ============================ */

  const recipientEmail = "walkercollinsotieno@gmail.com";

  function prepareEmail(form, options) {
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const name = String(formData.get(options.nameField) || "").trim();
      const email = String(formData.get(options.emailField) || "").trim();
      const message = String(formData.get(options.messageField) || "").trim();
      const status = document.getElementById(options.statusId);
      const body = `${options.messageLabel}\n\nName: ${name}\nEmail: ${email}\n\n${message}`;
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(options.subject)}&body=${encodeURIComponent(body)}`;

      if (status) {
        status.textContent = "Your email application should open with the message prepared. Review it and press Send to submit it.";
      }
      // This site prepares an email; it does not send or store submissions itself.
      window.location.href = mailtoLink;
    });
  }

  prepareEmail(document.getElementById("contact-form"), {
    nameField: "name", emailField: "email", messageField: "message",
    statusId: "contact-status", subject: "Portfolio website enquiry", messageLabel: "Message"
  });

  prepareEmail(document.getElementById("comment-form"), {
    nameField: "comment-name", emailField: "comment-email", messageField: "comment-message",
    statusId: "comment-status", subject: "Comment on Collins Otieno's portfolio", messageLabel: "Comment"
  });

});
