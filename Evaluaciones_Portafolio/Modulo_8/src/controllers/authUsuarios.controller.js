require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { leerDB, insertarEnDB, actualizarenDB } = require("../../db/clientDB");

// Clave secreta para firmar JWT
const LLAVE_SECRETA = process.env.SECRET_KEY;

// FUNCION PARA REGISTRAR USUARIOS
exports.registroUsuario = async (req, res, next) => {
  try {
    // Extraemos nombre de usuario, email y contraseña del cuerpo de la petición
    const { name, email, password } = req.body;

    // Validamos que la petición contenga todos los datos necesarios para el registro ( el middleware de validación de datos se encarga de comprobar tipo y formato de los datos)
    if (!name || !email || !password) {
      return res.status(400).json({
        mensaje:
          "debes ingresar nombre de usuario, email y contraseña para continuar con el registro de tu perfil",
      });
    }

    // Normalizamos el email
    const emailNormalizado = email.trim().toLowerCase();

    // Leemos la base de datos
    const usuarios = await leerDB();

    // Validamos que no exista un usuario ya registrado con ese email
    const emailExistente = usuarios.find(
      (usuario) => usuario.email === emailNormalizado
    );
    if (emailExistente) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe un usuario registrado con este email" });
    }

    // Validamos que el nombre de usuario no esté ocupado
    const nombreOcupado = usuarios.find((usuario) => usuario.name === name);
    if (nombreOcupado) {
      return res.status(400).json({
        mensaje:
          "El nombre de usuario ya está ocupado, escoge otro nombre para continuar con el registro de tu perfil",
      });
    }

    // Encriptamos la contraseña
    const contrasenaEncriptada = await bcrypt.hash(password, 10);

    // Generamos un id numérico autoincremental
    let id = 1;

    if (usuarios.length > 0) {
      const arregloIds = usuarios.map((usuario) => usuario.id);
      id = Math.max(...arregloIds) + 1;
    }

    // Creamos al usuario y lo insertamos a la base de datos
    const nuevoUsuario = {
      id: id,
      name: name,
      email: emailNormalizado,
      password: contrasenaEncriptada,
    };
    await insertarEnDB(nuevoUsuario);

    // Generamos un access token con el id e email único del usuario y un tiempo de expiración de 15 minutos
    const accessToken = jwt.sign(
      { id: id, email: emailNormalizado },
      LLAVE_SECRETA,
      {
        expiresIn: "15m",
      }
    );

    // Devolvemos una respuesta en formato JSON que adjunta el access token al header de la respuesta y confirma el registro del usuario y sus datos
    return res
      .set({ authorization: `Bearer ${accessToken}` })
      .status(201)
      .json({
        mensaje: "Usuario registrado correctamente",
        nombreUsuario: name,
        email: emailNormalizado,
        id: id,
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

    // Validamos que la petición contenga todos los datos necesarios para el login ( el middleware de validación de datos se encarga de comprobar tipo y formato de los datos)
    if (!email || !password) {
      return res.status(400).json({
        mensaje: "debes ingresar email y contraseña para iniciar sesión",
      });
    }

    // Normalizamos el email
    const emailNormalizado = email.trim().toLowerCase();

    // Leemos la base de datos
    const usuarios = await leerDB();

    // Validamos que exista un usuario registrado con ese email
    const usuarioExistente = usuarios.find(
      (usuario) => usuario.email === emailNormalizado
    );
    if (!usuarioExistente) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    // Validamos que se ingrese la contraseña correcta para el usuario ingresado
    const passwordValida = await bcrypt.compare(
      password,
      usuarioExistente.password
    );
    if (!passwordValida) {
      return res
        .status(401)
        .json({ mensaje: "Usuario o contraseña incorrectos" });
    }
    // Generamos un access token con el id e email único del usuario y un tiempo de expiración de 15 minutos
    const accessToken = jwt.sign(
      { id: usuarioExistente.id, email: emailNormalizado },
      LLAVE_SECRETA,
      {
        expiresIn: "15m",
      }
    );

    // Generamos un refresh token de más larga duración (12hrs), para no impactar la experiencia de usuario en su sesión
    const refreshToken = jwt.sign(
      { id: usuarioExistente.id, email: emailNormalizado },
      LLAVE_SECRETA,
      { expiresIn: "12h" }
    );

    // Guardamos el refreshToken en la base de datos, rotando/sobrescribiendo cualquier token anterior
    await actualizarenDB(usuarioExistente.id, refreshToken, "refreshToken");

    // Adjuntamos los tokens a los headers de la respuesta y retornamos un mensaje de confirmación de login con un enlace para ver el perfil del usuario
    return res
      .set({
        authorization: `Bearer ${accessToken}`,
        "refresh-token": refreshToken,
      })
      .status(200)
      .json({
        mensaje: `Has iniciado sesión ${usuarioExistente.name}`,
        link: { rel: "self", href: `/usuarios/${usuarioExistente.id}` },
      });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};

// FUNCIÓN PARA RENOVAR TOKEN DE ACCESO
exports.renovarToken = async (req, res, next) => {
  try {
    // El middleware de autenticación de refresh token se encarga de comprobar existencia y validez del refresh token en el header de la petición y que no haya rotado de la base de datos

    // Generamos un nuevos tokens de acceso y refresco con los datos del refresh token contenidos en el header de la petición
    const nuevoAccessToken = jwt.sign(
      { id: req.user.id, email: req.user.email },
      LLAVE_SECRETA,
      {
        expiresIn: "15m",
      }
    );

    const nuevoRefreshToken = jwt.sign(
      { id: req.user.id, email: req.user.email },
      LLAVE_SECRETA,
      { expiresIn: "12h" }
    );

    // Guardamos el nuevo refreshToken en la base de datos, rotando/sobrescribiendo el token anterior
    await actualizarenDB(req.user.id, nuevoRefreshToken, "refreshToken");

    // Adjuntamos los tokens a los headers de la respuesta y retornamos un mensaje de confirmación del proceso y un enlace al perfil del usuario
    return res
      .set({
        authorization: `Bearer ${nuevoAccessToken}`,
        "refresh-token": nuevoRefreshToken,
      })
      .status(200)
      .json({
        mensaje: "Las credenciales de autenticación se renovaron con éxito",
        link: { rel: "self", href: `/usuarios/${req.user.id}` },
      });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};
