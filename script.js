/* ==============================
   COLLINS OTIENO PORTFOLIO
   Main JavaScript
============================== */

document.addEventListener("DOMContentLoaded", () => {

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

  const sectionIds = new Set(
    portfolioSections.map((section) => section.id)
  );

  function showSection(sectionId, updateHistory = true) {
    if (!sectionIds.has(sectionId)) {
      return;
    }

    portfolioSections.forEach((section) => {
      const isSelected = section.id === sectionId;

      section.classList.toggle("view-active", isSelected);
      section.classList.toggle("view-hidden", !isSelected);

      section.setAttribute(
        "aria-hidden",
        String(!isSelected)
      );
    });

    // Show the footer only when Contact is selected.
    if (footer) {
      footer.classList.toggle(
        "view-hidden",
        sectionId !== "contact"
      );
    }

    // Update the active navigation link.
    document.querySelectorAll("nav a[href^='#']").forEach((link) => {
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Keep the address bar in sync with the selected section.
    if (updateHistory) {
      try {
        history.replaceState(null, "", `#${sectionId}`);
      } catch (error) {
        // Navigation still works if history updates are unavailable.
      }
    }

    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth"
    });
  }

  // Handle links to portfolio sections.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href.length < 2) {
        return;
      }

      const sectionId = href.slice(1);

      if (sectionIds.has(sectionId)) {
        event.preventDefault();
        showSection(sectionId);
      }
    });
  });

  // Open the section in the URL if a visitor follows a section link.
  // Otherwise, begin on Home.
  const requestedSection = window.location.hash.slice(1);

  if (sectionIds.has(requestedSection)) {
    showSection(requestedSection, false);
  } else {
    showSection("home", false);
  }

  // Handle browser Back and Forward navigation.
  window.addEventListener("popstate", () => {
    const sectionId = window.location.hash.slice(1);

    if (sectionIds.has(sectionId)) {
      showSection(sectionId, false);
    } else {
      showSection("home", false);
    }
  });


  /* ============================
     PROFILE PICTURE HOVER
  ============================ */

  const profileWrapper = document.querySelector(
    ".profile-picture-wrapper"
  );

  const profileHover = document.querySelector(".profile-hover");

  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (profileWrapper && profileHover && supportsHover) {
    profileHover.style.clipPath = "circle(0 at 50% 50%)";

    profileWrapper.addEventListener("pointermove", (event) => {
      const rect = profileWrapper.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      profileHover.style.clipPath =
        `circle(4.5rem at ${x}px ${y}px)`;
    });

    profileWrapper.addEventListener("pointerleave", () => {
      profileHover.style.clipPath = "circle(0 at 50% 50%)";
    });
  }


  /* ============================
     SCROLL REVEAL ANIMATIONS
  ============================ */

  const revealElements = document.querySelectorAll(
    ".about-intro, " +
    ".highlight, " +
    ".about-details > div, " +
    ".skill-card, " +
    ".project-card, " +
    ".service-card, " +
    ".contact-item, " +
    ".contact-form, " +
    ".comment-section, " +
    ".lets-connect"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08
      }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    // Keep content visible if animations are unsupported or disabled.
    revealElements.forEach((element) => {
      element.classList.add("reveal-visible");
    });
  }


  /* ============================
     CONTACT AND COMMENT FORMS
  ============================ */

  const recipientEmail = "walkercollinsotieno@gmail.com";

  function prepareEmail(form, options) {
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const formData = new FormData(form);
      const name = String(formData.get(options.nameField) || "").trim();
      const email = String(formData.get(options.emailField) || "").trim();
      const message = String(formData.get(options.messageField) || "").trim();

      const status = document.getElementById(options.statusId);

      const subject = options.subject;
      const body =
        `${options.messageLabel}\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `${message}`;

      const mailtoLink =
        `mailto:${recipientEmail}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      if (status) {
        status.textContent =
          "Your email application should open with the message prepared. Review it and press Send to submit it.";
      }

      // Opens the visitor's default email application.
      // This website does not send or store form submissions itself.
      window.location.href = mailtoLink;
    });
  }

  prepareEmail(
    document.getElementById("contact-form"),
    {
      nameField: "name",
      emailField: "email",
      messageField: "message",
      statusId: "contact-status",
      subject: "Portfolio website enquiry",
      messageLabel: "Message"
    }
  );

  prepareEmail(
    document.getElementById("comment-form"),
    {
      nameField: "comment-name",
      emailField: "comment-email",
      messageField: "comment-message",
      statusId: "comment-status",
      subject: "Comment on Collins Otieno's portfolio",
      messageLabel: "Comment"
    }
  );

});