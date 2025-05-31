async function FetchPokeApi() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");
    const data = await res.json();
    mostrar(data);
}


async function mostrar(data) {
    const ListPokemon = document.querySelector(".ListPokemon");
    ListPokemon.innerHTML = ""; // limpia antes de agregar

    // data.results.forEach(pokemon => {
    //     const card= await PokerCard(pokemon);
    //     ListPokemon.appendChild(card);
    // });
    const cards = await Promise.all(
        data.results.map(pokemon => PokerCard(pokemon))
    );

    cards.forEach(card => ListPokemon.appendChild(card));
}

async function PokerCard(pokemon){
    const imgPokemon = await fetch(pokemon.url).then(res=>res.json())

    const div = document.createElement("div");
    div.className="shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 w-60 bg-white rounded-2xl overflow-hidden flex justify-center flex-col";
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
    const btn =div.querySelector(".btn")
    btn.addEventListener("click",()=>{
        window.location.href = `detallePokemon.html?nombre=${pokemon.name}`;
    })
    return div;
}



FetchPokeApi()

    