const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Tarea = sequelize.define("Tarea", {
  id_tarea: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "en progreso", "completada"),
    allowNull: false,
    defaultValue: "pendiente",
  },
  fecha_vencimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Tarea;
