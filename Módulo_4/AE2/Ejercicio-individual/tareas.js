// APP DE GESTIÓN DE TAREAS

import { Tarea, TareaImportante } from "./Clases.js"; // Importación de clases desde módulo Clases.js

let estadoTarea = false; // Variable que contiene el estado de la tarea

const archivo = {}; // Objeto vacío que contendrá las listas de tareas

let contadorID = 0; // Variable contador para generar IDs únicos

const tareasCompletadas = new Set(); // Set vacío que contendrá las tareas completadas

// 1. Función flecha para agregar una tarea a la lista de tareas

const agregarTarea = (nombre, nombreLista, estado = estadoTarea, prioridad = "normal") => { // La función recibe nombre de la tarea, nombre de la lista, estado de la tarea y prioridad como parámetros. Si no se especifica estado de la tarea, por defecto asume el valor false/"pendiente". Si no se declara prioridad, por defecto se asume prioridad normal

    if(!nombre || !nombreLista) { // Se valida que la función tenga un nombre y un nombre de lista, en caso contrario, se muestra un mensaje en consola y se detiene el flujo
        console.log("debes agregar un nombre a tu tarea y a tu lista");
        return;
    }

    if(!archivo[nombreLista]) { // Se realiza un checkeo para ver si existe una lista con el nombre indicado dentro del archivo

        archivo[nombreLista] = new Map(); // Si no existe, se crea una lista tipo Map con el nombre proporcionado y se añade como propiedad del objeto archivo
    }

    let id = contadorID + 1; // El valor del ID de la tarea, comenzando en 1
    
    let tarea; // Se declara una variable vacía que luego se asignará como un objeto Tarea o Tarea importante

    if(prioridad === "importante") { // Si se marca la tarea como "importante" al agregarla, se crea un objeto desde la clase TareaImportante. De lo contrario, se crea un objeto desde la Clase Tarea. Estos objetos toman sus valores de nombre, estado y prioridad (en caso de establecerla) de los parámetros de la función 

        tarea = new TareaImportante(nombre, estado, id, prioridad);
        contadorID ++; 
    } else {
        tarea = new Tarea(nombre, estado, id);
        contadorID ++;
    }

    if(tarea.estado === "completa") { // Si se agrega una tarea como completa, se mueve al Set de tareas completadas y se muestra un mensaje en consola
        tareasCompletadas.add(tarea);
        console.log("tu tarea se ha movido a tu lista de tareas completadas");
    } else {
        archivo[nombreLista].set(tarea.id, tarea); // Se añade la tarea al Map correspondiente si no está marcada como "completa"
    }
     
    console.log(`Has agregado la siguiente tarea - ${tarea.mostrarDetalles()} - a tu lista de tareas: ${nombreLista}.`); // Se muestra un mensaje en consola confirmando la adición de la tarea y sus detalles a la lista  
};

// Función flecha para mostrar tareas de una lista, usando destructuración e interpolación de strings

const mostrarTareas = (nombreLista) => {
   
    if(!nombreLista || !archivo[nombreLista]) { // Si no se nombra la lista a mostrar, o no existe, se muestra una alerta y se detiene el flujo
        console.log("debes escribir el nombre de una lista existente");
        return;
    }

    archivo[nombreLista].forEach(tarea => {
        const {nombre: aliasNombre, id: aliasID, estado: aliasEstado, prioridad: aliasPrioridad} = tarea; // Destructuración de la información de cada objeto tarea en la lista
        console.log(`Tarea: ${aliasNombre}, ID: ${aliasID}, estado: ${aliasEstado ? "completa" : "pendiente"}, prioridad: ${aliasPrioridad || "normal"}`); // Interpolación de strings para mostrar la información
    })
}

// Función flecha para copiar una lista de tareas existente usando el operador Spread

