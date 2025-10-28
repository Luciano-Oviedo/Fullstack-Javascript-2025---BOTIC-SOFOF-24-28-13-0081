const Proyecto = require("./proyecto");
const Tarea = require("./tarea");
const Empleado = require("./empleado");

// RELACION 1:N TAREA-PROYECTO
// Al usar las opciones 'foreignKey' y 'targetKey' cuando establecemos la relación, sequelize crea automáticamente una clave foránea 'id_proyecto' en el modelo Tarea, que referencia a 'id_proyecto' en el modelo Proyecto
Tarea.belongsTo(Proyecto, {
  as: "proyecto",
  foreignKey: "id_proyecto",
  targetKey: "id_proyecto",
  onDelete: "CASCADE",
});
Proyecto.hasMany(Tarea, { as: "tareas", foreignKey: "id_proyecto" });

// RELACION N:M TAREA-EMPLEADO
// Creamos la tabla intermedia 'TareasEmpleados' automáticamente al definirla en la opción 'through', cuando establecemos las relaciones en sequelize
Tarea.belongsToMany(Empleado, {
  through: "TareasEmpleados",
  as: "empleado",
  foreignKey: "id_tarea",
  otherKey: "id_empleado",
  onDelete: "CASCADE",
});

Empleado.belongsToMany(Tarea, {
  through: "TareasEmpleados",
  as: "tarea",
  foreignKey: "id_empleado",
  otherKey: "id_tarea",
  onDelete: "CASCADE",
});

module.exports = {
  Proyecto,
  Tarea,
  Empleado,
};
