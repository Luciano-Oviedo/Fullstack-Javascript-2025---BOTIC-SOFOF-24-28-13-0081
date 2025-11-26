// Middleware para validar tipo y formato de datos de usuario
const validarDatosUsuario = (req, res, next) => {
  // Validamos que la petición contenga un cuerpo (para pruebas en POSTMAN)
  if (!req.body) {
    return res
      .status(404)
      .json({ error: "Debes agregar un 'Body>raw>JSON' a esta petición HTTP" });
  }
  // Extraemos los datos ingresados por el usuario del cuerpo de la petición
  const { name, email, password } = req.body;

  // Si la petición viene de la ruta de registro:
  if (req.path === "/") {
    // Validamos el nombre de usuario registrado
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        error:
          "Debes ingresar un nombre de usuario como cadena de texto válida para continuar",
      });
    }
  }

  // Si la petición contiene email (ruta registro, login y, opcionalmente, la ruta para actualizar perfil):
  if (email) {
    // Validamos los tipos de datos ingresados
    if (typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        error:
          "Debes ingresar un email como cadena de texto válida para continuar",
      });
    }
    // Validamos el formato del email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Debes ingresar un email en formato 'correo@ejemplo.com'",
      });
    }
  }
  // Si la petición contiene contraseña (ruta registro, login y, opcionalmente, la ruta para actualizar perfil):
  if (password) {
    // Validamos los tipos de datos ingresados
    if (typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        error:
          "Debes ingresar una contraseña como cadena de texto válida para continuar",
      });
    }
  }
  return next();
};

module.exports = validarDatosUsuario;
