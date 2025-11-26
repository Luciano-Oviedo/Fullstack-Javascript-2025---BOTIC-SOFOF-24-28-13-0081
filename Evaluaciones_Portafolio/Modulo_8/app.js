const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const usuariosRouter = require("./src/routes/usuarios.Router");

// CONFIGURACION DEL SERVIDOR
const app = express();
const PORT = 3030;

// MIDDLEWARES

// Middleware para subir archivos
app.use(fileUpload());
// Middleware para servir /uploads como directorio estático donde ver las imágenes de perfil del usuario
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//Middleware para parsear JSON
app.use(express.json());

// RUTAS

// Ruta para: crear perfil, iniciar sesión, renovar sesión, obtener perfil por id, actualizar perfil existente, eliminar perfil y subir una imagen de perfil
app.use("/usuarios", usuariosRouter);

// MIDDLEWARE GLOBAL PARA RUTAS INEXISTENTES (ERROR 404)
app.use((req, res, next) => {
  res.status(404).json({ error: "ruta inexistente" });
});

// MIDDLEWARE GLOBAL DE ERRORES
app.use((err, req, res, next) => {
  console.error("error interno del servidor:", err.message);
  if (err.message.includes("usuario no encontrado")) {
    return res.status(404).json({ error: err.message });
  }
  if (
    err.message.includes("Error de lectura en base de datos") ||
    err.message.includes("Error de escritura en base de datos") ||
    err.message.includes("Error de inserción en base de datos")
  ) {
    return res.status(500).json({ error: err.message });
  }
  res.status(500).json({ error: `Error interno del servidor` });
});

// INICIALIZACION SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
