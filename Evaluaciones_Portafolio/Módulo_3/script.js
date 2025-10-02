// VARIABLES

const form = document.getElementById("form"); // Formulario para agregar tareas
const inputNombre = document.getElementById("nombre_tarea"); // Campo nombre formulario
const inputDescripcion = document.getElementById("descripcion_tarea"); // Campo descripcion formulario
const botonAgregarTarea = document.getElementById("agregar_tarea"); // Botón para agregar tarea
const listaTareas = []; // Arreglo vacío que almacenará las tareas
const tusTareas = document.getElementById("tus_tareas"); // Lista que contendrá las tareas agregadas

// FUNCIONES

// Función para agregar una tarea
function agregarTarea(nombre, descripcion) {
  // Capturamos valores de los campos del formulario
  const valorNombre = nombre.value.trim();
  const valorDescripcion = descripcion.value.trim();

  // Validamos que los campos no estén vacíos
  if (valorNombre === "" || valorDescripcion === "") {
    alert("Debes completar todos los campos");
  }
  //Validamos que nuestro arreglo no contenga más de 10 tareas
  else if (listaTareas.length === 10) {
    alert("No puedes agregar más tareas a tu lista");
  } else {
    // Generamos un ID único incremental que no exista ya en el arreglo
    let nuevoId = 1;
    while (listaTareas.find((tarea) => tarea.id === nuevoId)) {
      nuevoId++;
    }
    // Creamos un objeto tarea con los valores de nombre y descripción ingresados como propiedades
    const nuevaTarea = {
      id: nuevoId,
      nombre: valorNombre,
      descripcion: valorDescripcion,
    };
    // Agregamos el objeto a nuestro arreglo de tareas
    listaTareas.push(nuevaTarea);
  }
}

// Función para eliminar una tarea
function eliminarTarea(id) {
  // Buscamos el índice de la tarea por su ID y la eliminamos del arreglo con .splice
  const indiceTarea = listaTareas.findIndex((tarea) => tarea.id === id);
  listaTareas.splice(indiceTarea, 1);
}

// Función para renderizar dinámicamente las tareas del arreglo en el HTML
function mostrarTareas(listaTareas) {
  // Reiniciamos el contenido de nuestro HTML antes de renderizar, para evitar duplicados
  tusTareas.innerHTML = "";
  // Por cada tarea en nuestro arreglo, creamos un bloque de HTML con el nombre y descripción de nuestra tarea, más un botón de eliminar.
  listaTareas.forEach((tarea) => {
    const nuevoLi = document.createElement("li");
    nuevoLi.classList.add("tarea");
    nuevoLi.innerHTML = `<div> 
        <h3>${tarea.nombre}</h3>
        <p>${tarea.descripcion}</p>
        </div>
        <button class="eliminar_tarea" data-id="${tarea.id}">Eliminar tarea</button>`;
    // Añadimos cada <li> generado al contenedor de la lista
    tusTareas.appendChild(nuevoLi);

    // Creamos el listener de eventos: al hacer clic elimina la tarea y actualiza la lista renderizada
    const botonEliminarTarea = nuevoLi.querySelector(".eliminar_tarea");
    botonEliminarTarea.addEventListener("click", () => {
      eliminarTarea(tarea.id);
      mostrarTareas(listaTareas);
    });
  });
}

// EVENTOS

// Evento para agregar tareas al clickear el botón de agregar
botonAgregarTarea.addEventListener("click", (e) => {
  e.preventDefault();
  // Ejecutamos la función agregarTarea con los valores de los campos de nuestro formulario como parámetros
  agregarTarea(inputNombre, inputDescripcion);
  // Renderizamos las tareas de nuestro arreglo en el HTML con la función mostrarTareas
  mostrarTareas(listaTareas);
  // Reiniciamos los campos del formulario
  form.reset();
});
