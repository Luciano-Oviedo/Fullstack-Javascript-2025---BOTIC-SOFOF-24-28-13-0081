// 1. Clase vehículo:

class Vehiculo {
  constructor(marca, modelo, año, color, kilometraje) {
    this.marca = marca;
    this.modelo = modelo;
    this.año = año;
    this.color = color;
    this.kilometraje = kilometraje;
  }

  mostrarDetalles() {
    console.log(
      `El vehículo seleccionado es de la marca ${this.marca}, modelo ${this.modelo}, año ${this.año}. Es de color ${this.color} y su kilometraje es de ${this.kilometraje} kilómetros.`
    );
  }
}

//La consigna pide que las propiedades de la clase tenga propiedades con tipos ya definidos, por ejemplo, marca(string), año(number), etc. Pero no nos han enseñado a hacer eso y, además, es contrario al propósito de una clase, que es servir de plantilla para sus instancias. Por ejemplo, si asigno a la propiedad this.año = 2008, tendría que sobreescribir ese valor en cada objeto instanciado desde esa clase.

// 2. Clases hijas:

class Auto extends Vehiculo {
  constructor(marca, modelo, año, color, kilometraje, numeroDePuertas) {
    super(marca, modelo, año, color, kilometraje);
    this.numeroDePuertas = numeroDePuertas;
  }

  mostrarDetalles() {
    console.log(
      `El auto seleccionado es de la marca ${this.marca}, modelo ${this.modelo}, año ${this.año}. Es de color ${this.color}, cuenta con ${this.numeroDePuertas} puertas y su kilometraje es de ${this.kilometraje} kilómetros.`
    );
  }
}

class Motocicleta extends Vehiculo {
  constructor(marca, modelo, año, color, kilometraje, tipoDeManillar) {
    super(marca, modelo, año, color, kilometraje);
    this.tipoDeManillar = tipoDeManillar;
  }

  mostrarDetalles() {
    console.log(
      `La motocicleta seleccionada es de la marca ${this.marca}, modelo ${this.modelo}, año ${this.año}. Es de color ${this.color}, cuenta con un manillar tipo ${this.tipoDeManillar} y su kilometraje es de ${this.kilometraje} kilómetros.`
    );
  }
}

class Camion extends Vehiculo {
  constructor(marca, modelo, año, color, kilometraje, capacidadDeCarga) {
    super(marca, modelo, año, color, kilometraje);
    this.capacidadDeCarga = capacidadDeCarga;
  }

  mostrarDetalles() {
    console.log(
      `El camión seleccionado es de la marca ${this.marca}, modelo ${this.modelo}, año ${this.año}. Es de color ${this.color}, cuenta con una capacidad de carga de ${this.capacidadDeCarga} kilos y su kilometraje es de ${this.kilometraje} kilómetros.`
    );
  }
}

// 3. Objetos literales:

let vehiculoLiteral = {
  marca: "Toyota",
  modelo: "4Runner",
  año: 2010,
  color: "gris",
  kilometraje: 211500,
  mostrarDetalles: function () {
    console.log(
      `El vehículo seleccionado es de la marca ${this.marca}, modelo ${this.modelo}, año ${this.año}. Es de color ${this.color} y su kilometraje es de ${this.kilometraje} kilómetros.`
    );
  },
};

vehiculoLiteral.mostrarDetalles();

// 4. Crear una instancia de cada clase:

let objetoAuto = new Auto(
  "chancho",
  "cachupín 3000",
  2002,
  "amarillo patito",
  100,
  4
);

objetoAuto.mostrarDetalles();

let objetoMoto = new Motocicleta(
  "Yamaha",
  "New XTZ 150",
  2025,
  "Azul",
  0,
  "aluminio"
);

objetoMoto.mostrarDetalles();

let objetoCamion = new Camion(
  "Chevrolet",
  "FRR 1119 AMT",
  2000,
  "blanco",
  500000,
  7595
);

objetoCamion.mostrarDetalles();

// .5 Y 6, Generar un archivo JSON y manipularlo:

let listaVehiculos = {
  vehiculos: [
    {
      tipo: "auto",
      marca: "Toyota",
      modelo: "4Runner",
      año: 2010,
      color: "gris",
      kilometraje: 80000,
      numeroDePuertas: 4,
    },
    {
      tipo: "motocicleta",
      marca: "Yamaha",
      modelo: "New XTZ 150",
      año: 2025,
      color: "azul",
      kilometraje: 211500,
      tipoDeManillar: "aluminio",
    },
    {
      tipo: "camion",
      marca: "Chevrolet",
      modelo: "FRR 1119 AMT",
      año: 2000,
      color: "blanco",
      kilometraje: 150000,
      capacidadDeCarga: 8000,
    },
  ],
};

//convertir objeto a JSON

const listaJSON = JSON.stringify(listaVehiculos, null, 2);
console.log("JSON generado:", listaJSON);

//convertir JSON a objeto JS

const objetoJS = JSON.parse(listaJSON);
console.log("Objeto JS:", objetoJS);

// 7. Usar una herramienta online para validar JSON generado:

// Revisar png adjunto en carpeta
