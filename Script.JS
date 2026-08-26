const grid = document.getElementById("champion-grid");
const searchInput = document.getElementById("search-input");
const roleFilters = document.getElementById("role-filters");
const compareSection = document.getElementById("compare-section");

const VERSION = "14.1.1";
const API_URL = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/champion.json`;

const ROLES = ["All", "Fighter", "Mage", "Assassin", "Marksman", "Support", "Tank"];

let allChampions = [];
let currentRole = "All";
let currentSearch = "";
let selectedChampions = [];

fetch(API_URL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    allChampions = Object.values(data.data);
    renderRoleFilters();
    renderChampions(allChampions);
  })
  .catch(function (error) {
    console.error("Failed to load champions:", error);
    grid.innerHTML = "<p>Failed to load champions. Please try again later.</p>";
  });

searchInput.addEventListener("input", function () {
  currentSearch = searchInput.value.trim().toLowerCase();
  applyFilters();
});

function renderRoleFilters() {
  ROLES.forEach(function (role) {
    const btn = document.createElement("button");
    btn.textContent = role;
    btn.classList.add("role-btn");

    if (role === "All") {
      btn.classList.add("active");
    }

    btn.addEventListener("click", function () {
      document.querySelectorAll(".role-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      currentRole = role;
      applyFilters();
    });

    roleFilters.appendChild(btn);
  });
}

function applyFilters() {
  const filtered = allChampions.filter(function (champ) {
    const matchesSearch = champ.name.toLowerCase().includes(currentSearch);
    const matchesRole = currentRole === "All" || champ.tags.includes(currentRole);
    return matchesSearch && matchesRole;
  });

  renderChampions(filtered);
}

function toggleSelect(champ, card) {
  const alreadySelected = selectedChampions.find(function (c) {
    return c.id === champ.id;
  });

  if (alreadySelected) {
    selectedChampions = selectedChampions.filter(function (c) {
      return c.id !== champ.id;
    });
    card.classList.remove("selected");
  } else {
    if (selectedChampions.length >= 2) {
      selectedChampions.shift();
    }
    selectedChampions.push(champ);
    card.classList.add("selected");
  }

  document.querySelectorAll(".champion-card").forEach(function (c) {
    const id = c.dataset.id;
    const isSelected = selectedChampions.some(function (sel) {
      return sel.id === id;
    });
    c.classList.toggle("selected", isSelected);
  });

  renderCompare();
}

function renderCompare() {
  compareSection.innerHTML = "";

  if (selectedChampions.length < 2) {
    compareSection.innerHTML = `<p class="compare-hint">Select two champions above to compare (${selectedChampions.length}/2 selected)</p>`;
    return;
  }

  const [a, b] = selectedChampions;

  compareSection.innerHTML = `
    <div class="compare-header">
      <div class="compare-side">
        <img src="https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${a.image.full}" alt="${a.name}">
        <h3>${a.name}</h3>
      </div>
      <span class="vs">VS</span>
      <div class="compare-side">
        <img src="https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${b.image.full}" alt="${b.name}">
        <h3>${b.name}</h3>
      </div>
    </div>
  `;
}

function renderChampions(champions) {
  grid.innerHTML = "";

  if (champions.length === 0) {
    grid.innerHTML = "<p>No champions found.</p>";
    return;
  }

  champions.forEach(function (champ) {
    const card = document.createElement("div");
    card.classList.add("champion-card");
    card.dataset.id = champ.id;

    const isSelected = selectedChampions.some(function (sel) {
      return sel.id === champ.id;
    });

    if (isSelected) {
      card.classList.add("selected");
    }

    const img = document.createElement("img");
    img.src = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${champ.image.full}`;
    img.alt = champ.name;

    const name = document.createElement("p");
    name.textContent = champ.name;

    card.appendChild(img);
    card.appendChild(name);

    card.addEventListener("click", function () {
      toggleSelect(champ, card);
    });

    grid.appendChild(card);
  });
}