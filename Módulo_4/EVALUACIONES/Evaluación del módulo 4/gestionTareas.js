// 1. Interacción con el DOM

const inputTitulo = document.getElementById("titulo"); // Contenido input título

const inputDescripcion = document.getElementById("descripcion"); // Contenido input descripción

const botonAgregarTarea = document.getElementById("botonAgregarTarea"); // Botón de agregar tarea

const contenedorTareas = document.querySelector(".contenedorTareas"); // Contenedor de lista de tareas

const contenedorTareasCompletas = document.querySelector(".tareasCompletas"); // Contenedor de lista de tareas completadas

let contadorId = 0; // Variable global que permite asignar IDs únicos a cada tarea

// 2. Configuración de clases y objetos

class Tarea {
  constructor(id, titulo, descripcion, completada) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.completada = completada;
  }

  mostrarDetalles() {
    // Este método toma los datos del constructor y muestra en consola las propiedades de la tarea
    return `Tarea: ${this.titulo}.<br> ID: ${this.id}.<br> Descripción: ${
      this.descripcion
    }.<br> Estado: ${this.completada === true ? "completada" : "pendiente"}.`;
  }
}

class ListaTareas {
  tareas = []; // Arreglo vacío para almacenar las tareas

  agregarTarea() {
    // Este método crea un objeto tarea a partir de la clase Tarea, tomando el título y descripción ingresados en el HTML como parámetros

    if (!inputTitulo.value || !inputDescripcion.value) {
      alert(
        `debes agregar un título y una descripción a tu tarea antes de continuar`
      );
      return;
    }
    const tarea = new Tarea(
      contadorId + 1,
      inputTitulo.value,
      inputDescripcion.value,
      false
    );

    contadorId++; // Tras crear la tarea se aumenta el contador de IDs

    this.tareas.push(tarea); // Se agrega la tarea al arreglo

    //Se crean botones de eliminar tarea y marcar como completa, junto a sus eventos asociados
    const botonEliminarTarea = document.createElement(`button`);
    botonEliminarTarea.textContent = "Eliminar";
    botonEliminarTarea.addEventListener("click", () =>
      this.eliminarTarea(tarea.id)
    );

    const botonCompletarTarea = document.createElement(`button`);
    botonCompletarTarea.textContent = "Marcar como completa";
    botonCompletarTarea.addEventListener("click", () =>
      this.marcarComoCompleta(tarea.id)
    );

    // Se crea un elemento lista y se modifica su contenido interno para mostrar la información de la tarea
    const tarjetaTarea = document.createElement(`li`);
    tarea.li = tarjetaTarea;
    tarjetaTarea.innerHTML = `${tarea.mostrarDetalles()}`;

    // Se agrega el elemento lista y los botones al HTML
    contenedorTareas.appendChild(tarjetaTarea);
    tarjetaTarea.appendChild(botonCompletarTarea);
    tarjetaTarea.appendChild(botonEliminarTarea);

    // Se limpian los campos de título y descripción
    inputTitulo.value = "";
    inputDescripcion.value = "";
  }
  eliminarTarea(id) {
    // Este método busca una tarea en el arreglo de tareas por su id, elimina su contenedor HTML y  elimina el objeto tarea con splice

    const indiceTarea = this.tareas.findIndex((tarea) => tarea.id === id);
    const eliminarContenedor = this.tareas.find((tarea) => tarea.id === id).li;
    this.tareas.splice(indiceTarea, 1);
    eliminarContenedor.remove();
  }
  marcarComoCompleta(id) {
    // Este método busca una tarea en el arreglo de tareas por su id y cambia su propiedad "completada" a true. Luego crea un elemento HTML con la información de esa tarea y lo mueve a la lista de tareas completas

    const tareaCompleta = this.tareas.find((tarea) => tarea.id === id);
    tareaCompleta.completada = true;
    const tarjetaTareaCompleta = tareaCompleta.li;

    tarjetaTareaCompleta.innerHTML = `
  ${tareaCompleta.mostrarDetalles()}
`;
    contenedorTareasCompletas.appendChild(tarjetaTareaCompleta);
  }
  mostrarTareas() {
    //Este método recorre el arreglo de tareas con .forEach y muestra sus propiedades

    this.tareas.forEach((tarea) => tarea.mostrarDetalles());
  }
}

// 3. Eventos

const miLista = new ListaTareas(); // Objeto instanciado de ListaTareas, que almacenará nuestras tareas

botonAgregarTarea.addEventListener("click", () => miLista.agregarTarea()); // Agregar tarea con click en botón del formulario

// *: los demás eventos (eliminar y marcar tarea como completa) fueron creados dentro del método agregarTarea
