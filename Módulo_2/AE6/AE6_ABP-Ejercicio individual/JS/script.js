// 1. Variables modal

const modal = $("#miModal"); // modal
const claseRPG = $(".imgClaseRPG"); // nodelist de imagenes de las clases RPG
const imgModal = $("#imgModal"); // imagen dentro del modal
const nombreEnModal = $("#nombreEnModal"); // nombre de la clase RPG en el modal
const cierreModal = $("#botonCierreModal"); // botón de cierre del modal
const miniaturas = $(".RPG-class"); // miniaturas de las clases RPG (img + marco + texto)
let indiceActual = 0; // índice de la imagen mostrada actualmente en el modal
const anterior = $("#anterior"); // botón de navegación hacia la imagen anterior
const siguiente = $("#siguiente"); // botón de navegación hacia la imagen siguiente

// 2. Eventos modal

// desplegar modal al clickear una imagen de la cuadrícula

claseRPG.each(function (index, imagenClase) {
  $(imagenClase).on("click", function () {
    indiceActual = index; // almacena el índice de la imagen clickeada
    imgModal.attr("src", $(claseRPG[index]).attr("src")); // cambia la imagen del modal por la imagen de la clase RPG clickeada
    nombreEnModal.text($(claseRPG[index]).attr("id")); // cambia el texto del modal por el nombre de la clase RPG clickeada
    modal.fadeIn(300).css("display", "flex"); // muestra el modal mediante una animación de desvanecimiento y establece su display a flex para centrar el contenido
    miniaturas.hide(); // oculta las miniaturas de las clases RPG
  });
});

// cerrar modal al hacer clic en el botón de cierre

cierreModal.on("click", function () {
  modal.fadeOut(300, function () {
    miniaturas.show(); // desvanece el modal mediante una animación y muestra las miniaturas de las clases RPG
  });
});

// cerrar modal al hacer clic fuera de la imagen

modal.on("click", function (e) {
  if ($(e.target).is("#miModal")) {
    // verifica si el clic fue en el fondo del modal, excluyendo los elementos internos del modal (imagen, texto, botones, etc.)
    modal.fadeOut(300, function () {
      miniaturas.show(); // desvanece el modal mediante una animación y muestra las miniaturas de las clases RPG
    });
  }
});

// navegación entre imágenes del modal

anterior.on("click", function () {
  if (indiceActual > 0) {
    indiceActual--; // reduce en 1 el índice actual para mostrar la imagen anterior
  } else {
    indiceActual = claseRPG.length - 1; // maneja condiciones de borde: si el índice actual es 0, lo cambia al último índice
  }
  imgModal.fadeOut(150, function () {
    imgModal.attr("src", $(claseRPG[indiceActual]).attr("src")).fadeIn(150);
  });
  nombreEnModal.text($(claseRPG[indiceActual]).attr("id")); // actualiza el texto del modal
});

siguiente.on("click", function () {
  if (indiceActual < claseRPG.length - 1) {
    indiceActual++; // aumenta en 1 el índice actual para mostrar la imagen siguiente
  } else {
    indiceActual = 0; // maneja condiciones de borde: si el índice actual es el último, lo cambia al primer índice
  }
  imgModal.fadeOut(150, function () {
    imgModal.attr("src", $(claseRPG[indiceActual]).attr("src")).fadeIn(150);
  });
  nombreEnModal.text($(claseRPG[indiceActual]).attr("id")); // actualiza el texto del modal
});
