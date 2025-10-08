// Configuración del servidor
const express = require("express");
const pool = require("./db/pool");
const obtenerLibros = require("./routes/libros");

const app = express();
const port = 3000;

// Ruta raíz muestra html con los libros
app.get("/", async (req, res) => {
  try {
    const libros = await obtenerLibros();
    let lista = "";
    for (const libro of libros) {
      lista += `
            <li style = "margin-bottom: 20px; font-size: 18px;">ID: ${libro.id}. Título: ${libro.titulo}. Autor: ${libro.autor}. Año: ${libro.anio}.</li>
        `;
    }
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Usuarios</title>
      </head>
      <body>
        <h1>Tus libros</h1>
        <ul>
        ${lista} 
        </ul>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error al cargar tus libros");
  }
});

// Cerrar pool al detener servidor
process.on("SIGINT", async () => {
  await pool.end();
  console.log("Pool cerrado. Servidor detenido.");
  process.exit();
});

// Inicialización de servidor
app.listen(port, () =>
  console.log(`Servidor corriendo en http://localhost:${port}`)
);
