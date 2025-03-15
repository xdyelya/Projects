const pokemonListDiv = document.getElementById('pokemonList');
const pokemonInfoDiv = document.getElementById('pokemonInfo');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

let currentUrl = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemons(url) {
    const response = await fetch(url);
    const data = await response.json();
    
    pokemonListDiv.innerHTML = '';
    
    for (const pokemon of data.results) {
        const pokemonItem = document.createElement('div');
        pokemonItem.className = 'pokemon-item';
        pokemonItem.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
        (function(pokemonUrl) {
            pokemonItem.addEventListener('click', async () => {
                const pokeResponse = await fetch(pokemonUrl);
                const pokeData = await pokeResponse.json();
                showPokemonInfo(pokeData);
            });
        })(pokemon.url);
        
        pokemonListDiv.appendChild(pokemonItem);
    }

    prevButton.disabled = !data.previous;
    nextButton.disabled = !data.next;
    
    currentUrl = data.next;
}

function showPokemonInfo(pokemon) {
    const types = pokemon.types.map(type => type.type.name).join(', ');
    
    pokemonInfoDiv.innerHTML = `
        <h2>Имя: ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <p>Тип: ${types}</p>
        <p>Рост: ${pokemon.height}</p>
        <p>Вес: ${pokemon.weight}</p>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    `;
}

prevButton.addEventListener('click', async () => {
    if (currentUrl) {
        const response = await fetch(currentUrl);
        const data = await response.json();
        fetchPokemons(data.previous);
    }
});

nextButton.addEventListener('click', async () => {
    if (currentUrl) {
        fetchPokemons(currentUrl);
    }
});

fetchPokemons(currentUrl);
