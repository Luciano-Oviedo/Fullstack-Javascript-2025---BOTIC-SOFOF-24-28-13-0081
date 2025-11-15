const express = require("express");
const fileUpload = require("express-fileupload");
const subirArchivosRouter = require("./routes/subirArchivos.router");
const gestionUsuariosRouter = require("./routes/gestionUsuarios.router");

// CONFIGURACION DEL SERVIDOR
const app = express();
const PORT = 3030;

// MIDDLEWARES

// Middleware para subir archivos
app.use(fileUpload());
//Middleware para parsear JSON
app.use(express.json());

// RUTAS

// Rutas de registro y login de usuarios
app.use("/api/users", gestionUsuariosRouter);

// Ruta de subida de archivos
app.use("/api/files", subirArchivosRouter);

// MIDDLEWARE GLOBAL PARA RUTAS INEXISTENTES (ERROR 404)
app.use((req, res, next) => {
  res.status(404).send("Error 404: ruta inexistente");
});

// MIDDLEWARE GLOBAL DE ERRORES INTERNOS DEL SERVIDOR (ERROR 500)
app.use((err, req, res, next) => {
  console.error("Error interno del servidor:", err.message);
  res
    .status(500)
    .json({ mensaje: `Error interno del servidor: ${err.message}` });
});

// INICIALIZACION SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
