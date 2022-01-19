import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import image from "../../img/pokemon.png";

export default class View {
  renderList = function (data) {
    this._data = data;
    const markup = this._data
      .map((poke) => this._generateMarkup(poke))
      .join("");
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  };

  renderLoader() {
    const markup = `<div class="loader"><img src="${image}" alt="" /></div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(this._data);
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElement.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (!newEl.isEqualNode(curEl)) {
        console.log("Current", curEl);
        console.log("New", newEl);
        curEL = newEl;
      }
    });
  }

  renderError(msg) {
    const markup = `<div class="error"><p>${msg}</p></div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  _generateMarkup = function (pokemon) {
    return `
  <div class="card" data-id="${pokemon.id}">
  <img
    src="${pokemon.image}"
    alt="${pokemon.name}"
    class="pokemon__img"
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
  <div class="heart add__favorit ${pokemon.isFav ? "hidden" : ""}" data-id="${
      pokemon.id
    }">
    <i class="far fa-heart"></i>
  </div>
  <div class="heart favorit ${!pokemon.isFav ? "hidden" : ""}" data-id="${
      pokemon.id
    }"><i class="fas fa-heart"></i></div>
  </div>
  `;
  };
}
