// 1. Clases

class Producto {
  constructor(id, nombre, precio, categoria, descripcion, img) {
    // Constructor con todas las características del producto que utilizaremos
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.img = img;
  }
  informacionProducto() {
    // Método para mostrar las principales características del producto
    return `Name: ${this.nombre}.
            Price: ${this.precio} USD.
            Category: ${this.categoria}.
            Descripción: ${this.descripcion}.`;
  }
}

// 2. Funciones

// 2.1 Función flecha con fetch API para obtener la información de los productos
const obtenerProductos = async () => {
  try {
    const peticion = await fetch(
      "https://dummyjson.com/products/category/smartphones?&limit=10" // fetch API para obtener la categoría 'smartphones', limitada a 10 resultados
    );
    if (!peticion.ok) throw new Error(`Error ${peticion.status}`);

    const data = await peticion.json();

    const productos = data.products;

    const listaProductos = []; // Arreglo vacío para guardar los productos

    productos.forEach((producto) => {
      // Por cada producto obtenido de la API, se extraeran ciertos parámetros para construir un objeto producto, que se agregará a nuestro arreglo
      const objeto = new Producto(
        producto.id,
        producto.title,
        producto.price,
        producto.category,
        producto.description,
        producto.images[0]
      );
      listaProductos.push(objeto);
    });
    return listaProductos; // Retorna el arreglo con productos para poder utilizar fuera de la función
  } catch (error) {
    // Manejo de errores, devuelve un arreglo vacío si hay un error
    console.error(`Error: ${error}`);
    return [];
  }
};

// 2.2 Función flecha para crear estructura HTML con productos obtenidos de la API

const estructuraWeb = async () => {
  try {
    const productos = await obtenerProductos(); // Obtiene el arreglo de productos, invocando a la función obtenerProductos y esperando su finalización

    console.log(productos);
    // Creamos una section que contendrá los divs con nuestros productos y le añadimos una clase para CSS
    const seccionProductos = document.createElement("section");
    seccionProductos.className = "seccionProductos";

    // Esta función nos permite mostrar un placeholder si no carga la imagen
    const imgUrl = (url) => {
      if (!url) return "https://via.placeholder.com/250x250?text=No+Image";
      return url;
    };
    productos.forEach((producto) => {
      // Por cada producto del array se ejecuta la siguiente función:

      const { nombre, precio, categoria, descripcion, img } = producto; // Extraemos la información del producto mediante destructuración

      // Se crean los contenedores y sus elementos internos en HTML, se les asignan clases para manipularlos en CSS
      const contenedorProducto = document.createElement("article");
      contenedorProducto.className = "contenedorProducto";

      const contenedorImagen = document.createElement("div");
      contenedorImagen.className = "contenedorImagen";
      const imagen = document.createElement("img");
      imagen.alt = `Imagen del producto ${nombre}`;
      imagen.src = imgUrl(img);

      const infoProducto = document.createElement("div");
      infoProducto.className = "infoProducto";

      const botonAgregarCarrito = document.createElement("button");
      botonAgregarCarrito.className = "botonAgregarCarrito";
      botonAgregarCarrito.innerHTML = "Agregar al carrito";
      botonAgregarCarrito.dataset.id = producto.id;

      // Usamos las propiedades del objeto destructuradas para llenar nuestros párrafos
      infoProducto.innerHTML = `
        <h3 class="titulo"><strong>${nombre}</strong></h3>
        <p class="precio"><strong>Price:</strong> ${precio} USD</p>
        <p class="categoria"><strong>Category</strong>: ${categoria}</p>
        <p class="descripcion">${descripcion}</p>
      `;

      contenedorImagen.appendChild(imagen);
      contenedorProducto.appendChild(contenedorImagen);
      contenedorProducto.appendChild(infoProducto);
      contenedorProducto.appendChild(botonAgregarCarrito);
      seccionProductos.appendChild(contenedorProducto); // Insertamos nuestro div del producto en la sección de productos
    });

    document.querySelector("#main").appendChild(seccionProductos); // Insertamos la sección con nuestros divs de productos al main
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// 3. Manipulación del DOM y eventos

// 3.1 Variables

const contadorCarrito = document.getElementById("contadorCarrito"); // Parrafo que cuenta nuestros artículos en el carrito
const carrito = document.querySelector(".seccionCarrito"); // Modal de nuestro carrito en el HTML
const contenidoCarrito = document.getElementById("carritoCompras"); // Sección interna de nuestro carrito
const botonFinalizarCompra = document.getElementById("botonFinalizarCompra"); // Botón para finalizar compra

// 3.2 Eventos

document.addEventListener("DOMContentLoaded", estructuraWeb); // En la carga de nuestra web se activa la función que arma la estructura html de nuestros productos con la información de la fetch API

// Este evento detecta clicks en la sección "main" de nuestro HTML y si se corresponde a un botón carrito, agrega el producto a nuestro carrito
document.querySelector("#main").addEventListener("click", (event) => {
  if (event.target.matches(".botonAgregarCarrito")) {
    // Obtenemos el contenedor del producto
    const contenedorProducto = event.target.closest("article");

    // Creamos un contenedor para copiar nuestro producto
    const contenedorCopia = document.createElement("article");

    // Le agregamos la clase de nuestro contenedor original, para mantener algunos estilos
    contenedorCopia.classList.add("contenedorProducto");

    // Copiamos el html interno de nuestro producto al contenedor copia
    contenedorCopia.innerHTML = contenedorProducto.innerHTML;

    // Quitamos la información innecesaria
    contenedorCopia.querySelector(".categoria").remove();
    contenedorCopia.querySelector(".descripcion").remove();

    // Cambiamos el contenido del botón a "Quitar del carrito"
    const botonQuitar = contenedorCopia.querySelector(".botonAgregarCarrito");
    botonQuitar.textContent = "Quitar del carrito";

    // Agregamos un evento al botón para quitar del carrito, para que elimine el producto del carrito y actualice el contador
    botonQuitar.addEventListener("click", function () {
      this.closest("article").remove();
      const contenedorCarrito =
        contenidoCarrito.querySelector(".productosCarrito");
      contadorCarrito.textContent = `has agregado ${
        contenedorCarrito.querySelectorAll(".contenedorProducto").length
      } artículo/s a tu carrito`;
    });

    // Agregamos nuestra copia a nuestro carrito en el documento html
    const contenedorCarrito =
      contenidoCarrito.querySelector(".productosCarrito");
    contenedorCarrito.appendChild(contenedorCopia);

    // Actualizamos el contador de artículos de nuestro carrito
    contadorCarrito.textContent = `has agregado ${
      contenedorCarrito.querySelectorAll(".contenedorProducto").length
    } artículo/s a tu carrito`;
  }
});

// Este evento despliega el carrito con el botón "ver carrito"
const abrirCarrito = document.getElementById("abrirCarrito");

abrirCarrito.addEventListener("click", () => {
  carrito.classList.add("activo");
});

// Este evento cierra el carrito con el botón "cerrar"
const cerrarCarrito = document.getElementById("cerrarCarrito");

cerrarCarrito.addEventListener("click", () => {
  carrito.classList.remove("activo");
});

// Este evento da una alerta en el navegador de que no se ha implementado una pasarela de pagos

const finalizarCompra = botonFinalizarCompra.addEventListener("click", () => {
  alert(
    "Esta demo no tiene implementada una pasarela de pagos, felicitaciones por llegar hasta aquí ;)"
  );
});
