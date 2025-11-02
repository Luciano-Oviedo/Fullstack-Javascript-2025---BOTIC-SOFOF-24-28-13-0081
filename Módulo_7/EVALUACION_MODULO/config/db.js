const { Sequelize } = require("sequelize");
require("dotenv").config({ path: __dirname + "/../.env" });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    define: {
      timestamps: false,
    },
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error.message);
  }
}

testConnection();

module.exports = sequelize;
