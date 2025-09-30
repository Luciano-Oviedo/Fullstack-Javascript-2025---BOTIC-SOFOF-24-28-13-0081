// CONFIGURACION DEL SERVIDOR
const express = require("express");
const app = express();
const port = 8020;
// Funciones para manipular productos
const {
  readProducts,
  writeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./fileUtils.js");

// MIDLEWARE

app.use(express.json());

// RUTAS

// 1. Crear un producto
app.post("/products", (req, res) => {
  // El cliente envía las propiedades del nuevo producto en el cuerpo de la petición
  const nuevoProducto = req.body;

  // Validamos que tenga todas las propiedades requeridas
  if (
    nuevoProducto.id === undefined ||
    nuevoProducto.nombre === undefined ||
    nuevoProducto.precio === undefined ||
    nuevoProducto.cantidad === undefined
  ) {
    res.status(400).json({ error: "Datos incompletos" });
  }
  // Validamos los tipos de datos ingresados
  else if (
    typeof nuevoProducto.id !== "number" ||
    typeof nuevoProducto.nombre !== "string" ||
    typeof nuevoProducto.precio !== "number" ||
    typeof nuevoProducto.cantidad !== "number"
  ) {
    res.status(400).json({ error: "tipos de datos inválidos" });
  }
  // Validamos que la cantidad ingresada no sea negativa
  else if (nuevoProducto.cantidad < 0) {
    res.status(400).json({ error: "la cantidad no puede ser negativa" });
  }
  // Validamos que el precio sea mayor a cero
  else if (nuevoProducto.precio <= 0) {
    res.status(400).json({ error: "el precio debe ser mayor a cero" });
  } else {
    // Guardamos el nuevo producto en nuestro archivo json y lo devolvemos en la respuesta de la petición
    const productoCreado = addProduct("products.json", nuevoProducto);
    res.json({
      mensaje: "Has agregado un nuevo producto",
      producto: productoCreado,
    });
  }
});

// INICIALIZACION DEL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
