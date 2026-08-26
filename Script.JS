const grid = document.getElementById("champion-grid");

const VERSION = "14.1.1";
const API_URL = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/data/en_US/champion.json`;

fetch(API_URL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const champions = Object.values(data.data);
    renderChampions(champions);
  })
  .catch(function (error) {
    console.error("Failed to load champions:", error);
    grid.innerHTML = "<p>Failed to load champions. Please try again later.</p>";
  });

function renderChampions(champions) {
  grid.innerHTML = "";

  champions.forEach(function (champ) {
    const card = document.createElement("div");
    card.classList.add("champion-card");

    const img = document.createElement("img");
    img.src = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${champ.image.full}`;
    img.alt = champ.name;

    const name = document.createElement("p");
    name.textContent = champ.name;

    card.appendChild(img);
    card.appendChild(name);
    grid.appendChild(card);
  });
}