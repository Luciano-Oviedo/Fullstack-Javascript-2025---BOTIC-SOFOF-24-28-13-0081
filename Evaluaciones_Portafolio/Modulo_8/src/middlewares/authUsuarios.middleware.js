const jwt = require("jsonwebtoken");
require("dotenv").config();
const { leerDB, leerDBporId } = require("../../db/clientDB");

// Clave secreta para firmar JWT
const LLAVE_SECRETA = process.env.SECRET_KEY;

// Middleware de autenticación (para verificar que el usuario hizo login)
const autenticarAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Validamos que exista un bearer token en la clave 'authorization' de los headers de la petición
  if (!authHeader)
    return res.status(401).json({
      error: "Acceso denegado: no se proporcionó token de autenticación",
    });

  // Si existe un bearer token en los headers de la petición, validamos que sea un token válido y que no esté expirado
  const token = authHeader.split(/\s+/)[1];
  jwt.verify(token, LLAVE_SECRETA, (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ error: "Acceso denegado: token de autenticación inválido" });
    }
    // Agregamos la información del usuario contenida en el token de acceso a la petición, para usar en controlador y en middleware de autorización
    req.user = payload;
    return next();
  });
};

// Middleware de autenticación de refresh tokens (para validar el refresco de sesión del usuario cuando su access token expira)
const autenticarRefreshToken = async (req, res, next) => {
  try {
    // Validamos existencia del refresh token en header de la petición
    const token = req.headers["refresh-token"];
    if (!token)
      return res.status(401).json({
        error:
          "No se detectaron credenciales de usuario, debes volver a iniciar sesión",
      });

    // Verificamos validez del token
    let payload;
    try {
      payload = jwt.verify(token, LLAVE_SECRETA);
    } catch (err) {
      return res.status(401).json({
        error:
          "Credenciales inválidas o expiradas, debes volver a iniciar sesión",
      });
    }

    // Consultamos DB y validamos que el token no haya rotado
    const usuarios = await leerDB();
    const usuario = usuarios.find((usuario) => usuario.refreshToken === token);

    if (!usuario) {
      return res.status(401).json({
        error:
          "Credenciales inválidas o expiradas, debes volver a iniciar sesión",
      });
    }

    // Agregamos la información de usuario a la petición para usar en controlador y en middleware de autorización
    req.user = { id: usuario.id, email: usuario.email };
    return next();
  } catch (error) {
    next(error);
  }
};

// Middleware de autorización (para verificar que el usuario logeado es dueño del perfil que está intentando actualizar/eliminar)
const autorizarToken = async (req, res, next) => {
  try {
    // Capturamos el id de la ruta
    const idRuta = Number(req.params.id);

    // Capturamos id e email contenidos en el payload del token autenticado
    const idPayload = req.user.id;
    const emailPayload = req.user.email;

    // Validamos que exista un usuario con el id ingresado en la ruta en nuestra base de datos
    const usuarioExistente = await leerDBporId(idRuta);
    if (!usuarioExistente)
      return res
        .status(404)
        .json({ error: "No existe un usuario asociado a este id" });

    // Validamos que el perfil a actualizar/eliminar pertenezca al usuario autenticado, comparando sus datos con los datos contenidos en el payload del token
    if (
      usuarioExistente.email !== emailPayload ||
      usuarioExistente.id !== idPayload
    )
      return res
        .status(403)
        .json({ error: "Usuario no autorizado para realizar esta operación" });

    return next();
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};

module.exports = {
  autenticarAccessToken,
  autenticarRefreshToken,
  autorizarToken,
};
