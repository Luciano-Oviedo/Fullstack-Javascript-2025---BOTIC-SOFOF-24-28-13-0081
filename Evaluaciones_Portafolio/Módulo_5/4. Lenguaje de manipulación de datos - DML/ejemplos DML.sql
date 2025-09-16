--En este ejemplo ocuparemos los comandos INSERT, UPDATE y DELETE de DML

--1. Haremos un INSERT de registros para todas nuestras tablas:

-- tabla edicion
insert into edicion (nombre) values
('Espada sagrada'),
('Cruzadas'),
('Helénica'),
('Imperio'),
('Hijos de Daana'),
('Tierras Altas'),
('Dominios de Ra'),
('Encrucijada');

-- tabla tipo_carta
insert into tipo_carta (nombre) values
('oro'),
('aliado'),
('talismán'),
('tótem'),
('arma');

-- tabla cartas
insert into cartas (id_tipo, id_edicion, nombre, coste, fuerza, descripcion) values
(1, 5, 'Salmón del Saber', null, null, 'Carta oro que permite barajar una carta y reducir daño.'),
(3, 7, 'Forma de Lince', 2, null, 'Carta talismán que aumenta la fuerza de un aliado.'),
(5, 1, 'Espada larga', 2, null, 'Carta arma que acelera el robo de cartas.'),
(2, 3, 'Fenix', 2, 2, 'Carta aliado que se puede jugar desde el cementerio.'),
(2, 4, 'Julio César', 4, 2, 'Carta aliado única, tus demás aliados ganan 1 a la fuerza y son imbloqueables.'),
(4, 8, 'Esna', 3, null, 'Carta tótem que da robo al jugar aliados.');

-- tabla precios_cartas
insert into precios_cartas (id_carta, precio) values
(1, 5000),
(2, 2000),
(3, 1000),
(4, 500),
(5, 600),
(6, 450);

-- tabla carrito_compras
insert into carrito_compras (id_precios_cartas, cantidad) values
(1, 2),
(3, 1),
(4, 3),
(6, 1);

--2. Actualizaremos con UPDATE el precio de una de las cartas en la tabla "precios_cartas":

update precios_cartas
set precio = 3000
where id_precios_cartas = 4; -- cambia el precio de 'Fenix'

-- 3. Eliminaremos un registro en la tabla "cartas", simulando que la carta nunca fue reeditada y es imposible de conseguir:

delete from cartas
where nombre = 'Espada larga'; -- eliminamos la carta 'Espada larga'