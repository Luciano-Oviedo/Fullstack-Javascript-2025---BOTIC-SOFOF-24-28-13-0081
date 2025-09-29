import fs from 'fs';

// Función sincrónica para leer archivos
const leerArchivo = (ruta) => {
  const contenido = fs.readFileSync(ruta, 'utf-8');
  return JSON.parse(contenido);
};

// Función sincrónica para escribir archivos
const escribirArchivo = (ruta, datos) => {
  fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
};

// Función sincrónica para agregar archivos
const agregarArchivo = (ruta, nuevoArchivo) => {
    const datos = leerArchivo(ruta);

  datos.push(nuevoArchivo);

  escribirArchivo(ruta, datos);

  return nuevoArchivo;
};

// Función sincrónica para modificar archivos
const modificarArchivoPorId = (ruta, id, datosActualizados) => {
 let datos = leerArchivo(ruta);
 const archivo = datos.find(archivo => archivo.id === id);
 if (!archivo) {
    console.error("no se encontró un archivo con ese ID");
 } else {
    const claves = Object.keys(datosActualizados);
    claves.forEach(
        clave => {
            archivo[clave] = datosActualizados[clave];
        }
    )
    escribirArchivo(ruta, datos);
    return archivo;
    }};

// Función sincrónica para eliminar archivos
const eliminarArchivoPorId = (ruta, id) => {
  let datos = leerArchivo(ruta);
  let eliminado;

  const datosFiltrados = datos.filter(archivo => archivo.id !== id);

  if (datos.length === datosFiltrados.length) {
    eliminado = false;
  } else {
      escribirArchivo(ruta, datosFiltrados);
      eliminado = true;
  }
     return eliminado;
};

export {leerArchivo, escribirArchivo, agregarArchivo, modificarArchivoPorId, eliminarArchivoPorId};