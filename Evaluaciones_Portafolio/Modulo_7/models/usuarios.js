const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      // Validamos ingreso de datos
      notEmpty: {
        msg: "Debes ingresar un valor para el nombre",
      },
      // Validamos tipo de dato
      isString(value) {
        if (typeof value !== "string") {
          throw new Error("El valor debe ser una cadena de texto");
        }
      },
    },
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      // Validamos ingreso de datos
      notEmpty: {
        msg: "Debes ingresar un valor para el correo electrónico",
      },
      // Validamos formato del correo
      isEmail: {
        msg: "El valor ingresado no tiene un formato válido para correo electrónico",
      },
    },
  },
  contrasena: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // Validamos ingreso de datos
      notEmpty: {
        msg: "Debes ingresar un valor para la contraseña",
      },
      // Validamos tipo de datos
      isString(value) {
        if (typeof value !== "string") {
          throw new Error("El valor debe ser una cadena de texto");
        }
      },
      // Validamos la extensión de la contraseña
      len: {
        args: [8, 100],
        msg: "La contraseña debe tener al menos 8 caracteres",
      },
      // Validamos formato de la contraseña
      is: {
        args: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).+$/,
        msg: "La contraseña debe contener al menos una letra, un número y un carácter especial",
      },
    },
  },
});

module.exports = Usuario;
