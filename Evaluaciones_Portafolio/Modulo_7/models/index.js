const Usuario = require("./usuarios");
const Pedido = require("./pedidos");

// Relación 1:N Pedidos-Usuarios
Usuario.hasMany(Pedido, { as: "pedidos", foreignKey: "usuario_id" });
Pedido.belongsTo(Usuario, {
  as: "usuario",
  foreignKey: "usuario_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

module.exports = { Usuario, Pedido };
