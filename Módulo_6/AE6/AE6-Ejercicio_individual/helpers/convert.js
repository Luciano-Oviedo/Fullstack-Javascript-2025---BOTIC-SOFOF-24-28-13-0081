// Función de conversión de temperatura entre escalas Celsius-Fahrenheit-Celsius

export function conversionTemperatura(grados, escala) {
  if (typeof grados !== "number") {
    throw new Error("Debes ingresar un valor numérico para la temperatura");
  } else if (escala === "c") {
    return grados * 1.8 + 32;
  } else if (escala === "f") {
    return (grados - 32) / 1.8;
  } else {
    throw new Error(`Escala desconocida: ${escala}. Debe ser "c" o "f".`);
  }
}
