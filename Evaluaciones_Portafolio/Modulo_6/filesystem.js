const fs = require("fs/promises");

// Función asíncrona para leer archivos
const leerArchivo = async (ruta) => {
  try {
    const contenido = await fs.readFile(ruta, "utf-8");
    return JSON.parse(contenido);
  } catch (err) {
    console.error("Error de lectura de archivo:", err.message);
    throw err;
  }
};

// Función asíncrona para escribir archivos
const escribirArchivo = async (ruta, datos) => {
  try {
    await fs.writeFile(ruta, JSON.stringify(datos, null, 2), "utf-8");
  } catch (err) {
    console.error("Error en la escritura del archivo:", err.message);
    throw err;
  }
};

module.exports = { leerArchivo, escribirArchivo };
