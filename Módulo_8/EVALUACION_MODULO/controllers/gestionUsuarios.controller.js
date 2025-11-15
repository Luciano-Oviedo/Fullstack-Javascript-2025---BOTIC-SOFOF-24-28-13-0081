const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Clave secreta para firmar JWT
const LLAVE_SECRETA = process.env.SECRET_KEY;

// Base de datos simulada
const usuarios = [];

// FUNCION PARA REGISTRAR USUARIOS
exports.registroUsuario = async (req, res, next) => {
  try {
    // Extraemos email y contraseña del cuerpo de la petición
    const { email, password } = req.body;

    // Normalizamos el email
    const emailNormalizado = email.trim().toLowerCase();

    // Validamos que no exista un usuario ya registrado con ese email
    const usuarioExistente = usuarios.find(
      (usuario) => usuario.email === emailNormalizado
    );
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ Mensaje: "Ya existe un usuario registrado con este email" });
    }

    // Encriptamos la contraseña
    const contrasenaEncriptada = await bcrypt.hash(password, 10);

    // Guardamos al usuario registrado
    usuarios.push({
      email: emailNormalizado,
      contrasena: contrasenaEncriptada,
    });

    // Generamos un JWT con el email del usuario y un tiempo de expiración de 1 hora
    const token = jwt.sign({ email: emailNormalizado }, LLAVE_SECRETA, {
      expiresIn: "1h",
    });

    // Devolvemos una respuesta en formato JSON confirmando el registro del usuario, su email y el JWT generado
    return res.status(201).json({
      Mensaje: "Usuario registrado correctamente",
      Usuario: emailNormalizado,
      Token: token,
    });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};

// FUNCION DE LOGIN DE USUARIOS
exports.loginUsuario = async (req, res, next) => {
  try {
    // Extraemos email y contraseña del cuerpo de la petición
    const { email, password } = req.body;

    // Normalizamos el email
    const emailNormalizado = email.trim().toLowerCase();

    // Validamos que exista un usuario registrado con ese email
    const usuarioExistente = usuarios.find(
      (usuario) => usuario.email === emailNormalizado
    );
    if (!usuarioExistente) {
      return res
        .status(401)
        .json({ Mensaje: "Usuario o contraseña incorrectos" });
    }

    // Validamos que se ingrese la contraseña correcta para el usuario ingresado
    const passwordValida = await bcrypt.compare(
      password,
      usuarioExistente.contrasena
    );
    if (!passwordValida) {
      return res
        .status(401)
        .json({ Mensaje: "Usuario o contraseña incorrectos" });
    }
    // Generamos un JWT con el email del usuario y un tiempo de expiración de 1 hora
    const token = jwt.sign({ email: usuarioExistente.email }, LLAVE_SECRETA, {
      expiresIn: "1h",
    });

    // Retornamos un mensaje de confirmación de login en formato JSON y el token generado
    return res.status(200).json({
      Mensaje: `Bienvenido/a '${usuarioExistente.email}', has iniciado sesión correctamente`,
      Token: token,
    });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};
