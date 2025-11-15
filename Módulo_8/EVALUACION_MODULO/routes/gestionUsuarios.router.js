const {
  registroUsuario,
  loginUsuario,
} = require("../controllers/gestionUsuarios.controller");
const validarDatosUsuario = require("../middlewares/datosUsuario.middleware");
const express = require("express");
const router = express.Router();

// RUTA POST PARA REGISTRAR USUARIO, CON MIDDLEWARE PARA VALIDAR INGRESO, TIPO Y FORMATO DE DATOS
router.post("/register", validarDatosUsuario, registroUsuario);

// RUTA POST PARA HACER LOGIN DE USUARIO, CON MIDDLEWARE PARA VALIDAR INGRESO, TIPO Y FORMATO DE DATOS
router.post("/login", validarDatosUsuario, loginUsuario);

module.exports = router;
