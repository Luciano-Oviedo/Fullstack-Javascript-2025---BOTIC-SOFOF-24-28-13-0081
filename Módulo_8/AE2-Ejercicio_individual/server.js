// CONFIGURACION EXPRESS
const express = require("express");
const app = express();
const PORT = 3060;
const fs = require("fs/promises");

// MIDDLEWARE PARA PARSEAR JSON DESDE EL CUERPO DE UNA PETICION
app.use(express.json());

// RUTAS BASICAS CON MENSAJES:

// 1. RUTA GET DE SALUDO
app.get("/saludo", (req, res) => {
  res.status(200).json({
    Saludo:
      "Hola, bienvenido a mi server, toma una silla y siéntate como en casa ;)",
  });
});

// 2. RUTA POST DE CREACION DE USUARIO
app.post("/usuario", (req, res) => {
  res.status(201).json({ Mensaje: "Has creado un nuevo usuario" });
});

// 3. RUTA PUT PARA ACTUALIZACION DE USUARIO, RETORNANDO SU ID
app.put("/usuario/:id", (req, res) => {
  // Extraemos id de la URL usando req.params
  const id = parseInt(req.params.id);

  // Retornamos mensaje en JSON con el id extraido
  res.status(200).json({ Mensaje: `Has actualizado al usuario con id: ${id}` });
});

// 4. RUTA DELETE PARA ELIMINACION DE USUARIO, RETORNANDO SU ID
app.delete("/usuario/:id", (req, res) => {
  // Extraemos id de la URL usando req.params
  const id = parseInt(req.params.id);

  // Retornamos mensaje en JSON con el id extraido
  res.status(200).json({ Mensaje: `Has eliminado al usuario con id: ${id}` });
});

// RUTAS CON PARAMETROS REQ.:

// 1. RUTA DELETE DE ELIMINACION DE USUARIO CON REQ.PARAMS, SIMULANDO UNA CONSULTA A UNA BASE DE DATOS Y POSIBLE ERROR INTERNO DE SERVIDOR (500)
app.delete("/api/usuario/:id", async (req, res) => {
  // Extraemos el id de la URL con req.params
  const id = parseInt(req.params.id);
  try {
    // Leemos la base de datos y parseamos el resultado a objeto JS
    const datos = await fs.readFile("db.json", "utf-8");
    const usuarios = JSON.parse(datos);

    // Validamos que exista un usuario con el id extraido
    const indiceUsuario = usuarios.findIndex((u) => u.id === id);

    if (indiceUsuario === -1)
      return res
        .status(404)
        .json({ error: `Usuario con id ${id} no encontrado` });

    // Eliminamos al usuario
    usuarios.splice(indiceUsuario, 1);

    // Sobrescribimos la base de datos
    await fs.writeFile("db.json", JSON.stringify(usuarios, null, 2));

    // Confirmamos la eliminación
    res.status(200).json({ mensaje: `Has eliminado al usuario con id:${id}` });
  } catch (error) {
    // Código de estado 500 para error interno del servidor
    res.status(500).json({ Error: error.message });
  }
});

// 2. RUTA POST PARA CREAR UN MENSAJE CON LOS VALORES EXTRAIDOS DE REQ.QUERY
app.post("/api/chat", (req, res) => {
  // Extraemos el mensaje de los parámetros enviados por el usuario en formato: /api/chat?mensaje=mensajeDelUsuario
  const mensaje = req.query.mensaje;

  // Devolvemos el mensaje en formato JSON
  res.status(201).json({ TuMensajeCreado: mensaje });
});

// 3. RUTA POST DE CREACION DE USUARIO USANDO REQ.BODY Y CODIGO PERSONALIZADO
app.post("/api/usuario", (req, res) => {
  // Extraemos parámetros del body
  const { nombre, genero, edad } = req.body;

  // Validamos que estén presentes todos los parámetros para el nuevo usuario
  // Si falla la validación usamos código de estado 400 y un mensaje de error personalizado
  if (!nombre || !genero || !edad)
    return res.status(400).json({
      Error:
        "Debes ingresar todos los parámetros necesarios para crear a un usuario",
    });

  // Creamos al nuevo usuario
  const nuevoUsuario = {
    nombre: nombre,
    genero: genero,
    edad: parseInt(edad),
  };

  // Devolvemos el usuario creado en formato JSON
  res.status(201).json({ Mensaje: "nuevo usuario creado", nuevoUsuario });
});

// INICIALIZACION SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
