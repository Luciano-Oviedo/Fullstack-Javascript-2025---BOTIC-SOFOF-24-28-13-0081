const fs = require("node:fs");
const path = require("node:path");

const rutaDB = path.join(__dirname, "db.json");

const leerDB = async () => {
  try {
    // Si no existe → crear con []
    if (!fs.existsSync(rutaDB)) {
      await fs.promises.writeFile(rutaDB, JSON.stringify([]));
    }

    // Leer archivo y validar contenido
    let contenido = await fs.promises.readFile(rutaDB, "utf8");

    try {
      const data = JSON.parse(contenido);

      // Si el JSON es válido pero no es un arreglo → corregir
      if (!Array.isArray(data)) {
        await fs.promises.writeFile(rutaDB, JSON.stringify([]));
        return [];
      }

      return data;
    } catch {
      // JSON vacío o corrupto → reemplazar con []
      await fs.promises.writeFile(rutaDB, JSON.stringify([]));
      return [];
    }
  } catch (error) {
    throw new Error(`Error de lectura en base de datos: ${error.message}`);
  }
};

const leerDBporId = async (id) => {
  try {
    const usuarios = await leerDB();
    const usuario = usuarios.find((usuario) => usuario.id === id);
    if (!usuario) throw new Error("usuario no encontrado");
    return usuario;
  } catch (error) {
    throw new Error(`Error de lectura en base de datos: ${error.message}`);
  }
};

const insertarEnDB = async (nuevoUsuario) => {
  try {
    const usuarios = await leerDB();
    usuarios.push(nuevoUsuario);
    await fs.promises.writeFile(rutaDB, JSON.stringify(usuarios, null, 2));
  } catch (error) {
    throw new Error(`Error de inserción en base de datos: ${error.message}`);
  }
};

const guardarDB = async (usuarios) => {
  try {
    await fs.promises.writeFile(rutaDB, JSON.stringify(usuarios, null, 2));
  } catch (error) {
    throw new Error(`Error de escritura en base de datos: ${error.message}`);
  }
};

const actualizarenDB = async (id, nuevaData, propiedadActualizada) => {
  try {
    const usuarios = await leerDB();
    const index = usuarios.findIndex((usuario) => usuario.id === id);
    if (index === -1) throw new Error("usuario no encontrado");
    usuarios[index][propiedadActualizada] = nuevaData;
    await guardarDB(usuarios);
  } catch (error) {
    throw new Error(`Error de escritura en base de datos: ${error.message}`);
  }
};

const eliminarDeDB = async (id) => {
  try {
    const usuarios = await leerDB();
    const index = usuarios.findIndex((usuario) => usuario.id === id);
    if (index === -1) throw new Error("usuario no encontrado");
    usuarios.splice(index, 1);
    await guardarDB(usuarios);
  } catch (error) {
    throw new Error(`Error de eliminación en base de datos: ${error.message}`);
  }
};

module.exports = {
  leerDB,
  leerDBporId,
  insertarEnDB,
  actualizarenDB,
  eliminarDeDB,
};
