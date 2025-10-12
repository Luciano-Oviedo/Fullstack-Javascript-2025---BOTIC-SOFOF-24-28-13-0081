// 1. IMPORTACCION DE PAQUETES Y FUNCIONES
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("node:path");
const { leerArchivo, escribirArchivo } = require("./filesystem");

const app = express();
const port = 3000;

// 2. CCONFIGURACION HANDLEBARS
app.engine(
  "handlebars",
  engine({
    extname: ".handlebars",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 3. MIDDLEWARE PARA MOSTAR CONTENIDO ESTATICO
app.use(express.static(path.join(__dirname, "public")));

// 4. MIDDLEWARE PARA PARSEAR FORMULARIOS HTML
app.use(express.urlencoded({ extended: true }));

///////////////////////////////////////////////////////

// 5. CONFIGURACION DE RUTAS

// 5.1. Ruta home
app.get("/", (req, res) => {
  // Renderizamos un mensaje de bienvenida y un enlace a la ruta de /productos
  const html =
    '<a href="http://localhost:3000/productos">Agregar productos</a>';
  res.render("home", {
    mensajeBienvenida: "¡Bienvenido a la tienda en línea!",
    html,
  });
});

// 5.2. Ruta para agregar productos
app.post("/productos", async (req, res, next) => {
  const { nombre, descripcion, precio } = req.body;
  // Validamos existencia y tipos de datos
  const precioNum = Number(precio);
  if (
    !nombre ||
    !descripcion ||
    isNaN(precioNum) ||
    typeof nombre !== "string" ||
    typeof descripcion !== "string"
  ) {
    console.warn("Datos inválidos");
    return res.status(400).render("productos", {
      error: "Por favor ingresa datos válidos",
      listaProductos: await leerArchivo("./productos.json"),
    });
  }
  // Validamos que el precio sea un número positivo
  if (precioNum <= 0) {
    console.warn("Precio negativo o cero");
    return res.status(400).render("productos", {
      error: "El precio debe ser un número positivo",
      listaProductos: await leerArchivo("./productos.json"),
    });
  }
  // Leemos nuestro archivo de persistencia de datos, agregamos el producto y escribimos los cambios
  try {
    const datos = await leerArchivo("./productos.json");
    const nuevoProducto = req.body;
    datos.push(nuevoProducto);
    await escribirArchivo("./productos.json", datos);
    // Recargamos la página para actualizar la lista de productos
    res.redirect("/productos");
  } catch (error) {
    console.error("Error", error.message);
    next(error); // pasa el error al middleware global
  }
});

// 5.3. Ruta "/productos" para mostrar todos los productos
app.get("/productos", async (req, res, next) => {
  try {
    // Leemos nuestro archivo JSON de productos
    const productos = await leerArchivo("./productos.json");
    let listaProductos;

    // Validamos que existan productos agregados
    listaProductos =
      productos.length === 0 ? "Aún no has agregado productos" : productos;

    // Renderizamos el resultado de la lectura
    res.render("productos", { listaProductos });
  } catch (error) {
    console.error("Error", error.message);
    next(error); // pasa el error al middleware global
  }
});

// 6. MIDDLEWARE PARA MANERAR RUTAS INEXISTENTES (ERROR 404)
app.use((req, res, next) => {
  res.status(404).render("error", {
    mensaje: "Error 404: la ruta ingresada no existe",
  });
});

// 7. MIDDLEWARE GLOBAL DE ERRORES
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err.message);

  res.status(500).render("error", {
    mensaje: "Ocurrió un error inesperado. Intenta nuevamente más tarde.",
  });
});

// 8. INICIALIZACION DEL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor corriendo en  http://localhost:${port}`);
});
