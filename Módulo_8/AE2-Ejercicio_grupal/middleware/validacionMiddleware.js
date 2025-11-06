const validarNombre = (req, res) => {
  const nombre = req.body.nombre;
  if (!nombre || nombre.trim() === "" || typeof nombre !== "string") {
    return res.status(400).json({
      Error: {
        nombre: "error de validación",
        mensaje:
          "Debes ingresar un nombre como cadena de texto válida para continuar",
      },
    });
  }
};

const validarPrecio = (req, res) => {
  const precio = req.body.precio;
  if (isNaN(precio) || typeof precio !== "number") {
    return res.status(400).json({
      Error: {
        nombre: "error de validación",
        mensaje: "Debes ingresar un precio como valor númerico",
      },
    });
  }
  if (precio <= 0) {
    return res.status(400).json({
      Error: {
        nombre: "error de validación",
        mensaje: "Debes ingresar un precio mayor a cero",
      },
    });
  }
};

const validarCantidad = (req, res) => {
  const cantidad = req.body.cantidad;
  if (!Number.isInteger(cantidad) || typeof cantidad !== "number") {
    return res.status(400).json({
      Error: {
        nombre: "error de validación",
        mensaje: "Debes ingresar una cantidad como valor númerico",
      },
    });
  }
  if (cantidad < 0) {
    return res.status(400).json({
      Error: {
        nombre: "error de validación",
        mensaje: "Debes ingresar un cantidad mayor o igual a cero",
      },
    });
  }
};

const validarProductoMdw = (req, res, next) => {
  validarNombre(req, res);
  validarPrecio(req, res);
  validarCantidad(req, res);
  next();
};

module.exports = validarProductoMdw;
