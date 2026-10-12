
/* =========================
   PROFILE PICTURE HOVER
========================= */

const profileWrapper = document.querySelector(".profile-picture-wrapper");
const profileHover = document.querySelector(".profile-hover");

// Run the hover effect only when both elements exist
if (profileWrapper && profileHover) {
  profileHover.style.clipPath = "circle(0 at 50% 50%)";

  profileWrapper.addEventListener("mousemove", (event) => {
    const rect = profileWrapper.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    profileHover.style.clipPath = `circle(4.5rem at ${x}px ${y}px)`;
  });

  profileWrapper.addEventListener("mouseleave", () => {
    profileHover.style.clipPath = "circle(0 at 50% 50%)";
  });
}


/* =========================
   PORTFOLIO SECTION SWITCHING
========================= */

const portfolioSections = document.querySelectorAll(
  "#home, #about, #skills, #projects, #services, #contact"
);

const sectionLinks = document.querySelectorAll('a[href^="#"]');

function showSection(sectionId) {
  const selectedSection = document.getElementById(sectionId);

  // Ignore links that do not point to a portfolio section
  if (
    !selectedSection ||
    !Array.from(portfolioSections).includes(selectedSection)
  ) {
    return;
  }

  // Display the selected section only
  portfolioSections.forEach((section) => {
    const isSelected = section.id === sectionId;

    section.classList.toggle("view-active", isSelected);
    section.classList.toggle("view-hidden", !isSelected);
  });

  // Display the footer only with Contact
  const footer = document.getElementById("footer");

  if (footer) {
    footer.classList.toggle("view-hidden", sectionId !== "contact");
  }

  // Indicate the active navigation link
  document.querySelectorAll("nav a[href^='#']").forEach((link) => {
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Handle navigation, hero buttons, and footer links
sectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href").slice(1);

    if (
      Array.from(portfolioSections).some(
        (section) => section.id === sectionId
      )
    ) {
      event.preventDefault();
      showSection(sectionId);
    }
  });
});

// Start on Home
showSection("home");



/* =========================
   SCROLL REVEAL
========================= */

const revealElements = document.querySelectorAll(
  ".about-intro, .highlight, .about-details > div, " +
  ".skill-card, .project-card, .service-card, " +
  ".contact-item, .contact-form, .comment-section, .lets-connect"
);

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal-visible");
      observer.unobserve(entry.target);
    }
  });
});

revealElements.forEach((element) => {
  element.classList.add("reveal");
  revealObserver.observe(element);
});


