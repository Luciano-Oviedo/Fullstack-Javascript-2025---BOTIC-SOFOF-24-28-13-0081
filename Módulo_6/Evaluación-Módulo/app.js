// 1. IMPORTACION DE PAQUETES Y FUNCIONES
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("node:path");
const { leerArchivo, escribirArchivo } = require("./filesystem");

const app = express();
const port = 3000;

// 2. CONFIGURACION HANDLEBARS
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

// 3. MIDDLEWARES

// 3.1. Middleware para mostrar contenido estático
app.use(express.static(path.join(__dirname, "public")));

// 3.2. Middleware para parsear formularios HTML
app.use(express.urlencoded({ extended: true }));

///////////////////////////////////////////////////////

// 4. CONFIGURACION DE RUTAS

// 4.1. Ruta raíz
app.get("/", (req, res) => {
  res.render("home", {
    mensajeBienvenida: "Bienvenido a tu app de gestión de contactos",
  });
});

// 4.2. Ruta para mostrar contactos
app.get("/contactos", async (req, res, next) => {
  try {
    // Leemos nuestro archivo JSON de contactos
    const contactos = await leerArchivo("./contactos.json");
    let listaContactos;

    // Renderizamos el resultado de la lectura
    res.render("contactos", { listaContactos: contactos });
  } catch (error) {
    console.error("Error", error.message);
    next(error); // pasa el error al middleware global
  }
});

// 4.3. Ruta para agregar contactos
app.post("/contactos", async (req, res, next) => {
  const { nombre, telefono, email } = req.body;

  // Validamos existencia y tipos de datos
  if (
    !nombre ||
    !telefono ||
    !email ||
    typeof nombre !== "string" ||
    typeof telefono !== "string" ||
    typeof email !== "string"
  ) {
    console.warn("Datos inválidos");
    return res.status(400).render("contactos", {
      error: "Por favor ingresa datos válidos",
      listaContactos: await leerArchivo("./contactos.json"),
    });
  }

  // Leemos nuestro archivo JSON
  try {
    const datos = await leerArchivo("./contactos.json");
    let nuevoId = 1;

    // Función para generar id único
    while (datos.some((c) => c.id === nuevoId)) {
      nuevoId++;
    }
    // Creamos un objeto con la información de req.body
    const nuevoContacto = {
      id: nuevoId,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email.trim().toLowerCase(),
    };
    // Agregamos el objeto a memoria
    datos.push(nuevoContacto);
    //Persistimos los cambios
    await escribirArchivo("./contactos.json", datos);
    // Recargamos la página para actualizar la lista de contactos
    res.redirect("/contactos");
  } catch (error) {
    console.error("Error", error.message);
    next(error); // pasa el error al middleware global
  }
});

// 4.4. Ruta para eliminar contactos (los formularios HTML no aceptan delete, así que usé post)
app.post("/contactos/:id", async (req, res, next) => {
  try {
    // Leemos el archivo JSON que contiene el arreglo de contactos
    const contactos = await leerArchivo("./contactos.json");
    // Filtramos el arreglo para excluir el contacto eliminado, usando "req.params.id"
    const id = Number(req.params.id);
    const nuevosContactos = contactos.filter((c) => c.id != id);
    // Persistimos los cambios y recargamos la página de contactos
    await escribirArchivo("./contactos.json", nuevosContactos);

    // Renderizamos un mensaje de confirmación
    const contactoEliminado = contactos.find((c) => c.id === id);
    res.render("contactoEliminado", {
      nombre: contactoEliminado.nombre,
      id,
    });
  } catch (error) {
    console.error("Error", error.message);
    next(error); // pasa el error al middleware global
  }
});

// 4.5. Ruta para acceder formulario de edición
app.get("/contactos/:id/editar", async (req, res, next) => {
  // Guardamos el id del contacto con "req.params.id"
  const id = Number(req.params.id);

  try {
    // Leemos el archivo JSON que contiene el arreglo de contactos
    const contactos = await leerArchivo("./contactos.json");

    // Obtenemos el objeto contacto mediante su id
    const contacto = contactos.find((c) => c.id === id);

    // Validamos existencia de id
    if (!contacto) {
      return res.status(404).render("error", {
        mensaje: `Contacto con ID ${id} no encontrado`,
      });
    }

    // Renderizamos el formulario de edición con el objeto contacto
    res.render("editarContacto", { contacto });
  } catch (error) {
    console.error("Error", error.message);
    next(error); // pasa el error al middleware global
  }
});

// 4.6. Ruta para editar contacto ((los formularios HTML no aceptan patch, así que usé post))
app.post("/contactos/:id/editar", async (req, res, next) => {
  // Guardamos el id del contacto con "req.params.id"
  const id = Number(req.params.id);

  // Guardamos los datos ingresados, obtenidos desde "req.body"
  const { nombre, telefono, email } = req.body;

  try {
    // Leemos el archivo JSON que contiene el arreglo de contactos
    const contactos = await leerArchivo("./contactos.json");

    // Obtenemos el contacto a editar mediante su id
    const contacto = contactos.find((c) => c.id === id);

    // Validamos datos ingresados
    if (!nombre?.trim() || !telefono?.trim() || !email?.trim()) {
      return res.status(400).render("editarContacto", {
        contacto,
        error: "Por favor ingresa datos válidos",
      });
    }

    // Actualizamos el objeto contacto con la información ingresada por el cliente
    contacto.nombre = nombre.trim();
    contacto.telefono = telefono.trim();
    contacto.email = email.trim().toLowerCase();

    // Persistimos los cambios
    await escribirArchivo("./contactos.json", contactos);

    // Renderizamos un mensaje de confirmación
    res.render("editarContacto", {
      contacto,
      mensaje: "Has actualizado la información de tu contacto",
    });
  } catch (error) {
    console.error("Error", error.message);
    next(error); // pasa el error al middleware global
  }
});

// 5. MIDDLEWARES PARA MANEJO DE ERRORES

// 5.1. Middleware para manejo de rutas inexistentes (error 404)
app.use((req, res, next) => {
  res.status(404).render("error", {
    mensaje: "Error 404: la ruta ingresada no existe",
  });
});

// 5.2. Middleware global de errores
app.use((err, req, res, next) => {
  console.error("Error inesperado:", err.message);

  res.status(500).render("error", {
    mensaje: "Ocurrió un error inesperado. Intenta nuevamente más tarde.",
  });
});

// 6. INICIALIZACION DEL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor corriendo en  http://localhost:${port}`);
});
