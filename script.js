const defaultWeddingInfo = {
  groom: "景翔",
  bride: "佳柔",
  date: "2026-12-12",
  time: "午宴",
  venue: "桃園八德彭園",
  address: "334桃園市八德區介壽路一段728號3樓",
  map_link: "https://maps.app.goo.gl/kJ4QmBb84BgEKgTTA",
  transport: {
    parking: "現場提供地下停車位",
    mrt: "（自行填寫）",
    bus: "（自行填寫）"
  },
  schedule: [
    "11:30 迎賓",
    "12:00 開席",
    "13:00 一進",
    "13:30 二進",
    "14:00 敬酒",
    "14:30 送客"
  ],
  note: "敬請準時入席，謝謝您的蒞臨與祝福。"
};

const photoSources = [
  "assets/photos/photo1.jpg",
  "assets/photos/photo2.jpg",
  "assets/photos/photo3.jpg"
];

const state = {
  photos: [],
  currentIndex: 0,
  autoPlayId: null,
  startX: 0,
  deltaX: 0
};

document.addEventListener("DOMContentLoaded", async () => {
  const weddingInfo = await loadWeddingInfo();
  renderWeddingInfo(weddingInfo);
  setupCarousel();
  setupMapButton(weddingInfo.map_link);
  setupFadeIn();
});

async function loadWeddingInfo() {
  const embeddedData = readEmbeddedWeddingInfo();

  try {
    const response = await fetch("wedding_info.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    return await response.json();
  } catch (fetchError) {
    if (embeddedData) {
      console.warn("Failed to load wedding_info.json, using embedded fallback.", fetchError);
      return embeddedData;
    }

    console.warn("Failed to load wedding_info.json, using built-in fallback.", fetchError);
    return defaultWeddingInfo;
  }
}

function readEmbeddedWeddingInfo() {
  try {
    const element = document.getElementById("embedded-wedding-data");
    const raw = element?.textContent?.trim();
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function renderWeddingInfo(data) {
  const groom = data.groom || defaultWeddingInfo.groom;
  const bride = data.bride || defaultWeddingInfo.bride;
  const dateText = formatDate(data.date || defaultWeddingInfo.date);
  const parkingText = normalizeTransportText(data.transport?.parking || defaultWeddingInfo.transport.parking);
  const mrtText = normalizeTransportText(data.transport?.mrt || defaultWeddingInfo.transport.mrt);
  const busText = normalizeTransportText(data.transport?.bus || defaultWeddingInfo.transport.bus);

  setText("groom-name", groom);
  setText("bride-name", bride);
  setText("hero-date", dateText);
  setText("info-date", dateText);
  setText("info-time", data.time || defaultWeddingInfo.time);
  setText("info-venue", data.venue || defaultWeddingInfo.venue);
  setText("info-address", data.address || defaultWeddingInfo.address);
  setText("transport-parking", parkingText);
  setText("transport-mrt", mrtText);
  setText("transport-bus", busText);
  setText("note-text", data.note || defaultWeddingInfo.note);
  setText("footer-invite", `${groom} & ${bride} 敬邀`);

  const scheduleList = document.getElementById("schedule-list");
  scheduleList.innerHTML = "";

  (data.schedule || defaultWeddingInfo.schedule).forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    scheduleList.appendChild(listItem);
  });
}

function setupCarousel() {
  state.photos = photoSources.slice();

  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  track.innerHTML = "";
  dots.innerHTML = "";

  state.photos.forEach((src, index) => {
    const slide = document.createElement("article");
    slide.className = "carousel-slide";

    const image = document.createElement("img");
    image.src = src;
    image.alt = `婚紗照 ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";
    image.addEventListener("error", () => {
      console.error(`Photo failed to load: ${src}`);
      image.hidden = true;
      if (!slide.querySelector(".slide-placeholder")) {
        const placeholder = document.createElement("div");
        placeholder.className = "slide-placeholder";
        placeholder.innerHTML = "請將婚紗照放到<br>assets/photos/ 底下";
        slide.appendChild(placeholder);
      }
    });

    slide.appendChild(image);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `切換到第 ${index + 1} 張`);
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartAutoPlay();
    });
    dots.appendChild(dot);
  });

  prevBtn.addEventListener("click", () => {
    moveSlide(-1);
    restartAutoPlay();
  });

  nextBtn.addEventListener("click", () => {
    moveSlide(1);
    restartAutoPlay();
  });

  track.addEventListener("touchstart", handleTouchStart, { passive: true });
  track.addEventListener("touchmove", handleTouchMove, { passive: true });
  track.addEventListener("touchend", handleTouchEnd);

  goToSlide(0);
  startAutoPlay();
}

function setupMapButton(mapLink) {
  const button = document.getElementById("map-button");
  button.addEventListener("click", () => {
    window.open(mapLink || defaultWeddingInfo.map_link, "_blank", "noopener,noreferrer");
  });
}

function setupFadeIn() {
  const sections = document.querySelectorAll(".fade-section");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });

  sections.forEach((section, index) => {
    section.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
    observer.observe(section);
  });
}

function startAutoPlay() {
  stopAutoPlay();
  state.autoPlayId = window.setInterval(() => moveSlide(1), 4500);
}

function stopAutoPlay() {
  if (state.autoPlayId) {
    window.clearInterval(state.autoPlayId);
    state.autoPlayId = null;
  }
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

function moveSlide(step) {
  const nextIndex = (state.currentIndex + step + state.photos.length) % state.photos.length;
  goToSlide(nextIndex);
}

function goToSlide(index) {
  const track = document.getElementById("carousel-track");
  const dots = [...document.querySelectorAll("#carousel-dots button")];

  state.currentIndex = index;
  track.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function handleTouchStart(event) {
  state.startX = event.touches[0].clientX;
  state.deltaX = 0;
}

function handleTouchMove(event) {
  state.deltaX = event.touches[0].clientX - state.startX;
}

function handleTouchEnd() {
  if (Math.abs(state.deltaX) > 45) {
    moveSlide(state.deltaX < 0 ? 1 : -1);
    restartAutoPlay();
  }

  state.startX = 0;
  state.deltaX = 0;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function normalizeTransportText(value) {
  if (!value) {
    return "交通資訊待補";
  }

  if (value.includes("自行填寫")) {
    return "交通資訊待補";
  }

  return value.replace(/[()（）]/g, "").trim();
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
