const btn = $(".reserva");
const formModal = $("#formModal");
const modalContainer = $("#modalContainer");
let datos = {}

btn.on("click", function () {
  const titleMovie = $(this).closest(".card").find("h5").text();

  $("#pelicula").val(titleMovie);

  formModal.modal("show");
});




$("form").on("submit", (e) => {
  e.preventDefault();


  $(e.target).find("input, select").each(function (){

    const id = $(this).attr("id");
    const valor = $(this).val();
    
    datos[id] = valor;

  });
  console.log("datos del formulario", datos);
  modalContainer.html(`<h1 align="center">Felicitaciones, usted ha reservado ${datos.asientos} asiento/s para la película "${datos.pelicula}", para hoy a las ${datos.horario} hrs</h1>`)
});



