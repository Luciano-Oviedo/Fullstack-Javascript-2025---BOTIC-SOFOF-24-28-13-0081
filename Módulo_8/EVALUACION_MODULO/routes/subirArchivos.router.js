const express = require("express");
const subirArchivo = require("../controllers/subirArchivos.controller");
const autenticarJwt = require("../middlewares/auth.middleware");
const router = express.Router();

// RUTA POST PARA SUBIR ARCHIVOS, CON MIDDLEWARE DE AUTENTICACION DE CREDENCIALES DE USUARIO
router.post("/upload", autenticarJwt, subirArchivo);

module.exports = router;
