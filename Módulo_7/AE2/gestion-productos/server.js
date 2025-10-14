// IMPORTACION DE MODULOS Y FUNCIONES
const express = require("express");
const methodOverride = require("method-override");
const {
  obtenerProductos,
  productosPorCategoria,
  nuevoProducto,
  actualizarProducto,
  eliminarProductoPorId,
} = require("./db/queries-tienda_db");

// CONFIGURACION DEL SERVIDOR
const app = express();
const port = 3020;

// MIDDLEWARE PARA USAR METODOS PUT / PATCH / DELETE CON FORMULARIOS HTML
// QUE SOLO SOPORTAN GET Y POST NATIVAMENTE
app.use(methodOverride("_method"));

// MIDDLEWARE PARA PARSEAR DATOS DESDE FORMULARIOS HTML
app.use(express.urlencoded({ extended: true }));

// MIDDLEWARE PARA PARSEAR JSON DESDE EL BODY DE LAS SOLICITUDES
app.use(express.json());

// CONFIGURACION DE RUTAS

// 1. Ruta para ver todos los productos
app.get("/productos", async (req, res) => {
  try {
    // Hacemos la consulta con nuestra función
    const consulta = await obtenerProductos();
    // Devolvemos el resultado de la consulta como respuesta
    res.status(200).json(consulta);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error inesperado con el servidor.");
  }
});

// 2. Ruta para ver obtener productos por categoria
app.get("/productos/cat", async (req, res) => {
  try {
    // Capturamos el parámetro de categoria del producto desde la URL
    const categoria = req.query.categoria;
    // Hacemos la consulta con nuestra función
    const consulta = await productosPorCategoria(categoria);
    // Devolvemos el resultado de la consulta como respuesta
    res.status(200).json(consulta);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error inesperado con el servidor.");
  }
});

// 3. Ruta para agregar un producto
app.post("/productos/nuevo", async (req, res) => {
  try {
    // Capturamos los parámetros ingresados por el usuario para un nuevo producto
    const { nombre, categoria } = req.body;
    const precio = Number(req.body.precio);
    const stock = Number(req.body.stock);
    // Hacemos la consulta con nuestra función
    const consulta = await nuevoProducto(nombre, precio, categoria, stock);
    // Devolvemos el resultado de la consulta como respuesta
    res.status(200).json(consulta);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error inesperado con el servidor.");
  }
});

// 4. Ruta para actualizar un producto
app.patch("/productos/actualizar/:id", async (req, res) => {
  try {
    // Capturamos el id del producto a actualizar desde la ruta
    const idProducto = Number(req.params.id);
    // Capturamos los parámetros ingresados por el usuario para actualizar el producto
    const { columna, nuevoValor } = req.body;
    // Hacemos la consulta con nuestra función
    const consulta = await actualizarProducto(idProducto, columna, nuevoValor);
    // Devolvemos el resultado de la consulta como respuesta
    res.status(200).json(consulta);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error inesperado con el servidor.");
  }
});

// 5. Ruta para eliminar un producto
app.delete("/productos/eliminar/:id", async (req, res) => {
  try {
    // Capturamos el id del producto a eliminar desde la ruta
    const idProducto = Number(req.params.id);
    // Hacemos la consulta con nuestra función
    const consulta = await eliminarProductoPorId(idProducto);
    // Devolvemos el resultado de la consulta como respuesta
    res.status(200).json(consulta);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error inesperado con el servidor.");
  }
});

// INICIALIZACION DEL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor corriendo en  http://localhost:${port}/productos`);
});
