
document.addEventListener('deviceready', onDeviceReady, false);
var my_app;
var listMin = 0;

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  document.getElementById('deviceready').classList.add('ready');

  /*** ADD VUE JS start ***/
  my_app = Vue.createApp({
    created() {
      this.pokemons = []
      this.GetPokemonName(listMin)
      // this.pokemons = pokemons
      console.log(`Created pokemons : ${this.pokemons}`)
    },
    data() {
      return {
        pokemons : [],
        title: 'Pokemons',
        pokemon : {},
        selectedPokemon : false
      }
    },
    methods: {
      async GetPokemonName(size) {
        var url = `https://pokeapi.co/api/v2/pokemon/?offset=${size}&limit=10`;
        try {
          const r1 = await fetch(url)
          const data = await r1.json()
          var pokemonList = data.results;

          pokemonList.forEach(async (pokemon) => {
              const resp = await fetch(pokemon.url)
              const pokemonData = await resp.json()
              var stats = pokemonData.stats;
              var hp = stats.find(stat => stat.stat.name === 'hp').base_stat;
              var attack = stats.find(stat => stat.stat.name === 'attack').base_stat;
              var defense = stats.find(stat => stat.stat.name === 'defense').base_stat;
              var specialAttack = stats.find(stat => stat.stat.name === 'special-attack').base_stat;
              var specialDefense = stats.find(stat => stat.stat.name === 'special-defense').base_stat;
              var speed = stats.find(stat => stat.stat.name === 'speed').base_stat;

              var abilities = pokemonData.abilities;
              var attackNames = abilities.map(ability => ability.ability.name);

              var pokemonWithStats = {
                name: pokemon.name,
                hp: hp,
                attack: attack,
                defense: defense,
                specialAttack: specialAttack,
                specialDefense: specialDefense,
                speed: speed,
                attacks: attackNames,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`
              };

              this.pokemons.push(pokemonWithStats)
          });

          setTimeout(() => {
            console.log(`Pokemons : ${JSON.stringify(this.pokemons)}`)
          }, 2000)
        }

        catch (err) {
          console.error(err)
        }
      },
      handlePokemonSelection(index) {
        this.pokemon = this.pokemons[index]
        this.selectedPokemon = true
      }
    }
  })
  my_app.mount("#app");
  /*** ADD VUE JS end ***/
}



