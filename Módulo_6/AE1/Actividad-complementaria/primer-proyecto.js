const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});

// Ruta raíz con mensaje de bienvenida
app.get("/", (req, res) => {
  res.send("Hola, soy Luciano, bienvenido a mi primer servidor");
});

// Ruta /saludo
app.get("/saludo", (req, res) => {
  res.send("¡Hola amigo, que tengas un lindo día!");
});

// Ruta /hora
app.get("/hora", (req, res) => {
  const fecha = new Date();
  const hora = fecha.toLocaleTimeString();
  res.send(`La hora es: ${hora}`);
});

// Ruta /despedida
app.get("/despedida", (req, res) => {
  res.send("¡Nos vemos, vuelve pronto!");
});
