# Conceptualización y diagrama ER

Como primer paso pensé las relaciones entre las tres entidades solicitadas para el inventario: productos, proveedores y transacciones. La tabla "proveedores" solo contiene la información de cada proveedor, así que no debe referenciar a otras tablas. La tabla "transacciones" referencia tanto a "productos" como a "proveedores".

Luego, noté que más adelante en la consigna se me pide que con una consulta SQL recupere "...todos los proveedores que suministran productos específicos", así que asumí la necesidad de crear una cuarta tabla de carácter intermedio, llamada "proveedores_producto", que registre las relaciones m:n entre productos y sus proveedores.

Por último, decidí que las tablas principales: productos, proveedores y transacciones, debían contener un identificador único, como clave primaria, con el fin de poder referenciar mejor las filas de cada tabla al momento de hacer consultas.

## Normalización

1. Primera forma normal: las columnas ya contienen valores atómicos (únicos y no divisibles), además, crearé IDs únicos para cada fila. Tampoco hay columnas repetitivas.

2. Segunda forma normal: no existe redundancia de datos y todos los atributos no clave en cada tabla dependen completamente de su clave primaria.

3. Tercera forma normal: no hay dependencias transitivas, ninguno de los atributos de la tabla "productos" depende de la tabla "proveedores" o viceversa, sino que ambas tablas se relacionan mediante la tabla "proveedores_producto".

## Tipos de datos

1. Tabla productos: **varchar** para "nombre"; **text** para "descripcion", para poder explayarse; **numeric(10,2)** para "precio" y números enteros **int** para "cantidad". **boolean** para "activo", para poder activar y desactivar productos.

2. Tabla proveedores: **varchar** para "nombre", "direccion", "telefono" e "email". **boolean** para "activo", para poder activar y desactivar proveedores.

3. Tabla transacciones: **int** para "id_producto", "id_proveedor" y "cantidad"; **varchar** para "tipo_transaccion"; **date** para "fecha".

4. Tabla proveedores_productos: **int** para "id_producto" e "id_proveedor".

## Restricciones

1. Tabla productos:
   **serial primary key** para id único;
   **not null** para atributos obligatorios como nombre, descripcion y precio;
   **default** 0 para cantidad;
   **unique** para nombre, evitando duplicados;
   **check** para precio mayor a cero y para evitar cantidades negativas.

2. Tabla proveedores:
   **serial primary key** para id único;
   **not null** y **unique** para los atributos nombre, direccion, telefono e email, que son obligatorios y no deben duplicarse.

3. Tabla transacciones:
   **serial primary key** para id único;
   **not null** para atributos obligatorios como tipo_transaccion, fecha, id_producto e id_proveedor;
   **check** para cantidad mayor que cero, **default** 1;
   **foreign key** para id_producto (referencia a tabla productos) e id_proveedor (referencia a tabla proveedores).
   Evité usar "on delete cascade" en esta tabla, para que se mantuviera el historial de transacciones incluso si se elimina un producto o proveedor.

4. Tabla proveedores_productos:
   **primary key compuesta** para mantener la unicidad de cada par proveedor_producto;
   **foreign key** para id_proveedor (referencia tabla proveedores) e id_producto (referencia a tabla productos);
   Tampoco es necesario usar "on delete cascade" en esta tabla, ya que proveedores y productos se desactivan, no se eliminan, con el fin de mantener la trazabilidad histórica de la tabla "transacciones".
