const todaySpace = document.querySelector("#today-in-space");
const launches = document.querySelector("#launches");
const planets = document.querySelector("#planets");
const section = document.querySelectorAll("section");
const navLink = document.querySelectorAll(".nav-link");
const input = document.getElementById("apod-date-input");
const load = document.getElementById("load-date-btn");
const bntToday = document.getElementById("today-apod-btn");
const inputDate = document.querySelector(".inputDate");
const row = document.getElementById("todayImage");
const lunchCard = document.getElementById("launches-grid");
const featuredlunch = document.getElementById("featured-launch");
const apodDate = document.getElementById("apod-date");
const planet = document.querySelectorAll(".planet-card");

input.value = new Date().toISOString().split("T")[0];
apodDate.innerHTML = `Astronomy Picture of the Day - ${input.value}`;
input.max = new Date().toISOString().split("T")[0];
inputDate.innerHTML = input.value;
if (localStorage.getItem("dataSet") != null) {
  let dataSet = JSON.parse(localStorage.getItem("dataSet"));
  changeSection(dataSet);
}

function changeSection(dataSet) {
  navLink.forEach((link) => {
    link.dataset.section == dataSet
      ? link.classList.add("bg-blue-500")
      : link.classList.remove("bg-blue-500");
  });
  section.forEach((sec) => {
    sec.dataset.section == dataSet
      ? sec.classList.remove("hidden")
      : sec.classList.add("hidden");
  });
}

let id;
function clickLink() {
  navLink.forEach((link) => {
    link.addEventListener("click", () => {
      id = link.dataset.section;
      changeSection(id);
      localStorage.setItem("dataSet", JSON.stringify(id));
    });
  });
}
clickLink();

