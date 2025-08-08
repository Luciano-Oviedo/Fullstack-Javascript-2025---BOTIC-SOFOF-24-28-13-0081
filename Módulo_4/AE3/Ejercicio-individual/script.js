const botonesLike = document.querySelectorAll(".likes button"); // selección botones de like

// evento dar like
botonesLike.forEach(
    function (boton) {
        boton.addEventListener(
            "click", function(){
                const contenedor = this.closest("div");
                const likes = contenedor.querySelector("span");
                const numLikesInicial = parseInt(likes.textContent);
                numLikesActual = numLikesInicial +1;
                likes.textContent = `${numLikesActual} like(s)`;
            }
        )
    }
)