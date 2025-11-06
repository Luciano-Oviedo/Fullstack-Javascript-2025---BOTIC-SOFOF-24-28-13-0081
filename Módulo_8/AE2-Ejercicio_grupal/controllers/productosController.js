const productos = require("../db/productos.json");
const productosController = {
  listarProductos: (req, res) => {
    // Simulamos un error con la base de datos y manejamos error con código de estado 500: Internal server error
    if (productos.length === 0) {
      return res.status(500).json({
        Error:
          "error interno del servidor, no se pudieron obtener los productos",
      });
    }
    // Generamos una respuesta JSON con el resultado de la operación y todos los productos de nuestra base de datos
    return res
      .status(200)
      .json({ Mensaje: "Tu lista de productos", Productos: productos });
  },

  crearProducto: (req, res) => {
    let nuevaID;
    if (productos.length > 0) {
      // Encontrar el ID mas alto en caso que la lista este desordenada.
      const maxID = Math.max(...productos.map((producto) => producto.id));
      // Definir Proximo ID
      nuevaID = maxID + 1;
    } else {
      // Si la lista está vacía, empezar en 1.
      nuevaID = 1;
    }
    // Creamos un nuevo producto con los datos recibidos del cuerpo de la petición
    const nuevoProducto = {
      id: nuevaID,
      ...req.body,
    };
    // Generamos una respuesta JSON con el resultado de la operación y el nuevo producto
    return res
      .status(201)
      .json({ Mensaje: "Nuevo producto creado", Producto: nuevoProducto });
  },

  actualizarProducto: (req, res) => {
    // Extraemos id de la URL
    const { id } = req.params;
    // Validamos que el producto con ese id exista
    const productIndex = productos.findIndex((p) => p.id === parseInt(id));
    // Si no existe devolvemos mensaje de error
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: `Producto con id ${id} no encontrado` });
    }
    // Actualizamos el producto con los datos del cuerpo de la petición
    const productoActualizado = {
      id: id,
      ...req.body,
    };
    // Generamos una respuesta JSON con el resultado de la operación y el producto actualizado
    return res.status(200).json({
      Mensaje: "Actualización exitosa del producto",
      Producto: productoActualizado,
    });
  },

  eliminarProducto: (req, res) => {
    // Extraemos id de la URL
    const { id } = req.params;
    // Validamos que el producto con ese id exista
    const productIndex = productos.findIndex((p) => p.id === parseInt(id));
    // Si no existe devolvemos mensaje de error
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ error: `Producto con id ${id} no encontrado` });
    }
    // Generamos una respuesta JSON con el resultado de la operación
    return res
      .status(200)
      .json({ Mensaje: `Producto con id ${id} eliminado exitosamente` });
  },

  buscarProductoPorNombre: (req, res) => {
    // Extraemos el nombre del query string ingresado por el usuario
    const nombre = req.query.nombre;
    // Validamos que exista un producto con ese nombre
    const producto = productos.find((p) => p.nombre === nombre);
    // Si no existe devolvemos mensaje de error
    if (!producto) {
      return res
        .status(404)
        .json({ error: `Producto con nombre '${nombre}' no encontrado` });
    }
    // Generamos una respuesta JSON con el resultado de la operación y los datos del producto
    return res
      .status(200)
      .json({ Mensaje: "Producto encontrado", Producto: producto });
  },
};

module.exports = productosController;
