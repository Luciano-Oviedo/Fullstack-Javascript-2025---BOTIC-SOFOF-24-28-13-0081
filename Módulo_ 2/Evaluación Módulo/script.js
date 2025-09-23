// 1. Modal

// 1.1 Selección de botones
const botonModal = $("#botonModal");
const botonCerrarModal = $(".btn-close");

// 1.2 Selección del modal nativo de bootstrap
const modalEl = document.querySelector(".modal");
const modal = new bootstrap.Modal(modalEl, {
  backdrop: true, // permite cerrar al hacer click fuera
  keyboard: true, // permite cerrar con ESC
});

// 1.3 Eventos

// Abrir modal
botonModal.on("click", () => modal.show());
// Cerrar modal
botonCerrarModal.on("click", () => modal.hide());

// 2. Cuestionario Ciberseguridad

// 2.1 Variables

// Respuestas correctas
const respuestas = {
  q1: "c",
  q2: "c",
  q3: "a",
  q4: "a",
  q5: "b",
  q6: "b",
};

// Selectores
const $form = $("#quizForm");
const $btnValidar = $("#btnValidarQuiz");
const $divResultados = $("#resultadosQuiz");

// 2.2 Funciones

// Obtener respuestas seleccionadas del formulario
function obtenerRespuestas() {
  const formArray = $form.serializeArray();
  const seleccion = {};
  formArray.forEach((item) => {
    seleccion[item.name] = item.value;
  });
  return seleccion;
}

// Contar y validar respuestas y calcular puntaje
function validarRespuestas(seleccion) {
  let score = 0;
  Object.keys(respuestas).forEach((key) => {
    if (seleccion[key] === respuestas[key]) {
      score++;
    }
  });
  return score;
}

// Mostrar resumen del puntaje
function mostrarResultados(score, total) {
  $divResultados
    .removeClass("d-none alert-success alert-warning alert-danger")
    .addClass("alert");

  if (score === total) {
    $divResultados
      .addClass("alert-success")
      .text(`¡Excelente! Respondiste todas correctamente (${score}/${total})`);
  } else if (score >= total * 0.66) {
    $divResultados
      .addClass("alert-warning")
      .text(`Bien hecho, pero aún puedes mejorar (${score}/${total})`);
  } else {
    $divResultados
      .addClass("alert-danger")
      .text(`Necesitas repasar tus conocimientos sobre ciberseguridad (${score}/${total})`);
  }
}

// 2.3 Eventos

// Click para validar respuestas
$btnValidar.on("click", (e) => {
  e.preventDefault();

  // 1. Obtener respuestas seleccionadas
  const seleccion = obtenerRespuestas();

  // 2. Validar y calcular puntaje
  const score = validarRespuestas(seleccion);

  // 3. Mostrar resultados
  mostrarResultados(score, Object.keys(respuestas).length);

  // 4. Resetear formulario para un nuevo intento
  $form[0].reset();
});

// 3. Validación boletín de ciberseguridad

// 3.1. Variables
const botonBoletin = $("#botonBoletin");
const boletin = $("#boletin");
const inputNombre = $("#inputNombre");
const inputEmail = $("#inputEmail");

// 3.2 Función de validación
const validarBoletin = () => {
  const nombreVal = inputNombre.val().trim();
  const emailVal = inputEmail.val().trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nombreRegex = /^[a-zA-Z\s]+$/;

  if (!nombreVal || !emailVal) {
    alert("Debes ingresar un nombre y un correo electrónico");
  } else if (!nombreRegex.test(nombreVal)) {
    alert("El nombre solo puede contener letras y espacios");
  } else if (!emailRegex.test(emailVal)) {
    alert("Debes ingresar un correo electrónico válido");
  } else {
    alert("¡Felicidades! Te has suscrito con éxito al boletín de ciberseguridad");
    boletin[0].reset();
  }
};

// 3.3 Evento botón suscribirse
botonBoletin.on("click", (e) => {
  e.preventDefault();
  validarBoletin();
});