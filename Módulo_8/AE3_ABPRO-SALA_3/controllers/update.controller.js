import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { ErrorServidor } from "../utils/errors.js";
import { generarNombreUnico } from "../utils/generarNombreUnico.js";
import { transformarImagen } from "../utils/transformarImagen.js";

const __filename = fileURLToPath(import.meta.url);

const UPLOAD_DIR_NAME = 'uploads';
const UPLOAD_DIR_PATH = path.join(path.dirname(__filename),'..', UPLOAD_DIR_NAME);

export const subirArchivos = async(req, res) => {
    const archivos = req.archivosArray;

    const promesasMoverArchivo = archivos.map(archivo => {
        return new Promise (async(resolve, reject) => {
            
            // Determinar si es una imagen .jpg o .png para transformación
            const esImagenTransformable = archivo.mimetype === 'image/jpeg' || archivo.mimetype === 'image/png';
            
            let nombreArchivo;
            let bufferFinal;

            try {
                // Si se transforma, el nombre final debe terminar en .png
                if (esImagenTransformable) {
                    // Si el nombre original tiene .jpg o .jpeg, lo reemplazamos por .png para la unicidad
                    const nombreBase = archivo.name.replace(/\.(jpe?g|png)$/i, '');

                    nombreArchivo = await generarNombreUnico(`${nombreBase}.png`, UPLOAD_DIR_PATH);

                    // Transformar el archivo. Accedemos al buffer directamente con archivo.data.
                    bufferFinal = await transformarImagen(archivo.data, archivo.name);
                } else {
                    // Si no es imagen, se mantiene la extensión y se utiliza el método de guardado original
                    nombreArchivo = await generarNombreUnico(archivo.name, UPLOAD_DIR_PATH);
                    bufferFinal = archivo.data;
                }
            } catch (error) {
                return reject(error);
            }
            
            const destino = path.join(UPLOAD_DIR_PATH, nombreArchivo);
            
            // GUARDAR EL ARCHIVO: Usado fs.writeFile para guardar el Buffer
            try {
                // Guardamos el Buffer (transformado o original) en la ruta de destino
                await fs.writeFile(destino, bufferFinal);

                // Resolver la Promesa con los datos del archivo subido
                return resolve({
                    nombreOriginal : archivo.name,
                    nombreServidor: nombreArchivo,
                    mimetype : esImagenTransformable ? 'image/png' : archivo.mimetype, // Reportar el nuevo MIME type
                    size: bufferFinal.length, // Reportar el tamaño del archivo guardado (puede cambiar)
                    transformacionAplicada: esImagenTransformable ? 'Redimensionado (800px) y convertido a PNG' : 'Ninguna'
                });
            } catch (err) {
                // Error al escribir el archivo
                return reject(new ErrorServidor(`El archivo ${archivo.name}, no se pudo guardar en el servidor: ${err.message}`));
            }
        });
    });
    
    try {
        // Esperar a que todas las Promesas se completen
        const archivosCargados = await Promise.all(promesasMoverArchivo);
        
        // Enviar la respuesta FINAL (solo cuando todas las movimientos de archivo se completaron)
        return res.status(201).json({ mensaje:"Archivos cargados exitosamnete",archivosCargados: archivosCargados });
        
    } catch (error) {
        // Si alguna Promesa falla, el catch se ejecuta y pasa el error de la primera promesa que falló al middleware global.
        throw error;
    }
}