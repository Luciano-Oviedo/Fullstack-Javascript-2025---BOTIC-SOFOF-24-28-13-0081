const path = require("node:path");
const fs = require("node:fs");

// Definimos directorio de subida de los archivos en el servidor
const directorioArchivos = path.join(__dirname, "..", "uploads");

// Definimos un límite de tamaño de los archivos
const tamanoMaximo = 5 * 1024 * 1024;

// Definimos las extensiones de archivo permitidas
const extensionesPermitidas = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".pdf",
  ".txt",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".mp3",
  ".wav",
  ".m4a",
  ".ogg",
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
];

// FUNCION PARA SUBIR ARCHIVOS AL SERVIDOR
const subirArchivo = (req, res, next) => {
  try {
    // Validamos que se hayan subido un archivo en la petición
    if (!req.files || !req.files.archivo) {
      return res.status(400).json({ Error: "No se han subido archivos" });
    }

    // Validamos que solo se suba un archivo por petición
    if (Array.isArray(req.files.archivo))
      return res
        .status(400)
        .json({ Error: "Solo se permite subir un archivo a la vez" });

    // Guardamos el archivo en memoria
    const archivo = req.files.archivo;

    // Validamos tamaño máximo del archivo (5MB)
    if (archivo.size > tamanoMaximo) {
      return res.status(413).json({
        Error: `El archivo ${archivo.name} excede el tamaño máximo permitido (5MB)`,
      });
    }
    // Validamos la extensión del archivo
    const archivoExt = path.extname(archivo.name).toLowerCase();
    if (!extensionesPermitidas.includes(archivoExt)) {
      return res.status(415).json({
        Error: `La extensión '${archivoExt}' del archivo '${archivo.name}' no está permitida`,
      });
    }

    // Creamos el directorio para subir el archivo si aún no existe
    if (!fs.existsSync(directorioArchivos)) fs.mkdirSync(directorioArchivos);

    // Generamos un nombre único para el archivo
    const nombreOriginalsinExtension = archivo.name.replace(archivoExt, "");
    let contador = 1;
    let nombreUnico = nombreOriginalsinExtension + archivoExt;
    while (fs.existsSync(path.join(directorioArchivos, nombreUnico))) {
      nombreUnico = nombreOriginalsinExtension + "-" + contador + archivoExt;
      contador++;
    }

    // Subimos el archivo a nuestro directorio
    const rutaDestino = path.join(directorioArchivos, nombreUnico);

    archivo.mv(rutaDestino, (err) => {
      if (err) return next(err);
      else
        res.status(201).json({
          Mensaje: `Tu archivo '${nombreUnico}' ha sido subido correctamente`,
        });
    });
  } catch (error) {
    // Si sucede un error por fuera de los casos previstos, se pasa al middleware global de errores como error interno del servidor (500)
    next(error);
  }
};

module.exports = subirArchivo;
