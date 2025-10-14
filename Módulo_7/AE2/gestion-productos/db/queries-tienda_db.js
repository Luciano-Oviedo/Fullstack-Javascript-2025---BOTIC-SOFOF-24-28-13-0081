const pool = require("./pool");

// Consultas SELECT

// 1. Obtener todos los productos
async function obtenerProductos() {
  let client;
  try {
    // Conectarse al pool
    client = await pool.connect();
    // Inicio transacción
    await client.query("BEGIN");

    // Usamos un cursor para recuperar resultados en lotes de 5 filas y procesarlos secuencialmente
    await client.query(
      "DECLARE cursor_productos CURSOR FOR SELECT * FROM productos ORDER BY id"
    );
    let resultado;
    const productos = [];
    do {
      resultado = await client.query("FETCH 5 FROM cursor_productos");

      // Procesar las filas obtenidas
      resultado.rows.forEach((p) => {
        console.log(
          `ID: ${p.id} | Nombre: ${p.nombre} | Precio: $${p.precio} | Categoria: ${p.categoria} | Stock: ${p.stock}.`
        );
      });
      productos.push(...resultado.rows);
      // El cursor se ejecutará hasta que no queden filas por mostrar
    } while (resultado.rows.length > 0);

    //Cerramos el cursor
    await client.query("CLOSE cursor_productos");

    // Fin transacción
    await client.query("COMMIT");
    // Retornamos consulta para usar en otras funciones
    return productos;
  } catch (error) {
    // Revertir transacción en caso de error
    if (client) await client.query("ROLLBACK");
    console.error("Error al consultar la base de datos:", error.message);
    throw error;
  } finally {
    // Liberaramos el cliente al pool
    if (client) client.release();
  }
}

// 2. Obtener productos por categoría
async function productosPorCategoria(categoria) {
  // Validamos tipos de datos
  if (!categoria || typeof categoria !== "string") {
    throw new Error("Categoría debe ser una cadena de texto válida.");
  }
  let client;
  try {
    client = await pool.connect();
    //Parametrizamos la categoría, para evitar inyecciones SQL
    const resultado = await client.query(
      "SELECT * FROM productos WHERE categoria = $1",
      [categoria]
    );
    //Validamos que la categoría exista en nuestra DB
    if (resultado.rowCount === 0) {
      console.log("La categoría ingresada no existe.");
      return [];
    } else {
      // Mostramos resultado en consola
      console.table(resultado.rows);

      return resultado.rows;
    }
  } catch (error) {
    console.error("Error al consultar la base de datos:", error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// CONSULTA INSERT: agregar nuevo producto

async function nuevoProducto(nombre, precio, categoria, stock) {
  // Validamos ingreso y tipos de datos
  if (
    typeof nombre !== "string" ||
    typeof categoria !== "string" ||
    !nombre.trim() ||
    !categoria.trim() ||
    typeof precio !== "number" ||
    typeof stock !== "number" ||
    precio <= 0 ||
    stock <= 0
  ) {
    throw new Error(
      "Nombre y categoría deben ser cadenas de texto. Precio y stock deben ser números positivos, mayores a cero."
    );
  }
  let client;
  try {
    client = await pool.connect();
    //Parametrizamos los valores ingresados, para evitar inyecciones SQL
    const resultado = await client.query(
      "INSERT INTO productos (nombre, precio, categoria, stock) values ($1, $2, $3, $4) RETURNING *",
      [nombre, precio, categoria, stock]
    );
    // Mostramos un mensaje de confirmación
    console.log(
      "La base de datos ha sido actualizada, agregaste el siguiente producto:"
    );
    console.table(resultado.rows);

    return resultado.rows;
  } catch (error) {
    console.error("Error al consultar la base de datos:", error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// CONSULTA UPDATE: actualizar campo de un producto

async function actualizarProducto(idProducto, columna, nuevoValor) {
  // Validamos ingreso y tipos de datos
  if (
    !idProducto ||
    typeof idProducto !== "number" ||
    !columna ||
    !nuevoValor
  ) {
    throw new Error(
      "Debes ingresar todos los parámetros solicitados. El id debe ser numérico"
    );
  }

  // Validamos que no se esté alterando el id
  if (columna.toLowerCase() === "id") {
    throw new Error("No puedes alterar el id de un producto.");
  }

  // Validamos que se ingresen valores numéricos positivos en stock y precio
  if (
    ["precio", "stock"].includes(columna) &&
    (typeof nuevoValor !== "number" || nuevoValor <= 0)
  ) {
    throw new Error(
      `Debes ingresar un valor numérico positivo para el campo: ${columna}.`
    );
  }

  // Validamos que se ingresen strings en nombre y categoría
  if (
    ["nombre", "categoria"].includes(columna) &&
    (typeof nuevoValor !== "string" || !nuevoValor.trim())
  ) {
    throw new Error(
      `Debes ingresar una cadena de texto para el campo: ${columna}.`
    );
  }

  let client;
  try {
    client = await pool.connect();

    // Validamos que el id y la columna existan
    const selectId = await client.query(
      "SELECT * FROM productos WHERE id = $1",
      [idProducto]
    );

    const columnasValidas = ["nombre", "precio", "categoria", "stock"];

    if (selectId.rowCount === 0 || !columnasValidas.includes(columna)) {
      throw new Error("El id del producto o la columna ingresada no existen");
    }

    // Hacemos la consulta de actualización con valores parametrizados para evitar inyecciones SQL
    const resultado = await client.query(
      `UPDATE productos SET ${columna} = $1 WHERE id = $2 RETURNING *`,
      [nuevoValor, idProducto]
    );

    // Mostramos el resultado en consola:
    console.log(
      `Actualizaste el campo ${columna} del producto con ID: ${idProducto}.`
    );
    console.table(resultado.rows);

    return resultado.rows;
  } catch (error) {
    console.error("Error al consultar la base de datos:", error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
}

// CONSULTA DELETE: eliminar un registro por id

async function eliminarProductoPorId(idProducto) {
  // Validamos que se ingrese un id numérico
  if (!idProducto || typeof idProducto !== "number") {
    throw new Error("Debes ingresar un id numérico válido.");
  }
  let client;
  try {
    client = await pool.connect();

    // Validamos que el id exista
    const selectId = await client.query(
      "SELECT * FROM productos WHERE id = $1",
      [idProducto]
    );
    if (selectId.rowCount === 0) {
      throw new Error("El id del producto ingresado no existe.");
    }

    // Realizamos la consulta de eliminación, usando valores parametrizados para evitar inyecciones SQL
    const resultado = await client.query(
      "DELETE FROM productos WHERE id = $1 RETURNING *",
      [idProducto]
    );

    // Mostramos un mensaje de confirmación en consola:
    console.log(
      "Eliminaste el siguiente registro de tu tabla productos con éxito:"
    );
    console.table(resultado.rows);

    return resultado.rows;
  } catch (error) {
    console.error("Error al consultar la base de datos:", error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
}

module.exports = {
  obtenerProductos,
  productosPorCategoria,
  nuevoProducto,
  actualizarProducto,
  eliminarProductoPorId,
};
