//Variables

let inputBusqueda = document.querySelector("#catalogo"); // campo de búsqueda.

let buscar = document.querySelector("#botonBuscar"); // botón "Buscar".

let libros = document.querySelectorAll(".tarjeta-libro"); // lista de libros.

let formularioRegistro = document.querySelector("#formularioRegistro"); // formulario de registro.

let inputsFormulario = document.querySelectorAll(".input-registro"); // campos de formulario de registro.

//Funciones

function funcionBuscar() {
    let filtro = inputBusqueda.value.toUpperCase(); // recibe la búsqueda del usuario y la convierte a mayúsculas (para evitar la sensibilidad a mayúsculas/minúsculas).
    let parrafoContadorResultados = document.querySelector("#contadorResultados"); // elemento html que mostrará el contador.
    let contadorResultados = 0; // valor del contador en 0.
    
    libros.forEach(function(libro) {
        
        let titulo = libro.querySelector("h3").innerText.toUpperCase();  // obtiene título del libro y lo convierte a mayúsculas.
        let autor = libro.querySelector("p:nth-of-type(1)").innerText.toUpperCase(); // obtiene autor del libro y lo convierte a mayúsculas.
        let genero = libro.querySelector("p:nth-of-type(2)").innerText.toUpperCase(); // obtiene género del libro y lo convierte a mayúsculas.

        if(titulo.includes(filtro) || autor.includes(filtro) || genero.includes(filtro)) { // compara si los datos de cada libro en el catálogo incluyen el texto buscado por el usuario.
            libro.style.display = ""; // muestra los libros que coincidan.
            libro.classList.remove("oculto"); // quita la clase oculto.
            contadorResultados ++; // aumenta el contador de coincidencias.
        }
        else {
            libro.classList.add("oculto"); // oculta los libros que no coincidan sin sacarlos del layout (para no deformar el contenedor "lista-libros" al hacer una búsqueda).
        }
    })

    if(contadorResultados != 0) {
        parrafoContadorResultados.style.display = "block"; // si hay al menos 1 resultado de búsqueda, muestra el párrafo oculto del contador.
        parrafoContadorResultados.innerText = `Resultados de tu búsqueda: ${contadorResultados} coincidencia/s.`; // devuelve un mensaje con el número de coincidencias para la búsqueda.
    }
    else {
       parrafoContadorResultados.style.display = ""; //si no hay concidencias el párrafo del contador permanece oculto.
    }
}

//Eventos

buscar.addEventListener("click", funcionBuscar); // evento que activa la función de búsqueda al clickear en el botón "Buscar".

formularioRegistro.addEventListener("submit", function(e) { // evento asociado al submit del formulario
    for (let campoFormulario of inputsFormulario) { // este "for of" recorre los inputs del formulario y compreuba que no estén vacíos
        if (campoFormulario.value.trim() ==="") { 
            e.preventDefault();
            alert ("todos los campos del formulario deben estar completos para registrarse");
            break; // si hay algún campo vacío, detiene el submit y da un mensaje de alerta
        }
    }
})