import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import { uploadRouter } from "./routes/upload.router.js";
import { deleteRouter } from "./routes/delete.router.js";
import { ErrorRecursoNoEncontrado } from "./utils/errors.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { validarDirectorio } from "./utils/validadores.js";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);

const PORT = 3000;
const UPLOAD_DIR_NAME = 'uploads';
const UPLOAD_DIR_PATH = path.join(path.dirname(__filename), UPLOAD_DIR_NAME);

const app = express();

app.use(fileUpload());
// Contenido estático para la ruta /upload
app.use('/upload', express.static(UPLOAD_DIR_NAME));

// Rutas
app.use('/upload', uploadRouter);
app.use('/delete', deleteRouter);

app.all("/{*ruta}", (req, res) => {
  const ruta = req.originalUrl;
  throw new ErrorRecursoNoEncontrado(`Endpoint (${req.method})${ruta} no encontrado`);
});

// Middleware de Manejo de Errores Personalizado
// Debe ser el último middleware agregado
app.use(errorMiddleware);

async function iniciarServidor() {
    try {
        // Asegurar que el directorio 'uploads' existe antes de iniciar el servidor
        console.log(`Iniciando Servidor\n==================\nVerificando existencia directorio: ${UPLOAD_DIR_PATH}`);
        await validarDirectorio(UPLOAD_DIR_PATH); 

        // Iniciar la escucha del servidor
        app.listen(PORT, () =>{
            console.log(chalk.green(`Servidor iniciado en http://localhost:${PORT}`));
        });

    } catch (error) {
        console.error('*** ERROR AL INICIAR EL SERVIDOR ***'); 
        console.error(`${error.message}`);
        process.exit(1);
    }
}

// Ejecutar la función de inicio
iniciarServidor();