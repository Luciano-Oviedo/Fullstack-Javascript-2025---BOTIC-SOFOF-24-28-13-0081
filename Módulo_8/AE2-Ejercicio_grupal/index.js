const express = require("express");
const productosRoutes = require("./routes/productosRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", productosRoutes);

// Manejo de errores para rutas no definidas
app.all("/{*ruta}", (req, res) => {
  const ruta = `http://localhost:${PORT}/${req.params.ruta}`;
  return res.status(404).json({ Error: "Ruta no encontrada" });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
