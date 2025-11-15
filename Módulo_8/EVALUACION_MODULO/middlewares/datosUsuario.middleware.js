// Middleware para validar ingreso, tipo y formato de datos de usuario
const validarDatosUsuario = (req, res, next) => {
  // Validamos que la petición contenga un cuerpo (para pruebas en POSTMAN)
  if (!req.body) {
    return res
      .status(404)
      .json({ Error: "Debes agregar un 'Body>raw>JSON' a esta petición HTTP" });
  }
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
      Error: "Debes ingresar un email y contraseña válidos para continuar",
    });
  }

  // Validamos el formato del email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      Error: "Debes ingresar un email en formato 'correo@ejemplo.com'",
    });
  }
  return next();
};

module.exports = validarDatosUsuario;
