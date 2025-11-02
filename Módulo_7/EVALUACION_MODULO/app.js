const express = require("express");
const {
  crearUsuario,
  crearRol,
  obtenerUsuarios,
  obtenerUsuario,
  obtenerRoles,
  obtenerRol,
  actualizarUsuario,
  actualizarRol,
  eliminarUsuario,
  eliminarRol,
  sincronizarDB,
  cerrarConexionDB,
} = require("./controllers/operaciones-CRUD");

// CONFIGURACION DEL SERVIDOR
const app = express();
const PORT = 4020;

// MIDDLEWARES

// 1. Middleware para parsear formularios HTML
app.use(express.urlencoded({ extended: true }));

// 2. Middleware para parsear JSON
app.use(express.json());

// RUTAS

// 1. Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await obtenerUsuarios();
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener usuario por ID
app.get("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const resultado = await obtenerUsuario(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. Obtener todos los roles
app.get("/roles", async (req, res) => {
  try {
    const resultado = await obtenerRoles();
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. Obtener rol por ID
app.get("/roles/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const resultado = await obtenerRol(id);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 5. Crear usuario
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, correo, contrasena, id_rol } = req.body;
    const resultado = await crearUsuario(nombre, correo, contrasena, id_rol);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 6. Crear rol
app.post("/roles", async (req, res) => {
  try {
    const { nombre } = req.body;
    const resultado = await crearRol(nombre);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 7. Actualizar usuario
app.patch("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nuevoNombre, nuevoCorreo, nuevaContrasena } = req.body;
    const resultado = await actualizarUsuario(
      id,
      nuevoNombre,
      nuevoCorreo,
      nuevaContrasena
    );
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 8. Actualizar rol
app.patch("/roles/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nuevoNombre } = req.body;
    const resultado = await actualizarRol(id, nuevoNombre);
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 9. Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await eliminarUsuario(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 10. Eliminar rol
app.delete("/roles/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await eliminarRol(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

//MIDDLEWARES PARA RUTAS INEXISTENTES (ERROR 404)
app.use((req, res, next) => {
  res.status(404).send("Error 404: la ruta ingresada no existe");
});

// INICIALIZACION DEL SERVIDOR Y SINCRONIZACION DB
app.listen(PORT, async () => {
  await sincronizarDB();
  console.log(`Servidor corriendo en  http://localhost:${PORT}`);
});

// CIERRE DEL SERVIDOR Y DE CONEXION CON DB
process.on("SIGINT", async () => {
  console.log("Cerrando conexión a la base de datos...");
  await cerrarConexionDB();
  process.exit(0);
});
