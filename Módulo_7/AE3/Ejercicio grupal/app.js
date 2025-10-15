const express = require("express");
const consultas = require("./consultas_db");

const app = express();
const port = 3050;

// Middleware para parsear JSON
app.use(express.json());

// RUTA PARA OBTENER TODAS LAS PELICULAS
app.get("/items", async (req, res) => {
  try {
    const peliculas = await consultas.obtenerPeliculas();
    res.status(200).json(peliculas);
  } catch (err) {
    res
      .status(500)
      .json({ errorCode: err.code || "SIN_CODIGO", mensaje: err.message });
  }
});

// RUTA PARA INSERTAR UNA NUEVA PELICULA
app.post("/items", async (req, res) => {
  try {
    // Capturamos los argumentos ingresados por el usuario
    const { nombre, sinopsis, precio_boleto, disponible } = req.body;

    // Hacemos la consulta con los argumentos capturados
    const consulta = await consultas.insertarPelicula(
      nombre,
      sinopsis,
      precio_boleto,
      disponible
    );

    // Devolvemos el resultado de la consulta al cliente
    res.status(201).json(consulta);
  } catch (err) {
    console.error(`Error (${err.code || "SIN_CODIGO"}): ${err.message}`);
    res
      .status(500)
      .json({ errorCode: err.code || "SIN_CODIGO", mensaje: err.message });
  }
});

// RUTA PARA ACTUALIZAR UNA PELICULA
app.put("/items/:id", async (req, res) => {
  try {
    // Capturamos el id de la película desde la ruta
    const id = Number(req.params.id);
    // Capturamos el campo a actualizar y el nuevo valor ingresados por el usuario
    const { campo, nuevoValor } = req.body;

    // Hacemos la consulta con los argumentos capturados
    const consulta = await consultas.actualizarPelicula(id, campo, nuevoValor);

    // Devolvemos el resultado de la consulta al cliente
    if (consulta) {
      res.status(200).json({
        mensaje: "Película actualizada correctamente",
        datos: consulta,
      });
    } else {
      res.status(404).json({
        errorCode: "NO_EXISTE",
        mensaje: "No se encontró la película con ese id",
      });
    }
  } catch (err) {
    console.error(`Error (${err.code || "SIN_CODIGO"}): ${err.message}`);
    res
      .status(500)
      .json({ errorCode: err.code || "SIN_CODIGO", mensaje: err.message });
  }
});

// RUTA PARA ELIMINAR UNA PELICULA
app.delete("/items/:id", async (req, res) => {
  try {
    // Capturamos el id de la película desde la ruta
    const id = Number(req.params.id);

    // Hacemos la consulta con los argumentos capturados
    const consulta = await consultas.eliminarPelicula(id);

    // Devolvemos el resultado de la consulta al cliente
    if (consulta) {
      res
        .status(200)
        .json({ mensaje: "Película eliminada correctamente", datos: consulta });
    } else {
      res.status(404).json({
        errorCode: "NO_EXISTE",
        mensaje: "No se encontró la película con ese id",
      });
    }
  } catch (err) {
    console.error(`Error (${err.code || "SIN_CODIGO"}): ${err.message}`);
    res
      .status(500)
      .json({ errorCode: err.code || "SIN_CODIGO", mensaje: err.message });
  }
});

// INICIALIZACION DEL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor corriendo en  http://localhost:${port}/items`);
});
