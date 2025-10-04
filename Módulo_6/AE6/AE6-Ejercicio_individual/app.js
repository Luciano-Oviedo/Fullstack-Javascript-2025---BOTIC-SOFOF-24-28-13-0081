import yargs from "yargs";

import chalk from "chalk";

import { conversionTemperatura } from "./helpers/convert.js"; // Importación función de conversión

// 1. Configuración de parámetros de entrada

const argv = yargs(process.argv.slice(2))
  .options({
    temperatura: {
      alias: "temp",
      describe: "valor numérico de temperatura",
      type: "number",
      demandOption: true, // Parámetro obligatorio
    },
    unidad: {
      alias: "uni",
      describe: "escala de temperatura",
      choices: ["c", "f"],
      demandOption: true, // Parámetro obligatorio
    },
  })
  .check((argv) => {
    if (isNaN(argv.temperatura)) {
      // Tipo inválido: advertencia en amarillo
      throw new Error(chalk.yellow("La temperatura debe ser un número válido"));
    }
    return true;
  })
  .fail((msg, err) => {
    if (msg.includes("Missing required argument")) {
      // Parámetro obligatorio faltante: error en rojo
      console.error(chalk.red(msg));
    } else if (msg.includes("Invalid values")) {
      // Choice inválido: advertencia en amarillo
      console.error(chalk.yellow(msg));
    } else {
      // Otros errores: blanco
      console.error(msg);
    }
    process.exit(1);
  })
  .parse();

// 2. Ejecución de función de conversión de temperatura, con manejo de errores

try {
  const resultado = conversionTemperatura(argv.temperatura, argv.unidad);
  console.log(
    // Resultado de conversión en verde
    chalk.green(
      `${argv.temperatura} grados ${
        argv.unidad === "c" ? "Celsius" : "Fahrenheit"
      } equivalen a ${resultado} grados ${
        argv.unidad === "c" ? "Fahrenheit" : "Celsius"
      }`
    )
  );
} catch (error) {
  // Error en rojo
  console.error(chalk.red("Error al convertir temperatura:"), error.message);
  process.exit(1);
}
