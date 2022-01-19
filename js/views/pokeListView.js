import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import View from "./View.js";

class PokeListView extends View {
  _parentElement = document.querySelector(".pokemon__container");
  errorMsg = `Couldn't load Pokemon List server error`;
  _data;

  addHandlerListRender(handler) {
    window.addEventListener("load", function () {
      handler();
    });
  }
}

export default new PokeListView();
