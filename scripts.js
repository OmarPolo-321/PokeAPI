document.getElementById("pokemonForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Previene el recargo de la página

  const cantidad = document.getElementById("input_number").value
  if (cantidad > 0) {
    const loader = document.getElementById("loader");
    const ListPokemon = document.querySelector(".ListPokemon");
    loader.classList.remove("hidden");
    await FetchPokeApi(cantidad);
    
  }
});


async function FetchPokeApi(numPokemons) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numPokemons}&offset=0`);
        const data = await res.json();
        mostrar(data);
    } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
    }
}


async function mostrar(data) {
    const ListPokemon = document.querySelector(".ListPokemon");

    // data.results.forEach(pokemon => {
    //     const card= await PokerCard(pokemon);
    //     ListPokemon.appendChild(card);
    // });
    const cards = await Promise.all(
        data.results.map(pokemon => PokerCard(pokemon))
    );
    //Promise.all para esperar a que todas las tarjetas se generen en paralelo
    loader.classList.add("hidden");
    ListPokemon.innerHTML = ""; // limpia antes de agregar
    cards.forEach(card => ListPokemon.appendChild(card));
}

async function PokerCard(pokemon) {
    const imgPokemon = await fetch(pokemon.url).then(res => res.json())

    const div = document.createElement("div");
    div.className = "shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 w-60 bg-white rounded-2xl overflow-hidden flex justify-center flex-col";
    div.innerHTML = `
        <img src="${imgPokemon.sprites.other["official-artwork"].front_default}"
        alt="${pokemon.name}" class="w-full h-40 object-contain bg-gray-200 p-2">
        <div class="p-4 text-center">
        <h2 class="text-xl font-semibold text-gray-700 capitalize">${pokemon.name}</h2>
        <p class="text-sm text-gray-500">Tipo: ${imgPokemon.types[0].type.name}</p>
        </div>
        <button class="btn rounded-full bg-lime-300 m-3">
            Ver mas detalles
        </button>
    `;
    const btn = div.querySelector(".btn")
    btn.addEventListener("click", () => {
        window.location.href = `detallePokemon.html?nombre=${pokemon.name}`;
    })
    return div;
}



//FetchPokeApi()

