import { validarContenido, validarArchivos } from "../utils/validadores.js";

export function validacionMiddleware(req, res, next) {
    req.archivosArray = validarContenido(req);
    validarArchivos(req.archivosArray);
    next();
}