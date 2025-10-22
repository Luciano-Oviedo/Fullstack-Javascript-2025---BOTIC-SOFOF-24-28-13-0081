// 1. Clase Producto como declaración

class Producto {
  // Método constructor
  constructor(nombre, descripcion, precio, cantidad) {
    (this.nombre = nombre),
      (this.descripcion = descripcion),
      (this.precio = precio),
      (this.cantidad = cantidad);
  }

  // Getters
  get getNombre() {
    return this.nombre;
  }

  get getDescripcion() {
    return this.descripcion;
  }

  get getPrecio() {
    return this.precio;
  }

  get getCantidad() {
    return this.cantidad;
  }

  // Setters
  set setNombre(nuevoNombre) {
    if (typeof nuevoNombre !== "string" || nuevoNombre.trim() === "") {
      console.log(
        "Debes ingresar una cadena de texto para el nombre de tu producto."
      );
      return;
    }
    this.nombre = nuevoNombre;
  }

  set setDescripcion(nuevaDescripcion) {
    if (
      typeof nuevaDescripcion !== "string" ||
      nuevaDescripcion.trim() === ""
    ) {
      console.log(
        "Debes ingresar una cadena de texto para la descripción de tu producto."
      );
      return;
    }
    this.descripcion = nuevaDescripcion;
  }

  set setPrecio(nuevoPrecio) {
    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
      console.log(
        "Debes ingresar un valor numérico mayor a cero para el precio de tu producto."
      );
      return;
    }
    this.precio = nuevoPrecio;
  }

  set setCantidad(nuevaCantidad) {
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      console.log(
        "Debes ingresar un valor numérico mayor a cero para la cantidad de tu producto."
      );
      return;
    }
    this.cantidad = nuevaCantidad;
  }

  // Método personalizado para mostrar detalles del producto en consola
  mostrarInfo() {
    console.log(
      `Nombre: ${this.nombre}. Descripción: ${this.descripcion}. Precio: $${this.precio}. Cantidad: ${this.cantidad}.`
    );
  }
}

// 2. Clase Producto como expresión

const Producto2 = class {
  // Método constructor
  constructor(nombre, descripcion, precio, cantidad) {
    (this.nombre = nombre),
      (this.descripcion = descripcion),
      (this.precio = precio),
      (this.cantidad = cantidad);
  }

  // Getters
  get getNombre() {
    return this.nombre;
  }

  get getDescripcion() {
    return this.descripcion;
  }

  get getPrecio() {
    return this.precio;
  }

  get getCantidad() {
    return this.cantidad;
  }

  // Setters
  set setNombre(nuevoNombre) {
    if (typeof nuevoNombre !== "string" || nuevoNombre.trim() === "") {
      console.log(
        "Debes ingresar una cadena de texto para el nombre de tu producto."
      );
      return;
    }
    this.nombre = nuevoNombre;
  }

  set setDescripcion(nuevaDescripcion) {
    if (
      typeof nuevaDescripcion !== "string" ||
      nuevaDescripcion.trim() === ""
    ) {
      console.log(
        "Debes ingresar una cadena de texto para la descripción de tu producto."
      );
      return;
    }
    this.descripcion = nuevaDescripcion;
  }

  set setPrecio(nuevoPrecio) {
    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
      console.log(
        "Debes ingresar un valor numérico mayor a cero para el precio de tu producto."
      );
      return;
    }
    this.precio = nuevoPrecio;
  }

  set setCantidad(nuevaCantidad) {
    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      console.log(
        "Debes ingresar un valor numérico mayor a cero para la cantidad de tu producto."
      );
      return;
    }
    this.cantidad = nuevaCantidad;
  }

  // Método personalizado para mostrar detalles del producto en consola
  mostrarInfo() {
    console.log(
      `Nombre: ${this.nombre}. Descripción: ${this.descripcion}. Precio: $${this.precio}. Cantidad: ${this.cantidad}.`
    );
  }
};

// 3. Instancias de clase producto
const limon = new Producto("Limón", "redondo, ácido y amarillo", 2000, 10);
limon.mostrarInfo();

const patineta = new Producto("Patineta", "tabla con cuatro ruedas", 30000, 1);
patineta.mostrarInfo();

const cafeteraFrancesa = new Producto(
  "Cafetera de prensa francesa",
  "recipiente de vidrio y plástico, filtro metálico; 300ml de capacidad",
  20000,
  5
);
cafeteraFrancesa.mostrarInfo();