const copiarLista = (nombreNuevaLista, listaOriginal) => {

    if(!nombreNuevaLista) { // Si no se nombra la nueva lista, se muestra una alerta y se detiene el flujo
        console.log("debes nombrar tu nueva lista");
        return;
    }

    if(!archivo[listaOriginal]) { // Si no existe una lista con el nombre ingresado en el archivo, se muestra una alerta y se detiene el flujo
        console.log("debes ingresar un nombre de lista válido para copiar");
        return;
    }

    const arrayTareas = [...archivo[listaOriginal].values()]; // Convierte el Map original en un array de tareas usando spread

    archivo[nombreNuevaLista] = new Map(arrayTareas.map(tarea => [tarea.id, tarea]));     // Crea un nuevo Map a partir del array, usando los IDs como claves

    console.log(`Has creado la lista "${nombreNuevaLista}", a partir de: "${listaOriginal}".`); // Se muestra la información de la copia en consola
}

// Función flecha para eliminar tareas por ID usando operador Rest

const eliminarTarea = (nombreLista, ...IDs) => {
    
    if(!nombreLista || !archivo[nombreLista] || IDs.length === 0 ) { // Si no se ingresan todos los parámetros o la lista no existe, se muestra una alerta y se detiene el flujo 
        console.log("debes ingresar un nombre de lista e IDs válidos");
        return;
    }
    
    IDs.forEach(id => {
    if (!archivo[nombreLista].has(id)) {
        console.log(`El ID ${id} no existe en la lista ${nombreLista}`); // Valida que los IDs existan y muestra una alerta en caso de que no
    } else {
        archivo[nombreLista].delete(id); // Se eliminan los objetos tarea que tienen los IDs indicados como clave
    }
}); 
    
    console.log(`has eliminado las tareas seleccionadas de tu lista ${nombreLista}`); // Se muestra un mensaje que confirma la eliminación
}

// Función flecha para marcar tarea como completa

const marcarTareaCompleta = (nombreLista, id) => {
    if(!archivo[nombreLista]) { 
        console.log("la lista indicada no existe"); // Validación para evitar errores si la lista no existe
        return;
    }

    if(archivo[nombreLista].has(id)) { 
        const tarea = archivo[nombreLista].get(id); // Se obtiene la tarea por su id
        
        if(tareasCompletadas.has(tarea)) {
            console.log("esta tarea ya estaba marcada como completada"); // Evita duplicar en el Set y repetir mensajes
            return;
        }

        tareasCompletadas.add(tarea); // Se agrega al Set de tareas completadas
        archivo[nombreLista].delete(id); // Se elimina del Map
        console.log("has marcado con éxito tu tarea como completada");
    } else {
        console.log("selecciona una lista e ID válidos"); // Mensaje de error si el ID no existe en la lista
    }
}

// Generador para mostrar índice y tareas de una lista

const recorrerLista = (nombreLista) => {

    function* generadorTareas() { // Función Generador

        if(!archivo[nombreLista]) { //Validación de existencia de la lista
            console.log("debes ingresar una lista existente");
            return;
        }
        let index = 0;
        for (const tarea of archivo[nombreLista].values()) { // Iteración sobre la lista y creación de índice
            yield [index, tarea];
            index++;
        }
    }

    const generador = generadorTareas(); // se guarda el Generador en una variable

    for (const [index, tarea] of generador) { // se muestran los detalles de cada tarea
        console.log(`Índice: ${index}. Tarea: ${tarea.mostrarDetalles()}`);
    }
}

// Simulación solicitud a servidor usando promesas

const cargarTareasAsync = async (nombreLista) => {
    try {
        // Se simula una solicitud al servidor que dura 10 segundos
        await new Promise((resolve, reject) => {
            if (!archivo[nombreLista]) { // Validación de existencia de la lista
                reject("La lista no existe"); // Rechaza la promesa si no hay lista
            } else {
                setTimeout(resolve, 10000); // Simula espera
            }
        });

        mostrarTareas(nombreLista); // Tras pasar 10 segundos, se muestran las tareas de la lista       
    } catch (error) {
        console.log(`Error al cargar las tareas: ${error}`); // Captura errores de la promesa
    }
}
