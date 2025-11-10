import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { ErrorServidor, ErrorRecursoNoEncontrado } from "../utils/errors.js";

const __filename = fileURLToPath(import.meta.url);

const UPLOAD_DIR_NAME = 'uploads';
const UPLOAD_DIR_PATH = path.join(path.dirname(__filename),'..', UPLOAD_DIR_NAME);

export const eliminarArchivos = async(req, res) =>{
    try{
        const archivoPath = path.join(UPLOAD_DIR_PATH, req.params.filename);
        await fs.unlink(archivoPath);
        return res.status(200).json({mensaje:`Archivo ${req.params.filename}, eliminado exitosamente`});   
    } catch(error) {
        if (error.code === 'ENOENT')
            throw new ErrorRecursoNoEncontrado(`El archivo ${req.params.filename}, no existe en el servidor`);
        
        throw new ErrorServidor(`El archivo ${req.params.filename}, no se pudo eliminar del servidor`);
    }
}