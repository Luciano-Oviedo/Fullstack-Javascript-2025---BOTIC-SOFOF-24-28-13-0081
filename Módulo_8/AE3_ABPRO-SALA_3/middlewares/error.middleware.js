import chalk from "chalk";

export const errorMiddleware = (err, req, res, next) => {
    // Si no tiene statusCode, se asigna statusCode = 500 (Error de Servidor). 
    if (!err.statusCode)
        err.statusCode = 500;
        
    // Logear el error en consola
    console.error(chalk.redBright('*** Error capturado por el middleware de errores ***'));
    console.error(chalk.redBright(`${err.name} (${err.statusCode}): ${err.message}`));
  
    return res.status(err.statusCode).json({error:{ name: err.name, statusCode: err.statusCode, message: err.message }});
}