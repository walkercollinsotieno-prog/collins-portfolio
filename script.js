// Selects the profile picture wrapper from the HTML
const profileWrapper = document.querySelector(".profile-picture-wrapper");

// Selects the futuristic hover image
const profileHover = document.querySelector(".profile-hover");

// Starts with the futuristic image completely hidden
profileHover.style.clipPath = "circle(0 at 50% 50%)";

// Watches the mouse as it moves over the profile picture
profileWrapper.addEventListener("mousemove", (event) => {

  // Gets the position and size of the profile wrapper
  const rect = profileWrapper.getBoundingClientRect();

  // Calculates the mouse position inside the wrapper
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Creates a circular reveal around the mouse position
  profileHover.style.clipPath = `circle(4.5rem at ${x}px ${y}px)`;

});

// Hides the futuristic image when the mouse leaves the picture
profileWrapper.addEventListener("mouseleave", () => {
  profileHover.style.clipPath = "circle(0 at 50% 50%)";
});