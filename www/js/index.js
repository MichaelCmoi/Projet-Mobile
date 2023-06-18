
document.addEventListener('deviceready', onDeviceReady, false);
var my_app;
var listMin = 0;

var pokemons = []

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');
  getPokemonName(listMin);
  /*** ADD VUE JS start ***/
  console.log(`Pokemons : ${pokemons}`)
  my_app = Vue.createApp({
    data() {
      return {
        message: 'Pokemons',
        message_mon_objet_global: 'mon_objet_global',
        pokemons: pokemons,
      }
    }
  })
  my_app.mount("#app");
  /*** ADD VUE JS end ***/
}

function getPokemonName(size) {
  var url = `https://pokeapi.co/api/v2/pokemon/?offset=${size}&limit=10`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var pokemonList = data.results;
      pokemons = pokemonList
      var recupererData = pokemonList.map(function (pokemon) {
        return fetch(pokemon.url)
          .then(function (response) {
            return response.json();
          })
          .then(function (pokemonData) {
            var stats = pokemonData.stats;
            var hp = stats.find(stat => stat.stat.name === 'hp').base_stat;
            var defense = stats.find(stat => stat.stat.name === 'defense').base_stat;
            var specialAttack = stats.find(stat => stat.stat.name === 'special-attack').base_stat;
            var specialDefense = stats.find(stat => stat.stat.name === 'special-defense').base_stat;
            var speed = stats.find(stat => stat.stat.name === 'speed').base_stat;

            var abilities = pokemonData.abilities;
            var attackNames = abilities.map(ability => ability.ability.name);

            var pokemonWithStats = {
              name: pokemon.name,
              hp: hp,
              attack: stats.find(stat => stat.stat.name === 'attack').base_stat,
              defense: defense,
              specialAttack: specialAttack,
              specialDefense: specialDefense,
              speed: speed,
              attacks: attackNames,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`
            };

            return pokemonWithStats;
          });
      });

      // pas besoin

      Promise.all(recupererData)
        .then(function (pokemonData) {
          // Update Vue app's data with retrieved Pokemon data
          pokemons = pokemonData;
          console.log(pokemons);
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error(error);
    });
}



