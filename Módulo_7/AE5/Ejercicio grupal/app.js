const sequelize = require("./db");

const {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} = require("./Controllers/producto.controllers");

async function main() {
  try {
    // Crea tablas según modelos
    await sequelize.sync({ force: true });
    console.log("Tablas creadas correctamente");

    // Ejemplo CRUD
    await crearProducto(
      "Pelota de futbol",
      "pelota blanca con negro, marca Adidas",
      20.0,
      1
    );
    await crearProducto("Palta", "malla de 1kg de oro verde", 6000, 3);
    await obtenerProductos();
    await obtenerProductoPorId(2);
    await actualizarProducto(1, { descripcion: "pelota café de cuero" });
    await eliminarProducto(2);
  } catch (error) {
    console.error("Error en la aplicación:", error.message);
  }
}

main();
