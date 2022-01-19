import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! timed out adter ${s}`));
    }, s * 1000);
  });
};

export const getLinkHash = function () {
  return window.location.hash.slice(1);
};
