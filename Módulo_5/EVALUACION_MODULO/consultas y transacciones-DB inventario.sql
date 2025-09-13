--1. CONSULTAS

--1.1 Recupera todos los productos disponibles en el inventario. Ejemplo:

--seleccionamos todos los atributos de la tabla productos, para contar con toda la información del producto
select * 
from productos
--filtramos por cantidad mayor a cero, para comprobar disponibilidad
where cantidad > 0; 

--1.2 Recupera todos los proveedores que suministran productos específicos. Ejemplo:

--seleccionamos el id del proveedor desde "proveedores_productos" y el nombre del proveedor desde "proveedores"
select proveedores_productos.id_proveedor, proveedores.nombre 
from proveedores_productos
--unimos ambas tablas por igualdad de ID del proveedor
join proveedores on proveedores_productos.id_proveedor = proveedores.id_proveedor
--filtramos por ID del producto específico
where proveedores_productos.id_producto = 7; 

--1.3 Consulta las transacciones realizadas en una fecha específica. Ejemplo:

--seleccionamos todos los atributos de la tabla transacciones
select * 
from transacciones
--filtramos por la fecha específica que queremos consultar
where fecha = '2025-08-15'; 

--1.4 Calcula el número total de productos vendidos. Ejemplo:

--sumamos los valores del atributo "cantidad" en la tabla "transacciones" y lo mostramos en una nueva columna
select sum(cantidad) as total_productos_vendidos
from transacciones
--filtramos por transacciones tipo venta
where tipo_transaccion = 'venta'; 

--1.5 Calcula el valor total de las compras. Ejemplo:

--sumamos todos los resultados de "precio" (tabla productos) multiplicado por "cantidad" (tabla transacciones) 
select sum(p.precio * t.cantidad) as valor_total_compras
from productos p
--unimos ambas tablas por igualdad de ID del producto
left join transacciones t on p.id_producto = t.id_producto
--filtramos para que solo considere las transacciones de compras en la suma
where t.tipo_transaccion = 'compra';  

--1.6 Realiza una consulta que recupere el total de ventas de un producto durante el mes anterior. Ejemplo:

--seleccionamos ID y nombre del producto, creamos una columna total_ventas que registra precio*cantidad
select p.id_producto, p.nombre, sum(p.precio *t.cantidad) as total_ventas
from productos p
--unimos las tablas "productos" y "transacciones" por igualdad de ID del producto
join transacciones t on p.id_producto = t.id_producto
--filtramos por transacciones tipo ventas y por el ID del producto que queremos consultar
where t.tipo_transaccion = 'venta' and p.id_producto = 5
--agrupamos por ID y nombre del producto
group by p.id_producto, p.nombre;

--1.7 Utiliza JOINs (INNER, LEFT) para obtener información relacionada entre las tablas productos, proveedores y transacciones. 

--Ejemplo: consultar nombre del producto y del proveedor para nuestras transacciones

--seleccionamos todas las columnas pertinentes de "transacciones" y "nombre" del producto y proveedor
select t.id_transaccion, t.tipo_transaccion, t.fecha, t.cantidad, prod.nombre as nombre_producto, prov.nombre as nombre_proveedor
from transacciones t
--unimos "transacciones" con "productos" con inner join por igualdad de ID del producto
join productos prod on t.id_producto = prod.id_producto
--unimos "proveedores" con left join, mostrando solo los nombres de proveedores que registran transacciones
left join proveedores prov on t.id_proveedor = prov.id_proveedor;

--1.8 Implementa una consulta con subconsultas (subqueries) para obtener productos que no se han vendido durante un período determinado. Ejemplo:

--Consulta productos sin ventas durante la primera quincena del mes

--seleccionamos todos los atributos de la tabla "productos"
select * 
from productos p
--creamos una subconsulta que calcula las ventas en la primera quincena del mes y filtramos por los ID del producto que no cumplen con esa subconsulta
where p.id_producto not in (
    select t.id_producto
    from transacciones t
    where t.tipo_transaccion = 'venta'
      and t.fecha between '2025-08-01' and '2025-08-15'
);

--2. TRANSACCIONES

--Ejemplo transacción para realizar compra de un producto, usando BEGIN y manejo de errores con EXCEPTION en PostgreSQL:

--En este ejemplo, X representa el ID del producto que queremos comprar e Y representa el ID de su proveedor

DO $$
BEGIN
    --Iniciamos un bloque transaccional
    BEGIN
        --Insertamos la transacción de compra
        INSERT INTO transacciones (tipo_transaccion, fecha, cantidad, id_producto, id_proveedor)
        VALUES ('compra', CURRENT_DATE, 1, 1, 4);

        --Actualizamos el inventario sumando 1 unidad al producto comprado
        UPDATE productos
        SET cantidad = cantidad + 1
        WHERE id_producto = 1;

        --Si todo sale bien, mostramos mensaje de éxito
        RAISE NOTICE 'Compra registrada correctamente';

    EXCEPTION
        WHEN OTHERS THEN
            --Si ocurre cualquier error, el bloque hace rollback automático
            RAISE NOTICE 'Error en la transacción. Se revirtió automáticamente.';
    END;
END $$;

/* Nota sobre el uso conjunto de begin transaction, commit, rollback y manejo de errores:

La consigna de la evaluación (puntos 5 y 8) solicita el uso conjunto de BEGIN TRANSACTION, COMMIT/ROLLBACK y manejo de errores (pide usar TRY/CATCH, pero eso es de MySQL, 
en PostgreSQL se usa EXCEPTION). Sin embargo, esto no es posible de forma literal en PostgreSQL debido a cómo se manejan las transacciones y el control de errores.

SQL puro: al ejecutar comandos directamente en el cliente (DBeaver, psql, etc.), se puede usar BEGIN; ... COMMIT; o ROLLBACK; para controlar manualmente las transacciones. 
No obstante, SQL puro no soporta bloques EXCEPTION para capturar errores dentro de la misma instrucción.

PL/pgSQL (bloques DO $$ ... END $$ o funciones): se puede usar BEGIN ... EXCEPTION ... END; para capturar y manejar errores de forma explícita. 
Sin embargo, dentro de estos bloques no es posible ejecutar COMMIT o ROLLBACK de manera manual, ya que PostgreSQL administra automáticamente la transacción y hace rollback si ocurre un error.

Por lo tanto, no es posible combinar literalmente BEGIN TRANSACTION/COMMIT/ROLLBACK con EXCEPTION en un mismo bloque. Se debe elegir uno de los dos enfoques según el objetivo:

SQL puro: mostrar control de transacciones con commit/rollback.

PL/pgSQL: mostrar manejo explícito de errores con EXCEPTION. */


