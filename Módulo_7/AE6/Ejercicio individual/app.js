const sequelize = require("./config/db");

const {
  crearProyecto,
  crearTarea,
  crearEmpleado,
  asignarEmpleadoATarea,
  verProyectos,
  actualizarEstadoTarea,
  eliminarProyecto,
} = require("./queries/consultas");

// CONEXION A DB Y PRUEBA CONSULTAS CRUD
async function main() {
  try {
    // COMPROBAMOS LA CONEXION
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");

    // SINCRONIZAMOS NUESTROS MODELOS CON LA BASE DE DATOS
    await sequelize.sync({ force: true });
    console.log("Tablas creadas correctamente.");

    // PROBAMOS CONSULTAS CRUD

    // Crear proyectos
    await crearProyecto(
      "Proyecto Alfa",
      "Desarrollo de la aplicación web interna",
      "2025-11-01",
      "2026-02-28"
    );
    await crearProyecto(
      "Proyecto Beta",
      "Implementación del sistema de inventario",
      "2025-11-15",
      "2026-03-15"
    );

    // Crear tareas
    await crearTarea(
      "Diseñar wireframes",
      "Diseñar la interfaz inicial",
      "pendiente",
      "2025-11-10",
      1
    );
    await crearTarea(
      "Configurar base de datos",
      "Instalar y configurar MySQL",
      "pendiente",
      "2025-11-20",
      1
    );
    await crearTarea(
      "Crear módulo de inventario",
      "Desarrollar CRUD de productos",
      "pendiente",
      "2025-12-05",
      2
    );
    await crearTarea(
      "Realizar pruebas unitarias",
      "Pruebas de todos los módulos",
      "pendiente",
      "2025-12-20",
      2
    );

    // Crear empleados
    await crearEmpleado("Ramiro Tello", "ramiro.tello@test.com");
    await crearEmpleado("Ana Martínez", "ana.martinez@test.com");
    await crearEmpleado("Carlos Pérez", "carlos.perez@test.com");
    await crearEmpleado("María López", "maria.lopez@test.com");
    await crearEmpleado("Jorge Ramírez", "jorge.ramirez@test.com");
    await crearEmpleado("Sofía Torres", "sofia.torres@test.com");

    // Asignar empleados a tareas
    await asignarEmpleadoATarea(1, 1);
    await asignarEmpleadoATarea(2, 3);
    await asignarEmpleadoATarea(3, 2);

    // Actualizar estado de una tarea
    await actualizarEstadoTarea(1, "en progreso");
    await actualizarEstadoTarea(4, "completada");

    // Ver proyectos
    await verProyectos();

    // Eliminar un proyecto
    await eliminarProyecto(1);
  } catch (error) {
    console.error("Error ejecutando una consulta:", error.message);
  } finally {
    await sequelize.close();
    console.log("Conexión cerrada.");
  }
}

main();
