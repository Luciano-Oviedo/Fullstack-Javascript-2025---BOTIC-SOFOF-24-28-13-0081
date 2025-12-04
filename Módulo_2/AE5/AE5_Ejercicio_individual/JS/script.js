//1. Declaración de variables

const botonesAceptar = document.querySelectorAll(".botónAceptar"); //botones de aceptar solicitud

const botonesRechazar = document.querySelectorAll(".botónRechazar"); //botones de rechazar solicitud

const botonesSolicitudes = [...botonesAceptar, ...botonesRechazar]; //arreglo con botones de solicitud

const cantidadSolicitudes = document.querySelector(".solicitudes h2"); //título que muestra cantidad de solicitudes

const cantidadConexiones = document.querySelector(".tusConexiones h2"); //título que muestra cantidad de conexiones

//2. Funciones

function contadorSolicitudes() {
  let SolicitudesDeConexión = document.querySelectorAll(
    ".solicitudes .otrosPerfiles"
  );
  let tusConexiones = document.querySelectorAll(
    ".tusConexiones .otrosPerfiles"
  );
  cantidadSolicitudes.textContent =
    "Solicitudes de conexión (" + SolicitudesDeConexión.length + ")";
  cantidadConexiones.textContent =
    "Tus conexiones (" + tusConexiones.length + ")";
} //modifica el contador de solicitudes y conexiones

function eliminarSolicitud() {
  const perfilSolicitud = this.closest(".otrosPerfiles");
  if (perfilSolicitud) {
    perfilSolicitud.remove();
  }
} // Elimina solicitud de conexión

function aceptarSolicitud() {
  const perfil = this.closest(".otrosPerfiles");
  const contenedorConexiones = document.querySelector(".contenedor-conexiones");

  if (perfil && contenedorConexiones) {
    const btnAceptar = perfil.querySelector(".botónAceptar");
    const btnRechazar = perfil.querySelector(".botónRechazar");
    if (btnAceptar) btnAceptar.remove();
    if (btnRechazar) btnRechazar.remove();
    contenedorConexiones.appendChild(perfil);
    contadorSolicitudes();
  }
} //mueve las solicitudes a "tus conexiones" al ser aceptadas y actualiza el contador

//3. Eventos

botonesAceptar.forEach(function (botón) {
  botón.addEventListener("click", aceptarSolicitud);
}); //activa función "aceptarSolicitud" al clickear botón de aceptar

botonesRechazar.forEach(function (botón) {
  botón.addEventListener("click", function () {
    eliminarSolicitud.call(this);
    contadorSolicitudes();
  });
}); //activa función "eliminarSolicitud" y "contadorSolicitudes" al rechazar solicitud

//.4 Información cargada desde el principio

contadorSolicitudes();
