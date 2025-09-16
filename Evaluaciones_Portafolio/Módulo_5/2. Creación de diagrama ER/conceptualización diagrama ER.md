# ERD para plataforma de compra de cartas del TCG "Mitos y Leyendas"

Siguiendo con la temática de una base de datos para el TCG "Mitos y Leyendas", conceptualizaremos una plataforma de compra de cartas de este TCG.

## 1. Entidades:

- 'cartas',
- 'tipo_carta',
- 'edicion',
- 'precios_cartas' y
- 'carrito_compras'

## 2. Relaciones:

- La tabla 'cartas' referencia a las tablas 'tipo_carta' y 'edicion'.
- La tabla 'precios_cartas´ referencia a la tabla 'cartas' y le asigna un precio a cada carta.
- La tabla 'carrito_compras' referencia un par carta-precio de la tabla 'precios cartas´ y le asigna una cantidad.

## 3. Tipos de datos y restricciones:

**cartas:**

- id_carta serial primary key
- id_tipo int not null ---> FK hacia tipo_carta(id_tipo)
- id_edicion int not null ---> FK hacia edicion(id_edicion)
- nombre varchar(30) not null unique
- coste int, check: NULL si id_tipo = X ("oro"), >0 si id_tipo ≠ X
- fuerza int, check: >0 si id_tipo = Y ("aliado"), NULL si id_tipo ≠ Y
- descripcion text not null

**tipo_carta:**

- id_tipo serial primary key
- nombre varchar(15) not null unique

**edicion:**

- id_edicion serial primary key
- nombre varchar(50) not null unique

**precios_cartas:**

- id_precios_cartas serial primary key
- id_carta int not null ---> FK hacia cartas(id_carta)
- precio numeric(10,0) not null, check: >0, on delete cascade (para no mantener precios si se borra carta asociada)

**carrito_compras:**

- id_carrito serial primary key
- id_precios_cartas int not null ---> FK hacia precios_cartas(id_precios_cartas)
- cantidad int not null, check: >0, on delete cascade (para no mantener artículos sin precio en el carrito)

## 4. Normalización:

Me aseguré de que cada una de las tablas contenga valores atómicos (1NF) y no contenga dependencias parciales (2NF) ni dependencias transitivas (3NF).
