import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

const app = express();
const PORT = 4020;

dotenv.config();
const LLAVE_SECRETA = process.env.SECRET_KEY;

// Middleware para parsear cuerpo de peticiones HTTP
app.use(bodyParser.json());

// Middleware de autenticación
const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Validamos que exista un bearer token en la clave 'authorization' de los headers de la petición
  if (!authHeader)
    return res
      .status(401)
      .json({ Mensaje: "Acceso denegado: No se proporcionó token" });

  // Si existe un bearer token en los headers de la petición, validamos que sea un token válido y que no esté expirado (validación de login)
  const token = authHeader.split(" ")[1];

  jwt.verify(token, LLAVE_SECRETA, (err, usuario) => {
    if (err)
      return res
        .status(401)
        .json({ Mensaje: "Acceso denegado: Token inválido" });

    req.user = usuario.email;
    return next();
  });
};

// Middleware para validar ingreso y tipo de datos
const validarDatos = (req, res, next) => {
  // Extraemos email y contraseña del cuerpo de la petición
  const { email, password } = req.body;

  // Validamos ingreso de email y contraseña
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim().toLowerCase() === "" ||
    password.trim().toLowerCase() === ""
  ) {
    return res.status(400).json({
      Mensaje: "Debes ingresar un email y contraseña válidos para continuar",
    });
  }
  return next();
};

// Base de datos simulada
const usuarios = [];

// 1. RUTA PARA REGISTRAR USUARIO
app.post("/register", validarDatos, async (req, res) => {
  // Extraemos email y contraseña del cuerpo de la petición
  const { email, password } = req.body;

  // Validamos que no exista un usuario ya registrado con ese email
  const usuarioExistente = usuarios.find(
    (usuario) => usuario.email === email.trim().toLowerCase()
  );
  if (usuarioExistente) {
    return res
      .status(400)
      .json({ Mensaje: "Ya existe un usuario registrado con este email" });
  }

  // Encriptamos la contraseña
  const contrasenaEncriptada = await bcrypt.hash(password, 10);

  // Guardamos al usuario registrado y confirmamos con una respuesta JSON
  usuarios.push({
    email: email.trim().toLowerCase(),
    contrasena: contrasenaEncriptada,
  });
  return res.status(201).json({ Mensaje: "Usuario registrado correctamente" });
});

// 2. RUTA PARA INICIAR SESION
app.post("/login", validarDatos, async (req, res) => {
  // Extraemos email y contraseña del cuerpo de la petición
  const { email, password } = req.body;

  // Validamos que exista un usuario registrado con ese email
  const usuarioExistente = usuarios.find(
    (usuario) => usuario.email === email.trim().toLowerCase()
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
  return res.status(200).json({ Mensaje: "Has iniciado sesión", Token: token });
});

// 3. RUTA PROTEGIDA CON MIDDLEWARE DE AUTENTICACION
app.get("/profile", authenticateJwt, (req, res) => {
  res
    .status(200)
    .json({ Mensaje: `Usuario: ${req.user}. Bienvenido a tu perfil` });
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
