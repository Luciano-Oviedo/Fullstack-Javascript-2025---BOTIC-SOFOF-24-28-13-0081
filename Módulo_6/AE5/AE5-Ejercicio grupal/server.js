// CONFIGURACION DEL SERVIDOR
const express = require("express");
const app = express();
const port = 8020;
// Funciones para manipular productos
const {
  readProducts,
  writeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./fileUtils.js");

// MIDLEWARE

app.use(express.json());

// RUTAS

// 1. CREAR UN PRODUCTO
app.post("/products", (req, res) => {
  // El cliente envía las propiedades del nuevo producto en el cuerpo de la petición
  const nuevoProducto = req.body;

  // Validar que el ID no exista ya en el inventario
  const productos = readProducts("products.json");
  if (productos.some((p) => p.id === nuevoProducto.id)) {
    return res.status(400).json({ error: "ID ya existe" });
  }

  // Validamos el igreso de todas las propiedades requeridas
  if (
    nuevoProducto.id === undefined ||
    nuevoProducto.nombre === undefined ||
    nuevoProducto.precio === undefined ||
    nuevoProducto.cantidad === undefined
  ) {
    res.status(400).json({ error: "Datos incompletos" });
  }
  // Validamos los tipos de datos ingresados
  else if (
    typeof nuevoProducto.id !== "number" ||
    typeof nuevoProducto.nombre !== "string" ||
    typeof nuevoProducto.precio !== "number" ||
    typeof nuevoProducto.cantidad !== "number"
  ) {
    res.status(400).json({ error: "tipos de datos inválidos" });
  }
  // Validamos que la cantidad ingresada no sea negativa
  else if (nuevoProducto.cantidad < 0) {
    res.status(400).json({ error: "la cantidad no puede ser negativa" });
  }
  // Validamos que el precio sea mayor a cero
  else if (nuevoProducto.precio <= 0) {
    res.status(400).json({ error: "el precio debe ser mayor a cero" });
  } else {
    // Guardamos el nuevo producto en nuestro archivo json y lo devolvemos en la respuesta de la petición
    const productoCreado = addProduct("products.json", nuevoProducto);
    res.json({
      mensaje: "has agregado un nuevo producto",
      producto: productoCreado,
    });
  }
});

// 2. OBTENER TODOS LOS PRODUCTOS
app.get("/products", (req, res) => {
  // Leemos el archivo products.json y enviamos su contenido como respuesta
  res.json(readProducts("products.json"));
});

// 3. MODIFICAR UN PRODUCTO POR ID
app.put("/products/:id", (req, res) => {
  // Tomamos el ID de la URL y los datos actualizados del cuerpo de la petición
  const idProducto = Number(req.params.id);
  const producto = req.body;

  // Validamos que no se esté ingresando un nuevo ID en el cuerpo de la petición
  if (req.body.id) {
    res.status(400).json({ error: "no se puede modificar el ID" });
  } else {
    // Validamos las propiedades enviadas ("nombre", "precio", "cantidad"  o alguna combinación de éstas)
    if (producto.nombre !== undefined) {
      if (typeof producto.nombre !== "string") {
        res.status(400).json({ error: "datos inválidos" });
        return;
      }
    }
    if (producto.precio !== undefined) {
      if (typeof producto.precio !== "number" || producto.precio <= 0) {
        res
          .status(400)
          .json({ error: "precio debe ser un valor numérico mayor a cero" });
        return;
      }
    }
    if (producto.cantidad !== undefined) {
      if (typeof producto.cantidad !== "number" || producto.cantidad < 0) {
        res
          .status(400)
          .json({ error: "cantidad debe ser un valor numérico positivo" });
        return;
      }
    }

    // Actualizamos el producto
    const productoModificado = updateProduct(
      "products.json",
      idProducto,
      producto
    );

    // Respondemos según si el ID ingresado existe o no
    if (!productoModificado) {
      res.status(404).json({ error: "no se encontró un producto con ese ID" });
      return;
    } else {
      res.json({
        mensaje: "Producto actualizado",
        producto: productoModificado,
      });
    }
  }
});

// 4. ELIMINAR UN PRODUCTO POR ID
app.delete("/products/:id", (req, res) => {
  // Tomamos el ID desde la URL y eliminamos el producto correspondiente
  const idProducto = Number(req.params.id);
  const productoEliminado = deleteProduct("products.json", idProducto);

  // Respondemos según si se eliminó o no
  if (productoEliminado === false) {
    res.status(404).json({ error: "producto no encontrado" });
  } else {
    res.json({ mensaje: "producto eliminado" });
  }
});

// INICIALIZACION DEL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
