import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import View from "./View.js";

class SearchView extends View {
  _parentElement = document.querySelector(".pokemon__container");
  _filters = document.querySelector(".search__bar");

  errorMsg = `Pokemon does not exist`;
  _data;

  addHandlerSearchRender(handler) {
    this._filters.addEventListener("keyup", function () {
      const element = document.querySelector(".search--input");

      let searchString = element.value;

      handler(searchString);
    });
  }
}

export default new SearchView();
