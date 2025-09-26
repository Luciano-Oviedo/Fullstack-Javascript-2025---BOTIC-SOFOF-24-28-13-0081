//IMPORTACIONES

import express from "express"; // Express
import hbs from "hbs"; // Handlebars
import path from "path"; // Rutas de los archivos

//CONFIGURACIONES

const app = express(); // Inicializar express
const port = 8080; // Puerto

// Directorio de archivos estáticos
app.use(express.static("public"));

// Definir handlebars como motor de vistas
app.set("view engine", "hbs");

// Directorio de vistas
app.set("views", path.join(path.dirname(""), "views"));

// Directorio de vistas parciales
hbs.registerPartials(path.join(path.dirname(""), "views/partials"));

//helpers
hbs.registerHelper("año_actual", () => {
  return new Date().getFullYear();
});

//PROCESOS

// Ruta Home
app.get("/", (req, res) => {
  res.render("home", {
    titulo: "Inicio",
    proyecto_1: "Simulación de una red social:",
    proyecto_2: "API para librería virtual:",
    proyecto_3: "Aplicación de gestión de tareas:",
  });
});

// Ruta About
app.get("/about", (req, res) => {
  res.render("about", {
    titulo: "Sobre mi",
    sobre_mi:
      "Hola, mi nombre es Luciano Oviedo, tengo 31 años y resido en San Pedro de Atacama, lugar donde también me crié. Actualmente estoy estudiando desarollo web full stack con una beca de Talento Digital. Siempre me han gustado los computadores y esta vez quise ir más allá y formarme profesionalmente para probar suerte en la industria TI. Otros de mis pasatiempos, aparte de la informática, son el montañismo, los juegos de mesa y los viajes.",
  });
});

// Ruta projects
app.get("/projects", (req, res) => {
  res.render("projects", {
    titulo: "Mis proyectos",
    proyecto_1: "Simulación de una red social:",
    descripcion_1:
      "En este proyecto practiqué manipulación del DOM con JS, implementado la posibilidad de dar 'likes' a los perfiles de los usuarios.",
    proyecto_2: "API para librería virtual:",
    descripcion_2:
      "En este proyecto practiqué la implementación de APIs externas en mi libreria virtual. Concretamente, se usó una API para búsqueda de libros.",
    proyecto_3: "Aplicación de gestión de tareas:",
    descripcion_3:
      "En este proyecto practiqué nuevas características de ECMAScript 6 como 'clases', 'funciones flecha' y 'destructuración', mediante la creación de una app de gestión de tareas.",
  });
});

// Error 404
app.use((req, res, next) => {
  res
    .status(404)
    .send("<h1>Error 404: página no encontrada en el servidor</h1>");
});

//SERVIDOR

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
