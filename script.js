// SLIDER
const slides = document.querySelectorAll(".slide");
let index = 0;

if (slides.length > 1) {
  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 4500);
}

// LIGHTBOX
const images = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeLightboxBtn = document.getElementById("close");
const prevImageBtn = document.getElementById("prevImage");
const nextImageBtn = document.getElementById("nextImage");
let currentImageIndex = 0;

function showImage(indexToShow) {
  currentImageIndex = (indexToShow + images.length) % images.length;
  const currentImage = images[currentImageIndex];
  lightboxImg.src = currentImage.src;
  lightboxImg.alt = currentImage.alt || "Imagen ampliada de la galería";
}

function closeLightbox() {
  lightbox.style.display = "none";
  lightboxImg.removeAttribute("src");
}

images.forEach((img) => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    showImage(Array.from(images).indexOf(img));
  });
});

lightboxImg.addEventListener("click", (event) => {
  event.stopPropagation();
});

lightbox.addEventListener("click", closeLightbox);
closeLightboxBtn.addEventListener("click", closeLightbox);
prevImageBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  showImage(currentImageIndex - 1);
});
nextImageBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  showImage(currentImageIndex + 1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.style.display === "flex") {
    closeLightbox();
  }
  if (event.key === "ArrowLeft" && lightbox.style.display === "flex") {
    showImage(currentImageIndex - 1);
  }
  if (event.key === "ArrowRight" && lightbox.style.display === "flex") {
    showImage(currentImageIndex + 1);
  }
});

// SCROLL ANIMATION
const faders = document.querySelectorAll(".fade");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

faders.forEach((el) => observer.observe(el));

// FEATURED REEL
const reelBackdrop = document.querySelector(".featured-reel-backdrop");
const reelCards = document.querySelectorAll(".reel-card");

if (reelBackdrop && reelCards.length) {
  reelCards.forEach((card) => {
    card.addEventListener("click", () => {
      const nextSrc = card.dataset.backdrop;
      const nextAlt = card.dataset.backdropAlt;

      if (!nextSrc) {
        return;
      }

      reelCards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");

      reelBackdrop.style.opacity = "0.45";
      reelBackdrop.style.transform = "scale(1.08)";

      window.setTimeout(() => {
        reelBackdrop.src = nextSrc;
        if (nextAlt) {
          reelBackdrop.alt = nextAlt;
        }
      }, 180);

      window.setTimeout(() => {
        reelBackdrop.style.opacity = "1";
        reelBackdrop.style.transform = "scale(1)";
      }, 220);
    });
  });
}

// DARK MODE
const toggle = document.getElementById("darkToggle");

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark");
  toggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
updateThemeButton();

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeButton();
});
