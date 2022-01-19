import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import View from "./View.js";

class favoritView extends View {
  _parentElement = document.querySelector(".pokemon__container");
  _favList = document.querySelector(".fav__list");
  _favoritParent = document.querySelector(".nav");
  _element = document.querySelector(".card");

  errorMsg = `Couldn't Display Pokemon details server Error`;
  _data;

  render(pokemon) {
    const markup = this._generateMarkup(pokemon);

    this._favList.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup = function (pokemon) {
    return `
    <div class="fav__pokemon" data-id="${pokemon.id}">
      <img
      src="${pokemon.image}"
      alt="${pokemon.name}"
      class="fav__pokemon__img"
     />
    <h4 class="fav__name">${pokemon.name}</h4>
  </div>`;
  };

  removeFavorit(id) {
    console.log(this._favList.children);
    this._favList.children.forEach((element) => {
      if (+element.dataset.id === id) {
        element.remove();
      }
    });
  }

  update(id) {
    this._parentElement.children.forEach((element) => {
      if (+element.dataset.id === id) {
        element.children.forEach((el) => {
          if (
            el.classList.contains("favorit") ||
            el.classList.contains("add__favorit")
          ) {
            el.classList.toggle("hidden");
          }
        });
      }
    });
  }

  addHandlerFavoritListRender() {
    this._favoritParent.addEventListener("click", function (e) {
      if (e.target.closest(".circle__bg"))
        document.querySelector(".fav__list").classList.toggle("hidden");
    });
  }

  addHandlerFavoritDetailsRender(handler) {
    this._favList.addEventListener("click", function (e) {
      const favPokemon = e.target.closest(".fav__pokemon");
      const id = +favPokemon.dataset.id;
      handler(id);
    });
  }

  addHandlerAddFavorit(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const heart = e.target.closest(".add__favorit");
      const id = +heart.dataset.id;

      if (!heart) return;

      handler(id);
    });
  }

  addHandlerRemoveFavorit(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const heart = e.target.closest(".favorit");
      const id = +heart.dataset.id;

      if (!heart) return;

      handler(id);
    });
  }
}

export default new favoritView();
