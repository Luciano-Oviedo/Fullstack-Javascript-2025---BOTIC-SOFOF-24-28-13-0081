const express = require("express");
const router = express.Router();

// Funciones para autenticar usuarios y renovar su sesión
const {
  registroUsuario,
  loginUsuario,
  renovarToken,
} = require("../controllers/authUsuarios.controller");

// Funciones para manipular usuarios
const {
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  subirImagenPerfil,
} = require("../controllers/gestionUsuarios.controller");

// Middlewares de autenticación y autorización de usuarios mediante JWT
const {
  autenticarAccessToken,
  autenticarRefreshToken,
  autorizarToken,
} = require("../middlewares/authUsuarios.middleware");

// Middleware de validación de ingreso, tipo y formato de datos de usuario (nombre de usuario, email y password)
const validarDatosUsuario = require("../middlewares/datosUsuarios.middleware");

// ROUTERS DE AUTENTICACIÓN DE USUARIOS

// Registrar un nuevo perfil de usuario
router.post("/", validarDatosUsuario, registroUsuario);

// Iniciar sesión como usuario
router.post("/login", validarDatosUsuario, loginUsuario);

// Renovar sesión
router.post(
  "/:id/refresh",
  autenticarRefreshToken,
  autorizarToken,
  renovarToken
);

// ROUTERS DE MANIPULACIÓN DE USUARIOS

// Obtener perfil de usuario por ID
router.get("/:id", autenticarAccessToken, autorizarToken, obtenerUsuario);

// Actualizar perfil de usuario por ID
router.put(
  "/:id",
  autenticarAccessToken,
  autorizarToken,
  validarDatosUsuario,
  actualizarUsuario
);

// Eliminar perfil de usuario por ID
router.delete("/:id", autenticarAccessToken, autorizarToken, eliminarUsuario);

// Subir imagen de perfil
router.post(
  "/:id/imagen",
  autenticarAccessToken,
  autorizarToken,
  subirImagenPerfil
);

module.exports = router;
