import "@babel/polyfill";

import * as model from "./model.js";
import pokeListView from "./views/pokeListView.js";
import paginationView from "./views/paginationView.js";
import pokeDetailsView from "./views/pokeDetailsView.js";
import searchView from "./views/searchView.js";
import favoritView from "./views/favoritView.js";

import View from "./views/View.js";

import { LIMIT, PER_PAGE } from "../js/config.js";
import * as helpers from "./helpers.js";

const pokemonDetails = document.querySelector(".page-number");

let offset = 0;
let pageCount = 1;

///////////////////////////////////////////////////////////////////////

const pagination = function (target) {
  const maxPage = model.pokeState.pokemonCount;

  if (target.classList.contains("next") && offset <= maxPage) {
    offset += PER_PAGE;
    pokemonDetails.textContent = pageCount += 1;
    return (window.location.hash = `#?limit=${LIMIT}&offset=${offset}`);
  }
  if (target.classList.contains("prev") && offset > 0) {
    offset -= PER_PAGE;
    pokemonDetails.textContent = pageCount -= 1;
    return (window.location.hash = `#?limit=${LIMIT}&offset=${offset}`);
  }
};

const controlPagination = async function (target) {
  pagination(target);

  paginationView.renderLoader();

  const link = helpers.getLinkHash();
  await model.loadPokemonsList(link);

  setTimeout(function () {
    paginationView.renderList(model.pokeState.pages);
  }, 1000);
};

const controlPokeList = async function () {
  try {
    window.location.hash = ``;
    const link = helpers.getLinkHash();
    pokeListView.renderLoader();
    await model.loadPokemonsList(link);

    setTimeout(function () {
      pokeListView.renderList(model.pokeState.pages);
    }, 500);
  } catch (err) {
    pokeListView.renderError();
  }
};

const controlPokeDetails = function (id) {
  try {
    model.pokeState.pages.forEach((pokemon) => {
      if (id === pokemon.id) {
        pokeDetailsView.renderLoader();
        setTimeout(() => {
          pokeDetailsView.render(pokemon);
        }, 500);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const controlSearch = async function (searchString) {
  if (!searchString) {
    await controlPokeList();
  } else {
    pokemonDetails.textContent = pageCount = 1;
    offset = 0;
    await model.loadPokemonsSearch(searchString);
    searchView.renderLoader();
    setTimeout(function () {
      searchView.renderList(model.pokeState.pages);
    }, 400);
  }
};

const controlFavoritDetails = async function (id) {
  try {
    model.pokeState.pages.forEach((pokemon) => {
      if (id === pokemon.id) {
        pokeDetailsView.renderLoader();
        setTimeout(() => {
          pokeDetailsView.render(pokemon);
        }, 500);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const controlAddFavorit = function (id) {
  console.log(id);
  try {
    model.pokeState.pages.forEach((pokemon) => {
      if (id === pokemon.id && pokemon.isFav === false) favoritView.update(id);
    });

    model.addFavorit(id);
    model.pokeState.favorites.forEach((pokemon) => {
      return setTimeout(() => {
        if (pokemon.id === id) {
          favoritView.render(pokemon);
        }
      }, 500);
    });
  } catch (err) {
    console.log(err);
  }
};

const controlRemoveFavorit = function (id) {
  model.pokeState.favorites.forEach((pokemon) => {
    if (id === pokemon.id && pokemon.isFav === true) {
      favoritView.update(id);
      favoritView.removeFavorit(id);
    }
  });
  model.removeFavorit(id);
};

const init = function () {
  pokeListView.addHandlerListRender(controlPokeList);
  paginationView.addHandlerPageRender(controlPagination);
  pokeDetailsView.addHandlerDetailsRender(controlPokeDetails);
  searchView.addHandlerSearchRender(controlSearch);
  favoritView.addHandlerAddFavorit(controlAddFavorit);
  favoritView.addHandlerFavoritDetailsRender(controlFavoritDetails);
  favoritView.addHandlerFavoritListRender();
  favoritView.addHandlerRemoveFavorit(controlRemoveFavorit);
};
init();
