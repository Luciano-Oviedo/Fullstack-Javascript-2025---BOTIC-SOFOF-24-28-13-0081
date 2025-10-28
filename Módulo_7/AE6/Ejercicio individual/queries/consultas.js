const { Proyecto, Tarea, Empleado } = require("../models");

// 1. CREAR UN PROYECTO
async function crearProyecto(nombre, descripcion, fecha_inicio, fecha_fin) {
  try {
    // Validamos ingreso y tipos de datos
    if (
      typeof nombre !== "string" ||
      typeof descripcion !== "string" ||
      typeof fecha_inicio !== "string" ||
      typeof fecha_fin !== "string" ||
      nombre.trim() === "" ||
      descripcion.trim() === "" ||
      fecha_inicio.trim() === "" ||
      fecha_fin.trim() === ""
    ) {
      throw new Error(
        "Debes ingresar los datos del proyecto como una cadena de texto válida."
      );
    }
    // Validamos que las fechas vengan en formato YYYY-MM-DD, que es el formato esperado por DataTypes.DATEONLY de Sequelize
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha_inicio) || !regexFecha.test(fecha_fin)) {
      throw new Error("Debes ingresar las fechas con formato YYYY-MM-DD.");
    }
    // Validamos que el proyecto no exista aún
    const proyectoExistente = await Proyecto.findOne({
      where: { nombre: nombre },
    });
    if (proyectoExistente) {
      throw new Error(
        "Ya existe un proyecto con este nombre en la base de datos."
      );
    }
    // Creación del nuevo proyecto con los parámetros ingresados como valores de cada atributo
    const proyecto = await Proyecto.create({
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
    });
    // Despliegue del resultado en consola
    console.log("Nuevo proyecto creado:");
    console.table([proyecto.toJSON()]);
    // Retornamos resultado para usar en otras funciones
    return proyecto;
  } catch (error) {
    console.error("Error al crear proyecto:", error.message);
    throw error;
  }
}

// 2. CREAR UNA TAREA
async function crearTarea(
  titulo,
  descripcion,
  estado = "pendiente",
  fecha_vencimiento,
  id_proyecto
) {
  try {
    // Validamos ingreso y tipos de datos
    if (
      typeof titulo !== "string" ||
      typeof descripcion !== "string" ||
      typeof fecha_vencimiento !== "string" ||
      typeof id_proyecto !== "number" ||
      titulo.trim() === "" ||
      descripcion.trim() === "" ||
      fecha_vencimiento.trim() === "" ||
      !Number.isInteger(id_proyecto)
    ) {
      throw new Error(
        "Debes ingresar los datos de la tarea como una cadena de texto válida y el ID del proyecto como un número entero."
      );
    }
    // Validamos que 'estado' sea una de las tres opciones aceptadas por el modelo Tarea
    if (
      estado !== "pendiente" &&
      estado !== "en progreso" &&
      estado !== "completada"
    ) {
      throw new Error(
        'El estado debe ser "pendiente", "en progreso" o "completada".'
      );
    }
    // Validamos que las fechas vengan en formato YYYY-MM-DD, que es el formato esperado por DataTypes.DATEONLY de Sequelize
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha_vencimiento)) {
      throw new Error("Debes ingresar las fechas con formato YYYY-MM-DD.");
    }
    // Validamos que la tarea no exista aún
    const tareaExistente = await Tarea.findOne({
      where: { titulo: titulo },
    });
    if (tareaExistente) {
      throw new Error(
        "Ya existe una tarea con este título en la base de datos."
      );
    }
    // Validamos que exista un proyecto con el ID ingresado
    const proyecto = await Proyecto.findByPk(id_proyecto);
    if (!proyecto) {
      throw new Error("No existe un proyecto con el ID indicado.");
    }
    // Creación de la nueva tarea con los parámetros ingresados como valores de cada atributo
    const tarea = await Tarea.create({
      titulo,
      descripcion,
      estado,
      fecha_vencimiento,
    });
    //Asignación de tarea a proyecto
    await tarea.setProyecto(proyecto);
    // Despliegue del resultado en consola
    console.log("Nueva tarea creada:");
    console.table([tarea.toJSON()]);
    // Retornamos resultado para usar en otras funciones
    return tarea;
  } catch (error) {
    console.error("Error al crear tarea:", error.message);
    throw error;
  }
}

// 3. CREAR UN EMPLEADO
async function crearEmpleado(nombre, email) {
  try {
    // Validamos ingreso, tipo y formato de datos
    if (typeof nombre !== "string" || nombre.trim() === "") {
      throw new Error(
        "Debes ingresar el nombre del empleado como una cadena de texto válida."
      );
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      throw new Error("El email no tiene un formato válido");
    }
    // Validamos que el empleado no exista aún
    const empleadoExistente = await Empleado.findOne({
      where: { email: email },
    });
    if (empleadoExistente) {
      throw new Error(
        "Ya existe un empleado con este email en la base de datos."
      );
    }
    // Creación del nuevo empleado con los parámetros ingresados como valores de cada atributo
    const empleado = await Empleado.create({
      nombre,
      email,
    });
    // Despliegue del resultado en consola
    console.log("Nuevo empleado creado:");
    console.table([empleado.toJSON()]);
    // Retornamos resultado para usar en otras funciones
    return empleado;
  } catch (error) {
    console.error("Error al crear empleado:", error.message);
    throw error;
  }
}

