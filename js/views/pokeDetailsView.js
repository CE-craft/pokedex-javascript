import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import View from "./View.js";

class PokeDetailsView extends View {
  _parentElement = document.querySelector(".pokemon__details");
  _container = document.querySelector(".pokemon__container");
  _element = document.querySelector(".card");

  errorMsg = `Couldn't Display Pokemon details server Error`;
  _data;

  render(pokemon) {
    const markup = this._generateMarkup(pokemon);
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup = function (pokemon) {
    return [
      `
    <img
    src="${pokemon.image}"
    alt="Charizard"
    class="pokemon__img--detail"
  />
  <span class="id">#${pokemon.id}</span>
  <h2 class="name">${pokemon.name}</h2>
  <div class="types">
    <div class="type main__type type--${pokemon.maintype}">${
        pokemon.maintype
      }</div>
    <div class="type sub__type ${!pokemon.subtype ? "hidden" : ""} subtype--${
        pokemon.subtype
      }">${pokemon.subtype}</div>
  </div>
  <div class="stats">`,

      pokemon.stats
        .map((stat) => {
          return `<div class="stat">
  <h4 class="type__name">${stat.name}</h4>
  <p class="stat__value">${stat.stat}</p>
  </div>
  `;
        })
        .join(""),
      `
  </div>
  <div class="evolution">
    <h3>Evolution chain</h3>
  
    <div class="evolution__details">`,
      pokemon.evoImages
        .map((img) => {
          if (!img) {
            return `<p>Does not evolve</p>`;
          } else {
            return `
      <img
      src="${img}"
      alt="Pokemon evolution"
      class="evo"
    />
`;
          }
        })
        .join(""),
      `</div>
</div>`,
    ].join("");
  };

  addHandlerDetailsRender(handler) {
    this._container.addEventListener("click", function (e) {
      const card = e.target.closest(".card");
      const id = +card.dataset.id;

      handler(id);
    });
  }
}

export default new PokeDetailsView();
