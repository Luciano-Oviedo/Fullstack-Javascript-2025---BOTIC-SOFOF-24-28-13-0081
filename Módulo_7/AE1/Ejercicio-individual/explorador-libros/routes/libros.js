const pool = require("../db/pool");

// Función para consultar todos los libros de nuestra DB
const obtenerLibros = async () => {
  const libros = await pool.query("select * from libros");
  return libros.rows;
};

module.exports = obtenerLibros;