let getDataApi = [];
let getDataLaunche = [];
let getDataPlanets = [];
async function getToday() {
  try {
    const selectedDate = input.value;
    const respons = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=gJZ69PNaseZLvumEqCU1RSrv78OXWD5DvQbgHVun&date=${selectedDate}`,
    );
    getDataApi = await respons.json();
    console.log(getDataApi);

    showToday();
    loadingimage();
    btnzone();
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

function showToday() {
  let box = `
      <div class="xl:col-span-2">
        <div
          id="apod-image-container"
          class="relative rounded-2xl overflow-hidden group h-[300px] md:h-[400px] lg:h-[600px] bg-slate-800/50 flex items-center justify-center"
        >
          <div id="apod-loading" class="text-center loadding">
            <i class="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
            <p class="text-slate-400">Loading today's image...</p>
          </div>

          <img
            id="apod-image"
            class="w-full h-full object-cover hidden"
            alt="Astronomy Picture of the Day"
          />
          <div
            class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div class="absolute bottom-6 left-6 right-6">
              <button
                class="w-full py-3 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-colors"
                 id="btn-zone"
              >
                <i class="fas fa-expand mr-2"></i>View Full Resolution
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-4 md:space-y-6">
        <div
          class="bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6"
        >
          <h3
            id="apod-title"
            class="text-lg md:text-2xl font-semibold mb-3 md:mb-4"
          >
            <span class="lodder hidden">${getDataApi.title || "No Title"}</span>
            <span class="loadding">Loading title...</span>
          </h3> 
          <div
            class="flex items-center space-x-2 mb-4 text-sm text-slate-400"
          >
            <span id="apod-date-detail"><i class="far fa-calendar mr-2"></i></span>
            <span class="lodder hidden">${getDataApi.date || input.value}</span>
            <span class="loadding">Loading date...</span>
          </div>
          <div
            id="apod-explanation"
            class="text-slate-300 leading-relaxed mb-4"
          >
            <span class="lodder hidden">${getDataApi.explanation || "No description"}</span>
            <span class="loadding">Loading description...</span>
          </div>
          <div
            id="apod-copyright"
            class="text-xs text-slate-400 italic mb-4"
          >
            ${getDataApi.copyright ? `&copy; ${getDataApi.copyright}` : "&copy; Public Domain / NASA"}
          </div>
        </div>
        <div
          class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <h4 class="font-semibold mb-3 flex items-center">
            <i class="fas fa-info-circle text-blue-400 mr-2"></i>
            Image Details
          </h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-400">Date</span>
              <span id="apod-date-info" class="font-medium lodder hidden">${getDataApi.date || input.value}</span>
              <span class="loadding font-medium">Loading...</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Media Type</span>
              <span id="apod-media-type" class="font-medium capitalize">${getDataApi.media_type || "Image"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Source</span>
              <span class="font-medium">NASA APOD</span>
            </div>
          </div>
        </div>
      </div>`;

  row.innerHTML = box;
}
function loadingimage() {
  const image = document.getElementById("apod-image");
  const loader = document.querySelectorAll(".lodder");
  const loading = document.querySelectorAll(".loadding");

  function showContent() {
    loader.forEach((item) => item.classList.remove("hidden"));
    loading.forEach((item) => item.classList.add("hidden"));
    if (image) image.classList.remove("hidden");
  }

  if (!getDataApi.hdurl && !getDataApi.url) {
    showContent();
    return;
  }

  image.onload = () => {
    showContent();
  };

  image.src = getDataApi.hdurl || getDataApi.url;

  if (image.complete) {
    showContent();
  }
  if (getDataApi.hdurl == null) {
    row.innerHTML = `<p class="text-red-400 text-center col-span-full py-10">Failed to load APOD data. Please try another date or check your connection.</p> `;
  }
}
function todayEvant() {
  input.addEventListener("input", () => {
    inputDate.innerHTML = input.value;
  });

  load.addEventListener("click", () => {
    getToday();
    apodDate.innerHTML = `Astronomy Picture of the Day - ${input.value}`;
  });

  bntToday.addEventListener("click", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    input.value = todayStr;
    inputDate.innerHTML = todayStr;
    apodDate.innerHTML = `Astronomy Picture of the Day - ${input.value}`;

    getToday();
  });
}
function btnzone() {
  const btnZone = document.getElementById("btn-zone");
  btnZone.addEventListener("click", () => {
    window.open(getDataApi.hdurl, "_blank");
  });
}
async function getLaunches() {
  try {
    const respons = await fetch(
      `https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10`,
    );
    getDataLaunche = await respons.json();

    showAllLaunches(getDataLaunche);
    showFeaturedLaunches(getDataLaunche);
    LaunchesEvents();
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}
function showAllLaunches(getLaunche) {
  let res = getLaunche.results
    .slice(1)
    .map((launch) => {
      return `<div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
  <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
<img 
  src="${launch.image?.image_url || "assets/images/launch-placeholder.png"}" 
  onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';" 
  alt="${launch.name || ""}"
  class="w-full h-full object-cover"
>
    <div class="absolute top-3 right-3">
      <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
        ${launch.status?.name}
      </span>
    </div>
  </div>
  <div class="p-5">
    <div class="mb-3">
      <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
        ${launch.name}
      </h4>
      <p class="text-sm text-slate-400 flex items-center gap-2">
        <i class="fas fa-building text-xs"></i>
        ${launch.launch_service_provider?.name}
      </p>
    </div>
    <div class="space-y-2 mb-4">
      <div class="flex items-center gap-2 text-sm">
        <i class="fas fa-calendar text-slate-500 w-4"></i>
        <span class="text-slate-300">${launch.net ? launch.net.split("T")[0] : ""}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <i class="fas fa-clock text-slate-500 w-4"></i>
        <span class="text-slate-300">${launch.net ? launch.net.split("T")[1].substring(0, 5) + " UTC" : ""}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <i class="fas fa-rocket text-slate-500 w-4"></i>
        <span class="text-slate-300">${launch.rocket?.configuration?.name}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
        <span class="text-slate-300 line-clamp-1">${launch.pad?.name}</span>
      </div>
    </div>
    <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
      <button  data-id="${launch.id}" class=" details-btn flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
        Details
      </button>
      <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
        <i class="far fa-heart"></i>
      </button>
    </div>
  </div>
</div>`;
    })
    .join("");
  lunchCard.innerHTML = res;
}
function showFeaturedLaunches(getLaunche) {
  let res = getLaunche.results
    .map((launch, index) => {
      if (index == 0) {
        return `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i>
                Featured Launch
              </span>
              <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                ${launch.status?.name || "N/A"}
              </span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">
              ${launch.name || "Unknown Launch"}
            </h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2">
                <i class="fas fa-building"></i>
                <span>${launch.launch_service_provider?.name || "N/A"}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-rocket"></i>
                <span>${launch.rocket?.configuration?.name || "N/A"}</span>
              </div>
            </div>
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-blue-400"></i>
              <div>
                <p class="text-2xl font-bold text-blue-400">
                  ${launch.net ? Math.max(0, Math.ceil((new Date(launch.net) - new Date()) / (1000 * 60 * 60 * 24))) : "0"}
                </p>
                <p class="text-xs text-slate-400">Days Until Launch</p>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-calendar"></i>
                  Launch Date
                </p>
                <p class="font-semibold">${launch.net ? launch.net.split("T")[0] : "N/A"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-clock"></i>
                  Launch Time
                </p>
                <p class="font-semibold">${launch.net ? launch.net.split("T")[1].substring(0, 5) + " UTC" : "N/A"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-map-marker-alt"></i>
                  Location
                </p>
                <p class="font-semibold text-sm line-clamp-1">${launch.pad?.name || "N/A"}</p>
              </div>
              <div class="bg-slate-900/50 rounded-xl p-4">
                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <i class="fas fa-globe"></i>
                  Country
                </p>
                <p class="font-semibold">${launch.pad?.location?.country_code || "USA"}</p>
              </div>
            </div>
            <p class="text-slate-300 leading-relaxed mb-6 line-clamp-3">
              ${launch.mission?.description || launch.status?.description || "No description available for this launch."}
            </p>
          </div>
          <div class="flex flex-col md:flex-row gap-3">
            <button data-id="${launch.id}" class="flex-1 details-btn self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
              <i class="fas fa-info-circle"></i>
              View Full Details
            </button>
            <div class="icons self-end md:self-center">
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
              </button>
              <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                <i class="fas fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
            <img 
              src="${launch.image?.image_url || "assets/images/launch-placeholder.png"}" 
              onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';" 
              alt="${launch.name || ""}"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  `;
      }
    })
    .join("");
  featuredlunch.innerHTML = res;
}

let getDetailsLaunches = async (id) => {
  const response = await fetch(
    `https://lldev.thespacedevs.com/2.3.0/launches/${id}/`,
  );

  return await response.json();
};

function LaunchesEvents() {
  const detailsBtn = document.querySelectorAll(".details-btn");

  detailsBtn.forEach((item) => {
    item.addEventListener("click", () => {
      window.open(`deat.html?id=${item.dataset.id}`,"_blank");
    });
  });
}
async function getPlanets() {
  try {
    const respons = await fetch(
      `https://solar-system-opendata-proxy.vercel.app/api/planets`,
    );
    getDataPlanets = await respons.json();
    console.log(getDataPlanets);
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}
function FindPlanets(findPlante) {
  let dataPlanet = getDataPlanets.bodies.find((item) => {
    return findPlante === item.englishName;
  });
  return dataPlanet;
}
function showPlanets(PlanetShow) {
  let box = "";
  box = `
      <div class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
        <div class="flex flex-col xl:flex-row xl:items-start space-y-4 xl:space-y-0">
          <div class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto xl:mr-6">
            <img
              id="planet-detail-image"
              class="w-full h-full object-contain"
              src="${PlanetShow.image}"
              alt="${PlanetShow.englishName}"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-3 md:mb-4">
              <h3 id="planet-detail-name" class="text-2xl md:text-3xl font-space font-bold">
                ${PlanetShow.englishName}
              </h3>
              <button class="w-10 h-10 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <i class="far fa-heart"></i>
              </button>
            </div>
            <p id="planet-detail-description" class="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              ${PlanetShow.description}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 md:gap-4 mt-4">
          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-ruler text-xs"></i>
              <span class="text-xs">Semimajor Axis</span>
            </p>
            <p id="planet-distance" class="text-sm md:text-lg font-semibold">
              ${PlanetShow.semimajorAxis}
            </p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-circle"></i>
              Mean Radius
            </p>
            <p id="planet-radius" class="text-lg font-semibold">
              ${PlanetShow.meanRadius}
            </p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-weight"></i>
              Mass
            </p>
            <p id="planet-mass" class="text-lg font-semibold">
              ${PlanetShow.mass?.massValue} × 10^${PlanetShow.mass?.massExponent}
            </p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-compress"></i>
              Density
            </p>
            <p id="planet-density" class="text-lg font-semibold">
              ${PlanetShow.density}
            </p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-sync-alt"></i>
              Orbital Period
            </p>
            <p id="planet-orbital-period" class="text-lg font-semibold">
              ${PlanetShow.sideralOrbit}
            </p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-redo"></i>
              Rotation Period
            </p>
            <p id="planet-rotation" class="text-lg font-semibold">
              ${PlanetShow.sideralRotation}
            </p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-moon"></i>
              Moons
            </p>
            <p id="planet-moons" class="text-lg font-semibold">
              ${PlanetShow.moons?.length}
            </p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-4">
            <p class="text-xs text-slate-400 mb-1 flex items-center gap-1">
              <i class="fas fa-arrows-alt-v"></i>
              Gravity
            </p>
            <p id="planet-gravity" class="text-lg font-semibold">
              ${PlanetShow.gravity}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Discovery Info -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h4 class="font-semibold mb-4 flex items-center">
            <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
            Discovery Info
          </h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Discovered By</span>
              <span id="planet-discoverer" class="font-semibold text-right">
                ${PlanetShow.discoveredBy || "Known since antiquity"}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Discovery Date</span>
              <span id="planet-discovery-date" class="font-semibold">
                ${PlanetShow.discoveryDate || "Ancient times"}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Body Type</span>
              <span id="planet-body-type" class="font-semibold">
                ${PlanetShow.bodyType || "Planet"}
              </span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-slate-400">Volume</span>
              <span id="planet-volume" class="font-semibold">
                ${PlanetShow.vol?.volValue} × 10^${PlanetShow.vol?.volExponent}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Facts -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h4 class="font-semibold mb-4 flex items-center">
            <i class="fas fa-lightbulb text-yellow-400 mr-2"></i>
            Quick Facts
          </h4>
          <ul id="planet-facts" class="space-y-3 text-sm">
            <li class="flex items-start">
              <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
              <span class="text-slate-300">Gravity: ${PlanetShow.gravity}</span>
            </li>
          </ul>
        </div>

        <!-- Orbital Characteristics -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h4 class="font-semibold mb-4 flex items-center">
            <i class="fas fa-satellite text-blue-400 mr-2"></i>
            Orbital Characteristics
          </h4>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Perihelion</span>
              <span id="planet-perihelion" class="font-semibold">
                ${PlanetShow.perihelion}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Aphelion</span>
              <span id="planet-aphelion" class="font-semibold">
                ${PlanetShow.aphelion}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Eccentricity</span>
              <span id="planet-eccentricity" class="font-semibold">
                ${PlanetShow.eccentricity}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Inclination</span>
              <span id="planet-inclination" class="font-semibold">
                ${PlanetShow.inclination}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Axial Tilt</span>
              <span id="planet-axial-tilt" class="font-semibold">
                ${PlanetShow.axialTilt}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-slate-700">
              <span class="text-slate-400">Avg Temperature</span>
              <span id="planet-temp" class="font-semibold">
                ${PlanetShow.avgTemp}
              </span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-slate-400">Escape Velocity</span>
              <span id="planet-escape" class="font-semibold">
                ${PlanetShow.escape}
              </span>
            </div>
          </div>
        </div>

        <button class="w-full py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors font-semibold">
          <i class="fas fa-book mr-2"></i>Learn More
        </button>
      </div>
    `;
  document.querySelector(".placeplanet").innerHTML = box;
}

function planetsEvents() {
  planet.forEach((item) => {
    item.addEventListener("click", (el) => {
      const find = item.dataset.planetId;
      console.log(find);

      let data = FindPlanets(find);
      showPlanets(data);
    });
  });
}
function todaySection() {
  getToday();
  todayEvant();
}
function launchesSection() {
  getLaunches();
}
function planetsSection() {
  getPlanets();
  planetsEvents();
}
todaySection();
launchesSection();
planetsSection();
