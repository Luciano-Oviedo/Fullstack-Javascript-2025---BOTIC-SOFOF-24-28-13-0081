// CONFIGURACION DEL SERVIDOR

import express from "express";
import {
  leerArchivo,
  escribirArchivo,
  agregarArchivo,
  modificarArchivoPorId,
  eliminarArchivoPorId,
} from "./fileUtils.js";
const app = express();
app.use(express.json());
const port = 8000;

// RUTAS

// 1. Obtener todas las tareas
app.get("/tasks", (req, res) => {
  // Leemos directamente el archivo JSON y enviamos su contenido como respuesta
  res.json(leerArchivo("tasks.json"));
});

// 2. Crear una tarea
app.post("/tasks", (req, res) => {
  // El cliente envía la nueva tarea en el cuerpo de la petición
  const nuevaTarea = req.body;

  // Validamos que tenga todas las propiedades requeridas
  if (
    !nuevaTarea.id ||
    !nuevaTarea.titulo ||
    typeof nuevaTarea.completada !== "boolean"
  ) {
    res.status(400).json({ error: "Datos incompletos" });
  } else {
    // Guardamos la tarea en el archivo y la devolvemos en la respuesta
    const tareaCreada = agregarArchivo("tasks.json", nuevaTarea);
    res.json({ mensaje: "Has agregado una nueva tarea", tarea: tareaCreada });
  }
});

// 3. Modificar una tarea
app.put("/tasks/:id", (req, res) => {
  // Tomamos el ID de la URL y los datos actualizados del cuerpo de la petición
  const idTarea = req.params.id;
  const tarea = req.body;

  // Validamos que no se esté ingresando un nueva ID en el cuerpo de la petición
  if (req.body.id) {
    res.status(400).json({ error: "No se puede modificar el ID" });
  } else {
    // Validamos solo las propiedades enviadas ("titulo", "completada" o ambas)
    if (tarea.titulo !== undefined) {
      if (typeof tarea.titulo !== "string") {
        res.status(400).json({ error: "Datos inválidos" });
        return;
      }
    }
    if (tarea.completada !== undefined) {
      if (typeof tarea.completada !== "boolean") {
        res.status(400).json({ error: "Datos inválidos" });
        return;
      }
    }

    // Actualizamos en el archivo
    const tareaModificada = modificarArchivoPorId("tasks.json", idTarea, tarea);

    // Respondemos según si el ID existía o no
    if (!tareaModificada) {
      res.status(404).json({ error: "Tarea no encontrada" });
      return;
    } else {
      res.json({ mensaje: "Tarea actualizada", tarea: tareaModificada });
    }
  }
});

// 4. Eliminar una tarea
app.delete("/tasks/:id", (req, res) => {
  // Tomamos el ID desde la URL y eliminamos la tarea correspondiente
  const idTarea = req.params.id;
  const tareaEliminada = eliminarArchivoPorId("tasks.json", idTarea);

  // Respondemos según si se eliminó o no
  if (tareaEliminada === false) {
    res.status(404).json({ error: "Tarea no encontrada" });
  } else {
    res.json({ mensaje: "Tarea eliminada" });
  }
});

// INICIALIZACION DEL SERVIDOR
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
