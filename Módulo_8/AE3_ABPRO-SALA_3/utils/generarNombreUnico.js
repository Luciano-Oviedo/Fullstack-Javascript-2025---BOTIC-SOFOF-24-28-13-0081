import path from "path";
import fs from 'fs/promises';
import { ErrorServidor } from "./errors.js";

export async function generarNombreUnico(nombreOriginal,pathDirectorio, sufijo = 0) {
    const ext = path.extname(nombreOriginal); // Obtiene la extensión, ej: '.png'
    const baseName = path.basename(nombreOriginal, ext); // Obtiene el nombre sin extensión, ej: 'imagen'
    
    // Crear la parte del sufijo: si es 0, es cadena vacía; si es > 0, es '-(sufijo)'
    const sufijoStr = sufijo > 0 ? `-${sufijo}` : '';
    
    // Estrategia nombrado: [nombre_base][sufijo].[ext]
    const nombreFinal = `${baseName}${sufijoStr}${ext}`;

    const rutaCompleta = path.join(pathDirectorio, nombreFinal);
    
    try {
        // Verificar si el archivo ya existe en la ruta de subida
        await fs.access(rutaCompleta); 
        
        // Si fs.access NO lanza un error, significa que el archivo EXISTE.
        // Llamar a la función de nuevo con un sufijo incrementado.
        return generarNombreUnico(nombreOriginal, pathDirectorio, sufijo + 1);

    } catch (error) {
        // Si el error es 'ENOENT' (Error No Entry), el archivo NO EXISTE,
        // por lo que este nombreFinal es único y puede usarse.
        if (error.code === 'ENOENT') {
            return nombreFinal;
        }
        
        // Otros errores (permisos, etc.) deben manejarse como errores del servidor
        throw new ErrorServidor(`Error al verificar la existencia del archivo: ${error.message}`);
    }
}