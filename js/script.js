import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

const pokeState = {
  pokemon: {},
};

const _parentElement = document.querySelector(".pokemon__container");
const search = document.querySelector(".search");
const searchKey = document.querySelector(".searchTerm");

//console.log(searchKey);

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
    stats: pokemon.stats.map((obj) => {
      let stat = { name: obj.stat.name, stat: obj.base_stat };
      return stat;
    }),
    // pushStats() {
    //   return pokemon.stats.map((obj) => {
    //     let stat = { name: obj.stat.name, stat: obj.base_stat };
    //   });
    // },
  };
};

//Responsible for fetchin data from API
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
  <div class="type main__type type--${pokemon.maintype}">${pokemon.maintype}</div>
  <div class="type sub__type subtype--${pokemon.subtype}">${pokemon.subtype}</div>
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
`,
  ].join("");
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
  addEvoImages(id);
  //console.log(pokeState);
  setTimeout(() => {
    const markup = _generateMarkupDetail(pokeState.pokemon);
    pokemonDetails.insertAdjacentHTML("afterbegin", markup);
  }, 1500);
});

const fetchPokemeonForms = async function (id) {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  const datapok = await data.json();
  //console.log("Species", datapok);

  const data2 = await fetch(datapok.evolution_chain.url);
  const datapok2 = await data2.json();
  //console.log("Evolution chain ", datapok2);

  const evo1 = datapok2.chain.species.name;
  const evo2 = datapok2.chain.evolves_to[0].species.name;
  const evo3 = datapok2.chain.evolves_to[0].evolves_to[0].species.name;

  const evos = await getEvolutions(evo1, evo2, evo3);

  // console.log(evos);

  const evoImage1 = evos[0].sprites.front_default;
  const evoImage2 = evos[1].sprites.front_default;
  const evoImage3 = evos[2].sprites.front_default;

  return [evoImage1, evoImage2, evoImage3];

  //.flat(Infinity)
};

//fetchPokemeonForms();

const fetchingDataName = async function (name) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokeData = await pokemon.json();

  return pokeData;
};

const getEvolutions = async function (name1, name2, name3) {
  const data = await Promise.all([
    fetchingDataName(name1),
    fetchingDataName(name2),
    fetchingDataName(name3),
  ]);

  return data;
};

const getPokemonList = async function () {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
  const pokeData = await pokemon.json();

  console.log(pokeData);
};

getPokemonList();
