const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Rol = sequelize.define("Rol", {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Rol;
