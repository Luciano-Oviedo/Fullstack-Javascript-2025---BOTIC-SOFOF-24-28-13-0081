const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");
const validarProductoMdw = require("../middleware/validacionMiddleware");

router.get("/productos", productosController.listarProductos);
router.post(
  "/productos",
  validarProductoMdw,
  productosController.crearProducto
);
router.put(
  "/productos/:id",
  validarProductoMdw,
  productosController.actualizarProducto
);
router.delete("/productos/:id", productosController.eliminarProducto);
router.get("/productos/query", productosController.buscarProductoPorNombre);

module.exports = router;
