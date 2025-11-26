require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const path = require("node:path");
const fs = require("node:fs");
const {
  leerDB,
  leerDBporId,
  actualizarenDB,
  eliminarDeDB,
} = require("../../db/clientDB");

// Clave secreta para firmar JWT
const LLAVE_SECRETA = process.env.SECRET_KEY;

// FUNCION PARA MOSTRAR PERFIL DEL USUARIO QUE INICIO SESION
exports.obtenerUsuario = async (req, res, next) => {
  try {
    // Capturamos el id del usuario desde los parámetros de la ruta
    const idRuta = Number(req.params.id);

    // Buscamos al usuario asociado a ese id (el middleware de autorización jwt se encarga previamente de validar que el usuario exista)
    const usuario = await leerDBporId(idRuta);

    // Devolvemos una respuesta en formato JSON con la información de perfil del usuario y los enlaces para subir una foto de perfil, editar su información o eliminar su perfil
    return res.status(200).json({
      mensaje: `Bienvenido/a a tu perfil ${usuario.name}. Desde esta sección puedes subir una foto de perfil, editar tu información o eliminar tu perfil`,
      links: [
        { rel: "upload", href: `/usuarios/${usuario.id}/imagen` },
        { rel: "update", href: `/usuarios/${usuario.id}` },
        { rel: "delete", href: `/usuarios/${usuario.id}` },
      ],
    });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};

// FUNCION PARA ACTUALIZAR LOS DATOS DE PERFIL DE UN USUARIO
exports.actualizarUsuario = async (req, res, next) => {
  try {
    // Capturamos el id del usuario desde los parámetros de la ruta
    const idRuta = Number(req.params.id);

    // Capturamos email y contraseña del cuerpo de la petición (nuestra API no permite cambiar nombre de usuario)
    // El middleware de validación de datos valida previamente el tipo y formato de los datos ingresados en la petición
    const { email, password } = req.body;

    // Declaramos variables para nuevos tokens de autenticación, por si se cambia un dato crítico del usuario (email)
    let accessToken = null;
    let refreshToken = null;

    // Si se cambió la contraseña:
    if (password) {
      // La encriptamos
      const contrasenaEncriptada = await bcrypt.hash(password, 10);
      // La actualizamos
      await actualizarenDB(idRuta, contrasenaEncriptada, "password");
    }

    // Si se cambió el email:
    if (email) {
      // Leemos la base de datos y validamos que el email no esté en uso por otro usuario
      const usuarios = await leerDB();
      const nuevoEmailNormalizado = email.trim().toLowerCase();
      const emailOcupado = usuarios.find(
        (usuario) =>
          usuario.email === nuevoEmailNormalizado && usuario.id !== idRuta
      );
      if (emailOcupado) {
        return res.status(400).json({
          error: "El nuevo email ya está en uso por otro perfil",
        });
      }
      // Actualizamos el email
      await actualizarenDB(idRuta, nuevoEmailNormalizado, "email");

      // Regeneramos tokens de autenticación, firmados con el nuevo email

      accessToken = jwt.sign(
        { id: idRuta, email: nuevoEmailNormalizado },
        LLAVE_SECRETA,
        {
          expiresIn: "15m",
        }
      );

      refreshToken = jwt.sign(
        { id: idRuta, email: nuevoEmailNormalizado },
        LLAVE_SECRETA,
        { expiresIn: "12h" }
      );

      await actualizarenDB(idRuta, refreshToken, "refreshToken");
    }

    // Devolvemos una respuesta en formato JSON confirmando la actualización de la información y un enlace para volver al home del perfil

    const usuarioActualizado = await leerDBporId(idRuta);

    // Se adjuntan los tokens a los headers de la respuesta solo si fueron refrescados (si se actualizó email)
    if (accessToken && refreshToken) {
      return res
        .set({
          authorization: `Bearer ${accessToken}`,
          "refresh-token": refreshToken,
        })
        .status(200)
        .json({
          mensaje: `Has actualizado tu información correctamente`,
          nombreUsuario: usuarioActualizado.name,
          email: usuarioActualizado.email,
          link: { rel: "self", href: `/usuarios/${usuarioActualizado.id}` },
        });
    }

    return res.status(200).json({
      mensaje: `Has actualizado tu información correctamente`,
      nombreUsuario: usuarioActualizado.name,
      email: usuarioActualizado.email,
      link: { rel: "self", href: `/usuarios/${usuarioActualizado.id}` },
    });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};

// FUNCION PARA ELIMINAR EL PERFIL DE UN USUARIO
exports.eliminarUsuario = async (req, res, next) => {
  try {
    // Capturamos el id del usuario desde los parámetros de la ruta
    const idRuta = Number(req.params.id);

    // Eliminamos el perfil correspondiente a ese usuario
    await eliminarDeDB(idRuta);

    // Confirmamos la eliminación del perfil de usuario con una respuesta en formato JSON
    return res
      .status(200)
      .json({ mensaje: "Has eliminado tu perfil exitosamente" });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};

// FUNCION PARA SUBIR UNA FOTO DE PERFIL
exports.subirImagenPerfil = async (req, res, next) => {
  // Definimos el directorio de subida de los archivos en el servidor
  const directorioArchivos = path.join(__dirname, "..", "..", "uploads");

  // Definimos un límite de tamaño máximo de la imagen
  const tamanoMaximo = 5 * 1024 * 1024;

  // Definimos las extensiones de imagen permitidas
  const extensionesPermitidas = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  try {
    // Validamos que se haya subido una imagen en la petición
    if (!req.files || !req.files.profileImg) {
      return res
        .status(400)
        .json({ error: "Debes seleccionar una imagen para continuar" });
    }

    // Validamos que solo se suba un archivo por petición
    if (Array.isArray(req.files.profileImg))
      return res
        .status(400)
        .json({ error: "Solo puedes seleccionar una imagen de perfil" });

    // Guardamos el archivo en memoria, remplazando posibles espacios en el nombre por _
    const imgPerfil = req.files.profileImg;

    // Validamos tamaño máximo de la imagen (5MB)
    if (imgPerfil.size > tamanoMaximo) {
      return res.status(413).json({
        error: "La Imagen seleccionada excede el tamaño máximo permitido (5MB)",
      });
    }
    // Validamos la extensión de la imagen
    const imgExt = path.extname(imgPerfil.name).toLowerCase();
    if (!extensionesPermitidas.includes(imgExt)) {
      return res.status(415).json({
        error: `La extensión '${imgExt}' no está permitida`,
      });
    }

    // Redimensionamos la imagen a un cuadrado de 200px x 200px, manteniendo aspect ratio
    const imagenProcesadaBuffer = await sharp(imgPerfil.data)
      .resize(200, 200, { fit: "contain" })
      .toBuffer();

    // Creamos el directorio para subir la imagen de perfil si aún no existe
    if (!fs.existsSync(directorioArchivos)) fs.mkdirSync(directorioArchivos);

    // Normalizamos el nombre, remplazando posibles espacios por _
    const nombreNormalizado = imgPerfil.name.replace(/\s+/g, "_");

    // Generamos un nombre único para la imagen de perfil
    const nombreSinExtension = nombreNormalizado.replace(imgExt, "");
    let contador = 1;
    let nombreUnico = nombreSinExtension + imgExt;
    while (fs.existsSync(path.join(directorioArchivos, nombreUnico))) {
      nombreUnico = nombreSinExtension + "-" + contador + imgExt;
      contador++;
    }

    // Subimos la imagen de perfil al directorio
    const rutaDestino = path.join(directorioArchivos, nombreUnico);

    await fs.promises.writeFile(rutaDestino, imagenProcesadaBuffer);

    // Si la carga es exitosa, devolvemos una respuesta en formato JSON confirmando la operación, con la URL de la imagen de perfil
    res.status(201).json({
      mensaje: "Felicitaciones, has actualizado tu imagen de perfil",
      URL: `/uploads/${nombreUnico}`,
    });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};
