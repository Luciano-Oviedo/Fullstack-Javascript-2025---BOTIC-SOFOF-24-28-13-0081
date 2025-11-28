/* 
  Desde Bootstrap 5, los elementos dinámicos como pestañas y carruseles 
  pueden controlarse automáticamente mediante los atributos "data-bs-*". 
  
  Sin embargo, para cumplir la consigna del módulo —que exige manipulación 
  del DOM con jQuery— se eliminaron esos atributos y se implementó toda la 
  lógica manualmente mediante eventos y cambios de clases.
*/

// ===================== PESTAÑAS =====================
/*
  Función: initPestanas()
  -----------------------
  Implementa un sistema de pestañas (tabs) usando jQuery.

  Qué hace:
  - Detecta el clic en una pestaña.
  - Quita los estados "active" de todas las pestañas y sus contenidos.
  - Activa la pestaña seleccionada y el panel correspondiente.
  
  Por qué es manual:
  - Bootstrap puede hacerlo automáticamente, pero se implementa a mano
    para demostrar manejo básico del DOM.
*/
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
/*
  Función: initCarrusel()
  -----------------------
  Controla manualmente un carrusel de proyectos usando jQuery.

  Lógica principal:
  - Lleva un índice del slide actual.
  - Cambia de slide al presionar botones prev/next.
  - Activa correctamente los indicadores del carrusel.
  - Permite clics en enlaces internos sin interferir con la navegación.
  
  Por qué es manual:
  - Igual que con las pestañas, Bootstrap 5 puede manejar carruseles
    automáticamente, pero esta implementación permite demostrar
    manipulación del DOM y eventos con jQuery.
*/
function initCarrusel() {
  const $carrusel = $("#carrusel"); // contenedor principal
  const $items = $carrusel.find(".carousel-item"); // todos los slides
  const $indicadores = $carrusel.find(".carousel-indicators button");
  const $prev = $carrusel.find(".carousel-control-prev");
  const $next = $carrusel.find(".carousel-control-next");

  let indexActual = 0; // índice del slide visible

  /*
    Función: mostrarSlide(i)
    -------------------------
    Cambia visualmente al slide indicado:
    - Controla que el índice no se salga del rango (loop circular).
    - Actualiza clases "active" en items e indicadores.
  */
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

  // Click en indicadores (los puntos inferiores del carrusel)
  $indicadores.each(function (i) {
    $(this).on("click", function (e) {
      e.preventDefault();
      mostrarSlide(i);
    });
  });

  /*
    Aseguramos que los <a> dentro de los slides funcionen:
    - stopPropagation evita que un clic en un enlace dispare un cambio de slide.
    - No se usa preventDefault, así que los enlaces abren normalmente.
  */
  $carrusel
    .find("a")
    .off("click")
    .on("click", function (e) {
      e.stopPropagation();
      console.log("Link clickeado:", $(this).attr("href"));
    });

  // Mostrar primer slide al cargar
  mostrarSlide(indexActual);
}

// ===================== INICIALIZACIÓN =====================
/*
  Cuando el documento esté listo:
  - Se muestra un mensaje en consola.
  - Se inicializan las pestañas y el carrusel manual.
*/
$(document).ready(function () {
  console.log("script.js cargado correctamente");
  initPestanas();
  initCarrusel();
});