// 4. ASIGNAR UN EMPLEADO A UNA TAREA
async function asignarEmpleadoATarea(id_empleado, id_tarea) {
  try {
    // Validamos ingreso y tipo de datos
    if (
      typeof id_empleado !== "number" ||
      typeof id_tarea !== "number" ||
      !Number.isInteger(id_empleado) ||
      !Number.isInteger(id_tarea)
    ) {
      throw new Error(
        "Debes ingresar números enteros para id_empleado e id_tarea."
      );
    }
    // Validamos que los IDs ingresados existan
    const empleado = await Empleado.findByPk(id_empleado);
    if (!empleado)
      throw new Error(
        "No existe un empleado con el ID ingresado en la base de datos."
      );
    const tarea = await Tarea.findByPk(id_tarea);
    if (!tarea)
      throw new Error(
        "No existe una tarea con el ID ingresado en la base de datos."
      );
    // Creamos la relación empleado-tarea
    const empleadoParaTarea = await empleado.addTarea(tarea);
    // Despliegue del resultado en consola
    console.log(
      `Empleado ${empleado.nombre} asignado a la tarea "${tarea.titulo}".`
    );
    // Retornamos resultado para usar en otras funciones
    return await Empleado.findByPk(id_empleado, {
      include: {
        model: Tarea,
        as: "tarea",
      },
    });
  } catch (error) {
    console.error("Error al asignar un empleado a una tarea:", error.message);
    throw error;
  }
}

// 5. LEER PROYECTOS Y SUS TAREAS
async function verProyectos() {
  try {
    const proyectos = await Proyecto.findAll({
      include: {
        model: Tarea,
        as: "tareas",
      },
    });
    // Validamos que existan proyectos para mostrar
    if (proyectos.length === 0) {
      throw new Error("Aún no has agregado proyectos a tu base de datos.");
    }
    // Mostramos los proyectos en consola
    console.log("Tus proyectos:");
    console.table(
      proyectos.map((p) => ({
        id_proyecto: p.id_proyecto,
        nombre: p.nombre,
        descripcion: p.descripcion,
        fecha_inicio: p.fecha_inicio,
        fecha_fin: p.fecha_fin,
        tareas: p.tareas.map((t) => t.titulo).join(", "),
      }))
    );
    // Retornamos resultado para usar en otras funciones
    return proyectos;
  } catch (error) {
    console.error("Error al obtener los proyectos:", error.message);
    throw error;
  }
}

// 6. ACTUALIZAR ESTADO DE UNA TAREA
async function actualizarEstadoTarea(id_tarea, estado) {
  try {
    // Validamos ingreso y tipo de datos
    if (
      typeof id_tarea !== "number" ||
      typeof estado !== "string" ||
      estado.trim() == "" ||
      !Number.isInteger(id_tarea)
    ) {
      throw new Error(
        "Debes ingresar una cadena de texto válida para estado y un número entero para el id de la tarea."
      );
    }
    // Validamos que 'estado' sea una de las tres opciones aceptadas por el modelo Tarea
    if (
      estado !== "pendiente" &&
      estado !== "en progreso" &&
      estado !== "completada"
    ) {
      throw new Error(
        'El estado debe ser "pendiente", "en progreso" o "completada".'
      );
    }
    // Validamos que exista una tarea con el ID ingresado
    const tarea = await Tarea.findByPk(id_tarea);
    if (!tarea)
      throw new Error(
        "No existe una tarea con el ID ingresado en la base de datos."
      );
    // Actualizamos la tarea con el nuevo estado
    await Tarea.update(
      { estado },
      {
        where: { id_tarea: id_tarea },
      }
    );
    // Mostramos tarea actualizada en consola
    const tareaActualizada = await Tarea.findByPk(id_tarea);
    console.log("Tarea actualizada:");
    console.table([tareaActualizada.toJSON()]);
    // Retornamos resultado para usar en otras funciones
    return tareaActualizada;
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    throw error;
  }
}

// 7. ELIMINAR UN PROYECTO Y SUS TAREAS ASOCIADAS
async function eliminarProyecto(id_proyecto) {
  try {
    // Validamos ingreso y tipo de datos
    if (typeof id_proyecto !== "number" || !Number.isInteger(id_proyecto)) {
      throw new Error(
        "Debes ingresar un número entero para el id del proyecto."
      );
    }
    // Validamos que exista un proyecto con el ID ingresado y lo eliminamos.
    // Las tareas asociadas se eliminan automáticamente porque configuramos la relación Tarea-Proyecto con onDelete: "CASCADE" en el archivo de relaciones models/index.js
    const proyectoEliminado = await Proyecto.destroy({
      where: { id_proyecto: id_proyecto },
    });
    if (!proyectoEliminado) {
      throw new Error(
        "No existe un proyecto con el ID ingresado en la base de datos."
      );
    }
    // Mostramos un mensaje de confirmación en consola
    console.log(
      `Proyecto con ID: ${id_proyecto} y sus tareas asociadas, ha sido eliminado exitósamente.`
    );
    // Retornamos resultado para usar en otras funciones
    return proyectoEliminado;
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    throw error;
  }
}

module.exports = {
  crearProyecto,
  crearTarea,
  crearEmpleado,
  asignarEmpleadoATarea,
  verProyectos,
  actualizarEstadoTarea,
  eliminarProyecto,
};
