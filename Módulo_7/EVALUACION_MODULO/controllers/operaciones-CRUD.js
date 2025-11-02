const { Usuario, Rol } = require("../models/index");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

// Sincronización con la base de datos
async function sincronizarDB() {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");
    await sequelize.sync();
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// Cierre de conexión con la base de datos
async function cerrarConexionDB() {
  try {
    await sequelize.close();
    console.log("Conexión cerrada.");
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 1. CREAR USUARIO
async function crearUsuario(nombre, correo, contrasena, id_rol) {
  try {
    // Validamos ingreso y tipos de datos
    if (
      typeof nombre !== "string" ||
      typeof correo !== "string" ||
      typeof contrasena !== "string" ||
      typeof id_rol !== "number" ||
      nombre.trim() === "" ||
      correo.trim() === "" ||
      contrasena.trim() === "" ||
      !Number.isInteger(id_rol)
    ) {
      throw new Error(
        "Debes ingresar nombre, usuario y contrasena como cadenas de texto y id_rol como número entero para continuar."
      );
    }

    // Validamos formato del correo
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(correo)) {
      throw new Error("El correo no tiene un formato válido");
    }

    // Validamos que el usuario no exista aún
    const usuarioExistente = await Usuario.findOne({
      where: { correo: correo.trim().toLowerCase() },
    });
    if (usuarioExistente) {
      throw new Error(
        "Ya existe un usuario con este correo en la base de datos."
      );
    }

    // Validamos que id_rol exista
    const idRol = await Rol.findByPk(id_rol);
    if (!idRol) {
      throw new Error("El rol que quieres asignar no existe.");
    }

    // Creación del nuevo usuario
    await Usuario.create({
      nombre,
      correo,
      contrasena,
      id_rol,
    });

    // Despliegue del resultado en consola
    const nuevoUsuario = await Usuario.findOne({
      where: { correo: correo.trim().toLowerCase() },
      include: {
        model: Rol,
        as: "rol",
        attributes: ["nombre"],
      },
      raw: true,
    });
    console.log("Nuevo usuario creado:");
    console.log(JSON.stringify(nuevoUsuario, null, 2));

    // Retornamos resultado para usar en otras funciones
    return nuevoUsuario;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 2. CREAR ROL
async function crearRol(nombre) {
  try {
    // Validamos ingreso y tipos de datos
    if (typeof nombre !== "string" || nombre.trim() === "") {
      throw new Error("Debes ingresar un nombre como cadena de texto válida.");
    }

    // Validamos que no exista un rol con ese nombre aún
    const rolExistente = await Rol.findOne({
      where: { nombre: nombre.trim().toUpperCase() },
    });
    if (rolExistente) {
      throw new Error("Ya existe un rol creado con ese nombre.");
    }

    // Creamos el nuevo rol
    await Rol.create({ nombre: nombre.trim().toUpperCase() });

    // Despliegue del resultado en consola
    const nuevoRol = await Rol.findOne({
      where: { nombre: nombre.trim().toUpperCase() },
    });
    console.log("Nuevo rol creado:");
    console.table([nuevoRol.toJSON()]);

    // Retornamos resultado para usar en otras funciones
    return nuevoRol.toJSON();
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 3. OBTENER TODOS LOS USUARIOS
async function obtenerUsuarios() {
  try {
    // Hacemos la búsqueda con findAll()
    const usuarios = await Usuario.findAll({
      include: {
        model: Rol,
        as: "rol",
      },
    });

    // Validamos que existan usuarios para mostrar
    if (usuarios.length === 0) {
      throw new Error("Aún no has agregado usuarios a tu base de datos.");
    }

    // Mostramos los usuarios en consola
    console.log("Mostrando todos los usuarios:");
    console.table(
      usuarios.map((u) => ({
        id_usuario: u.id_usuario,
        nombre: u.nombre,
        correo: u.correo,
        rol: u.rol.nombre,
      }))
    );

    // Retornamos resultado para usar en otras funciones
    return usuarios.map((u) => u.toJSON());
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 4. OBTENER UN USUARIO POR ID
async function obtenerUsuario(id_usuario) {
  try {
    // Validamos que se ingrese un número entero como id
    if (typeof id_usuario !== "number" || !Number.isInteger(id_usuario)) {
      throw new Error("Debes ingresar un número entero como ID.");
    }

    // Buscamos al usuario por id y entregamos un mensaje en consola de acuerdo al resultado
    const usuario = await Usuario.findByPk(id_usuario, {
      include: { model: Rol, as: "rol", attributes: ["nombre"] },
    });
    if (!usuario) {
      console.log(
        "No existe un usuario con el ID ingresado en la base de datos."
      );
    } else {
      console.log("Usuario encontrado:");
      console.table([usuario.toJSON()]);

      // Retornamos resultado para usar en otras funciones
      return usuario.toJSON();
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 5. OBTENER TODOS LOS ROLES
async function obtenerRoles() {
  try {
    // Hacemos la búsqueda con findAll()
    const roles = await Rol.findAll();

    // Validamos que existan roles para mostrar
    if (roles.length === 0) {
      throw new Error("Aún no has agregado roles a tu base de datos.");
    }

    // Mostramos los roles en consola
    console.log("Mostrando todos los roles:");
    console.table(roles.map((r) => r.toJSON()));

    // Retornamos resultado para usar en otras funciones
    return roles.map((r) => r.toJSON());
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 6. OBTENER UN ROL POR ID
async function obtenerRol(id_rol) {
  try {
    // Validamos que se ingrese un número entero como id
    if (typeof id_rol !== "number" || !Number.isInteger(id_rol)) {
      throw new Error("Debes ingresar un número entero como ID.");
    }

    // Buscamos el rol por id y entregamos un mensaje en consola de acuerdo al resultado
    const rol = await Rol.findByPk(id_rol);
    if (!rol) {
      console.log("No existe un rol con el ID ingresado en la base de datos.");
    } else {
      console.log("rol encontrado:");
      console.table([rol.toJSON()]);

      // Retornamos resultado para usar en otras funciones
      return rol.toJSON();
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 7. ACTUALIZAR USUARIO
async function actualizarUsuario(
  id_usuario,
  nuevoNombre,
  nuevoCorreo,
  nuevaContrasena
) {
  try {
    // Validamos ingreso y tipo de datos
    if (
      typeof nuevoNombre !== "string" ||
      typeof nuevoCorreo !== "string" ||
      typeof nuevaContrasena !== "string" ||
      nuevoNombre.trim() === "" ||
      nuevoCorreo.trim() === "" ||
      nuevaContrasena.trim() === "" ||
      typeof id_usuario !== "number" ||
      !Number.isInteger(id_usuario)
    ) {
      throw new Error(
        "Debes ingresar nombre, correo y contraseña como cadenas de texto y el id del usuario como número entero."
      );
    }

    // Validamos formato del correo
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(nuevoCorreo)) {
      throw new Error("El correo no tiene un formato válido");
    }

    // Validamos que exista un usuario con el ID ingresado
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario)
      throw new Error(
        "No existe un usuario con el ID ingresado en la base de datos."
      );

    // Validamos que el nuevo correo no esté ocupado
    const correoExistente = await Usuario.findOne({
      where: {
        correo: nuevoCorreo.trim().toLowerCase(),
        id_usuario: { [Op.ne]: id_usuario }, // ignora el mismo usuario en la validación
      },
    });
    if (correoExistente) {
      throw new Error(
        "Ya existe un usuario con este correo en la base de datos."
      );
    }

    // Actualizamos la información del usuario
    await usuario.update({
      nombre: nuevoNombre.trim(),
      correo: nuevoCorreo.trim().toLocaleLowerCase(),
      contrasena: nuevaContrasena,
    });

    // Mostramos el usuario actualizado en consola
    console.log("Usuario actualizado:");
    console.table([usuario.toJSON()]);

    // Retornamos resultado para usar en otras funciones
    return usuario.toJSON();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// 8. ACTUALIZAR ROL
async function actualizarRol(id_rol, nuevoNombre) {
  try {
    // Validamos ingreso y tipo de datos
    if (
      typeof nuevoNombre !== "string" ||
      nuevoNombre.trim() === "" ||
      typeof id_rol !== "number" ||
      !Number.isInteger(id_rol)
    ) {
      throw new Error(
        "Debes ingresar un nombre como cadena de texto y el id del rol como número entero."
      );
    }

    // Validamos que exista un rol con el ID ingresado
    const rol = await Rol.findByPk(id_rol);
    if (!rol)
      throw new Error(
        "No existe un rol con el ID ingresado en la base de datos."
      );

    // Validamos que el nuevo nombre del rol no esté ocupado
    const rolExistente = await Rol.findOne({
      where: {
        nombre: nuevoNombre.trim().toUpperCase(),
        id_rol: { [Op.ne]: id_rol }, // Ignora el mismo rol en la validación
      },
    });
    if (rolExistente) {
      throw new Error("Ya existe un rol con este nombre en la base de datos.");
    }

    // Actualizamos la información del rol
    await rol.update({ nombre: nuevoNombre.trim().toUpperCase() });

    // Mostramos el rol actualizado en consola
    console.log("Rol actualizado:");
    console.table([rol.toJSON()]);

    // Retornamos resultado para usar en otras funciones
    return rol.toJSON();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// 9. ELIMINAR USUARIO
async function eliminarUsuario(id_usuario) {
  try {
    // Validamos ingreso y tipo de datos
    if (typeof id_usuario !== "number" || !Number.isInteger(id_usuario)) {
      throw new Error(
        "Debes ingresar un número entero para el id del usuario a eliminar."
      );
    }

    // Validamos que exista un usuario con el ID ingresado y lo eliminamos.
    const usuarioEliminado = await Usuario.destroy({
      where: { id_usuario },
    });
    if (!usuarioEliminado) {
      throw new Error(
        "No existe un usuario con el ID ingresado en la base de datos."
      );
    }

    // Mostramos un mensaje de confirmación en consola
    console.log(
      `Usuario con ID: ${id_usuario} ha sido eliminado exitosamente.`
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// 10. ELIMINAR ROL
async function eliminarRol(id_rol) {
  try {
    // Validamos ingreso y tipo de datos
    if (typeof id_rol !== "number" || !Number.isInteger(id_rol)) {
      throw new Error(
        "Debes ingresar un número entero para el id del rol a eliminar."
      );
    }

    // Validamos que exista un rol con el ID ingresado y lo eliminamos.
    // Los usuarios asociados se eliminan automáticamente porque configuramos la relación Usuario-Rol con onDelete: "CASCADE" en el archivo de relaciones models/index.js
    const rolEliminado = await Rol.destroy({
      where: { id_rol },
    });
    if (!rolEliminado) {
      throw new Error(
        "No existe un rol con el ID ingresado en la base de datos."
      );
    }

    // Mostramos un mensaje de confirmación en consola
    console.log(
      `Rol con ID: ${id_rol} y sus usuarios asociados, ha sido eliminado exitosamente.`
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = {
  crearUsuario,
  crearRol,
  obtenerUsuarios,
  obtenerUsuario,
  obtenerRoles,
  obtenerRol,
  actualizarUsuario,
  actualizarRol,
  eliminarUsuario,
  eliminarRol,
  sincronizarDB,
  cerrarConexionDB,
};
