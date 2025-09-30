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

// Función para agregar productos
function addProduct(ruta, nuevoProducto) {
  const datos = readProducts(ruta);

  datos.push(nuevoProducto);

  writeProducts(ruta, datos);

  return nuevoProducto;
}

// Función para modificar productos
function updateProduct(ruta, id, newData) {
  let datos = readProducts(ruta);
  const producto = datos.find((producto) => producto.id === id);
  if (!producto) {
    return null;
  } else {
    const claves = Object.keys(newData);
    claves.forEach((clave) => {
      producto[clave] = newData[clave];
    });
    writeProducts(ruta, datos);
    return producto;
  }
}

// Función para eliminar productos
function deleteProduct(ruta, id) {
  let datos = readProducts(ruta);
  let eliminado;

  const datosFiltrados = datos.filter((producto) => producto.id !== id);

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
