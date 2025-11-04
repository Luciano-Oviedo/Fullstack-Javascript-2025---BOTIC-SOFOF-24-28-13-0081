const { Usuario, Pedido } = require("../models/index");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

// Sincronización con la base de datos
async function sincronizarDB() {
  try {
    await sequelize.authenticate();
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
    console.log("Conexión con la base de datos finalizada");
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 1. CREAR USUARIO
async function crearUsuario(nombre, email, contrasena) {
  try {
    // Validamos que el usuario no exista ya, a través de su email
    const usuarioExistente = await Usuario.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (usuarioExistente) {
      throw new Error(
        "Ya existe un usuario con este correo en la base de datos"
      );
    }

    // Creamos al nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email: email.trim().toLowerCase(),
      contrasena,
    });

    // Desplegamos el resultado en consola
    console.log("Nuevo usuario creado:");
    console.table([
      {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    ]);

    // Retornamos el resultado para usar en la ruta
    return {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 2. CREAR PEDIDO
async function crearPedido(usuario_id, producto, cantidad, fecha_pedido) {
  try {
    // Validamos que exista un usuario con el ID ingresado para asignarle un pedido
    const usuarioExistente = await Usuario.findOne({
      where: { id: usuario_id },
    });
    if (!usuarioExistente) {
      throw new Error(
        "No existe un usuario con el ID ingresado en la base de datos"
      );
    }

    // Validamos que el formato de la fecha sea correcto
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_pedido)) {
      throw new Error(
        "El formato de la fecha es inválido. Debe ser AAAA-MM-DD"
      );
    }

    // Creamos el nuevo pedido
    const nuevoPedido = await Pedido.create({
      usuario_id,
      producto,
      cantidad,
      fecha_pedido,
    });

    // Buscamos el pedido recién creado con su usuario asociado
    const mostrarPedido = await Pedido.findOne({
      where: { id: nuevoPedido.id },
      include: {
        model: Usuario,
        as: "usuario",
        attributes: ["nombre", "email"],
      },
      raw: true,
    });

    // Desplegamos el resultado en consola
    console.log("Nuevo pedido creado:");
    console.table([
      {
        id: mostrarPedido.id,
        producto: mostrarPedido.producto,
        cantidad: mostrarPedido.cantidad,
        fecha_pedido: mostrarPedido.fecha_pedido,
        usuario: mostrarPedido["usuario.nombre"],
        email: mostrarPedido["usuario.email"],
      },
    ]);

    // Retornamos el resultado para usar en la ruta
    return {
      id: mostrarPedido.id,
      producto: mostrarPedido.producto,
      cantidad: mostrarPedido.cantidad,
      fecha_pedido: mostrarPedido.fecha_pedido,
      usuario: {
        nombre: mostrarPedido["usuario.nombre"],
        email: mostrarPedido["usuario.email"],
      },
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 3. OBTENER TODOS LOS USUARIOS
async function obtenerUsuarios() {
  try {
    // Hacemos la búsqueda con findAll()
    const usuarios = await Usuario.findAll({ order: [["id", "ASC"]] });

    // Validamos que existan usuarios para mostrar
    if (usuarios.length === 0) {
      throw new Error("Aún no has agregado usuarios a tu base de datos");
    }

    // Mostramos los usuarios en consola
    console.log("Mostrando todos los usuarios:");
    console.table(
      usuarios.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
      }))
    );

    // Retornamos el resultado para usar en la ruta
    return usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
    }));
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 4. OBTENER TODOS LOS PEDIDOS DE UN USUARIO ESPECIFICO
async function obtenerPedidosDeUsuario(usuario_id) {
  try {
    // Validamos que exista un usuario con el ID ingresado para mostrar sus pedidos
    const usuarioExistente = await Usuario.findOne({
      where: { id: usuario_id },
      attributes: ["nombre", "email"],
    });
    if (!usuarioExistente) {
      throw new Error(
        "No existe un usuario con el ID ingresado en la base de datos"
      );
    }

    // Buscamos los pedidos del usuario
    const pedidos = await Pedido.findAll({
      where: { usuario_id },
      attributes: ["id", "producto", "cantidad", "fecha_pedido"],
      order: [["id", "ASC"]],
    });

    // Si no hay pedidos
    if (pedidos.length === 0) {
      console.log(
        `El usuario ${usuarioExistente.nombre} (ID ${usuario_id}) no tiene pedidos registrados`
      );
      return {
        usuario: {
          nombre: usuarioExistente.nombre,
          email: usuarioExistente.email,
        },
        pedidos: [],
      };
    }

    // Mostramos pedidos en consola
    console.log(
      `Pedidos del usuario "${usuarioExistente.nombre}" (ID ${usuario_id}):`
    );
    console.table(
      pedidos.map((p) => ({
        id: p.id,
        producto: p.producto,
        cantidad: p.cantidad,
        fecha_pedido: p.fecha_pedido,
      }))
    );

    // Retornamos el resultado para usar en la ruta
    return {
      usuario: {
        nombre: usuarioExistente.nombre,
        email: usuarioExistente.email,
      },
      pedidos: pedidos.map((p) => ({
        id: p.id,
        producto: p.producto,
        cantidad: p.cantidad,
        fecha_pedido: p.fecha_pedido,
      })),
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 5. ACTUALIZAR UN USUARIO
async function actualizarUsuario(id, nuevoNombre, nuevoEmail, nuevaContrasena) {
  try {
    // Validamos que exista un usuario con el id ingresado
    const usuarioExistente = await Usuario.findOne({
      where: { id },
    });
    if (!usuarioExistente) {
      throw new Error(
        "No existe un usuario con el ID ingresado en la base de datos"
      );
    }

    // Validamos que no se utilice un email ocupado por otro usuario
    const emailExistente = await Usuario.findOne({
      where: {
        email: nuevoEmail.trim().toLowerCase(),
        id: { [Op.ne]: id }, // ignora el mismo usuario en la validación
      },
    });
    if (emailExistente) {
      throw new Error(
        "Ya existe un usuario con este correo en la base de datos"
      );
    }

    // Acualizamos los datos del usuario
    await Usuario.update(
      {
        nombre: nuevoNombre.trim(),
        email: nuevoEmail.trim().toLowerCase(),
        contrasena: nuevaContrasena,
      },
      { where: { id } }
    );

    // Mostramos el usuario actualizado en consola
    const usuarioActualizado = await Usuario.findByPk(id);
    console.log("Usuario actualizado:");
    console.table([
      {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
      },
    ]);

    // Retornamos el resultado para usar en la ruta
    return {
      id: usuarioActualizado.id,
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// 6. ELIMINAR UN USUARIO
async function eliminarUsuario(id) {
  try {
    // Validamos que exista un usuario con el ID ingresado y lo eliminamos
    const usuarioEliminado = await Usuario.destroy({
      where: { id },
    });
    if (!usuarioEliminado) {
      throw new Error(
        "No existe un usuario con el ID ingresado en la base de datos"
      );
    }

    // Mostramos un mensaje de confirmación en consola
    console.log(`Usuario con ID ${id} eliminado exitosamente`);

    //Retornamos un objeto JSON con un mensaje de confirmación
    return { mensaje: `Usuario con ID ${id} eliminado correctamente` };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

module.exports = {
  sincronizarDB,
  cerrarConexionDB,
  crearUsuario,
  crearPedido,
  obtenerUsuarios,
  obtenerPedidosDeUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
