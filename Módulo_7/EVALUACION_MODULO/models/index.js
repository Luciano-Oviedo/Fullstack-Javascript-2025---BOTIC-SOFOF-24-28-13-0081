const Usuario = require("./usuario");
const Rol = require("./rol");

// RELACION 1:N USUARIO-ROLES
Usuario.belongsTo(Rol, {
  as: "rol",
  foreignKey: "id_rol",
  targetKey: "id_rol",
  onDelete: "CASCADE",
});
Rol.hasMany(Usuario, {
  as: "usuarios",
  foreignKey: "id_rol",
});

module.exports = {
  Usuario,
  Rol,
};
