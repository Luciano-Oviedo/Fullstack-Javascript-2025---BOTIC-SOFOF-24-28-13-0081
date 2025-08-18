//Clase Tarea

export class Tarea {
    constructor(nombre, estado, id) {
        this.nombre = nombre;
        this.estado = estado;
        this.id = id;
    }

mostrarDetalles() {
    return `Nombre: ${this.nombre}, ID: ${this.id}, estado: ${this.estado ? "completa" : "pendiente"}`;
    };
};

// Clase TareaImportante

export class TareaImportante extends Tarea {
    constructor(nombre, estado, id, prioridad) {
        super(nombre, estado, id);
        this.prioridad = prioridad;
    }

mostrarDetalles() {
    return `Nombre: ${this.nombre}, ID: ${this.id}, estado: ${this.estado ? "completa" : "pendiente"}, prioridad: ${this.prioridad}`;
    };
};
