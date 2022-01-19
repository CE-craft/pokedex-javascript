import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pokemon__container");
  _element = document.querySelector(".pagination___nav");
  errorMsg = `Couldn't load Pokemon List server error`;
  _data;

  addHandlerPageRender(handler) {
    this._element.addEventListener("click", function (e) {
      console.log("Listening pagination");
      e.preventDefault();
      const linkTarget = e.target.closest(".link--trigger");
      if (!linkTarget) return;
      handler(linkTarget);
    });
  }
}

export default new PaginationView();
