import sharp from "sharp";
import { ErrorServidor } from "./errors.js";

export async function transformarImagen(bufferArchivo, nombreOriginal) {
    try {
        // Usamos sharp para:
        // 1. Cargar el buffer de la imagen.
        // 2. Redimensionar (resize) a un ancho máximo de 800px.
        // 3. Convertir el formato a PNG (.png).
        // 4. Obtener el resultado como un Buffer.
        const bufferTransformado = await sharp(bufferArchivo)
            .resize(800) // Redimensionar a 800px de ancho (la altura se ajusta automáticamente)
            .png()       // Convertir a formato PNG
            .toBuffer();
            
        return bufferTransformado;
    } catch (error) {
        // En caso de error en la transformación
        throw new ErrorServidor(`Error al transformar la imagen '${nombreOriginal}': ${error.message}`);
    }
}