// Sidebar (mobile menu)
const menuBtn = document.querySelector("#sidebar-toggle");
const sidebarOverlay = document.querySelector(".sidebar-overlay");
const sideBar = document.querySelector("#sidebar");

menuBtn.addEventListener("click", function () {
  sideBar.classList.add("show");
  sidebarOverlay.classList.add("show");
});

sidebarOverlay.addEventListener("click", function () {
  sideBar.classList.remove("show");
  sidebarOverlay.classList.remove("show");
});

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".app-section");

function showSection(name) {
  for (let j = 0; j < sections.length; j++) {
    if (sections[j].dataset.section === name) {
      sections[j].classList.remove("hidden");
    } else {
      sections[j].classList.add("hidden");
    }
  }

  for (let k = 0; k < navLinks.length; k++) {
    if (navLinks[k].dataset.section === name) {
      navLinks[k].classList.add("bg-orange-500/10", "text-orange-400");
      navLinks[k].classList.remove("text-stone-300", "hover:bg-stone-800");
    } else {
      navLinks[k].classList.remove("bg-orange-500/10", "text-orange-400");
      navLinks[k].classList.add("text-stone-300", "hover:bg-stone-800");
    }
  }

  localStorage.setItem("section", name);

  sideBar.classList.remove("show");
  sidebarOverlay.classList.remove("show");
}

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function (e) {
    e.preventDefault();
    showSection(this.dataset.section);
  });
}

showSection(localStorage.getItem("section") || "today-in-space");

const NASA_KEY = "JhmPRCnM8k7JgBFLM8qtCbHkchQqjtzQPpfhB9Jc";

const dateInput = document.getElementById("apod-date-input");
const dateText = document.querySelector(".date-input-wrapper span");
const loadBtn = document.getElementById("load-date-btn");
const todayBtn = document.getElementById("today-apod-btn");

function getApod(date) {
  let url = "https://api.nasa.gov/planetary/apod?api_key=" + NASA_KEY;
  if (date !== "") {
    url = url + "&date=" + date;
  }

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.code) {
        document.getElementById("apod-title").textContent = "Could not load the picture";
        document.getElementById("apod-explanation").textContent =
          "NASA's server returned an error (" + data.code + "). Try another date or try again later.";
        return;
      }

      document.getElementById("apod-title").textContent = data.title;
      document.getElementById("apod-explanation").textContent = data.explanation;
      document.getElementById("apod-image").src = data.url;
      document.getElementById("apod-date-info").textContent = data.date;
      document.getElementById("apod-date-detail").innerHTML =
        '<i class="far fa-calendar mr-2"></i>' + data.date;
    })
    .catch(function () {
      document.getElementById("apod-title").textContent = "Network error";
      document.getElementById("apod-explanation").textContent = "Check your connection and try again.";
    });
}

dateInput.addEventListener("change", function () {
  dateText.textContent = dateInput.value;
});

loadBtn.addEventListener("click", function () {
  getApod(dateInput.value);
});

todayBtn.addEventListener("click", function () {
  getApod("");
});

dateInput.max = new Date().toISOString().slice(0, 10);

getApod("2024-03-14");

const launchesGrid = document.getElementById("launches-grid");

function getLaunches() {
  fetch("https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayFeatured(data.results[0]);
      displayLaunches(data.results.slice(1));
    });
  }

