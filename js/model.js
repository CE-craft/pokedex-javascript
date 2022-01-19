import "@babel/polyfill";
import "core-js/stable";
import "regenerator-runtime/runtime";

import { API_URL } from "../js/config.js";
import * as helpers from "./helpers.js";
import { TIME_OUT_SEC } from "./config.js";

export const pokeState = { pages: [], favorites: [] };

const createPokemonObject = async function (data) {
  const pokemon = data;
  const evoImages = await addEvoImages(pokemon.id);
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
    evoImages: evoImages.flat(),
    isFav: false,
  };
};

export const loadPokemon = async function (name) {
  try {
    const pokemon = await Promise.race([
      fetch(`${API_URL}${name}`),
      helpers.timeout(TIME_OUT_SEC),
    ]);
    const pokeData = await pokemon.json();
    //console.log(pokeData.id);

    const pokeObj = await createPokemonObject(pokeData);
    //console.log(pokeState);
    //pokeState.pages.evoImages = await addEvoImages(pokeData.id);

    if (!pokemon.ok)
      throw new Error(
        `Error couldn't get pokemon // Status: ${pokemon.status}`
      );
    return pokeObj;
  } catch (err) {
    throw err;
  }
};

export const loadPokemonsList = async function (link) {
  try {
    let pokemon;

    !link
      ? (pokemon = await fetch(`${API_URL}`))
      : (pokemon = await fetch(`${API_URL}${link}`));

    if (!pokemon.ok)
      throw new Error(
        `Error couldn't get pokemon // Status: ${pokemon.status}`
      );
    const pokeData = await pokemon.json();
    console.log(pokeData);
    // Insert total pokemons in the state
    pokeState.pokemonCount = pokeData.count;

    const pokemons = await Promise.all(
      pokeData.results.map((res) => loadPokemon(res.name))
    );
    // Insert pokemon list in the state
    return (pokeState.pages = pokemons);
  } catch (err) {
    throw err;
  }
};

//////////////////////////////////////////////// Get data for pokemon details

const loadPokeByName = async function (name) {
  //console.log(name);
  if (!name) return;
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokeData = await pokemon.json();

  return pokeData;
};

const loadPokeEvoPics = async function (name1 = "", name2 = "", name3 = "") {
  const data = await Promise.all([
    loadPokeByName(name1),
    loadPokeByName(name2),
    loadPokeByName(name3),
  ]);

  return data;
};

const loadPokeEvoChain = async function (id) {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  const datapok = await data.json();

  const data2 = await fetch(datapok.evolution_chain.url);
  const datapok2 = await data2.json();

  /*const notEvolve1 = datapok2.chain.species;
  const notEvolve2 = datapok2.chain.evolves_to[0];
  const notEvolve3 = datapok2.chain.evolves_to[0].evolves_to[0];*/
  // const emptyArray = [];
  // console.log(Array.isArray(emptyArray));

  const evo1 = datapok2.chain.species.name;

  //console.log(datapok2.chain.evolves_to[0]);

  let evo2 = "";
  let evo3 = "";
  if (
    Array.isArray(datapok2.chain.evolves_to) &&
    datapok2.chain.evolves_to.length > 0
  ) {
    evo2 = datapok2.chain.evolves_to[0].species.name;
    if (
      Array.isArray(datapok2.chain.evolves_to[0].evolves_to) &&
      datapok2.chain.evolves_to[0].evolves_to.length > 0
    ) {
      evo3 = datapok2.chain.evolves_to[0].evolves_to[0].species.name;
    }
  }
  //console.log(evo3);
  // console.log(datapok2.chain.evolves_to[0].evolves_to[0].species.name);
  // console.log(evo2);
  //const evo3 = datapok2.chain.evolves_to[0].evolves_to[0].species.name;

  const evos = await loadPokeEvoPics(evo1, evo2, evo3);

  const evolutions = evos.map((evo) => {
    if (evo) {
      return (evo = evo.sprites.front_default);
    }
  });
  //console.log(evolutions);

  /* const notEvo1 = evos[0];
  const notEvo2 = evos[1];
  const notEvo3 = evos[2];*/

  /*const evoImage1 = !notEvo1 ? "" : evos[0].sprites.front_default;
  const evoImage2 = !notEvo2 ? "" : evos[1].sprites.front_default;
  const evoImage3 = !notEvo3 ? "" : evos[2].sprites.front_default;
*/
  return [evolutions];
  //return [evoImage1, evoImage2, evoImage3];
};

const addEvoImages = async function (id) {
  const evoImgs = await loadPokeEvoChain(id);
  return evoImgs;
};
console.log(pokeState);

export const loadPokemonsSearch = async function (searchString) {
  console.log(searchString);
  try {
    let pokemon = await fetch(`${API_URL}?limit=150&offset=20`);
    if (!pokemon.ok)
      throw new Error(
        `Error couldn't get pokemon // Status: ${pokemon.status}`
      );

    const pokeData = await pokemon.json();

    const pokemons = await Promise.all(
      pokeData.results.map((poke) => {
        if (poke.name.startsWith(searchString)) {
          return loadPokemon(poke.name);
        } else {
          return null;
        }
      })
    );

    const set = new Set(pokemons);
    let pokeArr = Array.from(set);

    //pokeArr = pokeArr.splice(pokeArr.indexOf(null));
    if (pokeArr.includes(null)) pokeArr.shift();

    console.log(pokeArr);
    // Insert total pokemons in the state
    pokeState.pokemonCount = pokeData.count;

    // Insert pokemon list in the state
    return (pokeState.pages = pokeArr);
  } catch (err) {
    throw err;
  }
};

export const addFavorit = function (id) {
  pokeState.pages.forEach((pokemon) => {
    if (id === pokemon.id && pokemon.isFav === false) {
      pokemon.isFav = true;
      pokeState.favorites.push(pokemon);
    }
  });
  console.log(pokeState.favorites);
};

export const removeFavorit = function (id) {
  pokeState.favorites.forEach((pokemon, i) => {
    if (id === pokemon.id && pokemon.isFav === true) {
      pokemon.isFav = false;
      pokeState.favorites.splice(i, 1);
    }
  });
  console.log(pokeState.favorites);
};

/*const test = async function () {
  const data = await fetch(`https://pokeapi.co/api/v2/pokemon-species/21/`);
  const datapok = await data.json();
  // console.log(datapok);
  const data1 = await fetch(`https://pokeapi.co/api/v2/evolution-chain/8/`);
  const datapok1 = await data1.json();
  console.log(datapok1);

  const data2 = await fetch(`https://pokeapi.co/api/v2/evolution-chain/1/`);
  const datapok2 = await data2.json();
  console.log(datapok2);
};

test();*/
