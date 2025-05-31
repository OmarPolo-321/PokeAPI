// https://pokeapi.co/api/v2/pokemon/{charmander}

// 1: Obtener los parámetros de la URL que vienes del index.html
const params = new URLSearchParams(window.location.search);

// 2: Obtener el nombre del Pokémon
const nombrePokemon = params.get("nombre");
//const data=fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`).then(res => res.json())

async function DeteailsPokemon(nombrePokemon) {
    const loading = document.getElementById("loading-message");
    const content = document.getElementById("pokemon-content");
    try{
    const data= await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`).then(res => res.json())
    const SpeciesUrl =data.species.url;
    document.getElementById("pokemon-id").textContent=`#${data.id}`
    document.getElementById("pokemon-name").textContent = data.name;
    document.getElementById("pokemon-image").src = data.sprites.other["official-artwork"].front_default;
    document.getElementById("pokemon-height").textContent=`${data.height/10} m`
    document.getElementById("pokemon-weight").textContent=`${data.weight/10} kg`
    
    const SpeciesData=await fetch(SpeciesUrl).then(res => res.json())
    const EvolutionUrl= SpeciesData.evolution_chain.url;

    const Evolutions= await fetch(EvolutionUrl).then(res=>res.json())
    const descriptionEs = SpeciesData.flavor_text_entries.find(
        entry => entry.language.name === 'es'
    )?.flavor_text || SpeciesData.flavor_text_entries[0]?.flavor_text;
    
    document.getElementById("pokemon-description").textContent = descriptionEs;
    //document.getElementById("pokemon-description").textContent=SpeciesData.flavor_text_entries[50].flavor_text
    const EvolutionData = getEvolutionChain(Evolutions.chain);
    displayEvolutions(EvolutionData,data.id)
    }catch(error){
        loading.textContent="Ha ocurrido un error al cargar los datos";
        return
    }
    //console.log(Evolutions)
    //console.log(EvolutionData)
    loading.classList.add("hidden");
    content.classList.remove("hidden");
}
// Función corregida para obtener la cadena evolutiva
function getEvolutionChain(chain) {
    const evolutionChain = [];
    
    function traverseChain(node) {
        if (!node) return;
        
        const pokemonId = node.species.url.split('/')[6];
        evolutionChain.push({
            name: node.species.name,
            id: pokemonId,
            details: node.evolution_details[0] || null,
            is_baby: node.is_baby
        });
        
        // Recorrer todas las posibles evoluciones (no solo la primera)
        if (node.evolves_to && node.evolves_to.length > 0) {
            traverseChain(node.evolves_to[0]); // O usar forEach para ramificaciones
        }
    }
    
    traverseChain(chain);
    return evolutionChain;
}

function displayEvolutions(evolutionChain, currentPokemonId) {
    const container = document.getElementById('evolutions-container');
    container.innerHTML = '';
    
    if (evolutionChain.length <= 1) {
        container.innerHTML = '<p class="text-gray-500">No tiene evoluciones</p>';
        return;
    }
    
    evolutionChain.forEach((evo, index) => {
        const evoElement = document.createElement('div');
        evoElement.className = 'flex flex-col items-center';
        
        // Determinar si es el Pokémon actual
        const isCurrent = evo.id == currentPokemonId;
        
        evoElement.innerHTML = `
            <div class="w-16 h-16 rounded-full flex items-center justify-center 
                ${isCurrent ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-200'}">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png" 
                     alt="${evo.name}" 
                     class="w-14 h-14">
            </div>
            <p class="text-sm mt-1 capitalize">${evo.name}</p>
            ${evo.details?.min_level ? `<p class="text-xs text-gray-500">Lvl ${evo.details.min_level}</p>` : ''}
        `;
        
        container.appendChild(evoElement);
        
        // Agregar flecha si no es el último elemento
        if (index < evolutionChain.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'flex items-center mx-2 text-gray-400';
            arrow.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            `;
            container.appendChild(arrow);
        }
    });
}
DeteailsPokemon(nombrePokemon)