function displayLaunches(launches) {
  let cards = "";

  for (let i = 0; i < launches.length; i++) {
    const launch = launches[i];
    const date = new Date(launch.net).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    });                       
    const time = new Date(launch.net).toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", timeZone: "UTC"
    }) + " UTC";                 
    let image = "imgs/placeholder.webp";
    if (launch.image) {
      image = launch.image.image_url;
    }


    cards += `
      <div class="bg-stone-800/50 border border-stone-700 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all group cursor-pointer">
        <div class="relative h-48 bg-stone-900/50 flex items-center justify-center">
          <img src="${image}" class="w-full h-full object-cover" alt="">
          <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
              ${launch.status.abbrev}
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-3">
            <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
              ${launch.name}
            </h4>
            <p class="text-sm text-stone-400 flex items-center gap-2">
              <i class="fas fa-building text-xs"></i>
              ${launch.launch_service_provider.name}
            </p>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-calendar text-stone-500 w-4"></i>
              <span class="text-stone-300">${date}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-clock text-stone-500 w-4"></i>
              <span class="text-stone-300">${time}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-rocket text-stone-500 w-4"></i>
              <span class="text-stone-300">${launch.rocket.configuration.name}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <i class="fas fa-map-marker-alt text-stone-500 w-4"></i>
              <span class="text-stone-300 line-clamp-1">${launch.pad.location.name}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-4 border-t border-stone-700">
            <button class="flex-1 px-4 py-2 bg-stone-700 rounded-lg hover:bg-stone-600 transition-colors text-sm font-semibold">
              Details
            </button>
            <button class="px-3 py-2 bg-stone-700 rounded-lg hover:bg-stone-600 transition-colors">
              <i class="far fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;  }

  launchesGrid.innerHTML = cards;
}

const featuredLaunch = document.getElementById("featured-launch");

function displayFeatured(launch) {
  const date = new Date(launch.net).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  });
  const time = new Date(launch.net).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", timeZone: "UTC"
  }) + " UTC";

  const msLeft = new Date(launch.net) - new Date();
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

  let image = "imgs/placeholder.webp";
  if (launch.image) {
    image = launch.image.image_url;
  }

  let description = "No mission details yet.";
  if (launch.mission) {
    description = launch.mission.description;
  }

  featuredLaunch.innerHTML = `
    <div class="relative bg-stone-800/30 border border-stone-700 rounded-3xl overflow-hidden group hover:border-orange-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-orange-500/10 via-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i> Featured Launch
              </span>
              <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                ${launch.status.abbrev}
              </span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">${launch.name}</h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-stone-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${launch.launch_service_provider.name}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${launch.rocket.configuration.name}</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-orange-500/20 to-red-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-orange-400"></i>
              <div>
                <p class="text-2xl font-bold text-orange-400">${daysLeft}</p>
                <p class="text-xs text-stone-400">Days Until Launch</p>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-stone-900/50 rounded-xl p-4">
                <p class="text-xs text-stone-400 mb-1 flex items-center gap-2"><i class="fas fa-calendar"></i> Launch Date</p>
                <p class="font-semibold">${date}</p>
              </div>
              <div class="bg-stone-900/50 rounded-xl p-4">
                <p class="text-xs text-stone-400 mb-1 flex items-center gap-2"><i class="fas fa-clock"></i> Launch Time</p>
                <p class="font-semibold">${time}</p>
              </div>
              <div class="bg-stone-900/50 rounded-xl p-4">
                <p class="text-xs text-stone-400 mb-1 flex items-center gap-2"><i class="fas fa-map-marker-alt"></i> Location</p>
                <p class="font-semibold text-sm">${launch.pad.location.name}</p>
              </div>
              <div class="bg-stone-900/50 rounded-xl p-4">
                <p class="text-xs text-stone-400 mb-1 flex items-center gap-2"><i class="fas fa-globe"></i> Country</p>
                <p class="font-semibold">${launch.pad.country.alpha_3_code}</p>
              </div>
            </div>
            <p class="text-stone-300 leading-relaxed mb-6">${description}</p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <button class="flex-1 self-start md:self-center px-6 py-3 bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i> View Full Details
            </button>
            <div class="icons self-end md:self-center">
              <button class="px-4 py-3 bg-stone-700 rounded-xl hover:bg-stone-600 transition-colors"><i class="far fa-heart"></i></button>
              <button class="px-4 py-3 bg-stone-700 rounded-xl hover:bg-stone-600 transition-colors"><i class="fas fa-bell"></i></button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-stone-900/50">
            <img src="${image}" class="w-full h-full object-cover absolute inset-0" alt="">
            <div class="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

getLaunches();
// Planets (Solar System OpenData)
let planets = [];   

function getPlanets() {
  fetch("https://solar-system-opendata-proxy.vercel.app/api/planets")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      planets = data.bodies;
    });
}

getPlanets();
function findPlanet(planetId) {
  for (let i = 0; i < planets.length; i++) {
    if (planets[i].englishName.toLowerCase() === planetId) {
      return planets[i];      // found it, stop and give it back
    }
  }
}

function displayPlanet(planetId) {
  const planet = findPlanet(planetId);

  let moons = 0;
  if (planet.moons) {
    moons = planet.moons.length;
  }

  document.getElementById("planet-detail-image").src = "imgs/" + planetId + ".png";
  document.getElementById("planet-detail-name").textContent = planet.englishName;
  document.getElementById("planet-distance").textContent = (planet.semimajorAxis / 1000000).toFixed(1) + "M km";
  document.getElementById("planet-radius").textContent = Math.round(planet.meanRadius).toLocaleString() + " km";
  document.getElementById("planet-mass").textContent = planet.mass.massValue + " × 10^" + planet.mass.massExponent + " kg";
  document.getElementById("planet-density").textContent = planet.density + " g/cm³";
  document.getElementById("planet-orbital-period").textContent = planet.sideralOrbit + " days";
  document.getElementById("planet-rotation").textContent = planet.sideralRotation + " hours";
  document.getElementById("planet-moons").textContent = moons;
  document.getElementById("planet-gravity").textContent = planet.gravity + " m/s²";

  // description
  document.getElementById("planet-detail-description").textContent = planet.description;

  let discoverer = "Known since antiquity";
  if (planet.discoveredBy) {
    discoverer = planet.discoveredBy;
  }

  let discoveryDate = "Ancient";
  if (planet.discoveryDate) {
    discoveryDate = planet.discoveryDate;
  }

  document.getElementById("planet-discoverer").textContent = discoverer;
  document.getElementById("planet-discovery-date").textContent = discoveryDate;
  document.getElementById("planet-body-type").textContent = planet.bodyType;
  document.getElementById("planet-volume").textContent = planet.vol.volValue + " × 10^" + planet.vol.volExponent + " km³";

  document.getElementById("planet-perihelion").textContent = (planet.perihelion / 1000000).toFixed(1) + "M km";
  document.getElementById("planet-aphelion").textContent = (planet.aphelion / 1000000).toFixed(1) + "M km";
  document.getElementById("planet-eccentricity").textContent = planet.eccentricity;
  document.getElementById("planet-inclination").textContent = planet.inclination + "°";
  document.getElementById("planet-axial-tilt").textContent = planet.axialTilt + "°";
  document.getElementById("planet-temp").textContent = Math.round(planet.avgTemp - 273.15) + "°C";
  document.getElementById("planet-escape").textContent = (planet.escape / 1000).toFixed(1) + " km/s";
}

const planetCards = document.querySelectorAll(".planet-card");

for (let i = 0; i < planetCards.length; i++) {
  planetCards[i].addEventListener("click", function () {
    displayPlanet(this.dataset.planetId);
  });
}
