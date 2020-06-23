console.log("connected");
import axios from "axios";
import "./style.scss";

var indiSection = find("#individual");
var dbzCardContainer = find(".container__characters");
var homeLoader = find("#home .loader");
var indiLoader = find("#individual .loader");

var corsErrorRemovalURL = `https://corsanywhere.herokuapp.com/`;
var baseURL = `https://dragon-ball-api.herokuapp.com/`;

function find(selector) {
  return document.querySelector(selector);
}

function findAll(selector) {
  return document.querySelectorAll(selector);
}

function renderHTML(dbzCharacters) {
  for (var character of dbzCharacters) {
    var characterHTML = `<div data-name = ${character.name} class="container__character container__character1">
          <img
            class="container__character-image"
            src=${character.image}
            alt="character"
          />
          <p class="container__character-name"><span>Name:</span>${character.name}</p>
          <p class="container__character-gender"><span>Gender:</span>${character.gender}</p>
          <p class="container__character-planet"><span>Planet:</span>${character.planet}</p>
        </div>`;

    dbzCardContainer.insertAdjacentHTML("beforeend", characterHTML);
  }
}

function renderIndiHTML(character) {
  indiSection.querySelector(".loader").style.display = "none";

  var indiHTML = `<div class="character__container">
  <img
    src="${character.image.replace("../", baseURL)}"
    alt="character"
    class="character__container-image"
  />
  <div class="character__container-details">
    <p class="container__character-name">
      <span>Name:</span>${character.name}
    </p>
    <p class="container__character-gender">
      <span>Gender:</span>${character.gender}
    </p>
    <p class="container__character-status">
    <span>Status:</span>${character.status}
    </p>
    <p class="container__character-originPlanet">
    <span>OriginPlanet:</span>${character.originPlanet}
    </p>
    <p class="container__character-species">
      <span>Species:</span>${character.species}
    </p>
    <p class="container__character-planet">
      <span>Planet:</span>${character.planet}
    </p>
  </div> 
</div>`;

  indiSection.insertAdjacentHTML("afterbegin", indiHTML);
}

function fetchDBZCharacters() {
  homeLoader.style.display = "block";
  var characters = localStorage.getItem("characters");
  if (characters) {
    return Promise.resolve(JSON.parse(characters));
  }
  var dbzPromise = axios
    .get(`${corsErrorRemovalURL}${baseURL}/api/character`)
    .then(function (response) {
      var constructedData = [];
      var dbzCharacters = response.data;
      for (var character of dbzCharacters) {
        console.log(character);
        var characterObj = {
          name: character.name,
          planet: character.originPlanet,
          image: character.image.replace("../", baseURL),
          gender: character.gender,
        };
        constructedData.push(characterObj);
      }
      localStorage.setItem("characters", JSON.stringify(constructedData));
      return constructedData;
    })
    .catch(function (error) {
      console.log(error);
    });
  return dbzPromise;
}

function fetchDBZSingleCharacter(characterName) {
  indiSection.innerHTML = `<div class="loader" style="display: none;">Loading...</div>`;
  indiSection.querySelector(".loader").style.display = "block";
  return axios(
    `${corsErrorRemovalURL}${baseURL}/api/character/${characterName}`
  ).then(function (response) {
    return response.data;
  });
}

function checkValidHash() {
  if (
    window.location.hash !== "#home" &&
    window.location.hash !== "#individual"
  ) {
    window.location.hash = "#home";
  }
}

function renderPage(hashValue) {
  find(hashValue).style.display = "block";
  if (hashValue === "#home") {
    fetchDBZCharacters().then(function (characters) {
      homeLoader.style.display = "none";
      renderHTML(characters);
    });
  }
}

function init() {
  checkValidHash();
  renderPage(window.location.hash);
}

window.addEventListener("hashchange", function (event) {
  checkValidHash();
  find("#home").style.display = "none";
  find("#individual").style.display = "none";
  renderPage(window.location.hash);
});

dbzCardContainer.addEventListener("click", function () {
  var isCardClicked = event.target.matches(
    ".container__character, .container__character *"
  );
  if (isCardClicked) {
    var containerCard = event.target.closest(".container__character");
    var characterName = containerCard.dataset.name;
    console.log(characterName);
    window.location.hash = "#individual";
    fetchDBZSingleCharacter(characterName).then(function (character) {
      renderIndiHTML(character);
    });
  }
});

init();
