const express = require("express");
const {
  crearUsuario,
  crearPedido,
  obtenerUsuarios,
  obtenerPedidosDeUsuario,
  actualizarUsuario,
  eliminarUsuario,
  sincronizarDB,
  cerrarConexionDB,
} = require("./controllers/operaciones-CRUD");

// CONFIGURACION DEL SERVIDOR
const app = express();
const PORT = 3000;

// MIDDLEWARES PARA PARSEAR DATOS

// 1. Middleware para parsear formularios HTML
app.use(express.urlencoded({ extended: true }));

// 2. Middleware para parsear JSON
app.use(express.json());

// RUTAS

// 1. Crear usuario
app.post("/usuarios", async (req, res, next) => {
  try {
    const { nombre, email, contrasena } = req.body;
    const resultado = await crearUsuario(nombre, email, contrasena);
    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      usuario: resultado,
    });
  } catch (error) {
    next(error);
  }
});

// 2. Crear pedido
app.post("/pedidos", async (req, res, next) => {
  try {
    const { usuario_id, producto, cantidad, fecha_pedido } = req.body;
    const resultado = await crearPedido(
      usuario_id,
      producto,
      cantidad,
      fecha_pedido
    );
    res.status(201).json({
      mensaje: "Pedido creado exitosamente",
      pedido: resultado,
    });
  } catch (error) {
    next(error);
  }
});

// 3. Obtener usuarios
app.get("/usuarios", async (req, res, next) => {
  try {
    const resultado = await obtenerUsuarios();
    res.status(200).json({
      mensaje: "Lista de usuarios",
      usuarios: resultado,
    });
  } catch (error) {
    next(error);
  }
});

// 4. Obtener pedidos de un usuario
app.get("/usuarios/:id/pedidos", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const resultado = await obtenerPedidosDeUsuario(id);
    res.status(200).json({
      mensaje: "Pedidos del usuario obtenidos correctamente",
      pedidos: resultado,
    });
  } catch (error) {
    next(error);
  }
});

// 5. Actualizar usuario
app.put("/usuarios/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nuevoNombre, nuevoEmail, nuevaContrasena } = req.body;
    const resultado = await actualizarUsuario(
      id,
      nuevoNombre,
      nuevoEmail,
      nuevaContrasena
    );
    res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: resultado,
    });
  } catch (error) {
    next(error);
  }
});

// 6. Eliminar usuario
app.delete("/usuarios/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const resultado = await eliminarUsuario(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
});

// MIDDLEWARE PARA RUTAS INEXISTENTES
app.use((req, res, next) => {
  res.status(404).json({ error: "Error 404: la ruta ingresada no existe" });
});

// MIDDLEWARE GLOBAL DE ERRORES
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  // Error de validación Sequelize
  if (err.name === "SequelizeValidationError") {
    const mensajes = err.errors.map((e) => e.message);
    return res.status(400).json({ errores: mensajes });
  }

  // Errores de registros inexistentes
  const mensajes404 = [
    "no existe",
    "aún no has agregado",
    "no tiene pedidos registrados",
  ];

  const mensajeError = err.message.toLowerCase();

  if (mensajes404.some((frase) => mensajeError.includes(frase))) {
    return res.status(404).json({ error: err.message });
  }

  // Error por registros duplicados o parámetros mal ingresados
  if (
    mensajeError.includes("ya existe") ||
    mensajeError.includes("el formato de la fecha es inválido")
  ) {
    return res.status(409).json({ error: err.message });
  }
  // Error genérico
  res.status(500).json({ error: "Error interno del servidor" });
});

// INICIALIZACION DEL SERVIDOR Y SINCRONIZACION DE BASE DE DATOS
app.listen(PORT, async () => {
  await sincronizarDB();
  console.log(`Servidor corriendo en  http://localhost:${PORT}`);
});

// CIERRE DEL SERVIDOR Y DE CONEXION CON BASE DE DATOS
process.on("SIGINT", async () => {
  console.log("Cerrando conexión a la base de datos...");
  await cerrarConexionDB();
  process.exit(0);
});
