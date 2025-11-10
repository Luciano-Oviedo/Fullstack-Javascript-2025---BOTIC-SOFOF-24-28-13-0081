import fs from "fs/promises";
import { ErrorValidacion, ErrorExtensionArchivo, ErrorTamañoArchivo } from "../utils/errors.js";
import chalk from "chalk";

export async function validarDirectorio(ruta) {
    try {
        await fs.access(ruta);
        console.log(chalk.cyan(`Directorio existente\n`));
        return true;
    } catch (error) {
        // "Error No Entry", indica que el archivo/directorio no existe
        if (error.code === 'ENOENT') {
            await fs.mkdir(ruta); // agregar { recursive: true }, para permitir creación de directorios intermedios
            console.log(chalk.yellow(`Directorio "${ruta}" creado exitosamente.\n`));
        }    
        else
            throw error;
    }
}

export function validarContenido(req){
    if (!req.files || !req.files.archivo) {
        throw new ErrorValidacion("No se ha seleccionado ningún archivo");
    }

    return Array.isArray(req.files.archivo) ? req.files.archivo : [req.files.archivo];
}

function validarExtensionArchivo(archivo){
    const EXT_PERMITIDAS = {
        image : ['.jpg', '.jpeg', '.png', '.gif'],
        application : ['.pdf'],
        text : ['.txt']
    };

    // Obtener el tipo principal del MIME (ej: "image" de "image/jpeg")
    const tipoMime = archivo.mimetype.split('/')[0];

    // Obtener la lista de extensiones permitidas para este tipo
    const extensionesValidas = EXT_PERMITIDAS[tipoMime];
    
    // Obtener extension real del archivo en caso que no coincida con el mimetype
    const extension = archivo.name.substring(archivo.name.lastIndexOf('.')).toLowerCase();
    
    // Validar la existencia del tipo MIME y la extensión
    if (!extensionesValidas || !extensionesValidas.includes(extension)){
        // Generar el mensaje de error con las extensiones permitidas
        const extensionesValidasStr = extensionesValidas ? extensionesValidas.join(', ') : 'ninguna permitida para este tipo';
        throw new ErrorExtensionArchivo(`La extensión del archivo '${archivo.name}' no está permitida. Extensiones válidas para el tipo ${tipoMime}: ${extensionesValidasStr}`);
    }

    return true;
}

function validarTamañoArchivo(archivo){
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    
    if (archivo.size > MAX_SIZE){
        const maxSizeMB = (MAX_SIZE / (1024 * 1024)).toFixed(2);
        throw new ErrorTamañoArchivo(`Tamaño archivo '${archivo.name}' excede el tamaño máximo (${maxSizeMB} MB)`);
    }

    return true;
}

export function validarArchivos(archivos){
    archivos.forEach(archivo => {
        validarExtensionArchivo(archivo);
        validarTamañoArchivo(archivo);
    });

    return true;
}