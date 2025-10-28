const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Empleado = sequelize.define("Empleado", {
  id_empleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
});

module.exports = Empleado;
