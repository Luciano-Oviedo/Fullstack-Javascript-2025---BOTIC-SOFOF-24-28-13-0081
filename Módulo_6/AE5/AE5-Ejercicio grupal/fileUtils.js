const fs = require("fs");

// Función sincrónica para leer productos
function readProducts(ruta) {
  const contenido = fs.readFileSync(ruta, "utf-8");
  return JSON.parse(contenido);
}

// Función sincrónica para escribir productos
function writeProducts(ruta, datos) {
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
}

// Función sincrónica para agregar productos
function addProduct(ruta, nuevoProducto) {
  const datos = readProducts(ruta);

  datos.push(nuevoProducto);

  writeProducts(ruta, datos);

  return nuevoProducto;
}

// Función sincrónica para modificar productos
function updateProduct(ruta, id, datosActualizados) {
  let datos = readProducts(ruta);
  const archivo = datos.find((archivo) => archivo.id === id);
  if (!archivo) {
    console.error("no se encontró un archivo con ese ID");
  } else {
    const claves = Object.keys(datosActualizados);
    claves.forEach((clave) => {
      archivo[clave] = datosActualizados[clave];
    });
    writeProducts(ruta, datos);
    return archivo;
  }
}

// Función sincrónica para eliminar productos
function deleteProduct(ruta, id) {
  let datos = readProducts(ruta);
  let eliminado;

  const datosFiltrados = datos.filter((archivo) => archivo.id !== id);

  if (datos.length === datosFiltrados.length) {
    eliminado = false;
  } else {
    writeProducts(ruta, datosFiltrados);
    eliminado = true;
  }
  return eliminado;
}

module.exports = {
  readProducts,
  writeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
