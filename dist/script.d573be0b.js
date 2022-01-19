// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/script.js":[function(require,module,exports) {
const pokeState = {
  pokemon: {}
};

const _parentElement = document.querySelector(".pokemon__container");

const search = document.querySelector(".search");
const searchKey = document.querySelector(".searchTerm");
const pokemonDetails = document.querySelector(".pokemon__details"); //console.log(searchKey);
//console.log(pokeState);

const getPokemon = async function (name) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokeData = await pokemon.json();
  console.log(pokeData);
  pokeState.pokemon = createPokemonObject(pokeData);
  render(pokeState.pokemon);
  console.log(pokeData);
};

const createPokemonObject = function (data) {
  const pokemon = data;
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.front_default,
    maintype: pokemon.types[0].type.name,
    subtype: pokemon.types[1] ? pokemon.types[1].type.name : "",
    stats: pokemon.stats.map(obj => {
      let stat = {
        name: obj.stat.name,
        stat: obj.base_stat
      };
      return stat;
    }) // pushStats() {
    //   return pokemon.stats.map((obj) => {
    //     let stat = { name: obj.stat.name, stat: obj.base_stat };
    //   });
    // },

  };
}; //Responsible for fetchin data from API

/*const loadPokemon = async function () {
  try {
    const data = await getPokemon();
    //console.log(data);


  } catch (err) {
    //Error handling
    //console.error(`${err} MY ERROR-----`);
    throw err;
  }
};*/


const render = function (pokemon) {
  const markup = _generateMarkup(pokemon);

  _parentElement.insertAdjacentHTML("afterbegin", markup);
};

const _generateMarkup = function (pokemon) {
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
  <div class="type main__type type--${pokemon.maintype}">${pokemon.maintype}</div>
  <div class="type sub__type subtype--${pokemon.subtype}">${pokemon.subtype}</div>
</div>
</div>
`;
};

const _generateMarkupDetail = function (pokemon) {
  console.log(pokemon.stats);
  return [`
  <img
  src="${pokemon.image}"
  alt="Charizard"
  class="pokemon__img--detail"
/>
<span class="id">#${pokemon.id}</span>
<h2 class="name">${pokemon.name}</h2>
<div class="types">
  <div class="type main__type type--${pokemon.maintype}">${pokemon.maintype}</div>
  <div class="type sub__type subtype--${pokemon.subtype}">${pokemon.subtype}</div>
</div>
<div class="stats">`, pokemon.stats.map(stat => {
    return `<div class="stat">
<h4 class="type__name">${stat.name}</h4>
<p class="stat__value">${stat.stat}</p>
</div>
`;
  }).join(""), `
</div>
<div class="evolution">
  <h3>Evolution chain</h3>

  <div class="evolution__details">
    <img
      src="${pokemon.evoImgs[0]}"
      alt="Charizard"
      class="evo"
    />
    <img
      src="${pokemon.evoImgs[1]}"
      alt="Charizard"
      class="evo"
    />
    <img
      src="${pokemon.evoImgs[2]}"
      alt="Charizard"
      class="evo"
    />
  </div>
</div>
`].join("");
};

const addEvoImages = async function (id) {
  const evoImgs = await fetchPokemeonForms(id);
  pokeState.pokemon.evoImgs = evoImgs;
};

search.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(searchKey.value);
  getPokemon(searchKey.value);
});

_parentElement.addEventListener("click", function (e) {
  const card = e.target.closest(".card");
  const id = card.dataset.id;
  addEvoImages(id); //console.log(pokeState);

  setTimeout(() => {
    const markup = _generateMarkupDetail(pokeState.pokemon);

    pokemonDetails.insertAdjacentHTML("afterbegin", markup);
  }, 1500);
});

const fetchPokemeonForms = async function (id) {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  const datapok = await data.json(); //console.log("Species", datapok);

  const data2 = await fetch(datapok.evolution_chain.url);
  const datapok2 = await data2.json(); //console.log("Evolution chain ", datapok2);

  const evo1 = datapok2.chain.species.name;
  const evo2 = datapok2.chain.evolves_to[0].species.name;
  const evo3 = datapok2.chain.evolves_to[0].evolves_to[0].species.name;
  const evos = await getEvolutions(evo1, evo2, evo3); // console.log(evos);

  const evoImage1 = evos[0].sprites.front_default;
  const evoImage2 = evos[1].sprites.front_default;
  const evoImage3 = evos[2].sprites.front_default;
  return [evoImage1, evoImage2, evoImage3]; //.flat(Infinity)
}; //fetchPokemeonForms();


const fetchingDataName = async function (name) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokeData = await pokemon.json();
  return pokeData;
};

const getEvolutions = async function (name1, name2, name3) {
  const data = await Promise.all([fetchingDataName(name1), fetchingDataName(name2), fetchingDataName(name3)]);
  return data;
};

const getPokemonList = async function () {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
  const pokeData = await pokemon.json();
  console.log(pokeData);
};

getPokemonList();
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63542" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/script.js"], null)
//# sourceMappingURL=/script.d573be0b.js.map