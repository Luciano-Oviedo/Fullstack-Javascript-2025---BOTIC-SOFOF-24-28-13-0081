/*Desde bootstrap 5, los elementos dinámicos como pestañas y carruseles, pueden controlarse
con el script de JS de bootstrap, sin necesidad escribir una línea de código, usando los atributos "bs-data" y "bs-target". Pero para cumplir la consigna eliminé esos atributos y usé jQuery */

// ===================== PESTAÑAS =====================
function initPestanas() {
  $(".nav-link").on("click", function () {
    // Quitar clase activa de todas las pestañas y contenidos
    $(".nav-link").removeClass("active");
    $(".tab-pane").removeClass("show active");

    // Activar la pestaña seleccionada
    $(this).addClass("active");
    const target = $(this).data("target");
    $(target).addClass("show active");
  });
}

// ===================== CARRUSEL =====================
function initCarrusel() {
  const $carrusel = $("#carrusel"); // contenedor principal
  const $items = $carrusel.find(".carousel-item"); // todos los slides
  const $indicadores = $carrusel.find(".carousel-indicators button");
  const $prev = $carrusel.find(".carousel-control-prev");
  const $next = $carrusel.find(".carousel-control-next");

  let indexActual = 0; // índice del slide visible

  function mostrarSlide(i) {
    if (i >= $items.length) i = 0;
    if (i < 0) i = $items.length - 1;

    $items.removeClass("active");
    $indicadores.removeClass("active");

    $items.eq(i).addClass("active");
    $indicadores.eq(i).addClass("active");

    indexActual = i;
  }

  // Botones siguiente/anterior
  $next.on("click", function (e) {
    e.preventDefault();
    mostrarSlide(indexActual + 1);
  });

  $prev.on("click", function (e) {
    e.preventDefault();
    mostrarSlide(indexActual - 1);
  });

  // Click en indicadores
  $indicadores.each(function (i) {
    $(this).on("click", function (e) {
      e.preventDefault();
      mostrarSlide(i);
    });
  });

  // Aseguramos que los <a> dentro de los slides funcionen
  $carrusel
    .find("a")
    .off("click")
    .on("click", function (e) {
      e.stopPropagation(); // evita que el click suba al carrusel
      console.log("Link clickeado:", $(this).attr("href"));
      // NO preventDefault: el link abrirá normalmente
    });

  // Mostrar primer slide al cargar
  mostrarSlide(indexActual);
}

// ===================== INICIALIZACIÓN =====================
$(document).ready(function () {
  console.log("script.js cargado correctamente");
  initPestanas();
  initCarrusel();
});
