const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Pedido = sequelize.define("Pedido", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      // Validamos que se ingrese un número entero
      isInt: {
        msg: "El campo 'usuario_id' debe ser un número entero válido",
      },
      // Validamos que se ingrese un número positivo
      min: {
        args: [1],
        msg: "El número ingresado para 'usuario_id' debe ser mayor que cero",
      },
    },
  },
  producto: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      // Validamos ingreso de datos
      notEmpty: {
        msg: "Debes ingresar un valor para el campo producto",
      },
      // Validamos tipo de dato
      isString(value) {
        if (typeof value !== "string") {
          throw new Error(
            "El valor de 'producto' debe ser una cadena de texto"
          );
        }
      },
    },
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      // Validamos que se ingrese un número entero
      isInt: {
        msg: "El campo 'cantidad' debe ser un número entero válido",
      },
      // Validamos que se ingrese una cantidad positiva
      min: {
        args: [1],
        msg: "La cantidad ingresada debe ser mayor que cero",
      },
    },
  },
  fecha_pedido: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      // Validamos que se ingrese un valor
      notEmpty: {
        msg: "Debes ingresar un valor para la fecha del pedido",
      },
      // Validamos el formato de la fecha
      isDate: {
        msg: "Debes ingresar una fecha en formato YYYY-MM-DD",
      },
    },
  },
});

module.exports = Pedido;
