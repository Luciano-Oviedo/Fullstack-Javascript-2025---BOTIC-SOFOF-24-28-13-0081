const pool = require("./pool");

// Función SELECT
async function obtenerPeliculas() {
  let client;
  try {
    // Ocupamos una conexión del pool
    client = await pool.connect();

    // Hacemos un select a toda la tabla
    const resultado = await client.query("SELECT * FROM peliculas");

    // Retornamos resultados en consola y como objeto para usar en otras funciones
    console.table(resultado.rows);
    return resultado.rows;
  } catch (error) {
    // Manejamos errores
    console.error(`Error (${error.code || "SIN_CODIGO"}): ${error.message}`);
    throw error;
  } finally {
    // Nos desconectamos del pool
    if (client) client.release();
  }
}

// Función INSERT
async function insertarPelicula(nombre, sinopsis, precio_boleto, disponible) {
  let client;
  try {
    // Validamos existencia y tipos de datos
    if (
      typeof nombre !== "string" ||
      typeof sinopsis !== "string" ||
      typeof precio_boleto !== "number" ||
      typeof disponible !== "boolean" ||
      !nombre.trim() ||
      !sinopsis.trim() ||
      isNaN(precio_boleto) ||
      precio_boleto <= 0
    ) {
      throw new Error("El usuario debe ingresar parámetros válidos");
    }

    client = await pool.connect();
    const query = `
            INSERT INTO peliculas(nombre, sinopsis, precio_boleto, disponible)
            VALUES($1, $2, $3, $4)
            RETURNING id
        `;
    const valores = [nombre, sinopsis, precio_boleto, disponible];
    const resultado = await client.query(query, valores);
    console.log("ID insertado:", resultado.rows[0].id);
    console.log("Registros insertados:", resultado.rowCount);
    return resultado.rows[0];
  } catch (error) {
    console.error(`Error (${error.code || "SIN_CODIGO"}): ${error.message}`);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Función UPDATE
async function actualizarPelicula(id, campo, nuevoValor) {
  let client;
  try {
    // Validamos existencia y tipos de datos
    if (
      typeof id !== "number" ||
      typeof campo !== "string" ||
      isNaN(id) ||
      !campo.trim()
    ) {
      throw new Error("El usuario debe ingresar parámetros válidos");
    }
    if (typeof nuevoValor === "string" && !nuevoValor.trim()) {
      throw new Error("El valor no puede estar vacío");
    }

    // Validamos que se ingrese un campo válido de la tabla para modificar
    const camposValidos = ["nombre", "sinopsis", "precio_boleto", "disponible"];
    if (!camposValidos.includes(campo)) {
      throw new Error(
        "El usuario debe ingresar un campo existente para actualizar"
      );
    }

    client = await pool.connect();
    const query = `UPDATE peliculas SET ${campo} = $1 WHERE id = $2 RETURNING *`;
    const valores = [nuevoValor, id];
    const resultado = await client.query(query, valores);
    console.log("Registros actualizados:", resultado.rowCount);
    console.log(`Nuevos valores: ${resultado.rows}`);
    return resultado.rows[0];
  } catch (error) {
    console.error(`Error (${error.code || "SIN_CODIGO"}): ${error.message}`);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// Función DELETE
async function eliminarPelicula(id) {
  let client;
  try {
    // Validamos existencia y tipos de datos
    if (typeof id !== "number" || isNaN(id)) {
      throw new Error("El id debe ser un valor numérico");
    }
    client = await pool.connect();
    const query = `DELETE FROM peliculas WHERE id = $1 RETURNING *`;
    const valores = [id];
    const resultado = await client.query(query, valores);
    console.log("Registros eliminados:", resultado.rowCount);
    return resultado.rows[0];
  } catch (error) {
    console.error(`Error (${error.code || "SIN_CODIGO"}): ${error.message}`);
    throw error;
  } finally {
    if (client) client.release();
  }
}

module.exports = {
  obtenerPeliculas,
  insertarPelicula,
  actualizarPelicula,
  eliminarPelicula,
};
