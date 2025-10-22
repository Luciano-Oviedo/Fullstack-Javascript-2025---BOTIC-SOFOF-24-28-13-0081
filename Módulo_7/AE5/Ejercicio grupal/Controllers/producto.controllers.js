const Producto = require("../Models/producto");

// FUNCION CREATE

async function crearProducto(nombre, descripcion, precio, cantidad = 0) {
  try {
    // Validación de tipo de datos
    if (
      typeof nombre !== "string" ||
      typeof descripcion !== "string" ||
      nombre.trim() === "" ||
      descripcion.trim() === "" ||
      typeof precio !== "number" ||
      typeof cantidad !== "number" ||
      Number.isNaN(precio) ||
      Number.isNaN(cantidad)
    ) {
      throw new Error("Debes ingresar parámetros válidos.");
    }

    // Creación del nuevo producto con los parámetros ingresados como valores de cada atributo
    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      cantidad,
    });

    // Despliegue del resultado en consola
    console.log("Producto creado:");
    console.table([producto.toJSON()]);
  } catch (error) {
    // Manejo de errores
    console.error("Error al crear producto:", error.message);
  }
}

// FUNCIONES READ

// Obtener todos los productos
async function obtenerProductos() {
  try {
    // Consultamos todos los productos de la DB
    const productos = await Producto.findAll();

    // Validamos que la base de datos no esté vacía
    if (productos.length === 0) {
      throw new Error("No hay productos en la base de datos.");
    }

    // Iteramos sobre todos los productos de la DB para mostrarlos en consola
    console.log("Productos:");
    console.table(productos.map((p) => p.toJSON()));
  } catch (error) {
    // Manejo de errores
    console.error("Error al listar productos:", error.message);
  }
}

// Obtener un producto por id
async function obtenerProductoPorId(id) {
  try {
    // Realizamos una consulta por clave primaria, usando el id ingresado
    const producto = await Producto.findByPk(id);

    // Validamos existencia de id
    if (!producto) {
      throw new Error("El id ingresado no existe.");
    }

    // Mostramos el resultado de la consulta en consola
    console.log("Has seleccionado el producto con id:", id);
    console.table([producto.toJSON()]);
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener producto:", error.message);
  }
}

// FUNCION UPDATE

async function actualizarProducto(id, nuevosDatos) {
  try {
    // Actualizamos el registro usando el id ingresado como filtro
    const filaActualizada = await Producto.update(nuevosDatos, {
      where: { id },
    });

    // Validamos existencia de id
    if (filaActualizada[0] === 0) {
      throw new Error("El id ingresado no existe.");
    }

    // Mostramos el registro actualizado en consola
    const productoActualizado = await Producto.findByPk(id);
    console.log("Producto actualizado:");
    console.table([productoActualizado.toJSON()]);
  } catch (error) {
    // Manejo de errores
    console.error("Error al actualizar producto:", error.message);
  }
}

// FUNCION DELETE

async function eliminarProducto(id) {
  try {
    // Eliminamos el registro usando el id ingresado como filtro
    const productoEliminado = await Producto.destroy({ where: { id } });

    // Validamos existencia de id
    if (!productoEliminado) {
      throw new Error("El id ingresado no existe.");
    }
    console.log("Producto eliminado.");
  } catch (error) {
    // Manejo de errores
    console.error("Error al eliminar producto:", error.message);
  }
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};
