const jwt = require("jsonwebtoken");
require("dotenv").config();

// Clave secreta para firmar JWT
const LLAVE_SECRETA = process.env.SECRET_KEY;

// Middleware de autenticación
const autenticarJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Validamos que exista un bearer token en la clave 'authorization' de los headers de la petición
  if (!authHeader)
    return res.status(401).json({
      Error: "Acceso denegado: No se proporcionó token de autenticación",
    });

  // Si existe un bearer token en los headers de la petición, validamos que sea un token válido y que no esté expirado (validación de login)
  const token = authHeader.split(/\s+/)[1];
  jwt.verify(token, LLAVE_SECRETA, (err, usuario) => {
    if (err)
      return res
        .status(401)
        .json({ Error: "Acceso denegado: Token de autenticación inválido" });

    req.user = usuario;
    return next();
  });
};

module.exports = autenticarJwt;
