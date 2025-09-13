
--1. INSERCIÓN DE DATOS:

--INSERT: proveedores

insert into proveedores (nombre, direccion, telefono, email) values
('Distribuciones Gamers S.A.', 'Av. Libertador 1234, Buenos Aires, Argentina', '+54 11 43215678', 'ventas@gamers.com.ar'),
('Juegos del Norte Ltda.', 'Calle Norte 567, Santiago, Chile', '+56 2 34567890', 'contacto@juegosnorte.cl'),
('Fantasy Imports', 'Carrera 45 #12-34, Bogotá, Colombia', '+57 1 2345678', 'ventas@fantasyimports.co'),
('Board Game World', 'Rua das Palmeiras 890, São Paulo, Brasil', '+55 11 98765-4321', 'info@boardgameworld.br'),
('Collectibles Hub', 'Av. Córdoba 789, Córdoba, Argentina', '+54 351 567-8901', 'shop@collectibleshub.com'),
('Tabletop Masters', 'Av. Brasil 234, Lima, Perú', '+51 1 2345678', 'ventas@tabletopmasters.pe'),
('Card Kingdom', 'Calle Reforma 456, Ciudad de México, México', '+52 55 87654321', 'contacto@cardkingdom.mx'),
('Board Games Unlimited', 'Rua das Flores 789, Río de Janeiro, Brasil', '+55 21 98765-4321', 'info@boardgamesunlimited.br');


--INSERT: productos

insert into productos (nombre, descripcion, precio, cantidad) values
('Mazo Yu-Gi-Oh! Starter Deck', 'Mazo de inicio de Yu-Gi-Oh! con 40 cartas', 25.50, 50),
('Mazo MTG Elfos', 'Mazo de Magic: The Gathering de temática Elfos, 60 cartas', 27.00, 40),
('Juego de Mesa Catan', 'Juego de mesa Catan para 3-4 jugadores, comercio y colonización', 45.99, 30),
('Juego de Mesa Carcassonne', 'Juego de mesa de colocación de losetas y estrategia', 60.00, 20),
('Figurita Amiibo Mario', 'Figurita coleccionable Amiibo de Mario', 15.00, 15),
('Mazo MTG Guerreros', 'Mazo de Magic: The Gathering de temática Guerreros, 60 cartas', 26.50, 60),
('Juego de Mesa Cartógrafos', 'Juego de mesa de exploración y mapeo para 1-4 jugadores', 35.00, 25),
('Miniaturas Zombicide', 'Set de miniaturas Zombicide para tablero de juego', 22.00, 10),
('Tablero Expandible Dungeons & Dragons', 'Tablero modular para juegos de rol D&D', 55.00, 5),
('Mazo Yu-Gi-Oh! Bestias', 'Mazo de Yu-Gi-Oh! de temática Bestias, 60 cartas', 28.00, 45);

--INSERT: proveedores_productos

insert into proveedores_productos (id_proveedor, id_producto) values
(3,1),
(1,4),
(5,2),
(2,1),
(6,7),
(4,3),
(7,5),
(3,6),
(1,2),
(8,8),
(5,3),
(6,10),
(2,4),
(1,1),
(4,6),
(8,9),
(3,7),
(7,3),
(2,9),
(5,10),
(6,5),
(1,7);

--INSERT: transacciones

insert into transacciones (tipo_transaccion, fecha, cantidad, id_producto, id_proveedor) values
('compra', '2025-08-01', 12, 1, 3),
('venta', '2025-08-01', 3, 2, 2),
('compra', '2025-08-02', 8, 3, 3),
('venta', '2025-08-03', 2, 1, 1),
('venta', '2025-08-03', 4, 4, 1),
('compra', '2025-08-04', 15, 5, 5),
('venta', '2025-08-05', 1, 6, 2),
('compra', '2025-08-05', 10, 7, 1),
('venta', '2025-08-06', 5, 2, 2),
('compra', '2025-08-07', 7, 8, 8),
('venta', '2025-08-07', 2, 3, 3),
('compra', '2025-08-08', 20, 9, 7),
('venta', '2025-08-09', 3, 5, 5),
('compra', '2025-08-10', 6, 6, 2),
('venta', '2025-08-10', 2, 1, 3),
('compra', '2025-08-11', 9, 4, 1),
('venta', '2025-08-12', 1, 7, 1),
('venta', '2025-08-12', 2, 8, 8),
('compra', '2025-08-13', 5, 10, 6),
('venta', '2025-08-14', 4, 9, 7),
('compra', '2025-08-15', 8, 2, 2),
('venta', '2025-08-15', 1, 3, 3),
('venta', '2025-08-16', 2, 4, 1),
('compra', '2025-08-17', 12, 5, 5),
('venta', '2025-08-18', 3, 6, 2),
('compra', '2025-08-19', 7, 1, 3),
('venta', '2025-08-20', 5, 7, 1),
('compra', '2025-08-21', 10, 8, 8),
('venta', '2025-08-21', 2, 9, 7),
('compra', '2025-08-22', 6, 10, 6),
('venta', '2025-08-23', 1, 2, 2),
('compra', '2025-08-24', 15, 3, 3),
('venta', '2025-08-25', 4, 1, 1),
('venta', '2025-08-26', 2, 5, 5),
('compra', '2025-08-27', 8, 6, 2),
('venta', '2025-08-28', 3, 4, 1),
('compra', '2025-08-29', 12, 7, 1),
('venta', '2025-08-30', 5, 8, 8),
('compra', '2025-08-30', 9, 9, 7),
('venta', '2025-08-31', 2, 10, 6);

--2. ELIMINACIÓN DE DATOS (producto no disponible):

/* Ya que queremos simular una base de datos de inventario real, donde queremos mantene un historial de transacciones, no podemos usar "delete" en las tablas "productos" o "proveedor", 
porque esos registros pueden estar referenciados en la tabla "transacciones". Y si configuramos "transacciones" con "on delete cascade", no podemos mantener la trazabilidad de las transacciones.
Por eso, lo mejor es usar "update" para desactivar productos y proveedores, simulando su eliminación. */

--Ejemplos:

update proveedores
set activo = false
where id_proveedor = x; --donde x es el valor del id del proveedor a desactivar

update productos
set activo = false
where id_producto = x; --donde x es el valor del id del producto a desactivar



















