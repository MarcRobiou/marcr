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
const verticalReels = document.querySelectorAll(".vertical-reel");

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

// VERTICAL REELS
if (verticalReels.length) {
  const verticalReelsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (!(video instanceof HTMLVideoElement)) {
          return;
        }

        if (entry.isIntersecting) {
          video.muted = true;
          video.playsInline = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.55 }
  );

  verticalReels.forEach((video) => {
    const loopSeconds = Number(video.dataset.loopSeconds || 0);

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    verticalReelsObserver.observe(video);

    if (!loopSeconds) {
      return;
    }

    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= loopSeconds) {
        video.currentTime = 0;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    });
  });
}

// MOBILE NAV
const navToggle = document.getElementById("navToggle");
const mobileNavLinks = document.querySelectorAll("#siteNav a");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const willOpen = !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navToggle.setAttribute("aria-label", willOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menú de navegación");
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
