window.buscarPokemon = async () => {
  try {
    const valorBusqueda = document
      .querySelector("#barraBuscar")
      .value.trim()
      .toLowerCase();
    const respuesta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${valorBusqueda}`
    );
    const data = await respuesta.json();
    document.querySelector(".tu-pokemon").src = data.sprites.front_default;
    document.querySelector(".nombre-pokemon").textContent = data.name;
    document.querySelector(
      ".numero-pokemon"
    ).textContent = `Número: ${data.id}`;
    document.querySelector(".tipo-pokemon").textContent = `Tipo: ${data.types
      .map((t) => t.type.name)
      .join(", ")}`;
  } catch (error) {
    console.log(
      `No se pudo encontrar tu Pokemon, intenta ingresar un dato válido. Error ${error}.`
    );
  }
};
