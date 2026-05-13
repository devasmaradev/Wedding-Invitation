// script.js

// =======================
// GUEST NAME
// =======================

const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get("to");

const guestName = guest
  ? decodeURIComponent(guest.replace(/\+/g, " "))
  : "Tamu Undangan";

document.getElementById("guestName").innerText = guestName;
document.getElementById("footerGuest").innerText = guestName;

// =======================
// OPEN COVER
// =======================

const openBtn = document.getElementById("openInvitation");
const cover = document.getElementById("cover");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

music.volume = 0.7;

// status music dari user
let musicPlaying = false;

// status sebelum tab hidden
let wasPlayingBeforeHidden = false;

openBtn.addEventListener("click", async () => {

  window.scrollTo(0, 0);

  cover.classList.add("fade-out");

  document.body.style.overflowY = "auto";

  try{

    await music.play();

    musicPlaying = true;

    musicBtn.classList.add("playing");

  }catch(err){

    console.log("Autoplay blocked");

  }

});

// =======================
// MUSIC CONTROL
// =======================

musicBtn.addEventListener("click", async () => {

  try{

    if(music.paused){

      await music.play();

      musicPlaying = true;

      musicBtn.classList.add("playing");

    }else{

      music.pause();

      musicPlaying = false;

      musicBtn.classList.remove("playing");

    }

  }catch(err){

    console.log("Music error");

  }

});

// =======================
// TAB VISIBILITY CONTROL
// =======================

document.addEventListener("visibilitychange", async () => {

  // saat tab ditinggalkan
  if(document.hidden){

    // simpan status sebelumnya
    wasPlayingBeforeHidden = !music.paused;

    // pause music
    music.pause();

    musicBtn.classList.remove("playing");

  }else{

    // saat kembali ke tab
    if(wasPlayingBeforeHidden && musicPlaying){

      try{

        await music.play();

        musicBtn.classList.add("playing");

      }catch(err){

        console.log("Resume blocked");

      }

    }

  }

});

// =======================
// COUNTDOWN
// =======================

const targetDate = new Date("December 20, 2026 08:00:00").getTime();

const countdown = () => {

  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

};

setInterval(countdown, 1000);
countdown();

// =======================
// REVEAL ON SCROLL
// =======================

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if(entry.isIntersecting){
      entry.target.classList.add("active");
    }

  });

},{
  threshold:0.5,
  rootMargin:"0px 0px -100px 0px"
});

reveals.forEach((el) => observer.observe(el));

// =======================
// COPY TO CLIPBOARD
// =======================

const copyTargets = document.querySelectorAll(".copy-target");

copyTargets.forEach((item) => {

  item.addEventListener("click", async () => {

    const text = item.dataset.copy;

    await navigator.clipboard.writeText(text);

    const original = item.innerHTML;

    item.innerHTML = `
      <h3>Berhasil Disalin</h3>
      <span>${text}</span>
    `;

    setTimeout(() => {
      item.innerHTML = original;
    }, 1500);

  });

});

// =======================
// GOOGLE CALENDAR
// =======================

const calendarBtn = document.getElementById("calendarBtn");

const startDate = "20261220T010000Z";
const endDate = "20261220T050000Z";

const calendarUrl =
  `https://calendar.google.com/calendar/render?action=TEMPLATE` +
  `&text=Wedding+Aurel+%26+Fajar` +
  `&dates=${startDate}/${endDate}` +
  `&details=Wedding+Invitation+Aurel+dan+Fajar` +
  `&location=Grand+Emerald+Hall+Jakarta`;

calendarBtn.href = calendarUrl;

// =======================
// DUMMY WISHES
// =======================

const dummyWishes = [
  {
    name: "Rina",
    message: "Semoga menjadi keluarga yang sakinah mawaddah warahmah."
  },
  {
    name: "Budi",
    message: "Selamat menempuh hidup baru!"
  },
  {
    name: "Dewi",
    message: "Bahagia selalu untuk kalian berdua."
  }
];

const wishList = document.getElementById("wishList");

function renderWishes(){

  wishList.innerHTML = "";

  dummyWishes.forEach((wish) => {

    const item = document.createElement("div");

    item.classList.add("wish-item");

    item.innerHTML = `
      <h4>${wish.name}</h4>
      <p>${wish.message}</p>
    `;

    wishList.appendChild(item);

  });

}

renderWishes();

// =======================
// RSVP SUBMIT
// =======================

const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const inputs = rsvpForm.querySelectorAll("input, textarea");

  const newWish = {
    name: inputs[0].value,
    message: inputs[1].value
  };

  dummyWishes.unshift(newWish);

  renderWishes();

  rsvpForm.reset();

});

// =======================
// RESET SCROLL ON REFRESH
// =======================

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {

  // paksa ke atas
  window.scrollTo(0, 0);

  // pastikan tetap di atas
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);

});