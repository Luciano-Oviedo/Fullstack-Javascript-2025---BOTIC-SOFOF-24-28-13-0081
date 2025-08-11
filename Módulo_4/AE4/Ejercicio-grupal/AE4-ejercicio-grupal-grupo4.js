// Funciones preparaciones

const prepararCafe = () => {
  return new Promise((resolve, reject) => {
    const posibilidadFallo = Math.random(); // Genera un número entre 0 y 1;

    const tiempoPreparación = (1 + Math.random() * 2) * 1000; // Entre 1 a 3 segundos en milisegundos

    if (posibilidadFallo <= 0.2) {
      // Este condicional evalúa si el número generado es menor o igual a 0.2, representando el 20% de probabilidad de fallo
      reject("No se pudo preparar tu café: falta café");
    } else {
      setTimeout(() => {
        resolve(`Café listo en ${tiempoPreparación / 1000} segundos`);
      }, tiempoPreparación); // Si no se falla, entonces se ejecuta el timer de 1 a 3 segundos y se resuelve la promesa, con un mensaje del tiempo de preparación en consola
    }
  });
};

const tostarPan = () => {
  return new Promise((resolve, reject) => {
    const posibilidadFallo = Math.random();
    const tiempoPreparación = (2 + Math.random() * 2) * 1000; // Entre 2 a 4 segundos en milisegundos

    if (posibilidadFallo <= 0.2) {
      reject("No se pudo tostar tu pan: no queda pan.");
    } else {
      setTimeout(() => {
        resolve(`Pan tostado en ${tiempoPreparación / 1000} segundos`);
      }, tiempoPreparación);
    }
  });
};

const exprimirJugo = () => {
  return new Promise((resolve, reject) => {
    const posibilidadFallo = Math.random();
    const tiempoPreparación = (1 + Math.random()) * 1000; // Entre 1 a 2 segundos en milisegundos

    if (posibilidadFallo <= 0.2) {
      reject("No se pudo exprimir tu jugo: no quedan naranjas");
    } else {
      setTimeout(() => {
        resolve(`Jugo listo en ${tiempoPreparación / 1000} segundos`);
      }, tiempoPreparación);
    }
  });
};

// Función resumenPedido

const resumenPedido = (objeto) => {
  console.log(`Este es el resumen de tu pedido:
Café: ${objeto.resultadoCafe}.
Pan tostado: ${objeto.resultadoPan}.
Jugo exprimido: ${objeto.resultadoJugo}.`);
};

// Función realizarPedido con .then y .catch. Cada paso invoca una función de preparación, maneja sus resultados con .then y .catch y no ejecuta el siguiente .then (siguiente preparación), hasta que no se haya retornado la función anterior

const realizarPedido = () => {
  const resumen = {}; // Objeto vacío para guardar resultados de las preparaciones

  console.log("Preparando café");
  return prepararCafe()
    .then((resultado) => {
      console.log(resultado);
      resumen.resultadoCafe = "listo"; // En caso de resolver la promesa, crea una propiedad del objeto resumen con el valor "listo"
    })
    .catch((error) => {
      console.log(error);
      resumen.resultadoCafe = "fallo"; // En caso de rechazar la promesa, crea una propiedad del objeto resumen con el valor "fallo"
    })
    .then(() => {
      console.log("Tostando pan");
      return tostarPan()
        .then((resultado) => {
          console.log(resultado);
          resumen.resultadoPan = "listo";
        })
        .catch((error) => {
          console.log(error);
          resumen.resultadoPan = "fallo";
        });
    })
    .then(() => {
      console.log("Exprimiendo jugo");
      return exprimirJugo()
        .then((resultado) => {
          console.log(resultado);
          resumen.resultadoJugo = "listo";
        })
        .catch((error) => {
          console.log(error);
          resumen.resultadoJugo = "fallo";
        });
    })
    .finally(() => resumenPedido(resumen)); // tras ejecutar todas las promesas, se ejecuta la función resumenPedido
};

// Función realizarPedido con async/await y try/catch. Ya que cada preparación utiliza await, no se pasa al siguiente try hasta que la función de preparación se resuelve, positiva o negativamente

const realizarPedidoAsync = async () => {
  const resumen = {}; // Objeto vacío para guardar resultados de las preparaciones

  try {
    console.log("Preparando café");
    const cafe = await prepararCafe();
    console.log(cafe);
    resumen.resultadoCafe = "listo";
  } catch (error) {
    console.log(error);
    resumen.resultadoCafe = "fallo";
  }

  try {
    console.log("Tostando pan");
    const pan = await tostarPan();
    console.log(pan);
    resumen.resultadoPan = "listo";
  } catch (error) {
    console.log(error);
    resumen.resultadoPan = "fallo";
  }

  try {
    console.log("Exprimiendo jugo");
    const jugo = await exprimirJugo();
    console.log(jugo);
    resumen.resultadoJugo = "listo";
  } catch (error) {
    console.log(error);
    resumen.resultadoJugo = "fallo";
  }
  resumenPedido(resumen);
};

// Función bonus de pedido con Promise.allSettled

const realizarPedidoBonus = () => {
  const preparaciones = [prepararCafe(), tostarPan(), exprimirJugo()]; // Reúne promesas de preparaciones en un array

  Promise.allSettled(preparaciones).then((resultados) => {
    // el método all Settled itera sobre ese array de promesas y devuelve un objeto con los resultados de cada promesa, sin importar si se cumplen o no, y sin cortar el flujo en caso de fallo

    const nombres = ["Café", "Pan", "Jugo"];

    resultados.forEach((resultado, i) => {
      // Dentro del.then, formateamos un poco para dar legibilidad al resultado. Por cada promesa "fulfilled" se imprime un mensaje de "listo" y el tiempo de preparación. Por cada promesa "rejected" se imprime un mensaje de "fallo" y la razón del error
      if (resultado.status === "fulfilled") {
        console.log(`✅ ${nombres[i]} listo: ${resultado.value}`);
      } else {
        console.log(`❌ ${nombres[i]} falló: ${resultado.reason}`);
      }
    });
  });
};
