const defaultWeddingInfo = {
  groom: "景翔",
  bride: "佳柔",
  hero_message: "誠摯邀請您蒞臨見證",
  date: "2026-12-12",
  time: "12:00 開席",
  arrival_note: "建議 11:30 入場",
  venue: "桃園八德彭園",
  address: "334桃園市八德區介壽路一段728號3樓",
  map_link: "https://maps.app.goo.gl/kJ4QmBb84BgEKgTTA",
  invitation_message: [
    "感謝您一路以來的陪伴與祝福。",
    "我們將於這一天攜手步入人生新的旅程，",
    "誠摯邀請您蒞臨，與我們一同分享這份喜悅。"
  ],
  map_description: [
    "點擊下方按鈕即可開啟 Google 地圖導航。",
    "建議提早出發，預留交通與停車時間。"
  ],
  reminders: [
    "建議提前 10 至 15 分鐘抵達",
    "現場提供地下停車位",
    "敬請準時入席"
  ],
  note: "敬請準時入席"
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
  deltaX: 0,
  audioReady: true
};

document.addEventListener("DOMContentLoaded", async () => {
  const weddingInfo = await loadWeddingInfo();
  renderWeddingInfo(weddingInfo);
  setupCarousel();
  setupMapButton(weddingInfo.map_link);
  setupMusicToggle();
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
    console.warn("Failed to parse embedded wedding data.", error);
    return null;
  }
}

function renderWeddingInfo(data) {
  const groom = data.groom || defaultWeddingInfo.groom;
  const bride = data.bride || defaultWeddingInfo.bride;
  const heroMessage = data.hero_message || defaultWeddingInfo.hero_message;
  const dateText = formatDate(data.date || defaultWeddingInfo.date);
  const invitationMessage = Array.isArray(data.invitation_message) && data.invitation_message.length
    ? data.invitation_message
    : defaultWeddingInfo.invitation_message;
  const mapDescription = Array.isArray(data.map_description) && data.map_description.length
    ? data.map_description
    : defaultWeddingInfo.map_description;
  const reminders = Array.isArray(data.reminders) && data.reminders.length
    ? data.reminders
    : defaultWeddingInfo.reminders;

  setText("groom-name", groom);
  setText("bride-name", bride);
  setText("hero-date", dateText);
  setText("info-date", dateText);
  setText("info-time", data.time || defaultWeddingInfo.time);
  setText("info-arrival-note", data.arrival_note || defaultWeddingInfo.arrival_note);
  setText("info-venue", data.venue || defaultWeddingInfo.venue);
  setText("info-address", data.address || defaultWeddingInfo.address);
  setText("footer-invite", `${groom} & ${bride} 敬邀`);

  const heroMessageElement = document.querySelector(".hero-message");
  if (heroMessageElement) {
    heroMessageElement.textContent = heroMessage;
  }

  invitationMessage.forEach((line, index) => {
    setText(`invitation-message-line${index + 1}`, line);
  });

  mapDescription.forEach((line, index) => {
    setText(`map-description-line${index + 1}`, line);
  });

  renderReminderList(reminders);
}

function renderReminderList(items) {
  const reminderList = document.getElementById("reminder-list");
  reminderList.innerHTML = "";

  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    reminderList.appendChild(listItem);
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

function setupMusicToggle() {
  const audio = document.getElementById("bgm-audio");
  const button = document.getElementById("music-toggle");

  if (!audio || !button) {
    return;
  }

  audio.addEventListener("error", () => {
    state.audioReady = false;
    updateMusicButton(false);
    console.warn("Background music file could not be loaded: assets/music/bgm.mp3");
  });

  button.addEventListener("click", async () => {
    if (!state.audioReady) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        updateMusicButton(true);
      } catch (error) {
        console.warn("Background music playback was blocked or unavailable.", error);
        updateMusicButton(false);
      }
      return;
    }

    audio.pause();
    updateMusicButton(false);
  });

  audio.addEventListener("pause", () => updateMusicButton(false));
  audio.addEventListener("play", () => updateMusicButton(true));
}

function updateMusicButton(isPlaying) {
  const button = document.getElementById("music-toggle");

  if (!button) {
    return;
  }

  button.classList.toggle("is-playing", isPlaying);
  button.setAttribute("aria-pressed", String(isPlaying));
  button.setAttribute("aria-label", isPlaying ? "暫停背景音樂" : "播放背景音樂");
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
  state.autoPlayId = window.setInterval(() => moveSlide(1), 6000);
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
