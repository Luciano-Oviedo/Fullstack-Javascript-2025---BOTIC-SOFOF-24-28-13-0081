const botonBuscar = document.querySelector("button");

const parrafoResultados = document.getElementById("resultados");

const contenedorLibros = document.getElementById("contenedorLibros");

const buscarLibros = async () => {
  const inputAutor = document.getElementById("barraBuscar").value.trim();
  parrafoResultados.innerHTML = "";
  if (!inputAutor) {
    parrafoResultados.innerHTML = `<p class="error"> Por favor, ingresa el nombre de un autor </p>`;
    return;
  }
  parrafoResultados.innerHTML = `<p> Buscando libros de ${inputAutor}... </p>`;
  try {
    const respuesta = await fetch(
      `https://openlibrary.org/search.json?author=${inputAutor}&limit=10`
    );
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error("Error al buscar los libros");
    }
    if (datos.docs.length === 0) {
      parrafoResultados.innerHTML = `<p class="error"> No se encontraron libros de ${inputAutor} </p>`;
      return;
    }
    parrafoResultados.innerHTML = `<p>Se encontraron: ${datos.numFound} resultados</p>`;
    console.log(datos); //sacate
    datos.docs.map((libro) => {
      const titulo = libro.title || "Título no disponible";
      const anio = libro.first_publish_year || "Año no disponible";
      const autores = libro.author_name
        ? libro.author_name.join(", ")
        : "Autor no disponible";
      const libroHTML = document.createElement("div");
      libroHTML.className = "libro";
      libroHTML.innerHTML = `
    <h3>${titulo}</h3>
    <p>Año: ${anio}</p>
    <p>Autor: ${autores}</p>
`;
      contenedorLibros.appendChild(libroHTML);
    });
  } catch (error) {
    parrafoResultados.innerHTML = `<p class="error">${error.message}</p>`;
  }
};

botonBuscar.addEventListener("click", buscarLibros);
